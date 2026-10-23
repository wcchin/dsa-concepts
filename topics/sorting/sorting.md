# 4. Sorting

Sorting gives a collection an order. The interesting question is how an algorithm creates that order: by inserting into a sorted prefix, repairing neighbouring pairs, merging sorted parts, or partitioning around a pivot.

## Reading route

1. [What sorting promises](sorting-properties.md): ordering keys, stability and space.
2. [Insertion sort](insertion-sort.md): grow a sorted prefix and understand inversions.
3. [Bubble sort](bubble-sort.md): grow a sorted suffix with adjacent swaps.
4. [Merge sort](merge-sort.md): stable merging, recursive correctness and temporary storage.
5. [Partitioning](partitioning.md): maintain regions around a pivot.
6. [Quicksort](quicksort.md): turn a partition into a complete recursive sort.
7. [Timsort and Powersort](timsort.md): natural runs and choosing an efficient merge order.
8. [Comparing strategies](comparing-strategies.md): connect input order, time, space and stability.
9. [The comparison lower bound](comparison-lower-bound.md): explain what comparisons can and cannot achieve.

Read [Topic 2](../analysis/analysis.md) first for asymptotic notation, and [Topic 3](../recursion/recursion.md) for recursion and merge sort. Each code example uses ordinary Python lists; no notebook is needed.

After reading, you should be able to trace each strategy, state its invariant, explain its costs under stated assumptions, and distinguish a correct partition from a fully sorted sequence. Use the [concept index](../../concepts.md) for individual terms.

## A consistent route through each algorithm

Read **idea and visual trace → implementation → why it works → implementation choices → stability and in-place behaviour → time and space costs → when to use it → self-checks**. Some closely related explanations share a section, but the same questions apply throughout. Partitioning is a helper with its own contract; the lower-bound page is an argument, not another algorithm implementation.

The running numeric input is `[7,2,6,3,5]`. Label equal-key records when checking stability, and also consider empty, singleton, sorted, reverse-sorted and all-equal inputs. Counts refer to the implementation actually shown. The short Timsort/Powersort reading is conceptual and uses the built-in interface rather than offering an incomplete replacement.

[Heapsort](../heaps/heap-sorting-costs.md#in-place-heapsort) is developed after heap construction in Topic 10. Its iterative max-heap implementation is included in the comparison here; follow the link when ready rather than requiring heap knowledge before this chapter.

Code listings offer Python, JavaScript and Julia tabs where a runnable example is present. Python remains the explanation and trace language; see the [language guide](../../code-languages.md) for native conventions and runnable topic downloads.
