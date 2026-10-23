# Backtracking and safe pruning

**After this page, you should be able to:**

- Trace choose/explore/undo state and preserve saved solutions independently.
- Justify domain-dependent pruning and separate search work from output costs.

**Builds on:** [Recursive frames](../recursion/call-stack.md), [mutation/shallow copies](../foundations/mutation-and-copying.md) and [state contracts](strategy-selection.md).

(backtracking)=
## Build a candidate, explore, then undo

Backtracking explores alternatives from a partial candidate. It adds a choice, recursively explores the consequences, then restores the earlier state before trying another branch. The restoration matters when the partial candidate is a shared mutable list.

For subset sum, choose each input position at most once and report every subset totalling a target. This version requires strictly positive integer values and a nonnegative integer target. Equal values at different positions are distinct selectable items.

```python
def subset_sum_indices(values, target):
    values = list(values)
    if type(target) is not int or target < 0:
        raise ValueError("target must be a nonnegative integer")
    if any(type(v) is not int or v <= 0 for v in values):
        raise ValueError("values must be positive integers")
    results, chosen = [], []

    def search(i, remaining):
        if remaining == 0:
            results.append(chosen.copy())
            return
        if i == len(values):
            return
        if values[i] <= remaining:
            chosen.append(i)
            search(i + 1, remaining - values[i])
            chosen.pop()
        search(i + 1, remaining)

    search(0, target)
    return results
```

(subset-enumeration-contract)=
## Return positions and preserve each distinct choice

`subset_sum_indices(values, target)` consumes a finite iterable, copies it into a list and returns a list of index lists. Each returned list is strictly increasing, uses a supplied position at most once and selects values totalling the target. Equal values at different positions remain distinct items. It observes an input list without changing it; a supplied iterator is consumed.

Target must be an exact nonnegative `int`, and values exact positive `int` objects; invalid types, booleans or forbidden signs raise `ValueError`. Empty input with target zero returns `[[]]`; with a positive target it returns `[]`. Target zero is still validated along with every item. Include-first depth-first order determines output order; this is not a set of unique value-multisets.

The function uses recursion and can raise `RecursionError` for deep valid inputs. It reports all solutions, rather than stopping after the first success.

(backtracking-pruning)=
## A prune must follow from the domain

Skipping an item larger than the remaining target is safe because all other values are positive: no future negative item can undo an overshoot. Likewise, once the remainder reaches zero, adding another item cannot preserve the sum. These arguments would need revision if zero or negative values were allowed.

![The first two include-or-skip decisions on 2,3,4 find 2+3 for target five; the other branches continue with the last value.](../../assets/strategies/subset-backtracking.svg)

For values `[2,3,4]` and target 5, the result is `[[0,1]]`. For target 0, the only solution under this positive-item model is the empty subset. Copying `chosen` when saving a solution prevents later pops from changing the stored answer.

(backtracking-cost)=
## Small local updates do not make the search space small

There are up to $2^n$ include/skip combinations for n positions. Traversal can be exponential, and copying reported subsets gives an $O(n2^n)$ worst-case upper bound including output. The active recursion and chosen list use $O(n)$ working space, plus stored results.

If only feasibility or a count is required, a DP keyed by `(position, remaining)` may merge equivalent future subproblems. Enumerating every distinct solution needs to retain their distinct choices. State compression must respect the requested result.

## Correctness and complete space accounting

At entry to `search(i, remaining)`, `chosen` contains increasing indices below i, and their selected sum plus `remaining` equals the original target. Including or skipping position i covers the two possibilities without reusing it. Popping restores the previous candidate before the sibling branch; saving a copy protects the reported result from that restoration.

For n positions, the input copy, candidate and active stack require O(n+1) working space. For r returned subsets containing Z indices altogether, result storage is O(r+Z+1). Under the constant-cost arithmetic model, search visits at most an exponential number of branch nodes, and each copied result costs its length: O(n+2^n+Z+1) is an output-aware upper bound, with O(n2^n+1) a coarser worst-case summary.

When only feasibility or the best objective value is required, repeated future states may be reusable in DP. When every position-distinct witness is required, the output itself can be large. Pruning and state compression must preserve the requested witness distinctions.

:::{tip} Common misconception
**Equal values are interchangeable outputs.** This enumerator identifies positions, so choosing the first 2 and choosing the second 2 are different subsets.
:::

(backtracking-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. For values [2,2] and target 2, what is returned?**

:::{dropdown} Show explanation
[[0], [1]]. Each position can supply a separate solution even though the selected values are equal.
:::

**2. Why is results.append(chosen) unsafe in place of chosen.copy()?**

:::{dropdown} Show explanation
Every saved entry would refer to the same mutable candidate list. Later append/pop operations would change the supposed earlier answers.
:::

Next: [Sequence patterns](sequence-patterns.md).
