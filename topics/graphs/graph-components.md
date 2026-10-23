# Reachability and connected components

**After this page, you should be able to:**

- Distinguish a single reachable region from a full component partition.
- Explain shared discovery state, isolated vertices and directed-connectivity limits.

**Builds on:** [BFS](breadth-first-search.md), [DFS](depth-first-search.md) and [graph direction](graph-concepts.md#directed-undirected-graphs).

(graph-reachability)=
## A single start explores only what it can reach

On the shared undirected graph, BFS or DFS from A reaches A through G and stops. H is never discovered. This is correct single-source traversal: reaching every graph vertex is a different requirement, requiring additional starts when the graph is disconnected.

Starting at isolated H reaches H itself. An empty graph has no valid starting label, but it does have a well-defined full-graph component result: no components.

(connected-components)=
## Components partition an undirected graph

A **connected component** is a maximal group of vertices connected by paths. “Maximal” means no additional vertex from this graph can be added while preserving that property. In an undirected graph, every vertex belongs to exactly one component, including singleton components for isolated vertices.

![The shared graph is partitioned into component A through G and singleton component H. Traversal restarts at H only after finishing the first component.](../../assets/graphs/connected-components.svg)

The component groups are `{A, B, C, D, E, F, G}` and `{H}`. Within a group, list order is a traversal choice. Component membership does not depend on which vertex happens to be processed first.

(components-contract)=
## Return a partition of the whole undirected graph

`connected_components(graph)` returns a new list of component vertex lists. Every graph vertex appears exactly once, including isolated vertices; `{}` returns `[]`. It does not mutate the graph or return all connecting edges. Outer dictionary order chooses component starts; stored neighbour order chooses each group's traversal order. Membership is independent of these order choices.

Reciprocal undirected adjacency is a precondition, not something the function verifies. Group lists contain references to the original labels. Reordering a returned list does not edit the graph, and a returned partition is a snapshot rather than automatically updated state.

(connected-components-code)=
## Restart with one shared discovered set

This routine assumes **undirected**, reciprocal adjacency lists. It imports `deque` explicitly and iterates vertices in dictionary insertion order.

```python
from collections import deque

def connected_components(graph):
    seen, groups = set(), []
    for start in graph:
        if start in seen:
            continue
        seen.add(start)
        queue, group = deque([start]), []
        while queue:
            u = queue.popleft()
            group.append(u)
            for v in graph[u]:
                if v not in seen:
                    seen.add(v)
                    queue.append(v)
        groups.append(group)
    return groups
```

For the shared graph, the result is `[['A', 'B', 'C', 'D', 'E', 'F', 'G'], ['H']]`. After A's traversal, the outer checks at B through G do not launch another search because those vertices are already seen. H starts the second search.

(component-forest)=
## Several starts produce a forest

If parent links were also recorded, each component's start would have no parent and each other vertex would have one discovery parent. These traversal trees form a **forest**. The original graph can still have cycles and many non-tree edges; the discovery forest records how the algorithm reached vertices, not all the graph's connections.

The shared seen set is essential. Resetting it for every outer-loop vertex would repeat traversals and output overlapping groups rather than a partition.

(directed-connectivity)=
## Directed connectivity asks different questions

For outgoing lists `A: [B]`, `B: []`, `C: [B]`, both A and C can reach B, but neither reaches the other. Running the undirected restart routine on those lists can produce groups dependent on outer order. Those groups are not a valid general definition of directed components.

**Weak connectivity** ignores arrow direction when testing connection. **Strong connectivity** requires a directed path in both directions between every pair within a group. They need appropriate algorithms; a sequence of outgoing-only BFS restarts does not compute either notion in general.

## Costs and implementation choices

All restarts together discover n vertices and scan 2m neighbour entries, giving O(n+m+1) time with expected hash-table costs. Returned groups hold Θ(n+1) references; the seen set and queue require O(n+1) additional working storage. No copy of every original edge is needed.

BFS or DFS can produce the same undirected partition with different list orders and memory shapes. Use a full traversal when the graph is available and the partition is needed once. [Union–find](../union-find/union-find.md) instead maintains merge/connectivity information across arriving edges; its parent arrays do not automatically provide member lists or actual routes.

:::{tip} Common misconception
**Restarting outgoing-only BFS computes strongly connected components.** Directed mutual reachability needs an appropriate algorithm; undirected component code cannot be reused by changing its name.
:::

(components-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. After completing the shared graph from A, must the outer loop traverse again from B?**

:::{dropdown} Show explanation
No. B is already in the shared seen set. Only isolated H starts another search.
:::

**2. Does removing an edge from the graph automatically update previously returned component groups?**

:::{dropdown} Show explanation
No. The returned groups are a snapshot. Recompute or use a suitable dynamic-connectivity method when the graph changes.
:::

Next: [Traversal costs and choices](graph-traversal-costs.md).
