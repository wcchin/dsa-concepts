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

# topics/linear-structures/sequence-adt.md
mutable struct ArraySequence
    items::Vector{Any}
end
ArraySequence(values=()) = ArraySequence(Any[values...])
Base.length(s::ArraySequence) = length(s.items)
Base.isempty(s::ArraySequence) = isempty(s.items)
function check_index(s::ArraySequence, i, allow_end=false)
    i isa Int || throw(ArgumentError("integer index required"))
    1 <= i <= length(s) + (allow_end ? 1 : 0) || throw(BoundsError(s.items, i))
end
function get_at(s::ArraySequence, i)
    check_index(s, i); return s.items[i]
end
function set_at!(s::ArraySequence, i, item)
    check_index(s, i); s.items[i] = item; return nothing
end
function insert_at!(s::ArraySequence, i, item)
    check_index(s, i, true); insert!(s.items, i, item); return nothing
end
append_item!(s::ArraySequence, item) = (push!(s.items, item); nothing)
function remove_at!(s::ArraySequence, i)
    check_index(s, i); item = s.items[i]; deleteat!(s.items, i); return item
end

# topics/linear-structures/stacks.md
mutable struct Stack
    items::Vector{Any}
end
Stack() = Stack(Any[])
stack_push!(s::Stack, item) = (push!(s.items, item); nothing)
function stack_pop!(s::Stack)
    isempty(s.items) && throw(BoundsError())
    return pop!(s.items)
end
function stack_peek(s::Stack)
    isempty(s.items) && throw(BoundsError())
    return s.items[end]
end
Base.length(s::Stack) = length(s.items)
Base.isempty(s::Stack) = isempty(s.items)

# topics/linear-structures/stacks.md
function brackets_balanced(text)
    openers = Char[]
    matching = Dict(')'=>'(', ']'=>'[', '}'=>'{')
    for symbol in text
        if symbol in "([{"
            push!(openers, symbol)
        elseif haskey(matching, symbol)
            (isempty(openers) || pop!(openers) != matching[symbol]) && return false
        end
    end
    return isempty(openers)
end

# topics/linear-structures/queues-and-deques.md
mutable struct Queue
    items::DequeBuffer
end
Queue() = Queue(DequeBuffer())
Base.length(q::Queue) = q.items.n
Base.isempty(q::Queue) = length(q) == 0
enqueue!(q::Queue, item) = db_add_last!(q.items, item)
queue_front(q::Queue) = db_first(q.items)
dequeue!(q::Queue) = db_remove_first!(q.items)

# topics/linear-structures/deques.md
items = DequeBuffer()
db_add_last!(items, "B"); db_add_first!(items, "A"); db_add_last!(items, "C")
@assert db_remove_last!(items) == "C"
db_add_first!(items, "X")
@assert db_remove_first!(items) == "X"
@assert db_values(items) == ["A", "B"]

# topics/linear-structures/deques.md
mutable struct Deque
    items::DequeBuffer
end
Deque() = Deque(DequeBuffer())
Base.length(q::Deque) = q.items.n
Base.isempty(q::Deque) = length(q) == 0
add_first!(q::Deque, x) = db_add_first!(q.items, x)
add_last!(q::Deque, x) = db_add_last!(q.items, x)
peek_first(q::Deque) = db_first(q.items)
peek_last(q::Deque) = db_last(q.items)
remove_first!(q::Deque) = db_remove_first!(q.items)
remove_last!(q::Deque) = db_remove_last!(q.items)

# topics/linear-structures/deques.md
window = DequeBuffer([12, 15, 14, 18])
db_add_last!(window, 20)
window.n > 4 && db_remove_first!(window)
@assert db_values(window) == [15, 14, 18, 20]

# topics/linear-structures/deques.md
function is_palindrome(sequence)
    remaining = DequeBuffer(sequence)
    while remaining.n > 1
        db_remove_first!(remaining) != db_remove_last!(remaining) && return false
    end
    return true
end

# topics/linear-structures/arrays.md
route = ["A", "B", "C", "D"]
insert!(route, 2, "X")
@assert route == ["A", "X", "B", "C", "D"]
removed = route[2]; deleteat!(route, 2)
@assert removed == "X"
route[2] = "Y"
@assert route == ["A", "Y", "C", "D"]

# topics/linear-structures/linked-structures.md
mutable struct Node
    value
    next
end
Node(value) = Node(value, nothing)
c = Node("C"); b = Node("B", c); head = Node("A", b)

# topics/linear-structures/linked-structures.md
function linked_values(head)
    values = Any[]; current = head
    while current !== nothing
        push!(values, current.value); current = current.next
    end
    return values
end
@assert linked_values(head) == ["A", "B", "C"]

# topics/linear-structures/linked-structures.md
added = Node("X")
added.next = b.next; b.next = added
@assert linked_values(head) == ["A", "B", "X", "C"]

# topics/linear-structures/linked-structures.md
function remove_after!(node)
    node.next === nothing && throw(BoundsError())
    removed = node.next; node.next = removed.next; removed.next = nothing
    return removed.value
end
@assert remove_after!(b) == "X"
@assert linked_values(head) == ["A", "B", "C"]

# topics/linear-structures/circular-queues.md
mutable struct CircularQueue
    data::Vector{Any}
    front_index::Int
    n::Int
end
function CircularQueue(capacity)
    (capacity isa Int && capacity > 0) || throw(ArgumentError("positive integer capacity required"))
    return CircularQueue(Any[nothing for _ in 1:capacity], 1, 0)
end
Base.length(q::CircularQueue) = q.n
Base.isempty(q::CircularQueue) = q.n == 0
function enqueue!(q::CircularQueue, item)
    q.n == length(q.data) && throw(OverflowError("queue is full"))
    back = mod(q.front_index - 1 + q.n, length(q.data)) + 1
    q.data[back] = item; q.n += 1; return nothing
end
function queue_front(q::CircularQueue)
    isempty(q) && throw(BoundsError())
    return q.data[q.front_index]
end
function dequeue!(q::CircularQueue)
    item = queue_front(q); q.data[q.front_index] = nothing
    q.front_index = mod(q.front_index, length(q.data)) + 1; q.n -= 1
    return item
end

# topics/linear-structures/linked-queues.md
mutable struct LinkedQueue
    head
    tail
    n::Int
end
LinkedQueue() = LinkedQueue(nothing, nothing, 0)
Base.length(q::LinkedQueue) = q.n
Base.isempty(q::LinkedQueue) = q.n == 0
function enqueue!(q::LinkedQueue, item)
    added = Node(item)
    if isempty(q); q.head = added; else; q.tail.next = added; end
    q.tail = added; q.n += 1; return nothing
end
function queue_front(q::LinkedQueue)
    isempty(q) && throw(BoundsError())
    return q.head.value
end
function dequeue!(q::LinkedQueue)
    item = queue_front(q); removed = q.head
    q.head = removed.next; q.n -= 1
    q.head === nothing && (q.tail = nothing)
    removed.next = nothing; return item
end
