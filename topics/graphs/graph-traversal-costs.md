# Traversal costs and algorithm choice

**After this page, you should be able to:**

- Count examined vertices/entries and distinguish input, workspace and results.
- Select BFS, DFS or component traversal using the required output and representation.

**Builds on:** [Representation costs](graph-representations.md), [BFS](breadth-first-search.md), [DFS](depth-first-search.md) and [components](graph-components.md).

(adjacency-list-traversal-cost)=
## Count vertices and examined neighbour entries

Let $n=|V|$ and $m=|E|$. In the shown list-based traversals, each discovered vertex is expanded once and each of its neighbour entries is scanned once. For a full traversal this gives $O(n+m)$ time.

In an undirected graph each edge is listed twice, so the scan examines $2m$ entries; the constant factor does not change the bound. A single-start traversal instead costs $O(n_R+m_R)$, where $n_R$ counts reached vertices and $m_R$ counts examined outgoing entries from those vertices. Unreachable vertices do not have their lists scanned.

For the shared graph, A's traversal processes seven vertices and examines sixteen neighbour entries. H's empty list adds no entries when the component routine restarts there. A discovered neighbour may still be checked many times through its incident edges, but is inserted into the frontier only once.

(adjacency-matrix-traversal-cost)=
## A matrix changes neighbour enumeration

A matrix can answer one edge-existence question in constant time, but finding **all** neighbours of a vertex requires scanning a row of n entries. If all n vertices are reached, the standard row-scanning traversal costs $\Theta(n^2)$, even when few edges exist. Reaching only $n_R$ vertices requires $\Theta(n\,n_R)$ row-entry examinations, apart from matrix construction.

The algorithmic policy and representation both matter: calling an algorithm BFS does not establish its cost without knowing how it obtains neighbours and manages the queue.

(traversal-space)=
## Input storage differs from traversal state

| Resource | Space |
|---|---|
| Input adjacency lists | $\Theta(n+m)$ |
| Input adjacency matrix | $\Theta(n^2)$ |
| BFS queue, parents, distances and returned order | $O(n)$ additional |
| DFS seen set, parents, returned orders and call stack | $O(n)$ additional |
| All returned component groups and shared traversal state | $O(n)$ additional |

For a single start, stored traversal state is bounded by the reached region. A star can create a wide BFS queue; a long path can create a deep DFS stack. These are different shapes of memory demand, even though both have a linear worst-case bound.

(traversal-cost-assumptions)=
## The Python operations carry assumptions

The time bounds assume constant-cost vertex hashing and comparisons, expected constant-time set/dictionary operations, and constant-time deque endpoint operations. As a result, the stated linear Python bounds inherit the hashing assumptions; they are not unconditional worst-case guarantees for arbitrary label objects or adversarial hash behaviour.

Using `list.pop(0)` for the BFS frontier can introduce repeated linear shifts and destroy the linear traversal bound. Sorting every neighbour list during the search also adds work. Our lists already have their intended order and the algorithms iterate them directly.

The outer component loop does not multiply the cost by n: its shared seen set ensures that all restarts together scan each vertex and each neighbour entry once.

(bfs-versus-dfs)=
## Select the policy from the required result

| Requirement | Suitable starting point | Qualification |
|---|---|---|
| Reach all vertices accessible from a start | BFS or DFS | Follow direction for directed graphs |
| Find a shortest unweighted path | BFS | Parent choices may vary among tied shortest paths |
| Study nesting, returns or completion order | DFS | Specify the neighbour order for a precise trace |
| Partition an undirected graph into components | Restart BFS or DFS | Share discovery state across starts |
| Minimise unequal edge-weight sums | A weighted shortest-path algorithm | BFS's hop guarantee is insufficient |

Neighbour order can change traversal order and parent choices, while reachability stays the same. BFS distances also remain the same for a fixed graph and start. DFS completion order carries structural information, but interpreting it requires the appropriate graph assumptions and algorithm; it is not automatically a dependency ordering for every graph.

## Compare the actual interfaces

| Function | Scope and returned result | Boundary and limitation |
|---|---|---|
| `bfs(graph, start)` | One reachable region; expansion order, parents, hop distances | Missing start raises `KeyError`; no unequal-weight optimum |
| `dfs(graph, start)` | One reachable region; discovery/finish orders and parents | Missing start raises `KeyError`; recursive implementation can exceed Python's call limit |
| `connected_components(graph)` | All vertices; lists forming an undirected partition | Empty input returns `[]`; reciprocal adjacency required |
| `path_to(parent, target)` | One recovered path, or `None` | Uses a valid traversal parent structure; no independent graph validation |

These algorithms observe the graph; their temporary discovery and parent state is separate from graph mutation. Returned paths/orders/partitions are snapshots. A successful graph update can invalidate those old results without altering the Python lists already returned.

The n/m notation refers to logical vertices and edges. For empty inputs, use O(n+m+1) and O(n+1) when a constant term matters; earlier O(n+m) notation describes growing nonempty graphs. Matrix allocation, graph construction, sorting neighbours and path recovery are additional work unless explicitly included. The [operation table](graph-operations.md#graph-update-costs) describes update costs rather than traversal costs.

:::{tip} Common misconception
**Many component starts multiply traversal cost by n.** One shared seen set makes all starts together visit each vertex once.
:::

(graph-cost-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. In a matrix for n vertices, BFS reaches only r vertices. How many row entries are examined?**

:::{dropdown} Show explanation
n times r, because each reached vertex requires a full n-entry row scan, excluding input construction.
:::

**2. Is O(n) additional space a claim that the input edges also fit in O(n) storage?**

:::{dropdown} Show explanation
No. It describes traversal state/results. An adjacency-list input separately occupies Θ(n+m+1) storage.
:::

Continue to [Topic 12: union–find](../union-find/union-find.md) for maintained connectivity, followed by [Topic 13](../graph-algorithms/graph-algorithms.md) for graph ordering, weighted routes and spanning trees, or return to the [concept index](../../concepts.md).
