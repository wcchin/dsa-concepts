# 13. Graph ordering, paths and spanning trees

Three graph questions require different evidence: which task may happen next, which route is cheapest from a source, and which connections join a network at minimum total cost? A traversal alone does not answer all three.

## Reading route

1. [DAGs and topological order](topological-order.md): remove satisfied dependencies with Kahn's algorithm.
2. [Shortest paths and relaxation](shortest-path-state.md): distinguish tentative distances from final answers.
3. [Dijkstra and lazy heaps](dijkstra.md): settle vertices under nonnegative edge weights.
4. [Shortest paths in a DAG](dag-shortest-paths.md): relax in dependency order, including negative weights.
5. [Spanning trees and safe edges](spanning-trees.md): define the objective and justify greedy choices.
6. [Prim's algorithm](prim.md): grow one component at a time with a frontier of edges.
7. [Kruskal's algorithm](kruskal.md): scan globally sorted edges and reject cycles.
8. [Compare the graph objectives](graph-algorithm-choices.md): select an algorithm by the required result.

Read [graph representations, BFS and DFS](../graphs/graphs.md) and [priority queues](../heaps/heaps.md) first. Before the Kruskal code, read [Topic 12: union–find](../union-find/union-find.md); its full implementation is kept there rather than duplicated here. Topic 9 is a separate spatial-search branch and is not a prerequisite.

The examples follow the Week 12–13 lecture graphs. All graph keys include sinks and isolated vertices. Weighted code assumes finite numeric edge weights, consistent adjacency lists and bounded-cost arithmetic; Dijkstra additionally checks for negative weights. String labels are used in the traces, and `None` denotes a missing predecessor.

## Read each method through the same questions

Each algorithm page states its objective, input/return/error contract, working state, next-step invariant, trace, code context, implementation choices and costs. Compare the meaning of a queue entry, heap key or parent map before reusing an earlier implementation.

The [comparison table](graph-algorithm-choices.md#graph-algorithm-contract-summary) separates working storage from returned state and covers ties, empty/disconnected graphs and unsupported weights/cycles. Imports are explicit where possible; DAG paths reuses Kahn and Kruskal reuses Topic 12's class, with those dependencies linked beside the code. Negative-cycle route algorithms, directed-cycle witnesses and SCC implementations remain future extensions.
