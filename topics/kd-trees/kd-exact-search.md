# Exact-point search and coordinate ties

(kd-exact-search)=
## Check the entire point before choosing a side

Exact search asks whether a particular coordinate tuple is stored. At each node, first test full-point equality. Otherwise compare the active coordinate and use the same `<` left, `>=` right rule as insertion.

```python
def kd_search(node, point, depth=0):
    while node is not None:
        if point == node.point:
            return node
        axis = depth % 2
        if point[axis] < node.point[axis]:
            node = node.left
        else:
            node = node.right
        depth += 1
    return None
```

The result is a node or `None`. The full-tree call starts at depth 0. An arbitrary subtree starts at its actual depth, since resetting that depth would change the axes and invalidate the decisions.

(kd-exact-traces)=
## A successful and unsuccessful path

| Current point; axis | Query E = (3, 6) | Query (5, 7) |
|---|---|---|
| A = (5, 4); x | 3 < 5: left | 5 = 5 but points differ: right |
| Next node | B = (2, 7); y | C = (8, 1); y |
| Decision there | 6 < 7: left to D | 7 ≥ 1: right to F |
| Next decision | At D = (1, 3), x: 3 ≥ 1, right to E | At F = (7, 5), x: 5 < 7, left is empty |
| Result | Full equality at E | Absent |

![Exact search highlights the route A, B, D, E for a match and A, C, F, missing-left for an absent coordinate-tie query.](../../assets/kd-trees/kd-exact-paths.svg)

(kd-search-correctness)=
## Why one path is enough here

If the target's active coordinate is smaller than the current split, no equal point can exist in the right subtree. Otherwise, left points have strictly smaller active coordinates and cannot equal the target. The retained branch therefore contains every possible exact match. Reaching `None` proves absence under the stated invariant.

This reasoning fails if construction placed equal split coordinates on both sides while lookup still sends ties only right. A search policy must match the builder, including its handling of ties.

The iterative function uses constant auxiliary space and follows $O(h+1)$ nodes. Balanced height makes this logarithmic for fixed-dimensional exact lookup; a chain makes the worst case linear. This is different from a range query, which can require both branches even in a balanced tree.

**Check your understanding:** does encountering x = 5 prove `(5, 7)` is present? No. Only full coordinate equality does. Next: [Range search](kd-range-search.md).
