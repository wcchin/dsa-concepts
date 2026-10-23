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

# topics/foundations/data-and-algorithms.md
function find_stop(route, target)
    for (index, stop) in enumerate(route)
        stop == target && return index
    end
    return nothing
end
route = ["KR", "MUS", "UTN", "MUS"]
println(find_stop(route, "MUS")) # 2
println(find_stop(route, "CLM")) # nothing

# topics/foundations/objects-and-references.md
stop = "Kent Ridge"
passengers = 12
stop = "Museum"
println(stop) # Museum

# topics/foundations/objects-and-references.md
route_a = ["KR", "MUS"]
route_b = route_a
println(route_a === route_b) # true

# topics/foundations/objects-and-references.md
x = ["KR", "MUS"]
y = ["KR", "MUS"]
z = x
println(x == y)  # true: contents
println(x === y) # false: identity
println(x === z) # true

# topics/foundations/objects-and-references.md
next_node = nothing
println(next_node === nothing) # true

# topics/foundations/mutation-and-copying.md
record = ("KR", [12, 15])
push!(record[2], 18)
println(record) # ("KR", [12, 15, 18])

# topics/foundations/mutation-and-copying.md
route_a = ["KR", "MUS"]
route_b = route_a
push!(route_b, "UTN")
println(route_a)
route_b = ["CLM"]
println(route_a)
println(route_b)

# topics/foundations/mutation-and-copying.md
function replace_route(route)
    route = ["Botanic Gardens"]
    return nothing
end
function extend_route(route)
    push!(route, "Botanic Gardens")
    return nothing
end
stops = ["Kent Ridge"]
replace_route(stops)
println(stops)
extend_route(stops)
println(stops)

# topics/foundations/mutation-and-copying.md
routes = [["KR", "MUS"], ["KR", "UTN"]]
backup = copy(routes)
println(backup === routes)       # false
println(backup[1] === routes[1]) # true
push!(backup[1], "CLM")
println(routes[1])

# topics/foundations/mutation-and-copying.md
original = [["KR", "MUS"], ["KR", "UTN"]]
independent = deepcopy(original)
push!(independent[1], "CLM")
println(original[1])
println(independent[1])

# topics/foundations/mutation-and-copying.md
# Julia also evaluates a default expression at each call.
function add_stop(stop, route=String[])
    push!(route, stop)
    return route
end
first_route = add_stop("KR")
second_route = add_stop("MUS")
println(first_route, " ", second_route)
println(first_route === second_route) # false

# topics/foundations/collections-and-classes.md
location = (1.2937, 103.7845)
latitude, longitude = location
# A vector of pairs keeps the example's display order explicit.
passenger_counts = ["Kent Ridge"=>12, "Museum"=>7, "University Town"=>18]
busy_stops = [name for (name, count) in passenger_counts if count >= 10]
println(busy_stops)

# topics/foundations/collections-and-classes.md
mutable struct ShuttleStop
    code
    name
    passengers::Int
end
ShuttleStop(code, name) = ShuttleStop(code, name, 0)
function check_number(number)
    (number isa Int && number >= 0) || throw(ArgumentError("Expected a nonnegative integer count"))
end
function board!(stop::ShuttleStop, number=1)
    check_number(number)
    stop.passengers += number
    return nothing
end
function alight!(stop::ShuttleStop, number=1)
    check_number(number)
    number <= stop.passengers || throw(ArgumentError("Not enough passengers"))
    stop.passengers -= number
    return nothing
end
museum = ShuttleStop("MUS", "Museum")
utown = ShuttleStop("UTN", "University Town")
board!(museum, 3); board!(utown, 8); alight!(museum, 1)
println(museum); println(utown)

# topics/foundations/collections-and-classes.md
mutable struct RouteNode
    stop
    next
end
RouteNode(stop) = RouteNode(stop, nothing)
second = RouteNode(ShuttleStop("MUS", "Museum"))
first_node = RouteNode(ShuttleStop("KR", "Kent Ridge"), second)
let current = first_node
    while current !== nothing
        println(current.stop.name)
        current = current.next
    end
end
