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

# topics/heaps/heap-insertion.md
function sift_up!(heap, i)
    while i > 1
        parent = div(i, 2)
        heap[parent] <= heap[i] && break
        heap[parent], heap[i] = heap[i], heap[parent]; i = parent
    end
    return nothing
end
push_min!(heap, priority) = (push!(heap, priority); sift_up!(heap, length(heap)); nothing)

# topics/heaps/heap-removal.md
function peek_min(heap::AbstractVector)
    isempty(heap) && throw(BoundsError())
    return heap[1]
end

# topics/heaps/heap-removal.md
function sift_down!(heap, i)
    n = length(heap)
    while 2i <= n
        child = 2i; right = child + 1
        right <= n && heap[right] < heap[child] && (child = right)
        heap[i] <= heap[child] && break
        heap[i], heap[child] = heap[child], heap[i]; i = child
    end
    return nothing
end

# topics/heaps/heap-removal.md
function pop_min!(heap)
    result = peek_min(heap); last_item = pop!(heap)
    if !isempty(heap); heap[1] = last_item; sift_down!(heap, 1); end
    return result
end

# topics/heaps/heap-construction.md
function build_min_heap(values)
    heap = collect(values)
    for i in div(length(heap), 2):-1:1
        sift_down!(heap, i)
    end
    return heap
end

# topics/heaps/heap-applications.md
values = build_min_heap([9, 5, 6, 2, 3, 4])
push_min!(values, 1)
@assert pop_min!(values) == 1
@assert values[1] == 2

# topics/heaps/heap-applications.md
mutable struct MinPriorityQueue
    heap::MinHeap
    sequence::Int
end
MinPriorityQueue() = MinPriorityQueue(MinHeap(entry_less), 0)
Base.length(q::MinPriorityQueue) = length(q.heap.data)
Base.isempty(q::MinPriorityQueue) = length(q) == 0
function pq_insert!(q::MinPriorityQueue, item, priority)
    heap_push!(q.heap, (priority, q.sequence, item)); q.sequence += 1; return nothing
end
peek_min(q::MinPriorityQueue) = heap_peek(q.heap)[3]
remove_min!(q::MinPriorityQueue) = heap_pop!(q.heap)[3]
extract_min!(q::MinPriorityQueue) = remove_min!(q)

# topics/heaps/heap-applications.md
struct MaxPriorityQueue
    queue::MinPriorityQueue
end
MaxPriorityQueue() = MaxPriorityQueue(MinPriorityQueue())
Base.length(q::MaxPriorityQueue) = length(q.queue)
Base.isempty(q::MaxPriorityQueue) = isempty(q.queue)
pq_insert!(q::MaxPriorityQueue, item, priority) = pq_insert!(q.queue, item, -priority)
peek_max(q::MaxPriorityQueue) = peek_min(q.queue)
remove_max!(q::MaxPriorityQueue) = remove_min!(q.queue)
extract_max!(q::MaxPriorityQueue) = remove_max!(q)

# topics/heaps/heap-sorting-costs.md
function heapsort!(a)
    function sift_down_max(i, last)
        while 2i <= last
            child = 2i; right = child + 1
            right <= last && a[right] > a[child] && (child = right)
            a[i] >= a[child] && break
            a[i], a[child] = a[child], a[i]; i = child
        end
    end
    for i in div(length(a), 2):-1:1; sift_down_max(i, length(a)); end
    for last in length(a):-1:2
        a[1], a[last] = a[last], a[1]; sift_down_max(1, last - 1)
    end
    return nothing
end
