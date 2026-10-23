# Adjacency lists and matrices

**After this page, you should be able to:**

- Read the same graph from lists and a matrix, including isolated vertices.
- Choose a representation by membership, neighbour enumeration, updates and storage.

**Builds on:** [Graph modelling](graph-concepts.md), [reference sharing](../foundations/mutation-and-copying.md) and [hashing assumptions](../maps-sets-hashing/performance.md).

(adjacency-list)=
## Store each vertex's neighbours

An **adjacency list** records the neighbours reachable by one edge from each vertex. In Python, a dictionary can map each label to a list. Lists give a specified iteration order; this example uses alphabetical neighbour order.

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B", "E"],
    "E": ["B", "D", "F"],
    "F": ["C", "E", "G"],
    "G": ["F"],
    "H": [],
}
```

(graph-representation-contract)=
## Keep vertices and edges consistent

Every vertex, including H, appears as a key. Every listed neighbour must also be a key. Undirected lists are reciprocal: B in A's list requires A in B's list. A directed representation instead lists outgoing neighbours, without automatically adding the reverse edge.

The eight undirected edges occupy sixteen neighbour entries because each appears at both endpoints. The empty list at H records an isolated vertex; omitting H would represent a different vertex set.

(adjacency-matrix)=
## Store an entry for every ordered pair

Fix the vertex order A through H. An **adjacency matrix** has entry 1 in row u, column v when the edge exists, and 0 otherwise. An undirected graph's matrix is symmetric; a directed graph's need not be. The diagonal is zero for this graph because it has no self-loops.

![The adjacency-list rows and the matching eight-by-eight matrix represent the same edges; H has an empty list and a zero matrix row and column.](../../assets/graphs/adjacency-representations.svg)

```python
vertices = list(graph)
index = {v: i for i, v in enumerate(vertices)}
n = len(vertices)
matrix = [[0] * n for _ in range(n)]
for u in vertices:
    for v in graph[u]:
        matrix[index[u]][index[v]] = 1
```

Each row is a separate list. `[[0] * n] * n` would alias a single row: changing one entry would unexpectedly change the same column in every row. This is the [reference-sharing issue from Topic 1](../foundations/mutation-and-copying.md).

(graph-representation-costs)=
## Ask which operation needs to be fast

Let $n=|V|$ and $m=|E|$, with constant-time label hashing, comparisons and indexed access.

| Operation or storage | Dictionary of neighbour lists | Matrix plus label-to-index map |
|---|---|---|
| Input storage | $\Theta(n+m)$ | $\Theta(n^2)$ |
| Test whether u–v exists | $O(\deg(u))$ scan | $O(1)$ entry lookup |
| Enumerate neighbours of u | $\Theta(\deg(u))$ entries | $\Theta(n)$ row scan |
| Initialise the shown structure | Depends on supplied vertices and edges | $\Theta(n^2)$ zero initialisation |

A neighbour **set** can provide expected constant-time membership at the cost of an additional ordering decision for exact traces. That is a different representation from the lists above.

(sparse-dense-graphs)=
## Space depends on how many edges exist

A **sparse** graph has relatively few edges compared with the possible number of vertex pairs. A **dense** graph has many. Adjacency lists avoid allocating a slot for every absent edge, making them attractive for sparse networks. A matrix can be useful when pairwise edge tests dominate and quadratic storage is acceptable.

For weighted matrices, choose an explicit no-edge marker rather than using zero if zero-weight edges are legal. For weighted lists, store each neighbour together with its weight. Neither extension changes the distinction between a connection and its cost.

## Construction, updates and implementation choices

The matrix code assumes the supplied adjacency lists already satisfy the contract. It allocates n distinct rows, then fills entries: Θ(n²+m+1) time and Θ(n²+1) output storage. For a simple graph, m is at most quadratic. The index dictionary adds Θ(n+1) storage and expected constant-time label-to-row lookup.

Lists preserve supplied neighbour order and are easy to inspect in traces. Sets improve expected edge membership/update costs but require an explicit ordering policy for reproducible traversal. Matrices make edge tests/updates constant-time after allocation; they do not make neighbour enumeration constant-time. See the [complete update route](graph-operations.md#graph-update-costs) for insertion and deletion, including matrix vertex-management choices.

The 0/1 matrix here is unweighted. A weighted representation needs a separate absent-edge marker when weight zero is legal. Weighted lists later use `(neighbour, weight)` entries, while edge-list algorithms use `(weight, u, v)` records; check the interface before passing one format to another.

:::{tip} Common misconception
**A matrix makes every graph operation constant-time.** One indexed edge lookup is constant-time; enumerating a row still examines n positions.
:::

(graph-representation-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. Why does isolated H need a dictionary key and a matrix row/column?**

:::{dropdown} Show explanation
It belongs to the vertex set. Dropping it changes component counts and any result that must cover all vertices.
:::

**2. For a sparse graph, must a matrix save space because most entries are zero?**

:::{dropdown} Show explanation
No. The shown dense matrix still allocates all n² entries. An adjacency list omits absent connections.
:::

Next: [Graph operations](graph-operations.md), then [breadth-first search](breadth-first-search.md).
