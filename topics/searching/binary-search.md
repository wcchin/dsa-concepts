# Binary search and candidate intervals

**After this page, you should be able to:**

- Trace inclusive candidate bounds for success, failure and empty input.
- Distinguish an index result and a probe bound from sorted-data preparation.

**Builds on:** [Sorting contracts](../sorting/sorting-properties.md) supply the ordered-input precondition.

(linear-search)=
## What can a comparison exclude?

Linear search checks candidates one at a time and needs no sorted-input precondition. On an arbitrary unsorted list, seeing one unequal value does not tell us which other values can be skipped. An unsuccessful scan of $n$ items takes $\Theta(n)$ comparisons.

(binary-search)=
## Sorted order lets us discard a whole side

For an ascending sequence, if `a[mid] < target`, every position at or before `mid` also has a value below the target. If the middle value is too large, every position at or after it is too large. This implication depends on the sequence being sorted under the same comparison rule used by the search.

![Binary search for 18 in 3, 7, 11, 18, 24 discards positions zero through two, then finds position three.](../../assets/searching/binary-interval.svg)

## Operation contract and implementation choices

`binary_search(a,target)` observes an ascending, random-access sequence and returns one matching index or `None`. It never changes the sequence. An empty input returns `None`; duplicates do not imply a first-match guarantee. Input and query comparisons must follow the same consistent ordering.

This implementation uses inclusive endpoints, integer midpoint calculation and index bounds instead of slices. Its workspace is constant; a recursive or slicing version needs a separate space/copy analysis. The trace above uses the same sorted input as the code's correctness argument.

(binary-search-invariant)=
## Keep an inclusive interval

The invariant is: **if the target occurs, at least one matching position remains in `low..high`**. Here both endpoints are inclusive. Initially this is the entire sequence; it becomes empty when `low > high`.

Python is the teaching and diagram language throughout this page. Choose JavaScript or Julia to read the same inclusive-interval algorithm. These are code listings to copy and run; selecting a tab changes the display.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python
:selected:

```python
def binary_search(a, target):
    low, high = 0, len(a) - 1
    while low <= high:
        mid = (low + high) // 2
        if a[mid] == target:
            return mid
        if target < a[mid]:
            high = mid - 1
        else:
            low = mid + 1
    return None
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function binary_search(a, target) {
    let low = 0, high = a.length - 1;
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (a[mid] === target) {
            return mid;
        }
        if (target < a[mid]) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return null;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
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
```

:::

::::

The result is an **index**, not the target value. In Python, test absence with `result is None`; index zero is a valid success even though it is false in a Boolean context. The language-specific absence values and indices are compared below. Empty and singleton inputs use the same algorithm.

Each mismatch excludes `mid` itself, so `high = mid - 1` or `low = mid + 1` strictly reduces the interval. Using `low = mid` can stall when only two candidates remain. An interval convention such as `[low, high)` also works, but its initialisation, loop condition and updates must be consistent with that convention.

(binary-search-language-example)=
## Run the same example in each language

Run the selected definition above before its matching example below. The implementation and example tabs switch language together. Python is the initial selection on this page.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python
:selected:

```python
values = [3, 7, 11, 18, 24]
print(binary_search(values, 18))  # 3
print(binary_search(values, 3))   # 0
print(binary_search(values, 20))  # None
print(binary_search([], 18))      # None
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
const values = [3, 7, 11, 18, 24];
console.log(binary_search(values, 18)); // 3
console.log(binary_search(values, 3));  // 0
console.log(binary_search(values, 20)); // null
console.log(binary_search([], 18));    // null
```

:::

:::{tab-item} Julia
:sync: julia

```julia
values = [3, 7, 11, 18, 24]
println(binary_search(values, 18))  # 4
println(binary_search(values, 3))   # 1
println(binary_search(values, 20))  # nothing
println(binary_search(Int[], 18))  # nothing
```

:::

::::

| Convention | Python | JavaScript | Julia |
|---|---|---|---|
| Container in these examples | List | Array | Ordinary one-based Vector |
| First valid index | `0` | `0` | `1` |
| No matching value | `None` | `null` | `nothing` |
| Explicit absence test | `result is None` | `result === null` | `result === nothing` |
| Index of 18 in the example | `3` | `3` | `4` |
| Index returned for `[2, 2, 2]`, target 2 | `1` | `1` | `2` |

Julia's answer 4 means the same fourth element as index 3 in Python and JavaScript. Read the diagram and existing self-check indices as Python indices. To translate a successful position from this Julia vector to a zero-based trace, subtract one; leave absence as absence.

All three versions observe the input, keep an inclusive candidate interval, discard the midpoint after a mismatch and return one match without a first-match guarantee. JavaScript and Julia compute the midpoint as `low + half the remaining distance`; it selects the same relative position as Python's formula. `Math.floor` and `div` supply an integer half here; JavaScript bitwise midpoint tricks would impose a 32-bit conversion and are avoided.

For the parallel examples, use ascending numeric arrays/vectors whose values have the same ordering and equality in all three languages. Integer examples stay within JavaScript's safe-integer range. The Julia listing assumes an ordinary one-based vector; offset-indexed arrays, strings and custom indexing are outside this example. None of these listings validates sortedness or repairs invalid comparison data such as NaN. The original Python contract can also apply to other consistently ordered random-access values.

For keyboard access, or to read code without switching tabs, open the complete runnable examples directly: [Python](../../examples/binary_search.py), [JavaScript](../../examples/binary_search.js) and [Julia](../../examples/binary_search.jl). Run them with `python binary_search.py`, `node binary_search.js` or `julia binary_search.jl`, respectively.

Language references: [Julia's differences from Python](https://docs.julialang.org/en/v1/manual/noteworthy-differences/#Noteworthy-differences-from-Python) and [JavaScript safe integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

(binary-search-correctness)=
## Explain the result and termination

Initialisation includes every possible match. A mismatch preserves the invariant by discarding only values proved too small or too large. The nonnegative number of candidates strictly decreases. Equality returns a valid match; an empty interval combined with the invariant establishes absence.

For example, searching for 20 in `[3, 7, 11, 18, 24]` inspects 11, 18 and 24, then ends with `low = 4, high = 3`. Failure is a justified result, not an exceptional case.

(binary-search-duplicates)=
## Repeated values and boundary queries

This function returns some matching position. In `[2, 2, 2]`, it can return index 1; it does not promise the first occurrence. Finding the first value at least a target is a different contract, often called a lower-bound query. Finding one match does not by itself establish either edge of a duplicate run.

(binary-search-cost)=
## Halving counts probes, not all preparation

With constant-time indexing and comparisons, the worst-case probe count is $O(\log n)$ and iterative auxiliary space is $O(1)$. A recursive implementation using index bounds instead has $O(\log n)$ call-stack space in the worst case. Slicing copies data and changes the cost analysis.

For empty input the cost is constant; a uniform bound is O(log(n+2)). No result list is allocated. This is a useful choice for mostly static sorted arrays; linked-list indexing does not satisfy the constant-time-access assumption.

Sorting an unsorted collection before a single query is additional work. Repeated queries may justify maintaining sorted data; binary search itself does not make insertions into a sorted array cheap.

:::{tip} Common misconception
**Index zero is a failure result.** Zero is a valid index in the Python and JavaScript versions. Test the explicit absence marker: `None`, `null` or `nothing`, respectively. Julia uses one-based indices.
:::

(tree-binary-checks)=
## Check your understanding

Predict the returned result, links or invariant before opening the explanation.

**1. What does exact search return on []? What about a match at the first position?**

:::{dropdown} Show explanation
An empty sequence returns None; a first-position match returns 0, which is a valid index.
:::

**2. Does low=mid always make progress after a mismatch?**

:::{dropdown} Show explanation
No. On two candidates, mid can equal low. The inclusive algorithm uses mid+1 to exclude the disproved midpoint.
:::

Next: [Search boundaries](search-boundaries.md).
