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
