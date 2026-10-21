# Connectivity, cycle checks and limits

(incremental-connectivity)=
## Merge when an undirected connection arrives

Begin with every graph vertex in a singleton set. For each undirected edge a–b, union their components. Afterwards `connected(a,b)` answers whether the **processed edges** supply some path between them, even if no edge directly joins a and b.

The component count decreases exactly on successful unions. For n vertices, after k successful merges it is n−k. Isolated vertices remain singleton components until an incident connection is processed.

(union-find-cycle-check)=
## Reject a connection within one existing component

If a and b are already connected by previously accepted forest edges, adding a new edge between them closes a cycle. `union(a,b)` returns `False`, letting a forest builder reject that redundant connection. A repeated copy of an already processed edge is also redundant; whether parallel edges count as separate graph edges depends on the graph model.

```python
def connection_forest(n, edges):
    sets = DisjointSet(n)
    chosen, rejected = [], []
    for a, b in edges:
        if sets.union(a, b):
            chosen.append((a, b))
        else:
            rejected.append((a, b))
    return chosen, rejected, sets.components
```

This uses the class from the preceding page. It builds an undirected spanning forest of the processed connections, but does **not** minimise any weight. [Kruskal](../graph-algorithms/kruskal.md) adds the crucial increasing-weight scan.

![Edges 0-1 and 1-2 join components; 0-2 is rejected as redundant because both endpoints already have the same representative.](../../assets/union-find/cycle-check.svg)

(union-find-directed-limit)=
## Directed reachability is not an equivalence relation

For A→B and C→B, merging endpoints puts all three vertices together, but there is no directed path from A to C. Plain union–find therefore does not answer directed reachability, find strongly connected components, or detect directed cycles by ignoring arrow directions.

It can represent weak connectivity if the intended operation deliberately ignores direction. That is a different question and should be named explicitly.

(union-find-deletion-limit)=
## Merging does not support splitting

Ordinary union–find cannot undo a component merge after an arbitrary graph edge is removed. Removing an edge may or may not disconnect a graph, and the compressed parent forest does not retain enough original connection information to decide that.

For occasional deletions, rebuilding connectivity from the remaining graph can be appropriate. Rollback or dynamic-connectivity methods are separate extensions with different rules; simply setting one parent back to itself is not a valid general deletion algorithm.

(union-find-workload-choice)=
## Choose between traversal and maintained partitions

Use BFS/DFS when you need actual routes, traversal order, or static component membership. Use union–find for repeated merge/connectivity operations and undirected cycle checks. To enumerate current members of every union–find component, scan all elements, call `find` on each, and group by the returned root; membership lists are not provided automatically by the parent arrays.

Return to [Kruskal](../graph-algorithms/kruskal.md), the [topic overview](union-find.md), or the [coverage review](../../coverage-review.md) for remaining concepts and proposed extensions.
