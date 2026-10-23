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

# topics/maps-sets-hashing/maps.md
mutable struct HashMap
    entries::Dict{Any,Any}
end
HashMap() = HashMap(Dict{Any,Any}())
Base.length(m::HashMap) = length(m.entries)
Base.isempty(m::HashMap) = isempty(m.entries)
put!(m::HashMap, key, value) = (m.entries[key] = value; nothing)
get_value(m::HashMap, key) = m.entries[key]
remove!(m::HashMap, key) = pop!(m.entries, key)
contains_key(m::HashMap, key) = haskey(m.entries, key)
key_snapshot(m::HashMap) = Tuple(keys(m.entries))
item_snapshot(m::HashMap) = Tuple(pairs(m.entries))

# topics/maps-sets-hashing/maps.md
directory = Dict("S01"=>"Central", "S02"=>"Museum")
directory["S03"] = "Harbour"; directory["S01"] = "Downtown"
name = directory["S02"]; delete!(directory, "S03")
present = haskey(directory, "S04")

# topics/maps-sets-hashing/maps.md
missing_key = Ref(nothing) # unique sentinel, not Julia's missing value
result = get(directory, "S04", missing_key)
result === missing_key && println("No such station")

# topics/maps-sets-hashing/sets.md
mutable struct HashSet
    elements::Set{Any}
end
HashSet(elements=()) = HashSet(Set{Any}(elements))
Base.length(s::HashSet) = length(s.elements)
Base.isempty(s::HashSet) = isempty(s.elements)
add!(s::HashSet, item) = (push!(s.elements, item); nothing)
contains_item(s::HashSet, item) = item in s.elements
function remove!(s::HashSet, item)
    item in s.elements || throw(KeyError(item))
    delete!(s.elements, item); return nothing
end
discard!(s::HashSet, item) = (delete!(s.elements, item); nothing)
element_snapshot(s::HashSet) = Tuple(s.elements)
set_union(a::HashSet, b::HashSet) = HashSet(union(a.elements, b.elements))
set_intersection(a::HashSet, b::HashSet) = HashSet(intersect(a.elements, b.elements))
set_difference(a::HashSet, b::HashSet) = HashSet(setdiff(a.elements, b.elements))

# topics/maps-sets-hashing/sets.md
visited = Set{String}()
push!(visited, "S01"); push!(visited, "S02"); push!(visited, "S01")
present = "S02" in visited; count = length(visited)
delete!(visited, "S03")

# topics/maps-sets-hashing/sets.md
observations = ["S01", "S02", "S01"]
counts = Dict{String,Int}()
for station in observations
    counts[station] = get(counts, station, 0) + 1
end

# topics/maps-sets-hashing/hashing.md
locations = Dict((2, 3) => "Stop A")
records = Dict("S01" => [72, 81])
push!(records["S01"], 85)

# topics/maps-sets-hashing/chaining.md
function get_chained(table, key)
    for (stored_key, value) in table[hash_index(key, length(table))]
        stored_key == key && return value
    end
    throw(KeyError(key))
end

# topics/maps-sets-hashing/chaining.md
function put_chained!(table, key, value)
    bucket = table[hash_index(key, length(table))]
    for (j, entry) in enumerate(bucket)
        if entry[1] == key; bucket[j] = (key, value); return false; end
    end
    push!(bucket, (key, value)); return true
end

# topics/maps-sets-hashing/chaining.md
function remove_chained!(table, key)
    bucket = table[hash_index(key, length(table))]
    for (j, (stored_key, value)) in enumerate(bucket)
        if stored_key == key; deleteat!(bucket, j); return value; end
    end
    throw(KeyError(key))
end

# topics/maps-sets-hashing/chaining.md
table = [Any[] for _ in 1:7]

# topics/maps-sets-hashing/open-addressing.md
const EMPTY = Ref(:empty)
const DELETED = Ref(:deleted)
function get_probed(table, key)
    m = length(table); start = hash_index(key, m)
    for step in 0:m-1
        slot = table[mod(start - 1 + step, m) + 1]
        slot === EMPTY && throw(KeyError(key))
        slot === DELETED && continue
        slot[1] == key && return slot[2]
    end
    throw(KeyError(key))
end

# topics/maps-sets-hashing/open-addressing.md
function put_probed!(table, key, value)
    m = length(table); start = hash_index(key, m); first_deleted = nothing
    for step in 0:m-1
        i = mod(start - 1 + step, m) + 1; slot = table[i]
        if slot === EMPTY
            target = first_deleted === nothing ? i : first_deleted
            table[target] = (key, value); return true
        elseif slot === DELETED
            first_deleted === nothing && (first_deleted = i)
        elseif slot[1] == key
            table[i] = (key, value); return false
        end
    end
    if first_deleted !== nothing; table[first_deleted] = (key, value); return true; end
    throw(OverflowError("hash table is full"))
end
function remove_probed!(table, key)
    m = length(table); start = hash_index(key, m)
    for step in 0:m-1
        i = mod(start - 1 + step, m) + 1; slot = table[i]
        slot === EMPTY && throw(KeyError(key))
        if slot !== DELETED && slot[1] == key
            table[i] = DELETED; return slot[2]
        end
    end
    throw(KeyError(key))
end

# topics/maps-sets-hashing/performance.md
function rebuild_chained(table, capacity)
    (capacity isa Int && capacity > 0) || throw(ArgumentError("positive integer capacity required"))
    fresh = [Any[] for _ in 1:capacity]
    for bucket in table, (key, value) in bucket
        put_chained!(fresh, key, value)
    end
    return fresh
end
function rebuild_probed(table, capacity)
    (capacity isa Int && capacity > 0) || throw(ArgumentError("positive integer capacity required"))
    fresh = Any[EMPTY for _ in 1:capacity]
    for slot in table
        if slot !== EMPTY && slot !== DELETED; put_probed!(fresh, slot[1], slot[2]); end
    end
    return fresh
end
