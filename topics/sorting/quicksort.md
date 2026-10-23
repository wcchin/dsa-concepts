# Quicksort

**After this page, you should be able to:**

- Connect the partition contract to correct shrinking recursive ranges.
- Explain how pivot, duplicate and recursion choices affect costs and stability.

**Builds on:** [Partitioning](partitioning.md) supplies the exact helper used below.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/sorting.js) · [Julia](../../examples/languages/sorting.jl).

Teaching sorts retain their mutation/return policy: JavaScript mutators return undefined and Julia teaching mutators return nothing. Built-in sort APIs are shown separately: JavaScript sort and Julia sort! return their mutated arrays. The Timsort/Powersort discussion describes Python’s implementation, not the algorithms used by the other runtimes.

(quicksort)=
## Partition, then recurse

Merge sort first splits by position and later combines sorted results. Quicksort first partitions by key and then sorts the resulting ranges. Because the pivot separates the ranges, no merge step is needed.

The following code uses exactly the `partition` function from [the preceding page](partitioning.md), including its inclusive bounds and `<=` tie rule.

![Quicksort partitions 7, 2, 6, 3, 5 around 5, then sorts the two remaining ranges.](../../assets/sorting/quicksort-tree.svg)

## Python implementation

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def quicksort(a):
    def sort_range(lo, hi):
        if lo >= hi:
            return
        p = partition(a, lo, hi)
        sort_range(lo, p - 1)
        sort_range(p + 1, hi)

    sort_range(0, len(a) - 1)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function quicksort(a) {
    function sort_range(lo, hi) {
        if (lo >= hi) return;
        const p = partition(a, lo, hi);
        sort_range(lo, p - 1);
        sort_range(p + 1, hi);
    }
    sort_range(0, a.length - 1);
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function quicksort!(a)
    function sort_range(lo, hi)
        lo >= hi && return
        p = partition!(a, lo, hi)
        sort_range(lo, p - 1)
        sort_range(p + 1, hi)
    end
    sort_range(1, length(a))
    return nothing
end
```

:::

::::

It modifies `a` and returns `None`. Empty lists start with `(lo, hi) = (0, -1)` and immediately return. Singleton ranges also need no partition.

(quicksort-progress)=
## Why the recursion terminates and sorts

The pivot must be excluded from both recursive ranges. Each nontrivial call fixes one pivot and delegates only strictly smaller ranges. If either side is empty, the other still has one fewer item than the original range.

Assume both recursive calls correctly sort their smaller ranges. Every left key is at most the pivot, every right key is larger, and each side is now internally sorted. Together they form a sorted range containing the original records. These are the inductive steps behind correctness.

## Implementation choices

| Choice here | Consequence or alternative |
|---|---|
| Last element as pivot | Simple reproducible traces; sorted distinct inputs can be worst cases |
| Lomuto-style two-way partition with `<=` | Equal keys collect on the left; all-equal input gives one-sided recursion |
| Inclusive index bounds, no slices | Partitions the existing array instead of allocating sublists |
| Two recursive calls | Can use linear stack depth; recursing only on the smaller side and looping over the larger can bound stack depth by O(log n) |

The smaller-side technique controls stack space, not worst-case comparison time. Random pivots and three-way partitioning are separate changes, described below; they are not features of the listing.

## Stability and in-place behaviour

The [partition counterexample](partitioning.md#partition-cost) shows that distant swaps can reverse equal-key records. This implementation is **not stable**. It mutates the list and returns `None`, but constant-space partitioning does not remove the recursion stack: balanced paths need O(log n) space and worst paths O(n). It is not O(1)-space sorting under this book's strict definition.

(quicksort-balanced)=
## Balanced partitions

If pivots repeatedly split ranges into roughly equal halves, there are $\Theta(\log n)$ levels. Partition scans across one level total $O(n)$ work, giving $\Theta(n\log n)$ time overall. The longest live chain of recursive calls uses $\Theta(\log n)$ stack space. See [Topic 3's recursion costs](../recursion/recursion-costs.md) for the level-by-level reasoning.

(quicksort-worst-case)=
## One-sided partitions

If each pivot is an extreme key, the remaining sizes are $n-1,n-2,\ldots,1$. The comparison count is

$$ (n-1)+(n-2)+\cdots+1 = \frac{n(n-1)}{2}. $$

Time becomes $\Theta(n^2)$ and the straightforward recursive implementation uses $\Theta(n)$ stack space. With the last-element pivot, ascending and descending distinct inputs produce this behaviour. All-equal input also does so under our `<=` rule. Large bad cases may reach Python's recursion limit before finishing.

(randomised-quicksort)=
## What random pivots change

Choosing a uniformly random pivot in each range, then swapping it to `hi` before partitioning, removes the dependence on a particular distinct-key input order. For distinct keys, expected running time over those random choices is $\Theta(n\log n)$ for every fixed input. Worst-case time is still quadratic: random choices can repeatedly be unlucky.

(three-way-partition)=
## Equal keys need a separate idea

Random selection cannot improve an all-equal input with our two-way partition: every possible pivot has the same key. A **three-way partition** groups keys as less than, equal to, and greater than the pivot, then recurses only on the less-than and greater-than groups. This avoids repeatedly processing a large equal-key group. It is a different algorithmic variant, not a property of the code shown above.

## When to use it

Useful for understanding partition-based sorting and the influence of pivot quality. Production variants often combine randomisation, duplicate handling, small-range insertion sorting or a worst-case fallback. None of those should be attributed to this small teaching function. For ordinary Python application code, use the built-in stable sort.

:::{tip} Common misconception
**Random pivots fix every duplicate-heavy input.** In this two-way scheme, all-equal input gives the same one-sided split for every pivot.
:::

(sorting-quick-checks)=
## Check your understanding

Predict the answer before opening the explanation.

**1. Partition returns p=2 on [2,3,5,7,6]. Which inclusive ranges are recursively sorted?**

:::{dropdown} Show explanation
0..1 and 3..4. Index 2 is the fixed pivot and must be excluded from both.
:::

**2. Does constant-space partitioning prove constant-space quicksort?**

:::{dropdown} Show explanation
No. The recursive call stack can grow to Θ(n) on one-sided splits in this listing.
:::

Next: [Timsort and Powersort](timsort.md).
