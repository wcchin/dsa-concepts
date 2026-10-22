# Binary-search boundaries and duplicate runs

**After this page, you should be able to:**

- Find lower/upper boundaries and derive duplicate counts.
- Keep half-open interval rules separate from exact-search rules.

**Builds on:** [Exact binary search](binary-search.md) returns one match rather than the whole duplicate run.

## Operation contracts

| Query on an ascending sequence | Return | Empty input |
|---|---|---|
| `lower_bound(a,t)` | First index with key≥t; n if none | 0 |
| `upper_bound(a,t)` | First index with key>t; n if none | 0 |

Both observe without mutation. The returned position n is a valid boundary but not a valid element index. Insertion at that boundary is a separate mutating operation.

(lower-bound-search)=
## Find the first position at least the target

A lower-bound query returns the first index i with `a[i] >= target`, or `len(a)` if no such item exists. The sequence must already be ascending under the comparison used. Unlike exact search, an absent target still has a meaningful insertion position.

```python
def lower_bound(a, target):
    low, high = 0, len(a)
    while low < high:
        mid = (low + high) // 2
        if a[mid] < target:
            low = mid + 1
        else:
            high = mid
    return low
```

The candidate interval is **half-open**: `[low, high)`. Every position before low is known too small; every position at or after high is known at least the target. Equality keeps mid as a possible boundary by moving high to mid. The loop stops when the two boundaries coincide. Mixing these updates with the inclusive exact-search loop from the previous page would be incorrect.

(upper-bound-search)=
## Find the first position strictly greater

```python
def upper_bound(a, target):
    low, high = 0, len(a)
    while low < high:
        mid = (low + high) // 2
        if a[mid] <= target:
            low = mid + 1
        else:
            high = mid
    return low
```

Now positions before low are at most the target, while positions at or after high are strictly greater. Equal keys move the boundary right instead of left. Both functions work on an empty list and can return n without ever reading index n.

(duplicate-run-boundaries)=
## Two boundaries identify every occurrence

For `[1, 2, 2, 2, 4]`, lower bound of 2 is 1 and upper bound is 4. The duplicate run is indices `[1,4)`, containing three items. Their difference is the occurrence count; exact presence can be checked with `i < len(a) and a[i] == target` after lower bound.

![A sorted array highlights the three occurrences of 2 between lower-bound position 1 and exclusive upper-bound position 4.](../../assets/searching/search-boundaries.svg)

For absent target 3, both functions return 4. These searches take $O(\log(n+1))$ time and constant auxiliary space under constant-time indexing/comparison. Actually inserting at that index can still shift $O(n)$ items.

(monotone-boundary-search)=
## Generalise only after proving monotonicity

Lower bound finds the first true value of the predicate `a[i] >= target`: it is false on an initial prefix and true thereafter. Similar boundary searches can locate a minimum feasible capacity or time when feasibility has that same false-to-true structure. Prove that monotonicity before discarding an interval; arbitrary predicates cannot safely be searched by halving.

## Implementation choices, costs and use

Equality stays on the candidate side for lower bound and is excluded for upper bound. Both loops use half-open bounds and must strictly shrink their candidate interval. Time is O(log(n+2)) and workspace O(1) with constant-time comparisons/indexing. Calculating the two boundaries does not copy the matching records; slicing out r results would add O(r) output work and space. Use boundaries for duplicate runs, insertion positions and monotone feasibility questions.

:::{tip} Common misconception
**A returned boundary n is an element index.** It marks the end position; check i<n before reading a[i].
:::

(tree-boundaries-checks)=
## Check your understanding

Predict the returned result, links or invariant before opening the explanation.

**1. For [1,2,2,2,4], what are the lower/upper bounds of 2?**

:::{dropdown} Show explanation
1 and 4. The half-open run [1,4) has three occurrences.
:::

**2. Does finding an insertion boundary make sorted-array insertion logarithmic?**

:::{dropdown} Show explanation
No. Finding the position is logarithmic; moving later elements can still be linear.
:::

Return to [binary search](binary-search.md) or continue to [tree terminology](tree-basics.md).
