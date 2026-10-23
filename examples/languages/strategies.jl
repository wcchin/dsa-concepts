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

# topics/strategies/greedy.md
function select_activities(activities)
    activities = collect(activities)
    any(start >= finish for (name,start,finish) in activities) && throw(ArgumentError("start must precede end"))
    chosen = Any[]; last_end = -Inf
    for activity in sort(activities; by=a->(a[3],a[2]), alg=MergeSort)
        if activity[2] >= last_end; push!(chosen, activity); last_end = activity[3]; end
    end
    return chosen
end

# topics/strategies/dynamic-programming.md
function coin_problem(coins, amount)
    coins = collect(coins)
    (amount isa Int && amount >= 0) || throw(ArgumentError("invalid amount"))
    all(c isa Int && c > 0 for c in coins) || throw(ArgumentError("invalid coin"))
    return sort(unique(coins))
end
function min_coins_memo(coins, amount)
    coins = coin_problem(coins,amount); memo = Dict{Int,Float64}(0=>0)
    function solve(a)
        if !haskey(memo,a)
            best = Inf
            for c in coins; c <= a && (best = min(best,1+solve(a-c))); end
            memo[a] = best
        end
        return memo[a]
    end
    result = solve(amount); return result == Inf ? nothing : Int(result)
end

# topics/strategies/dynamic-programming.md
function min_coin_change(coins, amount)
    coins = coin_problem(coins,amount)
    best = fill(Inf,amount+1); choice = zeros(Int,amount+1); best[1]=0
    for a in 1:amount, c in coins
        if c<=a && best[a-c+1]+1<best[a+1]; best[a+1]=best[a-c+1]+1; choice[a+1]=c; end
    end
    best[amount+1] == Inf && return nothing
    selected = Int[]; a=amount
    while a>0; push!(selected,choice[a+1]); a-=choice[a+1]; end
    return (Int(best[amount+1]),selected)
end

# topics/strategies/backtracking.md
function subset_sum_indices(values,target)
    values = collect(values)
    (target isa Int && target>=0) || throw(ArgumentError("invalid target"))
    all(v isa Int && v>0 for v in values) || throw(ArgumentError("positive integers required"))
    results=Vector{Int}[]; chosen=Int[]
    function search(i,remaining)
        if remaining==0; push!(results,copy(chosen)); return; end
        i>length(values) && return
        if values[i]<=remaining
            push!(chosen,i); search(i+1,remaining-values[i]); pop!(chosen)
        end
        search(i+1,remaining)
    end
    search(1,target); return results
end

# topics/strategies/sequence-patterns.md
function prefix_sums(values)
    prefix = Any[0]
    for value in values; push!(prefix, prefix[end] + value); end
    return prefix
end

# topics/strategies/sequence-patterns.md
function two_sum_sorted(values, target)
    left, right = 1, length(values)
    while left < right
        total = values[left] + values[right]
        total == target && return (left,right)
        if total < target; left += 1; else; right -= 1; end
    end
    return nothing
end

# topics/strategies/sequence-patterns.md
function max_fixed_window_sum(values, k)
    (k isa Int && 1 <= k <= length(values)) || throw(ArgumentError("invalid window size"))
    total = sum(values[i] for i in 1:k); best = total
    for right in k+1:length(values)
        total += values[right] - values[right-k]; best = max(best,total)
    end
    return best
end
