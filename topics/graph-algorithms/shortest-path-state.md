# Shortest paths and relaxation

**After this page, you should be able to:**

- Explain relaxation and distinguish tentative labels from final distances.
- Specify complete distance/parent results and recover one consistent route.

**Builds on:** [BFS distances and parents](../graphs/breadth-first-search.md) and [weighted graph models](../graphs/graph-concepts.md#weighted-graphs).

(weighted-shortest-path)=
## Minimise the sum along a source-to-target route

A weighted shortest path minimises its edge-weight sum. It differs from BFS's hop count: a direct edge of weight 10 can lose to two edges of weight 2. In a directed graph, every step must follow an outgoing edge.

The shared graph uses these outgoing lists. G remains an explicit isolated vertex.

```python
weighted = {
    "A": [("B", 4), ("C", 1)],
    "B": [("D", 1), ("E", 7)],
    "C": [("B", 2), ("D", 5), ("F", 8)],
    "D": [("E", 3)], "E": [("F", 1)],
    "F": [], "G": [],
}
```

![The shared directed weighted graph offers several routes from A and leaves G unreachable.](../../assets/graph-algorithms/weighted-routes.svg)

(shortest-path-contract)=
## Separate an algorithm result from route recovery

The shortest-path functions return `(distance, parent)` dictionaries covering **all graph keys**. The source distance is 0, an unreachable distance is `inf`, and the source/unreachable parents are `None`. Each reachable non-source parent selects one route, not every tied shortest route. Source labels must exist; a missing source raises `KeyError`. The input graph is observed without mutation, and the dictionaries are snapshots.

Use finite numeric edge weights with consistent comparison/arithmetic and non-`None` hashable labels. These are preconditions unless a function explicitly checks them. [Dijkstra](dijkstra.md) additionally rejects negative edges; [DAG relaxation](dag-shortest-paths.md) permits negatives but rejects cycles. The graph's weighted list entries are `(destination, weight)`, not the `(weight, u, v)` edge-list format used by Kruskal.

(relaxation)=
## A known route supplies a candidate improvement

Set the source distance to 0 and other distances to infinity. If a route to u has cost `distance[u]`, following edge `(u,v,w)` gives candidate cost `distance[u] + w`. **Relaxation** updates v only when that candidate is strictly smaller than its current distance, and records u as its predecessor.

After A, B has tentative distance 4 and C has 1. Via C, B improves to `1 + 2 = 3`; its predecessor becomes C. “First discovered” is therefore not the same as “final distance,” unlike BFS's first discovery in an unweighted graph.

(shortest-path-predecessors)=
## A distance label represents a route actually found

Every finite tentative distance is the cost of a discovered route, and is an upper bound on the optimum when a finite optimum exists. An algorithm needs an additional argument to establish finality. Dijkstra uses nonnegative weights; a DAG algorithm uses topological order.

A predecessor records one improving route. Equal candidates need not replace it. Strict improvement avoids unnecessary heap entries and avoids creating predecessor cycles merely by accepting equal-cost alternatives around zero-weight cycles.

(weighted-route-recovery)=
## Recover the route using results from the same run

```python
from math import inf

def weighted_path_to(source, target, distance, parent):
    if distance[target] == inf:
        return None
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = parent[current]
    path.reverse()
    return path
```

Use valid source and target keys, non-`None` vertex labels, and predecessor results from the same algorithm run. The `source` argument documents that association; this helper does not independently validate a supplied predecessor structure. The source returns a one-vertex path. An unreachable vertex has infinite distance and returns `None`, even though its predecessor and the source's predecessor are both `None`.

For the shared graph, the eventual A-to-F route is A–C–B–D–E–F with cost 8; G stays unreachable. Recovering a k-edge route takes $O(k+1)$ time and output storage.

## Implementation choices, costs and limits

One relaxation uses O(1) time/workspace under constant-cost arithmetic and expected dictionary access. Initialising all distance/parent entries takes Θ(n+1) time and result storage. The processing order determines how many relaxations are needed and why the final labels are correct; the relaxation formula alone supplies neither a whole algorithm nor its total bound.

`weighted_path_to` uses O(k+1) time and returned space for a k-edge route, with O(1) local workspace. Unknown target keys raise `KeyError`; an unreachable valid target returns `None`. The helper assumes consistent dictionaries from the same run and does not detect malformed/cyclic parent data. Following parents is appropriate only after an algorithm has established the required result.

Equal-cost candidates do not replace parents in the shown algorithms. This gives one reproducible result for fixed iteration/heap tie order, without claiming uniqueness. Graph changes require another run. General negative-cycle problems remain an [explicit extension](../../coverage-review.md), rather than something route recovery can fix.

:::{tip} Common misconception
**The first finite distance is already shortest.** It is the cost of a route found so far; finality needs the algorithm's processing-order argument.
:::

(relaxation-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. A first gives B distance 4. C later offers a route of cost 3. Should B's distance and parent change?**

:::{dropdown} Show explanation
Yes. Strict improvement replaces the distance and records C as the improving predecessor.
:::

**2. Both the source and an unreachable G have parent None. How does route recovery distinguish them?**

:::{dropdown} Show explanation
It checks distance first: the source has distance 0 and returns a one-vertex route; G has inf and returns None.
:::

Next: [Dijkstra](dijkstra.md).
