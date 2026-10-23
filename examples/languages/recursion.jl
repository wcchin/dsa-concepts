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

# topics/recursion/recursive-calls.md
function sum_to(n)
    (n isa Int && n >= 0) || throw(ArgumentError("Expected a nonnegative integer"))
    n == 0 && return 0
    return n + sum_to(n - 1)
end
println(sum_to(3)); println(sum_to(0))

# topics/recursion/call-stack.md
function trace_calls(n)
    if n == 0
        println("base")
        return nothing
    end
    println("enter ", n)
    trace_calls(n - 1)
    println("leave ", n)
    return nothing
end
trace_calls(2)

# topics/recursion/call-stack.md
function sum_to_iterative(n)
    (n isa Int && n >= 0) || throw(ArgumentError("Expected a nonnegative integer"))
    total = 0
    for value in 1:n
        total += value
    end
    return total
end
println(sum_to_iterative(3))

# topics/recursion/divide-and-conquer.md
function merge_sorted(left, right)
    result = Any[]
    i, j = 1, 1
    while i <= length(left) && j <= length(right)
        if left[i] <= right[j]
            push!(result, left[i]); i += 1
        else
            push!(result, right[j]); j += 1
        end
    end
    append!(result, left[i:end])
    append!(result, right[j:end])
    return result
end
function merge_sort(values)
    length(values) <= 1 && return copy(values)
    middle = div(length(values), 2)
    return merge_sorted(merge_sort(values[1:middle]), merge_sort(values[middle+1:end]))
end

values = [38, 12, 27, 5, 19, 8, 31, 14]
println(merge_sort(values))
