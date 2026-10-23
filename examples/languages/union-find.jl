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
