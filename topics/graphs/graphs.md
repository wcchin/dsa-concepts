# 10. Graphs and traversal

A route network can branch, reconnect and contain loops. A tree gives each non-root node one parent, but many networks need a more general model. A graph represents those connections; a traversal supplies a rule for exploring them without repeatedly revisiting the same vertices.

## Reading route

1. [Graph concepts and modelling](graph-concepts.md): distinguish vertices, edges, direction, weights, paths and cycles.
2. [Representing graphs](graph-representations.md): connect adjacency lists and matrices to the operations they support.
3. [Breadth-first search](breadth-first-search.md): maintain a queue, discover each vertex once and recover shortest hop paths.
4. [Depth-first search](depth-first-search.md): follow an active path, return from calls and distinguish discovery from completion.
5. [Reachability and components](graph-components.md): restart traversal to cover an undirected graph, including isolated vertices.
6. [Traversal costs and choices](graph-traversal-costs.md): count examined entries, state assumptions and choose a traversal for the question.

Read [queues and stacks](../linear-structures/linear-structures.md), [recursive calls](../recursion/recursive-calls.md) and [algorithm analysis](../analysis/analysis.md) first. Priority queues are not needed for this topic. [Topic 11](../graph-algorithms/graph-algorithms.md) will add dependency ordering and weighted routes.

The shared lecture graph has vertices A through H and eight undirected edges. All code assumes well-formed adjacency lists, non-`None` string vertex labels, and the stored neighbour order. The graph remains unchanged during traversal. No notebook is needed.
