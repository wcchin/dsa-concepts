# 12. Union–find and disjoint sets

When connections arrive one at a time, we may need to ask whether two objects are already connected without repeatedly traversing the whole graph. Union–find maintains a partition into disjoint sets and merges sets as new connections arrive.

## Reading route

1. [Partitions and representatives](disjoint-sets.md): specify what `find`, `union` and `connected` mean.
2. [Parent forests](parent-forests.md): follow references to a root and distinguish representation links from graph edges.
3. [Union by size and path compression](union-compression.md): read a complete implementation and justify its costs.
4. [Connectivity, cycle checks and limits](union-find-applications.md): connect the structure to Kruskal and identify what it cannot answer.

Review [arrays and references](../linear-structures/linear-structures.md), [connected components](../graphs/graph-components.md), and [amortised analysis](../linear-structures/dynamic-arrays.md). This topic is a prerequisite for the [Kruskal implementation](../graph-algorithms/kruskal.md) in the following topic.

The code manages a fixed universe of integer indices `0..n-1`. It preserves the additional lecture's tie rule: if root sizes are equal, the first argument's root remains the root. This makes its traces reproducible; the abstract partition does not depend on which representative is chosen.
