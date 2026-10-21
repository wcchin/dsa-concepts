# Heapsort, operation costs and choices

(heap-extraction-sorting)=
## Repeated minima produce ordered output

For a fixed batch, build a min-heap and repeatedly remove its root. Each removal returns the smallest remaining value, so the emitted sequence is ascending. Construction costs $\Theta(n)$; n removals take $O(n\log(n+1))$ total time. Saving the emitted values creates an additional output collection.

That process differs in space usage from the in-place heapsort below, although both use heap order to organise sorting.

(in-place-heapsort)=
## A max-heap places the next largest item at the end

To sort an existing array in ascending order, build a **max-heap**. Swap its root with the last item in the active prefix, shorten the prefix, and sift down within that prefix. The completed suffix is sorted and is no longer part of the active heap.

```python
def heapsort(a):
    def sift_down_max(i, end):
        while 2 * i + 1 < end:
            child = 2 * i + 1
            right = child + 1
            if right < end and a[right] > a[child]:
                child = right
            if a[i] >= a[child]:
                break
            a[i], a[child] = a[child], a[i]
            i = child

    for i in range(len(a) // 2 - 1, -1, -1):
        sift_down_max(i, len(a))
    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down_max(0, end)
```

`end` is **exclusive** in the helper. It prevents a repair from moving completed suffix values back into the heap. The function changes `a` and returns `None`; empty and singleton inputs require no sorting iterations.

![A max-heap with values 6, 5, 4, 2, 3 shrinks its active prefix as 6, then 5, then 4 enter the sorted suffix.](../../assets/heaps/heapsort-prefix.svg)

(heapsort-properties)=
## State time, space and stability separately

This heapsort has $O(n\log(n+1))$ worst-case time and $O(1)$ auxiliary space: it uses iterative sifting and no growing temporary list or recursion stack. Its worst-case comparison growth is asymptotically optimal for comparison sorting. This is a worst-case statement; equal keys can allow early stops during individual sifts.

Ordinary heapsort is **not stable**. Equal-key records can cross during root–end swaps even if every local comparison treats ties consistently. For `[2_A, 2_B, 1]`, the shown max-heap sort comparing numeric keys can produce `[1, 2_B, 2_A]`. A stable application priority queue uses additional arrival keys; the bare heapsort has no such guarantee.

(heap-operation-costs)=
## Separate heap repair from storage management

| Operation | Binary min-heap cost and condition |
|---|---|
| Peek minimum | $O(1)$ when nonempty |
| Insert | $O(\log(n+1))$ repair; amortised with dynamic-array growth |
| Remove minimum | $O(\log(n+1))$ repair; storage shrink can add occasional copying |
| Bottom-up build | $\Theta(n)$ for the shown copying builder |
| Find an arbitrary key | $O(n)$ worst case without an additional index |
| Produce sorted output | $O(n\log(n+1))$ by repeated extraction |

These bounds assume constant-time comparisons and array access. The heap's own array stores $O(n)$ references with geometric capacity management. That input storage is distinct from a sift operation's constant auxiliary space.

(heap-versus-avl)=
## Match the invariant to the workload

An [AVL tree](../balanced-trees/balanced-trees.md) supports logarithmic arbitrary-key lookup and linear sorted inorder traversal. A binary heap exposes a minimum immediately but supplies much less information about other keys. A basic AVL minimum query follows left links in $O(\log(n+1))$ time unless an extra minimum reference is maintained.

For repeated extreme selection with interleaved arrivals, a heap is a natural fit. For changing ordered data requiring arbitrary lookup and ordered traversal, a balanced search tree offers a different set of strengths. For ordinary batch sorting, Python's stable `sorted` and `.sort` are useful application interfaces; implementing heapsort explains another strategy and its space trade-off.

Return to the [topic overview](heaps.md), compare [sorting strategies](../sorting/comparing-strategies.md), or continue to [graph algorithms](../graph-algorithms/graph-algorithms.md).
