# Bubble sort

(bubble-sort)=
## Repair neighbouring pairs

Scan left to right, comparing adjacent values and swapping a pair when the left key is larger. A large value can move right repeatedly within one pass. After a complete pass, a largest value in the active region is at its rightmost position.

![Four adjacent comparisons move 7 to the end of 7, 2, 6, 3, 5.](../../assets/sorting/bubble-pass.svg)

(bubble-invariant)=
## The sorted suffix invariant

At the start of each pass, the suffix beyond `end` is sorted and already in its final positions; every suffix value is at least every value in the active prefix. The pass places a largest remaining value at `end`, so the suffix can grow by one.

```python
def bubble_sort(a):
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for j in range(end):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
```

`range(end)` stops at `end - 1`, so the last pair examined is `(end - 1, end)`. The completed suffix is not scanned again. This function modifies the list and returns `None`.

(bubble-early-stopping)=
## Why a pass with no swaps is enough

If a complete pass makes no swaps, every adjacent pair in the active prefix is already in order. Together with the suffix invariant, the entire list is sorted. One comparison that makes no swap is insufficient: later pairs may still be inverted.

With this flag, already sorted input takes $\Theta(n)$ time. Without it, the fixed sequence of passes still performs $n(n-1)/2$ comparisons even on sorted input. Reverse-sorted distinct input needs all passes and takes $\Theta(n^2)$ time. Working space is $\Theta(1)$.

(adjacent-swap-stability)=
## Movement and stability

An adjacent swap of a strictly inverted pair removes exactly one inversion, so the number of swaps equals the input inversion count. Equal-key records are never swapped across one another, making this implementation stable.

However, few inversions do not guarantee few comparisons. In `[2, 3, 4, 5, 1]`, the smallest value moves left only one position per pass. Generalising this pattern to $n$ items gives $n-1$ inversions but quadratic comparisons for the left-to-right algorithm above. Insertion sort handles that pattern in linear time because its cost follows $n+I$.

**Check your understanding:** after the first illustrated pass, `[2, 6, 3, 5]` remains unsorted. The guarantee concerns the final `7`, not the entire prefix.

Next: [Partitioning](partitioning.md).
