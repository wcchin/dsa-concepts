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

# topics/analysis/counting-work.md
function contains_with_count(values, target)
    comparisons = 0
    for value in values
        comparisons += 1
        value == target && return (true, comparisons)
    end
    return (false, comparisons)
end
stations = ["KR", "MUS", "UTN", "CLM"]
println(contains_with_count(stations, "UTN"))
println(contains_with_count(stations, "BG"))

# topics/analysis/counting-work.md
function visit_count(values)
    visits = 0
    for value in values
        visits += 1
    end
    return visits
end
println(visit_count(["KR", "MUS", "UTN"]))
println(visit_count([]))

# topics/analysis/counting-work.md
mutable struct Node
    value
    next
end
Node(value) = Node(value, nothing)
known = Node("KR", Node("UTN"))
added = Node("MUS")
added.next = known.next
known.next = added

# topics/analysis/code-and-space.md
function count_two_passes(values)
    work = 0
    for value in values
        work += 1
    end
    for value in values
        work += 1
    end
    return work
end
println(count_two_passes(["KR", "MUS", "UTN"]))

# topics/analysis/code-and-space.md
function count_pairs(n)
    full, triangular = 0, 0
    for i in 0:n-1, j in 0:n-1
        full += 1
    end
    for i in 0:n-1, j in 0:i-1
        triangular += 1
    end
    return (full, triangular)
end
println(count_pairs(5))

# topics/analysis/code-and-space.md
function halving_steps(n)
    n >= 1 || throw(ArgumentError("n must be positive"))
    steps, remaining = 0, n
    while remaining > 1
        remaining = div(remaining, 2)
        steps += 1
    end
    return steps
end
println(halving_steps(16)); println(halving_steps(13)); println(halving_steps(1))

# topics/analysis/code-and-space.md
function inspect_count(values, detailed)
    isempty(values) && return 0
    !detailed && return 1
    return count_two_passes(values)
end

# topics/analysis/code-and-space.md
function count_values(values)
    count = 0
    for value in values
        count += 1
    end
    return count
end
function copy_values(values)
    result = Any[]
    for value in values
        push!(result, value)
    end
    return result
end
