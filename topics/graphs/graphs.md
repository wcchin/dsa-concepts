# 11. Graphs and traversal

A route network can branch, reconnect and contain loops. A tree gives each non-root node one parent, but many networks need a more general model. A graph represents those connections; a traversal supplies a rule for exploring them without repeatedly revisiting the same vertices.

## Reading route

1. [Graph concepts and modelling](graph-concepts.md): distinguish vertices, edges, direction, weights, paths and cycles.
2. [Representing graphs](graph-representations.md): connect adjacency lists and matrices to the operations they support.
3. [Graph operations](graph-operations.md): build, query and update a simple graph while preserving its representation contract.
4. [Breadth-first search](breadth-first-search.md): maintain a queue, discover each vertex once and recover shortest hop paths.
5. [Depth-first search](depth-first-search.md): follow an active path, return from calls and distinguish discovery from completion.
6. [Reachability and components](graph-components.md): restart traversal to cover an undirected graph, including isolated vertices.
7. [Traversal costs and choices](graph-traversal-costs.md): count examined entries, state assumptions and choose a traversal for the question.

Read [queues and stacks](../linear-structures/linear-structures.md), [recursive calls](../recursion/recursive-calls.md) and [algorithm analysis](../analysis/analysis.md) first. Priority queues are not needed for this topic. Next, [Topic 12: union–find](../union-find/union-find.md) maintains connectivity as connections arrive. [Topic 13](../graph-algorithms/graph-algorithms.md) will add dependency ordering and weighted routes.

The shared lecture graph has vertices A through H and eight undirected edges. All code assumes well-formed adjacency lists, hashable non-`None` vertex labels (strings in the shared trace), and the stored neighbour order. The graph remains unchanged during traversal. No notebook is needed.

## Contracts, implementations and checks

Read the graph model and representation before tracing discovery, expansion and completion. Use the same stored neighbour order as the diagram when predicting exact parents or visit order; tied valid answers can differ under another order.

Graph mutation is separate from algorithms that observe a fixed graph and return snapshots. The [operation contract](graph-operations.md#graph-operation-contract) states returns and errors; the [traversal comparison](graph-traversal-costs.md) distinguishes reachable-region results, full partitions, working state and output storage. Directed cycle/SCC algorithms remain extensions.
