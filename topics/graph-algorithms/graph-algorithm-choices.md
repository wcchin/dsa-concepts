# Compare graph objectives before selecting an algorithm

**After this page, you should be able to:**

- Select an algorithm using its objective, assumptions and returned evidence.
- Compare implementations, tie guarantees, error policies and time/space costs.

**Builds on:** [Topological order](topological-order.md), [Dijkstra](dijkstra.md), [DAG paths](dag-shortest-paths.md), [Prim](prim.md) and [Kruskal](kruskal.md).

(graph-algorithm-selection)=
## Similar data structures can serve different goals

| Question | Method | Essential condition |
|---|---|---|
| Which vertices can be reached? | BFS or DFS | Follow the graph's direction |
| Which unweighted route uses fewest edges? | BFS | Hop count is the objective |
| Which dependency order is valid? | Kahn topological sort | Directed acyclic graph |
| Which route has smallest weight sum from a source? | Dijkstra | Nonnegative weights |
| Which routes are cheapest in a DAG? | Topological relaxation | Directed acyclic graph; negative edges permitted |
| Which connections minimise total network edge cost? | Prim or Kruskal | Undirected graph; produce a forest if disconnected |

A queue, heap or parent dictionary alone does not identify the algorithm. Ask what its entries mean: BFS stores a frontier by hops; Dijkstra's heap stores complete route costs; Prim's heap stores individual connection costs; Kruskal sorts edges and uses union–find for connectivity.

(shortest-path-tree-versus-mst)=
## A shortest-path tree need not be an MST

Consider triangle AB(2), AC(2), BC(1). A shortest-path tree from A uses AB and AC, preserving distance 2 to both other vertices, with selected-edge sum 4. An MST uses BC and either AB or AC, with sum 3, but one route from A then costs 3 rather than 2.

![On a weighted triangle, the shortest-path tree from A has total edge weight 4 while a minimum spanning tree has total 3 and a longer route from A to one vertex.](../../assets/graph-algorithms/paths-versus-spanning.svg)

The two results optimise different quantities. Changing the MST's starting vertex can change a tied result, but cannot turn its objective into preservation of every source distance.

(graph-algorithm-boundaries)=
## Test assumptions at the boundaries

Include empty graphs, isolated vertices, disconnected components, equal-weight alternatives, zero weights and directed cycles in reasoning. Negative weights are acceptable for MSTs and DAG relaxation, but are rejected by the shown Dijkstra implementation. A topological order must include isolated vertices, even when they affect no prerequisite.

Proof obligations differ too: Kahn preserves remaining indegrees; Dijkstra justifies settlement; DAG relaxation processes predecessors first; MST algorithms preserve safe completion. Memorising the same “greedy” label for all these methods does not replace those arguments.

(graph-algorithm-contract-summary)=
## Compare contracts and costs before choosing

Let n=|V| and m=|E|. Bounds below include initialisation, use the shown adjacency-list/edge-list implementations, and assume constant-cost labels/weights and expected hash-table access. Add a constant term for empty inputs. Working storage excludes input and the returned result.

| Algorithm | Returned result | Time | Working storage; result storage |
|---|---|---|---|
| FIFO Kahn | Full ordering, or `ValueError` for any directed cycle | O(n+m+1) | O(n+1); O(n+1) order |
| Lazy Dijkstra | All-vertex distance/parent maps; rejects any negative edge | O(n+m log(m+2)+1) | O(m+1) heap; O(n+1) maps |
| Shown DAG relaxation | All-vertex distance/parent maps; rejects any directed cycle | O(n+m+1) | O(n+m+1) converted graph/order; O(n+1) maps |
| Edge-heap Prim | Chosen edges, total, component count | O(n+m log(m+2)+1) | O(n+m+1); O(n+1) chosen records |
| Kruskal with weighted/compressed union–find | Chosen edges, total, component count | O(n+m log(m+1)+mα(n)+1) for n≥2 | O(n+m+1); O(n+1) chosen records |

Single-source path functions require an existing source and raise `KeyError` otherwise. They return `inf`/`None` for unreachable vertices; these are ordinary results, not errors. Ordering and forest functions accept empty full graphs. Prim trusts undirected reciprocity, while Kruskal explicitly rejects duplicate vertices and unknown endpoints. Valid destination keys, finite weights and record shapes remain stated preconditions; these functions are not general input validators.

All algorithms leave their input lists/dictionaries unchanged, although supplied iterables can be consumed by builders/sorting. Returned results do not update themselves after later graph edits. Tie policies make the given traces reproducible; they do not promise unique topological orders, routes or minimum forests. Always identify the output being compared before declaring two algorithms equivalent.

:::{tip} Common misconception
**Using a heap makes Dijkstra and Prim solve the same problem.** Their priorities and correctness arguments differ: route sums versus individual crossing-edge weights.
:::

(graph-choice-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. You need a dependency order, and an isolated task has no edges. May it be omitted?**

:::{dropdown} Show explanation
No. A topological order contains every vertex exactly once, including isolated tasks. Include it as a graph key.
:::

**2. You need cheapest routes from A, and the graph is an undirected weighted network. Is an MST sufficient?**

:::{dropdown} Show explanation
No. An MST minimises total selected-edge cost. Its routes from A can be longer than shortest routes in the full graph.
:::

Review [Topic 12](../union-find/union-find.md) for the reusable connectivity structure, continue to [Topic 14: algorithm design strategies](../strategies/strategies.md), or apply these methods in [Topic 16: the transport case](../applications/applications.md). The [coverage review](../../coverage-review.md) records further extensions.
