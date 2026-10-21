# Comparing sorting strategies

(sorting-strategies)=
## Where does each algorithm create order?

| Strategy | Progress made | Work still required |
|---|---|---|
| Insertion sort | Extend a sorted prefix by inserting one item | Process the remaining suffix |
| Bubble sort | Place a largest remaining item at the right boundary | Repeat over the shorter prefix |
| Merge sort | Sort halves independently | Merge their ordered outputs |
| Quicksort | Fix a pivot between two classified ranges | Sort each range |

Merge sort's split is cheap and its merge establishes the cross-half order. Quicksort spends linear work on partitioning before recursion; once its ranges are sorted, their order relative to the pivot is already known. Review the complete [merge-sort trace and code](../recursion/divide-and-conquer.md) rather than memorising only the shared $n\log n$ result.

(sorting-cost-comparison)=
## Costs depend on the implementation

For constant-time key comparisons and list access, the implementations in this book have these costs for growing $n$:

| Algorithm | Best time | Worst time | Additional working space | Stable? |
|---|---|---|---|---|
| Insertion sort | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes |
| Bubble sort with early stopping | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes |
| Slicing-based merge sort in Topic 3 | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ peak, including returned lists and stack | Yes, with left-first ties |
| Quicksort with the shown partition | $\Theta(n\log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ for balanced splits; $\Theta(n)$ worst, including stack | No |

Quicksort's best case assumes balanced partitions, not already sorted input. Its expected time needs an input-distribution or random-pivot assumption; it is not a synonym for best-case time. The merge-sort row describes the implementation without an already-ordered shortcut.

(choosing-sorting-strategy)=
## Match the strategy to the requirement

For a small or nearly sorted sequence, insertion sort's low overhead and $\Theta(n+I)$ behaviour can be useful. Bubble sort provides a clear adjacent-swap model, but it can spend many comparisons even when few swaps are needed.

Merge sort offers predictable comparison growth and a natural stable merge, with additional storage for this list implementation. Quicksort offers constant-space partitioning and can be fast with suitable pivot and equal-key handling, while requiring care over worst-case time and recursion depth.

For ordinary Python application code, start with `sorted` or `.sort`: the implementation is optimised and the interface supports keys and stability. Choose a hand-written algorithm when its behaviour or constraints are the point of the exercise.

Before choosing, ask: must ties retain their order? May the original list change? How much extra memory is available? Is the input nearly ordered or full of repeated keys? Do we need a worst-case guarantee? Big-O alone does not answer these questions.

**Check your understanding:** can a stable algorithm modify the original list? Yes: stability concerns the relative order of equal-key records, while mutation concerns which list object changes.

Next: [The comparison lower bound](comparison-lower-bound.md).

For another comparison-based strategy, see [heapsort and heap costs](../heaps/heap-sorting-costs.md). Its shrinking active heap gives an in-place sorting approach with a different stability trade-off.
