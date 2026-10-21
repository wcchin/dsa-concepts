# Root removal and sift-down

(heap-minimum)=
## Inspecting and removing are different operations

The root holds a minimum, so `peek_min` only needs to check emptiness and read index 0. Removal must additionally repair the remaining heap.

```python
def peek_min(heap):
    if not heap:
        raise IndexError("peek at empty heap")
    return heap[0]
```

(sift-down)=
## Swap with the smaller child

Assume the two child subtrees are already valid heaps. If the current item exceeds a child, choose the **smaller existing child** and swap. Choosing the larger child could leave the smaller child below a parent that is still too large.

```python
def sift_down(heap, i):
    n = len(heap)
    while 2 * i + 1 < n:
        child = 2 * i + 1
        right = child + 1
        if right < n and heap[right] < heap[child]:
            child = right
        if heap[i] <= heap[child]:
            break
        heap[i], heap[child] = heap[child], heap[i]
        i = child
```

The loop requires a left child. A right child is compared only when its index is valid. If children tie, this code chooses the left one; it does not thereby promise stable removal of equal-priority records.

(heap-remove-min)=
## Remove the final leaf, then move its item to the root

```python
def pop_min(heap):
    if not heap:
        raise IndexError("pop from empty heap")
    result = heap[0]
    last = heap.pop()
    if heap:
        heap[0] = last
        sift_down(heap, 0)
    return result
```

Removing the last slot preserves complete shape. Moving its item to the root can violate order downwards, but the remaining child subtrees are still valid. Sift-down restores their connection to the root. Removing index 0 with `pop(0)` would instead shift the array and destroy this structural reasoning.

(sift-down-trace)=
## Remove 2 from the lecture heap

Save root 2 for return. Remove final item 6, move it into the root, then compare children 5 and 4. Choose 4 and swap. The result is `[4, 5, 6, 9, 7]`; return 2.

![Removing 2 moves final item 6 to the root, then swaps with child 4. Swapping with 5 instead would leave an invalid root above 4.](../../assets/heaps/sift-down-trace.svg)

(heap-removal-boundaries)=
## Empty, singleton and one-child cases

| Input heap | Result or error | Final heap |
|---|---|---|
| `[]` | `IndexError` | `[]` |
| `[4]` | 4 | `[]` |
| `[2, 5]` | 2 | `[5]` |
| `[1, 3, 2]` | 1 | `[2, 3]` |

The singleton guard avoids assigning index 0 after the array becomes empty. A sift-down node with only a left child uses that child normally. At most one downward path is repaired, giving $O(\log(n+1))$ repair time and constant auxiliary space. A backing-array shrink can add an occasional copying cost; the comparison bound and allocation policy are separate claims.

Next: [Bottom-up construction](heap-construction.md).
