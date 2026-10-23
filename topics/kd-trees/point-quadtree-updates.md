# Point-quadtree nearest search, deletion and costs

**After this page, you should be able to:**

- Search all potentially closer quadrants using inherited-cell distance bounds.
- Explain why rebuilding a deleted pivot's subtree is correct, and what it costs.

**Builds on:** [Point-quadtree construction, exact lookup and range search](point-quadtrees.md). Use its node class, child order and shared points.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/kd-trees.js) · [Julia](../../examples/languages/kd-trees.jl).

JavaScript points are arrays compared by same_point; Julia points are value tuples. Julia coordinate/child indices are one-based (x=1, y=2; SW/SE/NW/NE=1/2/3/4), while depth still starts at zero. R-tree orientation uses exact big-integer arithmetic for the supplied integer-coordinate geometry; nearest distances remain floating calculations. General R-tree update code is still conceptual in every language.

(spatial-box-distance)=
## Distance to a cell is a lower bound

For each coordinate, the distance is zero inside the interval, otherwise the gap to the closer edge. Sum the squared coordinate gaps. This is the exact distance to a closed rectangle, and a safe lower bound for any point inside it. For half-open cells, use the closure: a possibly unattained boundary minimum is still a safe lower bound.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

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

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function box_distance2(query,[xmin,ymin,xmax,ymax]) {
    const dx=Math.max(xmin-query[0],0,query[0]-xmax), dy=Math.max(ymin-query[1],0,query[1]-ymax);
    return dx*dx+dy*dy;
}
function point_quad_cells([xmin,ymin,xmax,ymax],[x,y]) {
    return [[xmin,ymin,x,y],[x,ymin,xmax,y],[xmin,y,x,ymax],[x,y,xmax,ymax]];
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function box_distance2(query,bounds)
    xmin,ymin,xmax,ymax=bounds
    dx=max(xmin-query[1],0,query[1]-xmax); dy=max(ymin-query[2],0,query[2]-ymax)
    return dx^2+dy^2
end
function point_quad_cells(bounds,pivot)
    xmin,ymin,xmax,ymax=bounds; x,y=pivot
    return ((xmin,ymin,x,y),(x,ymin,xmax,y),(xmin,y,x,ymax),(x,y,xmax,ymax))
end
```

:::

::::

Start the point tree with an unbounded root cell. Split each inherited cell through its node's pivot; the resulting four cells enclose the corresponding children. These functions assume finite query coordinates, ordinary arithmetic without overflow, and the established Cartesian axes.

(point-quadtree-nearest)=
## Visit promising cells before less promising ones

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

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

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function point_quad_nearest(root,query) {
    let best=null,best_d2=Infinity;
    const stack=root===null ? [] : [[root,[-Infinity,-Infinity,Infinity,Infinity]]];
    while (stack.length) {
        const [node,bounds]=stack.pop(); if (box_distance2(query,bounds)>best_d2) continue;
        const d2=(node.point[0]-query[0])**2+(node.point[1]-query[1])**2;
        if (best===null || d2<best_d2) { best=node.point; best_d2=d2; }
        const cells=point_quad_cells(bounds,node.point), children=[];
        node.children.forEach((child,i)=>{if(child!==null)children.push([child,cells[i]])});
        children.sort((a,b)=>box_distance2(query,b[1])-box_distance2(query,a[1]));
        stack.push(...children);
    }
    return best;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function point_quad_nearest(root,query)
    best=nothing; best_d2=Inf
    stack=root===nothing ? Any[] : Any[(root,(-Inf,-Inf,Inf,Inf))]
    while !isempty(stack)
        node,bounds=pop!(stack); box_distance2(query,bounds)>best_d2 && continue
        d2=sum((node.point[i]-query[i])^2 for i in 1:2)
        if best===nothing || d2<best_d2; best=node.point; best_d2=d2; end
        cells=point_quad_cells(bounds,node.point)
        children=Any[(child,cell) for (child,cell) in zip(node.children,cells) if child!==nothing]
        sort!(children;by=p->box_distance2(query,p[2]),rev=true,alg=MergeSort)
        append!(stack,children)
    end
    return best
end
```

:::

::::

The smallest bound is popped first, but every popped cell is tested against the **current** best distance. An early candidate is not final. Return one nearest point, choosing the first encountered on a tie; an empty tree returns `None`. Sorting at most four children costs constant time per visited node.

For Q=(4,5), A=(5,4) and E=(3,6) both have squared distance 2. A is encountered first, so this listing keeps A. A cell bound equal to 2 is not pruned: equality can contain a tied answer. The query's owning quadrant is only a starting preference, not a proof that other quadrants are irrelevant.

(point-quadtree-deletion)=
## Delete by rebuilding the affected subtree

Removing a pivot removes both of its split lines. Simply promoting one child can invalidate where its siblings belong. A clear teaching strategy is to collect the affected subtree's points, omit the target, and reinsert the survivors into a fresh point quadtree. The rebuilt subtree stays inside the same ancestor region.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

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

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function point_quad_delete(root,point) {
    let parent=null,branch=null,node=root;
    while (node!==null && !same_point(node.point,point)) {
        parent=node; branch=point_quadrant(point,node.point); node=node.children[branch];
    }
    if (node===null) return root;
    const survivors=[],stack=[node];
    while (stack.length) {
        const current=stack.pop(); if (!same_point(current.point,point)) survivors.push(current.point);
        for (const child of current.children.slice().reverse()) if (child!==null) stack.push(child);
    }
    let replacement=null;
    for (const survivor of survivors) replacement=point_quad_insert(replacement,survivor);
    if (parent===null) return replacement;
    parent.children[branch]=replacement; return root;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function point_quad_delete(root,point)
    parent=nothing; branch=nothing; node=root
    while node!==nothing && node.point!=point
        parent=node; branch=point_quadrant(point,node.point); node=node.children[branch]
    end
    node===nothing && return root
    survivors=Any[]; stack=Any[node]
    while !isempty(stack)
        current=pop!(stack); current.point!=point && push!(survivors,current.point)
        append!(stack,(c for c in Iterators.reverse(current.children) if c!==nothing))
    end
    replacement=nothing
    for survivor in survivors; replacement=point_quad_insert(replacement,survivor); end
    parent===nothing && return replacement
    parent.children[branch]=replacement; return root
end
```

:::

::::

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
