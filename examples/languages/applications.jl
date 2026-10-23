# Generated from the published Markdown; run scripts/build_language_examples.py to refresh.
# Independent examples may reuse top-level names. Python remains the explanation language.

# Fixed-size linked nodes; O(1) deque endpoint updates.
mutable struct DQLink
    item
    prev
    next
end
mutable struct DequeBuffer
    head
    tail
    n::Int
end
function DequeBuffer(values=())
    q = DequeBuffer(nothing, nothing, 0)
    for item in values
        db_add_last!(q, item)
    end
    return q
end
function db_add_first!(q, item)
    node = DQLink(item, nothing, q.head)
    if q.head === nothing; q.tail = node; else; q.head.prev = node; end
    q.head = node; q.n += 1
    return nothing
end
function db_add_last!(q, item)
    node = DQLink(item, q.tail, nothing)
    if q.tail === nothing; q.head = node; else; q.tail.next = node; end
    q.tail = node; q.n += 1
    return nothing
end
function db_first(q)
    q.n > 0 || throw(BoundsError())
    return q.head.item
end
function db_last(q)
    q.n > 0 || throw(BoundsError())
    return q.tail.item
end
function db_remove_first!(q)
    item = db_first(q); q.head = q.head.next; q.n -= 1
    if q.head === nothing; q.tail = nothing; else; q.head.prev = nothing; end
    return item
end
function db_remove_last!(q)
    item = db_last(q); q.tail = q.tail.prev; q.n -= 1
    if q.tail === nothing; q.head = nothing; else; q.tail.next = nothing; end
    return item
end
function db_values(q)
    result = Any[]; p = q.head
    while p !== nothing
        push!(result, p.item); p = p.next
    end
    return result
end
mutable struct MinHeap
    data::Vector{Any}
    less
end
MinHeap(less=isless) = MinHeap(Any[], less)
function heap_peek(h)
    isempty(h.data) && throw(BoundsError())
    return h.data[1]
end
function heap_push!(h, item)
    a = h.data; push!(a, item); i = length(a)
    while i > 1
        p = div(i, 2)
        !h.less(a[i], a[p]) && break
        a[i], a[p] = a[p], a[i]; i = p
    end
    return nothing
end
function heap_pop!(h)
    result = heap_peek(h); a = h.data; last_item = pop!(a)
    if !isempty(a)
        a[1] = last_item; i = 1
        while 2i <= length(a)
            c = 2i
            if c < length(a) && h.less(a[c+1], a[c]); c += 1; end
            !h.less(a[c], a[i]) && break
            a[c], a[i] = a[i], a[c]; i = c
        end
    end
    return result
end
entry_less(a, b) = isless((a[1], a[2]), (b[1], b[2]))
# Integer trace keys use h(k)=k; native hashing for other hashable values.
hash_index(key, m) = key isa Integer ? mod(key, m) + 1 : Int(mod(hash(key), UInt(m))) + 1

# topics/graphs/graph-representations.md
graph = Dict("A"=>["B","C"], "B"=>["A","D","E"], "C"=>["A","F"],
    "D"=>["B","E"], "E"=>["B","D","F"], "F"=>["C","E","G"], "G"=>["F"], "H"=>String[])

# topics/graphs/graph-representations.md
vertices = collect(keys(graph))
index = Dict(v=>i for (i,v) in enumerate(vertices))
matrix = zeros(Int, length(vertices), length(vertices))
for u in vertices, v in graph[u]; matrix[index[u], index[v]] = 1; end

# topics/graphs/graph-operations.md
function add_vertex!(graph, v)
    v === nothing && throw(ArgumentError("nothing is reserved for missing parents"))
    get!(graph, v, Any[]); return nothing
end
function require_endpoints(graph, u, v)
    haskey(graph, u) || throw(KeyError(u)); haskey(graph, v) || throw(KeyError(v))
end
function add_edge!(graph, u, v; directed=false)
    require_endpoints(graph, u, v)
    u == v && throw(ArgumentError("no self-loops"))
    !(v in graph[u]) && push!(graph[u], v)
    !directed && !(u in graph[v]) && push!(graph[v], u)
    return nothing
end
has_edge(graph, u, v) = (require_endpoints(graph, u, v); v in graph[u])
neighbours(graph, u) = copy(graph[u])
function remove_edge!(graph, u, v; directed=false)
    require_endpoints(graph, u, v)
    i = findfirst(==(v), graph[u]); i === nothing && throw(KeyError((u,v)))
    deleteat!(graph[u], i)
    !directed && deleteat!(graph[v], findfirst(==(u), graph[v]))
    return nothing
end
function remove_vertex!(graph, v)
    haskey(graph, v) || throw(KeyError(v))
    for u in keys(graph)
        if u != v
            i = findfirst(==(v), graph[u]); i !== nothing && deleteat!(graph[u], i)
        end
    end
    delete!(graph, v); return nothing
end
vertex_count(graph) = length(graph)
function edge_count(graph; directed=false)
    entries = sum(length, values(graph); init=0)
    return directed ? entries : div(entries, 2)
end
function build_graph(vertices, edges; directed=false)
    graph = Dict{Any,Vector{Any}}()
    for v in vertices; add_vertex!(graph, v); end
    for (u,v) in edges; add_edge!(graph, u, v; directed=directed); end
    return graph
end

# topics/graphs/breadth-first-search.md
function bfs(graph, start)
    haskey(graph, start) || throw(KeyError(start))
    distance = Dict{Any,Int}(start=>0); parent = Dict{Any,Any}(start=>nothing); order = Any[]
    queue = DequeBuffer([start])
    while queue.n > 0
        u = db_remove_first!(queue); push!(order, u)
        for v in graph[u]
            if !haskey(distance, v)
                distance[v] = distance[u] + 1; parent[v] = u; db_add_last!(queue, v)
            end
        end
    end
    return (order, parent, distance)
end

# topics/graphs/breadth-first-search.md
function path_to(parent, target)
    haskey(parent, target) || return nothing
    path = Any[]; current = target
    while current !== nothing; push!(path, current); current = parent[current]; end
    return reverse!(path)
end

# topics/graphs/depth-first-search.md
function dfs(graph, start)
    haskey(graph, start) || throw(KeyError(start))
    seen = Set{Any}(); parent = Dict{Any,Any}(start=>nothing); discovery = Any[]; finish = Any[]
    function visit(u)
        push!(seen, u); push!(discovery, u)
        for v in graph[u]
            if !(v in seen); parent[v] = u; visit(v); end
        end
        push!(finish, u)
    end
    visit(start); return (discovery, finish, parent)
end

# topics/graphs/graph-components.md
function connected_components(graph)
    seen = Set{Any}(); groups = Any[]
    for start in keys(graph)
        start in seen && continue
        push!(seen, start); queue = DequeBuffer([start]); group = Any[]
        while queue.n > 0
            u = db_remove_first!(queue); push!(group, u)
            for v in graph[u]
                if !(v in seen); push!(seen, v); db_add_last!(queue, v); end
            end
        end
        push!(groups, group)
    end
    return groups
end

# topics/union-find/parent-forests.md
function find_root(parent, x)
    while parent[x] != x; x = parent[x]; end
    return x
end

# topics/union-find/union-compression.md
mutable struct DisjointSet
    parent::Vector{Int}
    sizes::Vector{Int}
    components::Int
end
function DisjointSet(n)
    (n isa Int && n >= 0) || throw(ArgumentError("nonnegative integer size required"))
    return DisjointSet(collect(1:n), ones(Int, n), n)
end
function find_set!(s::DisjointSet, x)
    (x isa Int && 1 <= x <= length(s.parent)) || throw(BoundsError(s.parent, x))
    root = x
    while s.parent[root] != root; root = s.parent[root]; end
    while s.parent[x] != x
        next_x = s.parent[x]; s.parent[x] = root; x = next_x
    end
    return root
end
function union_sets!(s::DisjointSet, a, b)
    ra, rb = find_set!(s, a), find_set!(s, b)
    ra == rb && return false
    if s.sizes[ra] < s.sizes[rb]; ra, rb = rb, ra; end
    s.parent[rb] = ra; s.sizes[ra] += s.sizes[rb]; s.components -= 1
    return true
end
connected(s::DisjointSet, a, b) = find_set!(s, a) == find_set!(s, b)
Base.length(s::DisjointSet) = length(s.parent)
Base.isempty(s::DisjointSet) = length(s) == 0
component_count(s::DisjointSet) = s.components
component_size(s::DisjointSet, x) = s.sizes[find_set!(s, x)]

# topics/union-find/union-find-applications.md
function connection_forest(n, edges)
    sets = DisjointSet(n); chosen = Any[]; rejected = Any[]
    for (a, b) in edges
        push!(union_sets!(sets, a, b) ? chosen : rejected, (a, b))
    end
    return (chosen, rejected, sets.components)
end

# topics/graph-algorithms/topological-order.md
dag = Dict("A"=>["C"], "B"=>["C","D"], "C"=>["E"], "D"=>["E"], "E"=>["F"], "F"=>String[], "G"=>String[])
function valid_topological_order(graph, order)
    (length(order) == length(graph) && Set(order) == Set(keys(graph))) || return false
    position = Dict(v=>i for (i,v) in enumerate(order))
    return all(position[u] < position[v] for u in keys(graph) for v in graph[u])
end

# topics/graph-algorithms/topological-order.md
function topological_sort(graph)
    degree = Dict(v=>0 for v in keys(graph))
    for adjacent in values(graph), v in adjacent; degree[v] += 1; end
    ready = DequeBuffer(v for v in keys(graph) if degree[v] == 0); order = Any[]
    while ready.n > 0
        u = db_remove_first!(ready); push!(order, u)
        for v in graph[u]
            degree[v] -= 1
            degree[v] == 0 && db_add_last!(ready, v)
        end
    end
    length(order) == length(graph) || throw(ArgumentError("directed cycle: no complete order"))
    return order
end

# topics/graph-algorithms/shortest-path-state.md
weighted = Dict("A"=>[("B",4),("C",1)], "B"=>[("D",1),("E",7)],
    "C"=>[("B",2),("D",5),("F",8)], "D"=>[("E",3)], "E"=>[("F",1)],
    "F"=>Tuple{String,Int}[], "G"=>Tuple{String,Int}[])

# topics/graph-algorithms/shortest-path-state.md
function weighted_path_to(source, target, distance, parent)
    distance[target] == Inf && return nothing
    path = Any[]; current = target
    while current !== nothing; push!(path, current); current = parent[current]; end
    return reverse!(path)
end

# topics/graph-algorithms/dijkstra.md
function dijkstra(graph, source)
    haskey(graph, source) || throw(KeyError(source))
    any(w < 0 for adjacent in values(graph) for (v,w) in adjacent) && throw(ArgumentError("Dijkstra requires nonnegative weights"))
    distance = Dict(v=>Inf for v in keys(graph)); parent = Dict{Any,Any}(v=>nothing for v in keys(graph))
    distance[source] = 0; sequence = 0; heap = MinHeap(entry_less)
    heap_push!(heap, (0, sequence, source)); sequence += 1
    while !isempty(heap.data)
        cost, serial, u = heap_pop!(heap)
        cost != distance[u] && continue
        for (v,w) in graph[u]
            candidate = cost + w
            if candidate < distance[v]
                distance[v] = candidate; parent[v] = u
                heap_push!(heap, (candidate, sequence, v)); sequence += 1
            end
        end
    end
    return (distance, parent)
end

# topics/graph-algorithms/dag-shortest-paths.md
function dag_shortest_paths(graph, source)
    haskey(graph, source) || throw(KeyError(source))
    unweighted = Dict(u=>[v for (v,w) in graph[u]] for u in keys(graph))
    order = topological_sort(unweighted)
    distance = Dict(v=>Inf for v in keys(graph)); parent = Dict{Any,Any}(v=>nothing for v in keys(graph))
    distance[source] = 0
    for u in order
        distance[u] == Inf && continue
        for (v,w) in graph[u]
            candidate = distance[u] + w
            if candidate < distance[v]; distance[v] = candidate; parent[v] = u; end
        end
    end
    return (distance, parent)
end

# topics/graph-algorithms/spanning-trees.md
vertices = string.(collect("ABCDEF"))
edges = [(4,"A","B"),(2,"A","C"),(1,"B","C"),(5,"B","D"),(8,"C","D"),
    (10,"C","E"),(2,"D","E"),(6,"D","F"),(3,"E","F")]
function weighted_adjacency(vertices, edges)
    graph = Dict(v=>Any[] for v in vertices)
    for (w,u,v) in edges; push!(graph[u], (v,w)); push!(graph[v], (u,w)); end
    return graph
end

# topics/graph-algorithms/prim.md
function prim_forest(graph)
    seen = Set{Any}(); chosen = Any[]; total = 0; components = 0; sequence = 0
    for root in keys(graph)
        root in seen && continue
        components += 1; push!(seen, root); heap = MinHeap(entry_less)
        for (v,w) in graph[root]
            if !(v in seen); heap_push!(heap, (w,sequence,root,v)); sequence += 1; end
        end
        while !isempty(heap.data)
            w,serial,u,v = heap_pop!(heap); v in seen && continue
            push!(seen, v); push!(chosen, (w,u,v)); total += w
            for (x,cost) in graph[v]
                if !(x in seen); heap_push!(heap, (cost,sequence,v,x)); sequence += 1; end
            end
        end
    end
    return (chosen, total, components)
end

# topics/graph-algorithms/kruskal.md
function kruskal_forest(vertices, edges)
    vertices = collect(vertices); index = Dict(v=>i for (i,v) in enumerate(vertices))
    length(index) == length(vertices) || throw(ArgumentError("vertices must be unique"))
    sets = DisjointSet(length(vertices)); chosen = Any[]; total = 0
    for (w,u,v) in sort(collect(edges); by=e->e[1], alg=MergeSort)
        if union_sets!(sets, index[u], index[v]); push!(chosen, (w,u,v)); total += w; end
    end
    return (chosen, total, sets.components)
end

# topics/applications/transport-model.md
# Reuse the preceding topics' graph algorithms and disjoint sets.
places = Dict("A"=>"Gate","B"=>"Museum","C"=>"Library","D"=>"Market",
    "E"=>"Clinic","F"=>"Park","G"=>"Harbour")
links = [("A","B",12,3),("A","C",3,6),("B","C",2,2),("B","D",3,4),
    ("C","D",9,1),("C","E",12,7),("D","E",3,5),("D","F",8,2),("E","F",2,3)]
function adjacency_view(places, links, weight_column=nothing)
    weight_column in (nothing,3,4) || throw(ArgumentError("invalid weight column"))
    graph = Dict(v=>Any[] for v in keys(places))
    for row in links
        u,v = row[1:2]
        push!(graph[u], weight_column === nothing ? v : (v,row[weight_column]))
        push!(graph[v], weight_column === nothing ? u : (u,row[weight_column]))
    end
    return graph
end
hop_graph = adjacency_view(places, links)
time_graph = adjacency_view(places, links, 3)
build_graph_view = adjacency_view(places, links, 4)
edge_key(u,v) = u <= v ? (u,v) : (v,u)

# topics/applications/transport-model.md
function route_total(route, links, weight_column)
    weight_column in (3,4) || throw(ArgumentError("invalid weight column"))
    route === nothing && return nothing
    weights = Dict(edge_key(row[1],row[2])=>row[weight_column] for row in links)
    return sum((weights[edge_key(u,v)] for (u,v) in zip(route,route[2:end])); init=0)
end

# topics/applications/transport-hops.md
order, hop_parent, hop_distance = bfs(hop_graph, "A")
fewest_route = path_to(hop_parent, "F")
fewest_minutes = route_total(fewest_route, links, 3)

# topics/applications/transport-times.md
time_distance, time_parent = dijkstra(time_graph, "A")
fastest_route = weighted_path_to("A", "F", time_distance, time_parent)
fastest_minutes = route_total(fastest_route, links, 3)

# topics/applications/transport-connectivity.md
place_index = Dict(v=>i for (i,v) in enumerate(keys(places)))
sets = DisjointSet(length(places)); opening_log = Any[]
for (u,v,minutes,build_units) in links
    merged = union_sets!(sets, place_index[u], place_index[v])
    push!(opening_log, (u,v,merged,sets.components))
end

# topics/applications/transport-design.md
construction_edges = [(cost,u,v) for (u,v,minutes,cost) in links]
chosen_build, build_total, build_components = kruskal_forest(keys(places), construction_edges)
prim_chosen, prim_total, prim_components = prim_forest(build_graph_view)

# topics/applications/transport-design.md
chosen_pairs = Set(edge_key(u,v) for (cost,u,v) in chosen_build)
built_links = [row for row in links if edge_key(row[1],row[2]) in chosen_pairs]
built_time_graph = adjacency_view(places, built_links, 3)
built_distance, built_parent = dijkstra(built_time_graph, "A")
built_route = weighted_path_to("A", "F", built_distance, built_parent)
