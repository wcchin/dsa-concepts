# Insertion sort

(insertion-sort)=
## Grow a sorted prefix

Imagine arranging cards in your hand. Keep the cards already considered in order, take the next card, and insert it in its proper position. The unprocessed part need not be ordered.

![Insertion sort grows the sorted prefix of 7, 2, 6, 3, 5 by one value per iteration.](../../assets/sorting/insertion-prefix.svg)

(insertion-invariant)=
## The prefix invariant

Before outer iteration `i`, the prefix `a[:i]` is sorted and contains exactly the records originally in those first `i` positions. Initially, a one-element prefix is sorted. Each iteration inserts the next record without losing any earlier record. When the prefix covers the entire list, the sorting specification follows.

```python
def insertion_sort(a):
    for i in range(1, len(a)):
        item = a[i]
        j = i - 1
        while j >= 0 and a[j] > item:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = item
```

The function modifies `a` and returns `None`. Saving `item` is essential: shifting overwrites its original position. Python's `and` short-circuits, so `a[j]` is examined only when `j >= 0`.

(insertion-shifting)=
## Shift, then fill the gap

To insert `3` into the prefix `[2, 6, 7]`, save `3`, shift `7` and `6` one position right, and stop at `2`. Place `3` after `2`. During this process, the saved item lives in a variable; duplicated values in the list are temporary copies awaiting replacement.

![Insertion of 3: save the item, shift 7 and 6 right, then fill the gap after 2.](../../assets/sorting/insertion-shift.svg)

Why can the search stop at `2`? The prefix is sorted, so all earlier keys are also at most `3`. Scanning them would establish nothing new. The strict `>` comparison means an equal key is not shifted past the new item, making this implementation stable.

(inversions)=
## Inversions measure disorder

An **inversion** is a pair of positions `i < j` with `a[i] > a[j]`. The list `[3, 1, 2]` has two inversions: `(3, 1)` and `(3, 2)`. Equal keys do not form inversions.

(adaptive-sorting)=
## Adaptiveness and cost

Each shift moves an earlier, larger item past the item being inserted, removing one inversion. Therefore the total number of shifts equals the initial inversion count $I$. With constant-time comparisons and list assignments, this implementation takes $\Theta(n+I)$ time for $n\geq1$.

- Already sorted: $I=0$, so time is $\Theta(n)$.
- Reverse sorted with distinct keys: $I=n(n-1)/2$, so time is $\Theta(n^2)$.
- Nearly sorted with few inversions: relatively little shifting is necessary.

This response to existing order is **adaptiveness**. Additional working space is $\Theta(1)$; the algorithm creates no growing temporary lists. Empty and singleton lists require no insertion iterations.

Next: [Bubble sort](bubble-sort.md), which grows order from the other end.
