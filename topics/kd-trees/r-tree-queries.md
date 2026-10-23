# Query an R-tree, then refine the candidates

**After this page, you should be able to:**

- Trace candidate traversal and the separate exact-refinement pass.
- Account for boundary contacts and examined entries instead of inferring cost from height alone.

**Builds on:** Use the [given R-tree and line records](r-tree-representation.md); the query helpers also reuse the closed-rectangle predicate from [spatial queries](spatial-queries.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/kd-trees.js) · [Julia](../../examples/languages/kd-trees.jl).

JavaScript points are arrays compared by same_point; Julia points are value tuples. Julia coordinate/child indices are one-based (x=1, y=2; SW/SE/NW/NE=1/2/3/4), while depth still starts at zero. R-tree orientation uses exact big-integer arithmetic for the supplied integer-coordinate geometry; nearest distances remain floating calculations. General R-tree update code is still conceptual in every language.

(r-tree-candidate-query)=
## Test each intersecting entry and continue through its child

This query uses the preceding page's `RNode` entries. Boxes are closed: touching counts as intersection. The given tree must be finite, acyclic and correctly enclosing, with each record identifier stored once.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

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

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function closed_boxes_overlap(a,b) { return a[0]<=b[2] && b[0]<=a[2] && a[1]<=b[3] && b[1]<=a[3]; }
function rtree_candidates(root,rect) {
    rect=checked_rect(rect); const out=[],stack=[root];
    while (stack.length) {
        const node=stack.pop();
        for (const [box,item] of node.entries) {
            if (!closed_boxes_overlap(box,rect)) continue;
            if (node.leaf) out.push(item); else stack.push(item);
        }
    }
    return out;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
closed_boxes_overlap(a,b)=a[1]<=b[3] && b[1]<=a[3] && a[2]<=b[4] && b[2]<=a[4]
function rtree_candidates(root,rect)
    rect=checked_rect(rect); out=Any[]; stack=Any[root]
    while !isempty(stack)
        node=pop!(stack)
        for (box,item) in node.entries
            closed_boxes_overlap(box,rect) || continue
            push!(node.leaf ? out : stack,item)
        end
    end
    return out
end
```

:::

::::

For `line_query`, both root entries pass. In group V, only L4's box passes. In group U, L1 and L2 pass. With this stack order the candidate list is `["L4","L1","L2"]`. Traversal order is not a relevance ranking, and the candidates are not yet the final answer.

(segment-rectangle-refinement)=
## Check actual segment intersection, including boundary contact

The example uses integer coordinates, so orientation cross-products can be evaluated exactly in Python. A segment meets a closed rectangle if an endpoint is inside or the segment touches/crosses one of its four boundary edges. These helpers also handle a zero-length segment and degenerate closed query rectangles.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

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

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
// Exact determinant arithmetic for the integer-coordinate line examples.
function orientation(a,b,c) {
    const [ax,ay]=a.map(BigInt),[bx,by]=b.map(BigInt),[cx,cy]=c.map(BigInt);
    return (bx-ax)*(cy-ay)-(by-ay)*(cx-ax);
}
function on_segment(a,b,p) { return orientation(a,b,p)===0n && in_closed_rect(p,segment_bounds([a,b])); }
function segments_intersect(a,b,c,d) {
    const x=orientation(a,b,c),y=orientation(a,b,d),z=orientation(c,d,a),w=orientation(c,d,b);
    if (((x<0n&&y>0n)||(y<0n&&x>0n)) && ((z<0n&&w>0n)||(w<0n&&z>0n))) return true;
    return (x===0n&&on_segment(a,b,c))||(y===0n&&on_segment(a,b,d))||(z===0n&&on_segment(c,d,a))||(w===0n&&on_segment(c,d,b));
}
function segment_intersects_rect([a,b],rect) {
    rect=checked_rect(rect); if(in_closed_rect(a,rect)||in_closed_rect(b,rect))return true;
    const [xmin,ymin,xmax,ymax]=rect,corners=[[xmin,ymin],[xmax,ymin],[xmax,ymax],[xmin,ymax]];
    return corners.some((c,i)=>segments_intersect(a,b,c,corners[(i+1)%4]));
}
var candidates=rtree_candidates(r_root,line_query);
var line_matches=candidates.filter(key=>segment_intersects_rect(segments.get(key),line_query));
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function orientation(a,b,c)
    return (big(b[1])-a[1])*(big(c[2])-a[2])-(big(b[2])-a[2])*(big(c[1])-a[1])
end
on_segment(a,b,p)=orientation(a,b,p)==0 && in_closed_rect(p,segment_bounds((a,b)))
function segments_intersect(a,b,c,d)
    x,y,z,w=orientation(a,b,c),orientation(a,b,d),orientation(c,d,a),orientation(c,d,b)
    ((x<0<y || y<0<x) && (z<0<w || w<0<z)) && return true
    return (x==0&&on_segment(a,b,c))||(y==0&&on_segment(a,b,d))||(z==0&&on_segment(c,d,a))||(w==0&&on_segment(c,d,b))
end
function segment_intersects_rect(segment,rect)
    rect=checked_rect(rect); a,b=segment
    (in_closed_rect(a,rect)||in_closed_rect(b,rect)) && return true
    xmin,ymin,xmax,ymax=rect; corners=[(xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)]
    return any(segments_intersect(a,b,corners[i],corners[mod(i,4)+1]) for i in 1:4)
end
candidates=rtree_candidates(r_root,line_query)
line_matches=[key for key in candidates if segment_intersects_rect(segments[key],line_query)]
```

:::

::::

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
