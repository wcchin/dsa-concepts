# Point-quadtree nearest search, deletion and costs

**After this page, you should be able to:**

- Search all potentially closer quadrants using inherited-cell distance bounds.
- Explain why rebuilding a deleted pivot's subtree is correct, and what it costs.

**Builds on:** [Point-quadtree construction, exact lookup and range search](point-quadtrees.md). Use its node class, child order and shared points.

(spatial-box-distance)=
## Distance to a cell is a lower bound

For each coordinate, the distance is zero inside the interval, otherwise the gap to the closer edge. Sum the squared coordinate gaps. This is the exact distance to a closed rectangle, and a safe lower bound for any point inside it. For half-open cells, use the closure: a possibly unattained boundary minimum is still a safe lower bound.

```python
def box_distance2(query, bounds):
    xmin, ymin, xmax, ymax = bounds
    dx = max(xmin - query[0], 0, query[0] - xmax)
    dy = max(ymin - query[1], 0, query[1] - ymax)
    return dx * dx + dy * dy

def point_quad_cells(bounds, pivot):
    xmin, ymin, xmax, ymax = bounds
    x, y = pivot
    return ((xmin, ymin, x, y), (x, ymin, xmax, y),
            (xmin, y, x, ymax), (x, y, xmax, ymax))
```

Start the point tree with an unbounded root cell. Split each inherited cell through its node's pivot; the resulting four cells enclose the corresponding children. These functions assume finite query coordinates, ordinary arithmetic without overflow, and the established Cartesian axes.

(point-quadtree-nearest)=
## Visit promising cells before less promising ones

```python
def point_quad_nearest(root, query):
    best, best_d2 = None, float("inf")
    extent = (-float("inf"), -float("inf"),
              float("inf"), float("inf"))
    stack = [] if root is None else [(root, extent)]
    while stack:
        node, bounds = stack.pop()
        if box_distance2(query, bounds) > best_d2:
            continue
        d2 = sum((node.point[i] - query[i]) ** 2 for i in range(2))
        if best is None or d2 < best_d2:
            best, best_d2 = node.point, d2
        cells = point_quad_cells(bounds, node.point)
        children = [(child, cell) for child, cell
                    in zip(node.children, cells) if child is not None]
        children.sort(key=lambda pair: box_distance2(query, pair[1]),
                      reverse=True)
        stack.extend(children)
    return best
```

The smallest bound is popped first, but every popped cell is tested against the **current** best distance. An early candidate is not final. Return one nearest point, choosing the first encountered on a tie; an empty tree returns `None`. Sorting at most four children costs constant time per visited node.

For Q=(4,5), A=(5,4) and E=(3,6) both have squared distance 2. A is encountered first, so this listing keeps A. A cell bound equal to 2 is not pruned: equality can contain a tied answer. The query's owning quadrant is only a starting preference, not a proof that other quadrants are irrelevant.

(point-quadtree-deletion)=
## Delete by rebuilding the affected subtree

Removing a pivot removes both of its split lines. Simply promoting one child can invalidate where its siblings belong. A clear teaching strategy is to collect the affected subtree's points, omit the target, and reinsert the survivors into a fresh point quadtree. The rebuilt subtree stays inside the same ancestor region.

```python
def point_quad_delete(root, point):
    parent, branch, node = None, None, root
    while node is not None and node.point != point:
        parent = node
        branch = point_quadrant(point, node.point)
        node = node.children[branch]
    if node is None:
        return root
    survivors, stack = [], [node]
    while stack:
        current = stack.pop()
        if current.point != point:
            survivors.append(current.point)
        stack.extend(child for child in reversed(current.children)
                     if child is not None)
    replacement = None
    for survivor in survivors:
        replacement = point_quad_insert(replacement, survivor)
    if parent is None:
        return replacement
    parent.children[branch] = replacement
    return root
```

Always retain the return value: `point_root = point_quad_delete(point_root, point)`. An absent point leaves the tree unchanged. Deleting the only point returns `None`. On the shared tree, deleting B rebuilds its subtree using E, leaving E at A's NW child. This is a complete, deliberately simple deletion implementation; more specialised local repair algorithms are beyond this reading.

(point-quadtree-operation-costs)=
## Height, visits and rebuild size measure different work

Let h be tree height, v visited nodes, r range results, and s the number of points in the deleted node's subtree before removal.

| Operation | Time | Extra working space, excluding results |
|---|---|---|
| Build by repeated insertion | O(n²) worst case | O(1) beyond the growing tree |
| Insert or exact lookup | O(h+1), worst O(n) | O(1) |
| Range query | O(v+1), worst O(n) | O(h+1), plus O(r) results |
| Nearest query | O(v+1), worst O(n) | O(h+1) |
| Delete by subtree rebuilding | O(h+s²+1) worst case | O(s+h+1), including replacement nodes |

Collection takes O(s); repeated insertion of s−1 survivors can take O(s²). It may produce a different shape. Persistent storage is O(n); four child slots per point are a constant factor. Four-way branching guarantees neither balance nor logarithmic queries.

:::{tip} Common misconception
**Nearest search only descends into the quadrant containing the query.** It must also consider any other cell whose lower bound can match or improve the best candidate.
:::

(pilot-point-quadtree-updates-checks)=
## Check your understanding

**1. Best squared distance is 5. A pending cell has lower bound 4; another has 9. Which can be skipped?**

:::{dropdown} Show explanation
Only the cell with bound 9. A bound of 4 is a possibility, not a claim that an actual point at distance 4 exists.
:::

**2. Deleting a root rebuilds n−1 survivors. Is that necessarily linear time?**

:::{dropdown} Show explanation
No. Collection is linear, but repeated insertion can take quadratic time. The deletion cost must include construction of the replacement.
:::

Next: [PR quadtrees](point-region-quadtrees.md), which retain fixed midpoint boundaries.
