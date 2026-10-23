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

# topics/searching/binary-search.md
function binary_search(a, target)
    low, high = 1, length(a)
    while low <= high
        mid = low + div(high - low, 2)
        if a[mid] == target
            return mid
        end
        if target < a[mid]
            high = mid - 1
        else
            low = mid + 1
        end
    end
    return nothing
end

# topics/searching/binary-search.md
values = [3, 7, 11, 18, 24]
println(binary_search(values, 18))  # 4
println(binary_search(values, 3))   # 1
println(binary_search(values, 20))  # nothing
println(binary_search(Int[], 18))  # nothing

# topics/searching/search-boundaries.md
function lower_bound(a, target)
    low, high = 1, length(a) + 1
    while low < high
        mid = low + div(high - low, 2)
        if a[mid] < target; low = mid + 1; else; high = mid; end
    end
    return low
end

# topics/searching/search-boundaries.md
function upper_bound(a, target)
    low, high = 1, length(a) + 1
    while low < high
        mid = low + div(high - low, 2)
        if a[mid] <= target; low = mid + 1; else; high = mid; end
    end
    return low
end

# topics/searching/bst-lookup-insertion.md
mutable struct BSTNode
    key
    left
    right
end
BSTNode(key) = BSTNode(key, nothing, nothing)

# topics/searching/bst-lookup-insertion.md
function bst_search(node, target)
    while node !== nothing
        target == node.key && return node
        node = target < node.key ? node.left : node.right
    end
    return nothing
end

# topics/searching/bst-lookup-insertion.md
function bst_insert(node, key)
    node === nothing && return BSTNode(key)
    if key < node.key; node.left = bst_insert(node.left, key)
    elseif key > node.key; node.right = bst_insert(node.right, key); end
    return node
end
root = let tree = nothing
    for key in [50, 30, 70, 20, 40, 60, 80]; tree = bst_insert(tree, key); end
    bst_insert(tree, 65)
end

# topics/searching/bst-traversal.md
function inorder_keys(root)
    out = Any[]
    function visit(node)
        node === nothing && return
        visit(node.left)
        push!(out, node.key)
        visit(node.right)
    end
    visit(root); return out
end

# topics/searching/bst-traversal.md
function preorder_keys(root)
    out = Any[]
    function visit(node)
        node === nothing && return
        push!(out, node.key)
        visit(node.left)
        visit(node.right)
    end
    visit(root); return out
end

function postorder_keys(root)
    out = Any[]
    function visit(node)
        node === nothing && return
        visit(node.left)
        visit(node.right)
        push!(out, node.key)
    end
    visit(root); return out
end

# topics/searching/bst-traversal.md
function bst_minimum(node)
    node === nothing && return nothing
    while node.left !== nothing; node = node.left; end
    return node
end

# topics/searching/bst-traversal.md
function bst_maximum(node)
    node === nothing && return nothing
    while node.right !== nothing; node = node.right; end
    return node
end
function bst_successor(root, key)
    candidate = nothing; node = root
    while node !== nothing
        if key < node.key; candidate = node; node = node.left
        else; node = node.right; end
    end
    return candidate
end
function bst_predecessor(root, key)
    candidate = nothing; node = root
    while node !== nothing
        if node.key < key; candidate = node; node = node.right
        else; node = node.left; end
    end
    return candidate
end

# topics/searching/bst-range-queries.md
function bst_range_keys(root, low, high)
    low <= high || throw(ArgumentError("lower bound exceeds upper bound"))
    out = Any[]
    function visit(node)
        node === nothing && return
        low < node.key && visit(node.left)
        low <= node.key <= high && push!(out, node.key)
        node.key < high && visit(node.right)
    end
    visit(root); return out
end

# topics/searching/bst-deletion.md
function bst_delete(node, key)
    node === nothing && return nothing
    if key < node.key; node.left = bst_delete(node.left, key)
    elseif key > node.key; node.right = bst_delete(node.right, key)
    else
        node.left === nothing && return node.right
        node.right === nothing && return node.left
        successor = bst_minimum(node.right)
        node.key = successor.key
        node.right = bst_delete(node.right, successor.key)
    end
    return node
end

# topics/searching/ordered-set-operations.md
mutable struct OrderedSet
    root
    n::Int
    insert_key
    delete_key
end
OrderedSet(insert_key, delete_key) = OrderedSet(nothing, 0, insert_key, delete_key)
Base.length(s::OrderedSet) = s.n
Base.isempty(s::OrderedSet) = s.n == 0
contains_key(s::OrderedSet, key) = bst_search(s.root, key) !== nothing
function add!(s::OrderedSet, key)
    if !contains_key(s, key); s.root = s.insert_key(s.root, key); s.n += 1; end
    return nothing
end
function remove!(s::OrderedSet, key)
    contains_key(s, key) || throw(KeyError(key))
    s.root = s.delete_key(s.root, key); s.n -= 1; return nothing
end
discard!(s::OrderedSet, key) = (contains_key(s, key) && remove!(s, key); nothing)
function required_key(node)
    node === nothing && throw(KeyError("no matching key"))
    return node.key
end
Base.minimum(s::OrderedSet) = required_key(bst_minimum(s.root))
Base.maximum(s::OrderedSet) = required_key(bst_maximum(s.root))
successor(s::OrderedSet, key) = required_key(bst_successor(s.root, key))
predecessor(s::OrderedSet, key) = required_key(bst_predecessor(s.root, key))
function extract_min!(s::OrderedSet)
    key = minimum(s); remove!(s, key); return key
end
function extract_max!(s::OrderedSet)
    key = maximum(s); remove!(s, key); return key
end
ordered_keys(s::OrderedSet) = inorder_keys(s.root)
range_keys(s::OrderedSet, low, high) = bst_range_keys(s.root, low, high)
