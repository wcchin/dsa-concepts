# Dynamic programming: states, reuse and reconstruction

(dynamic-programming)=
## Solve equivalent subproblems once

Dynamic programming (DP) stores results for well-defined subproblems and reuses them. It is useful when different choices lead to the same future state. For optimisation, the recurrence must also justify how an optimum is assembled from correct smaller-state results; this is often called **optimal substructure**.

Consider minimum coin count for a nonnegative integer amount A, with unlimited copies of positive integer denominations. Let C(a) be the fewest coins totalling a. Then

$$C(0)=0,\qquad C(a)=1+\min_{c\leq a} C(a-c).$$

An impossible state has value infinity; a minimum over no available choices is infinity. This recurrence considers the last coin of every possible solution. The remaining solution must be optimal for its remainder, or replacing it would improve the whole answer.

(memoisation)=
## Top-down memoisation retains recursive structure

```python
def coin_problem(coins, amount):
    coins = tuple(coins)
    if type(amount) is not int or amount < 0:
        raise ValueError("amount must be a nonnegative integer")
    if any(type(c) is not int or c <= 0 for c in coins):
        raise ValueError("coins must be positive integers")
    return tuple(sorted(set(coins)))

def min_coins_memo(coins, amount):
    coins = coin_problem(coins, amount)
    memo = {0: 0}

    def solve(a):
        if a not in memo:
            memo[a] = min((1 + solve(a - c) for c in coins if c <= a),
                          default=float("inf"))
        return memo[a]

    result = solve(amount)
    return None if result == float("inf") else result
```

The dictionary caches both possible and impossible states. Positive denominations ensure recursive amounts decrease. Recursion depth can still grow with A, so Python can reach its recursion limit; memoisation reduces repeated work, not necessarily depth.

(tabulation)=
## Bottom-up tabulation follows the state dependencies

```python
def min_coin_change(coins, amount):
    coins = coin_problem(coins, amount)
    best = [float("inf")] * (amount + 1)
    choice = [None] * (amount + 1)
    best[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and best[a - c] + 1 < best[a]:
                best[a] = best[a - c] + 1
                choice[a] = c
    if best[amount] == float("inf"):
        return None
    selected = []
    a = amount
    while a > 0:
        selected.append(choice[a])
        a -= choice[a]
    return best[amount], selected
```

(dp-reconstruction)=
## Store a decision when the route to the answer matters

The memoised function returns only a count or `None`; the tabulated version returns `(count, coin_list)` or `None`. Its `choice` array permits reconstruction, just as graph predecessors recover a route. Amount zero returns `(0, [])`; an empty denomination set cannot form a positive amount.

![For coin values 1,3,4, a table from amount zero to six gives counts 0,1,2,1,1,2,2 and reconstructs amount six as three plus three.](../../assets/strategies/coin-dp.svg)

(dp-cost-and-model)=
## Count states times transitions, then check input encoding

With k distinct denominations and target A, the main DP has A+1 states and up to k transitions per state. For k≥1 and A≥1 this gives $O(kA)$ work and $O(A)$ state storage, assuming constant-time arithmetic. Including empty denomination sets and amount zero, the uniform bounds are $O((k+1)(A+1))$ work and $O(A+1)$ state storage. Normalising d supplied denominations adds expected $O(d+k\log(k+1))$ work for set construction and sorting; its temporary input tuple can occupy $O(d)$ storage. Reconstruction adds at most A selected coins. Memoisation visits only reachable requested states but has the same worst-case state bound.

This is an **unbounded** coin model. If each coin position can be used at most once, state must include which items remain, or a different iteration discipline must enforce that restriction. Also A is a numeric magnitude, not its bit length; [the complexity page](complexity-limits.md) explains why $O(kA)$ is pseudopolynomial.

Next: [Backtracking](backtracking.md).
