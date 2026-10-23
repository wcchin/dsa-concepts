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

# topics/strings/string-model.md
using Unicode
composed = "é"; decomposed = "e\u0301"
@assert composed != decomposed
@assert Unicode.normalize(composed, :NFC) == Unicode.normalize(decomposed, :NFC)

# topics/strings/trie-representation.md
mutable struct TrieNode
    children::Dict{Char,Any}
    terminal::Bool
end
TrieNode() = TrieNode(Dict{Char,Any}(), false)

# topics/strings/trie-operations.md
mutable struct Trie
    root::TrieNode
    n::Int
end
Trie() = Trie(TrieNode(), 0)
Base.length(t::Trie) = t.n
Base.isempty(t::Trie) = t.n == 0
function trie_walk(t::Trie, text)
    text isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root
    for char in text
        node = get(node.children, char, nothing)
        node === nothing && return nothing
    end
    return node
end
function trie_contains(t::Trie, word)
    node = trie_walk(t, word); return node !== nothing && node.terminal
end
has_prefix(t::Trie, prefix) = trie_walk(t, prefix) !== nothing
function trie_insert!(t::Trie, word)
    word isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root
    for char in word
        if !haskey(node.children, char); node.children[char] = TrieNode(); end
        node = node.children[char]
    end
    node.terminal && return false
    node.terminal = true; t.n += 1; return true
end
function trie_delete!(t::Trie, word)
    word isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root; path = Any[]
    for char in word
        child = get(node.children, char, nothing); child === nothing && return false
        push!(path, (node,char,child)); node = child
    end
    !node.terminal && return false
    node.terminal = false; t.n -= 1
    for (parent,char,child) in Iterators.reverse(path)
        (child.terminal || !isempty(child.children)) && break
        delete!(parent.children, char)
    end
    return true
end

# topics/strings/trie-operations.md
trie = Trie()
for word in ["be","bus","buses","busy","car"]; trie_insert!(trie, word); end

# topics/strings/trie-prefix-queries.md
struct PrefixWords
    trie::Trie
    prefix
end
Base.IteratorSize(::Type{PrefixWords}) = Base.SizeUnknown()
Base.eltype(::Type{PrefixWords}) = String
words_with_prefix(t::Trie, prefix) = PrefixWords(t, prefix)
function Base.iterate(w::PrefixWords)
    node = trie_walk(w.trie, w.prefix) # validation is delayed until iteration
    node === nothing && return nothing
    state = (path=collect(w.prefix), stack=Any[(node,iterate(node.children))])
    node.terminal && return (String(w.prefix), state)
    return iterate(w, state)
end
function Base.iterate(w::PrefixWords, state)
    while !isempty(state.stack)
        node, step = state.stack[end]
        if step === nothing
            pop!(state.stack)
            !isempty(state.stack) && pop!(state.path)
            continue
        end
        (char,child), next_state = step
        state.stack[end] = (node,iterate(node.children,next_state))
        push!(state.path, char)
        push!(state.stack, (child,iterate(child.children)))
        child.terminal && return (join(state.path), state)
    end
    return nothing
end

# topics/strings/trie-prefix-queries.md
function longest_stored_prefix(trie::Trie, text)
    text isa AbstractString || throw(ArgumentError("expected a string"))
    chars = collect(text); node = trie.root; best = node.terminal ? 0 : nothing
    for (i,char) in enumerate(chars)
        node = get(node.children, char, nothing); node === nothing && break
        node.terminal && (best = i)
    end
    return best === nothing ? nothing : join(chars[1:best])
end

# topics/strings/substring-baseline.md
function naive_find_all(text, pattern)
    t, p = collect(text), collect(pattern); n, m = length(t), length(p)
    m == 0 && return collect(1:n+1)
    matches = Int[]
    for start in 1:n-m+1
        j = 0
        while j < m && t[start+j] == p[j+1]; j += 1; end
        j == m && push!(matches, start)
    end
    return matches
end

# topics/strings/kmp-matching.md
function prefix_function(pattern)
    p = collect(pattern); pi = zeros(Int, length(p)); j = 0
    for i in 2:length(p)
        while j > 0 && p[i] != p[j+1]; j = pi[j]; end
        p[i] == p[j+1] && (j += 1)
        pi[i] = j
    end
    return pi
end

# topics/strings/kmp-matching.md
function kmp_find_all(text, pattern)
    t, p = collect(text), collect(pattern)
    isempty(p) && return collect(1:length(t)+1)
    pi = prefix_function(p); matches = Int[]; j = 0
    for (i,char) in enumerate(t)
        while j > 0 && char != p[j+1]; j = pi[j]; end
        char == p[j+1] && (j += 1)
        if j == length(p); push!(matches, i-length(p)+1); j = pi[j]; end
    end
    return matches
end

# topics/strings/rolling-hash-search.md
function rolling_find_all(text, pattern; base=257, modulus=1_000_000_007)
    (base isa Integer && !(base isa Bool) && base >= 2) || throw(ArgumentError("invalid base"))
    (modulus isa Integer && !(modulus isa Bool) && modulus >= 2) || throw(ArgumentError("invalid modulus"))
    b, q = big(base), big(modulus) # exact modular arithmetic, including custom parameters
    t, p = collect(text), collect(pattern); n, m = length(t), length(p)
    m == 0 && return collect(1:n+1)
    m > n && return Int[]
    high = powermod(b, m-1, q); target_hash = big(0); window_hash = big(0)
    for j in 1:m
        target_hash = mod(target_hash*b + Int(p[j]), q)
        window_hash = mod(window_hash*b + Int(t[j]), q)
    end
    matches = Int[]
    for start in 1:n-m+1
        if window_hash == target_hash && all(t[start+j-1] == p[j] for j in 1:m)
            push!(matches, start)
        end
        if start+m <= n
            window_hash = mod((window_hash-Int(t[start])*high)*b+Int(t[start+m]), q)
        end
    end
    return matches
end
