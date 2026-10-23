# Query an R-tree, then refine the candidates

**After this page, you should be able to:**

- Trace candidate traversal and the separate exact-refinement pass.
- Account for boundary contacts and examined entries instead of inferring cost from height alone.

**Builds on:** Use the [given R-tree and line records](r-tree-representation.md); the query helpers also reuse the closed-rectangle predicate from [spatial queries](spatial-queries.md).

(r-tree-candidate-query)=
## Test each intersecting entry and continue through its child

This query uses the preceding page's `RNode` entries. Boxes are closed: touching counts as intersection. The given tree must be finite, acyclic and correctly enclosing, with each record identifier stored once.

```python
def closed_boxes_overlap(a, b):
    return (a[0] <= b[2] and b[0] <= a[2]
            and a[1] <= b[3] and b[1] <= a[3])

def rtree_candidates(root, rect):
    rect = checked_rect(rect)
    out, stack = [], [root]
    while stack:
        node = stack.pop()
        for box, item in node.entries:
            if not closed_boxes_overlap(box, rect):
                continue
            if node.leaf:
                out.append(item)
            else:
                stack.append(item)
    return out
```

For `line_query`, both root entries pass. In group V, only L4's box passes. In group U, L1 and L2 pass. With this stack order the candidate list is `["L4","L1","L2"]`. Traversal order is not a relevance ranking, and the candidates are not yet the final answer.

(segment-rectangle-refinement)=
## Check actual segment intersection, including boundary contact

The example uses integer coordinates, so orientation cross-products can be evaluated exactly in Python. A segment meets a closed rectangle if an endpoint is inside or the segment touches/crosses one of its four boundary edges. These helpers also handle a zero-length segment and degenerate closed query rectangles.

```python
def orientation(a, b, c):
    return ((b[0] - a[0]) * (c[1] - a[1])
            - (b[1] - a[1]) * (c[0] - a[0]))

def on_segment(a, b, p):
    return orientation(a, b, p) == 0 and in_closed_rect(
        p, segment_bounds((a, b)))

def segments_intersect(a, b, c, d):
    ab_c, ab_d = orientation(a, b, c), orientation(a, b, d)
    cd_a, cd_b = orientation(c, d, a), orientation(c, d, b)
    if (((ab_c < 0 < ab_d) or (ab_d < 0 < ab_c))
            and ((cd_a < 0 < cd_b) or (cd_b < 0 < cd_a))):
        return True
    return ((ab_c == 0 and on_segment(a, b, c))
            or (ab_d == 0 and on_segment(a, b, d))
            or (cd_a == 0 and on_segment(c, d, a))
            or (cd_b == 0 and on_segment(c, d, b)))

def segment_intersects_rect(segment, rect):
    rect = checked_rect(rect)
    a, b = segment
    if in_closed_rect(a, rect) or in_closed_rect(b, rect):
        return True
    xmin, ymin, xmax, ymax = rect
    corners = [(xmin, ymin), (xmax, ymin),
               (xmax, ymax), (xmin, ymax)]
    return any(segments_intersect(a, b, corners[i], corners[(i + 1) % 4])
               for i in range(4))

candidates = rtree_candidates(r_root, line_query)
line_matches = [key for key in candidates
                if segment_intersects_rect(segments[key], line_query)]
```

The final list is **["L4","L2"]**. L1 was a real box candidate and an exact-geometry false positive, not an indexing error. Correct enclosing boxes guarantee that no true intersection was pruned. An undersized or stale bound could instead lose a real result and break correctness.

The integer teaching examples use exact sign/equality tests. General floating-point geometry needs an appropriate robust-predicate/library policy; this listing is not a complete GIS geometry engine.

(r-tree-query-costs)=
## Count examined entries and geometry predicates

Here the traversal examines seven entries in three nodes: two root entries and five leaf entries. It emits three candidates and performs three geometry tests, returning two matches. Let E count examined entries, c candidates, r matches, and g bound one exact predicate's cost. Time is $O(E+cg+1)$; this segment/rectangle predicate has constant operation count under fixed-cost arithmetic. More complex polygons can make g larger.

The candidate list stores $O(c)$ identifiers, final results $O(r)$, and the traversal stack can use $O(V+1)$ space for V visited nodes. Overlapping groups or a broad query may visit the whole index. Balanced height alone does not justify an $O(\log n)$ range-query claim.

:::{tip} Common misconception
**A positive intersection needs positive area.** Here intersection means sharing any point, including an endpoint or edge; the query can even be degenerate.
:::

(pilot-r-tree-queries-checks)=
## Check your understanding

Predict the answer before opening the explanation.

**1. The candidate list is `L4,L1,L2`. Predict the exact result list in this traversal order, and identify why one candidate disappears.**

:::{dropdown} Show explanation
The result is L4,L2. Both actual segments meet the closed query rectangle. L1’s envelope passes but its diagonal misses, so it is filtered out. A false positive is expected at the candidate stage, not an incorrect final answer.
:::

**2. Does L2 count as intersecting the point-sized closed query `(6,7,6,7)`?**

:::{dropdown} Show explanation
Yes. L2 ends at (6,7), so the segment and query share that point. The endpoint-inside test accepts it. Requiring positive-length or positive-area overlap would silently change the contract.
:::

Next: [R-tree construction, exact lookup, nearest and deletion](r-tree-operations.md), which reuses the candidate traversal defined here.
