# Comparing sorting strategies

**After this page, you should be able to:**

- Compare the exact versions shown using time, stability, mutation and space.
- Choose a strategy using input structure and application requirements.

**Builds on:** Read the algorithm pages, including [merge sort](merge-sort.md) and [Timsort/Powersort](timsort.md).

(sorting-strategies)=
## Where does each algorithm create order?

| Strategy | Progress made | Work still required |
|---|---|---|
| Insertion sort | Extend a sorted prefix by inserting one item | Process the remaining suffix |
| Bubble sort | Place a largest remaining item at the right boundary | Repeat over the shorter prefix |
| Merge sort | Sort halves independently | Merge their ordered outputs |
| Quicksort | Fix a pivot between two classified ranges | Sort each range |

Merge sort's split is cheap and its merge establishes the cross-half order. Quicksort spends linear work on partitioning before recursion; once its ranges are sorted, their order relative to the pivot is already known. Review the complete [merge-sort trace and code](merge-sort.md) rather than memorising only the shared $n\log n$ result.

(sorting-cost-comparison)=
## Costs depend on the implementation

For constant-time key comparisons and list access, the implementations in this book have these costs for growing $n$:

| Implementation | Best time | Average / expected time and assumption | Worst time | Extra space | Stable? | Mutates input? |
|---|---|---|---|---|---|---|
| Shifting insertion sort | Θ(n) | Θ(n²), uniform random distinct-key permutations | Θ(n²) | Θ(1) | Yes | Yes |
| Bubble sort with early stop | Θ(n) | Θ(n²), uniform random distinct-key permutations | Θ(n²) | Θ(1) | Yes | Yes |
| Slicing merge sort | Θ(n log n) | Θ(n log n), for every input distribution | Θ(n log n) | Θ(n) peak including result and stack | Yes, left-first ties | No |
| Last-pivot two-way quicksort | Θ(n log n) | Θ(n log n), uniform random distinct-key permutations | Θ(n²) | Θ(log n) balanced; Θ(n) worst stack | No | Yes |
| Iterative heapsort in Topic 9 | Θ(n) on all-equal input | Θ(n log n), uniform random distinct-key permutations | Θ(n log n) | Θ(1) | No | Yes |
| Timsort-derived built-in sorting | Θ(n) | Typically Θ(n log n) on random order | O(n log n) | O(n) worst case | Yes | `.sort()`: yes; `sorted()`: no |

Bounds describe n≥2 with constant-cost comparisons and ordinary list access. Θ(1) handles empty and singleton lists. “Extra space” includes recursion and any returned list; mutating input is a separate property. No timing benchmark is implied.

Quicksort's best case assumes balanced partitions, not already sorted input. Its expected time needs an input-distribution or random-pivot assumption; it is not a synonym for best-case time. The merge-sort row describes the implementation without an already-ordered shortcut. The heapsort best case refers specifically to the early-stop sifts shown in Topic 9; a blanket Θ(n log n) best-case claim would overlook all-equal input. Powersort is the merge-policy explanation within the hybrid row, not an independently callable built-in.

(choosing-sorting-strategy)=
## Match the strategy to the requirement

For a small or nearly sorted sequence, insertion sort's low overhead and $\Theta(n+I)$ behaviour can be useful. Bubble sort provides a clear adjacent-swap model, but it can spend many comparisons even when few swaps are needed.

Merge sort offers predictable comparison growth and a natural stable merge, with additional storage for this list implementation. Quicksort offers constant-space partitioning and can be fast with suitable pivot and equal-key handling, while requiring care over worst-case time and recursion depth.

For ordinary Python application code, start with `sorted` or `.sort`: the implementation is optimised and the interface supports keys and stability. Choose a hand-written algorithm when its behaviour or constraints are the point of the exercise.

Before choosing, ask: must ties retain their order? May the original list change? How much extra memory is available? Is the input nearly ordered or full of repeated keys? Do we need a worst-case guarantee? Big-O alone does not answer these questions.

:::{tip} Common misconception
**An algorithm name determines its costs independently of its code.** Shortcuts, slicing, ties and recursion choices can change the relevant bounds.
:::

(sorting-comparison-checks)=
## Check your understanding

Predict the answer before opening the explanation.

**1. Which shown implementations are both stable and constant-extra-space?**

:::{dropdown} Show explanation
Shifting insertion sort and early-stop bubble sort. Stable merge sort and the built-in hybrid may use linear storage.
:::

**2. Does sorted input give this last-pivot quicksort its best case?**

:::{dropdown} Show explanation
No. It repeatedly selects an extreme pivot, producing quadratic time and linear recursive depth.
:::

Next: [The comparison lower bound](comparison-lower-bound.md).

For another comparison-based strategy, see [heapsort and heap costs](../heaps/heap-sorting-costs.md). Its shrinking active heap gives an in-place sorting approach with a different stability trade-off.
