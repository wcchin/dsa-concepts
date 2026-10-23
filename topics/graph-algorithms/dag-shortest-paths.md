# Shortest paths in a DAG

**After this page, you should be able to:**

- Justify shortest paths by predecessor order even with negative edges.
- Account for the converted graph, dependencies, errors and returned state.

**Builds on:** [Topological sorting](topological-order.md), [relaxation](shortest-path-state.md) and [Dijkstra's assumptions](dijkstra.md).

(dag-shortest-paths)=
## Precedence supplies a different safe processing order

A topological order processes every possible predecessor before its destination. Once all incoming routes to a vertex have been considered, no later vertex can send a route backwards to improve it. This argument permits negative edge weights because it depends on acyclicity, not on nonnegative distances.

(dag-shortest-contract)=
## Specify acyclicity and whole-input rejection

`dag_shortest_paths(graph, source)` returns the same all-vertex distance/parent form as Dijkstra, observing the input without mutation. Negative, zero and positive finite weights are permitted. The source must exist (`KeyError` otherwise), every destination must be a key, and the **entire directed graph** must be acyclic (`ValueError` from topological sorting otherwise). An unreachable directed cycle is still invalid.

Tied candidate distances retain the first improving predecessor already stored. The FIFO topological routine supplies one valid processing order; a different valid order can change tied parents while preserving optimum distances. Empty input has no valid source.

```python
from math import inf

def dag_shortest_paths(graph, source):
    if source not in graph:
        raise KeyError(source)
    unweighted = {u: [v for v, _ in graph[u]] for u in graph}
    order = topological_sort(unweighted)
    distance = {v: inf for v in graph}
    parent = {v: None for v in graph}
    distance[source] = 0
    for u in order:
        if distance[u] == inf:
            continue
        for v, w in graph[u]:
            candidate = distance[u] + w
            if candidate < distance[v]:
                distance[v] = candidate
                parent[v] = u
    return distance, parent
```

Run the complete [`topological_sort` definition](topological-order.md#kahn-algorithm) first; `inf` is imported locally. It checks the entire graph for acyclicity, so even an unreachable directed cycle causes rejection. The weighted graph itself is left unchanged.

(dag-negative-example)=
## A negative edge can improve an earlier-looking choice

For A→B(2), A→C(5), C→B(−4), the topological order is A, C, B. A first gives B distance 2 and C distance 5; C then improves B to 1 before B is processed. The shortest route is A–C–B despite using two edges rather than one.

![The negative-edge DAG processes A then C then B, updating B from distance 2 to distance 1.](../../assets/graph-algorithms/dag-negative-route.svg)

(dag-path-cost)=
## Count ordering, conversion and relaxation

Constructing the unweighted adjacency lists, computing the order, and scanning each weighted edge take $O(n+m)$ time under the standard dictionary model. This implementation's converted adjacency lists require $O(n+m)$ additional storage, alongside $O(n)$ distance, parent and ordering state. A weighted-aware topological routine could avoid that particular conversion.

A DAG cannot have a negative cycle because it has no directed cycle at all. This does not mean every graph with a negative edge is a DAG. Choose the algorithm from all its assumptions, not just the sign of one edge.

## Choices and storage accounting

Run this listing with the linked `topological_sort` definition; it is a helper dependency, not a standard-library function. Converting to unweighted lists is convenient reuse of Kahn's code. A weighted-aware Kahn routine could count destinations directly and avoid this O(n+m+1) copy, while retaining O(n+m+1) total time.

The shown result dictionaries use O(n+1) space. Converted adjacency plus temporary ordering/count state uses O(n+m+1) working space. Relaxation itself uses constant local state per edge. These are additional to the original weighted input. Skipping unreachable vertices avoids adding weights to infinity, but does not skip the whole-graph acyclicity check.

Use this method when acyclicity is known or can be verified. Negative weights alone are not a reason to choose it: a graph with a negative edge may still contain cycles. Its correctness follows from processing every predecessor first, not from heap minimum selection.

:::{tip} Common misconception
**Negative edges require revisiting a vertex indefinitely.** A DAG's predecessor order lets each outgoing list be processed once; cycles change the problem.
:::

(dag-path-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. For A→B(2), A→C(5), C→B(−4), what is the final distance to B?**

:::{dropdown} Show explanation
1 via A–C–B. Topological processing A, C, B considers C's improvement before B is processed.
:::

**2. If an unreachable pair forms a directed cycle, will this function return the reachable distances anyway?**

:::{dropdown} Show explanation
No. It topologically checks the entire graph and raises ValueError. This is stricter than checking just the source-reachable region.
:::

Next: [Spanning trees](spanning-trees.md).
