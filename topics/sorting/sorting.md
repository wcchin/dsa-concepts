# 4. Sorting

Sorting gives a collection an order. The interesting question is how an algorithm creates that order: by inserting into a sorted prefix, repairing neighbouring pairs, merging sorted parts, or partitioning around a pivot.

## Reading route

1. [What sorting promises](sorting-properties.md): ordering keys, stability and space.
2. [Insertion sort](insertion-sort.md): grow a sorted prefix and understand inversions.
3. [Bubble sort](bubble-sort.md): grow a sorted suffix with adjacent swaps.
4. [Partitioning](partitioning.md): maintain regions around a pivot.
5. [Quicksort](quicksort.md): turn a partition into a complete recursive sort.
6. [Comparing strategies](comparing-strategies.md): connect input order, time, space and stability.
7. [The comparison lower bound](comparison-lower-bound.md): explain what comparisons can and cannot achieve.

Read [Topic 2](../analysis/analysis.md) first for asymptotic notation, and [Topic 3](../recursion/recursion.md) for recursion and merge sort. Each code example uses ordinary Python lists; no notebook is needed.

After reading, you should be able to trace each strategy, state its invariant, explain its costs under stated assumptions, and distinguish a correct partition from a fully sorted sequence. Use the [concept index](../../concepts.md) for individual terms.
