# Graph operations: build, query and update connections

**After this page, you should be able to:**

- Specify simple graph operations, returns, missing-input rules and directedness.
- Trace list-based updates and explain their representation-dependent costs.

**Builds on:** [Graph modelling](graph-concepts.md) and the [adjacency-list invariant](graph-representations.md#graph-representation-contract).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/graphs.js) · [Julia](../../examples/languages/graphs.jl).

JavaScript graphs use Map; Julia graphs use Dict. Stored neighbour order is preserved, but Julia Dict vertex iteration can change valid component ordering or tied choices. The shared DequeBuffer supplies constant-time linked endpoints. The figures and check answers use Python’s declared iteration order.

(graph-operation-contract)=
## Keep the vertex set and connection policy explicit

These helpers represent a **simple, unweighted graph** as a dictionary of neighbour lists. Labels are hashable and non-`None`; examples use strings. Every destination is a dictionary key. Neighbours are distinct, and self-loops are excluded. For an undirected graph, both endpoint lists contain the connection. A directed graph stores only the outgoing direction.

Choose directedness when constructing a graph and pass that same choice to every edge update and count. The dictionary itself does not store that choice. Helpers assume an already well-formed graph; they do not validate or repair arbitrary dictionaries. Do not mutate adjacency lists during a traversal.

| Operation | Result and effect |
|---|---|
| `build_graph(vertices, edges, directed=False)` | New dictionary; supplied vertices remain present even if isolated; each edge is an endpoint pair |
| `add_vertex(graph, v)` | `None`; add an empty list if absent; an existing vertex and its edges remain unchanged |
| `add_edge(graph, u, v, directed=False)` | `None`; add the connection if absent; repeat insertion has no effect |
| `has_edge(graph, u, v)` | Boolean; inspect the outgoing list of u |
| `neighbours(graph, u)` | New list of u's neighbours in stored order; changing this list does not alter the graph |
| `remove_edge(graph, u, v, directed=False)` | `None`; remove the connection; an absent edge raises `KeyError` |
| `remove_vertex(graph, v)` | `None`; remove v and every incoming/outgoing connection; an absent vertex raises `KeyError` |
| `vertex_count(graph)` / `len(graph)` | Number of vertices; not the number of edges |
| `edge_count(graph, directed=False)` | Number of connections; count reciprocal undirected entries once |
| `list(graph)` | New vertex-list snapshot in dictionary insertion order |
| `len(graph[u])` | Outdegree for directed lists; degree for undirected lists; unknown u raises `KeyError` |
| `not graph` | Whether the vertex set is empty; isolated vertices make this `False` |

Edge queries/updates require both endpoints to exist and raise `KeyError` otherwise. `add_edge` raises `ValueError` for a self-loop; `add_vertex` rejects `None` with `ValueError`. Use `add_vertex` explicitly rather than silently creating an endpoint when adding an edge. `build_graph` consumes the supplied iterables, including duplicate vertices/edges under the idempotent insertion rules. Returned neighbour snapshots are shallow copies of references to labels.

(graph-operation-code)=
## Maintain reciprocal lists when required

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def add_vertex(graph, v):
    if v is None:
        raise ValueError("None is reserved for a missing parent")
    if v not in graph:
        graph[v] = []

def _require_endpoints(graph, u, v):
    if u not in graph:
        raise KeyError(u)
    if v not in graph:
        raise KeyError(v)

def add_edge(graph, u, v, *, directed=False):
    _require_endpoints(graph, u, v)
    if u == v:
        raise ValueError("simple graphs have no self-loops")
    if v not in graph[u]:
        graph[u].append(v)
    if not directed and u not in graph[v]:
        graph[v].append(u)

def has_edge(graph, u, v):
    _require_endpoints(graph, u, v)
    return v in graph[u]

def neighbours(graph, u):
    return list(graph[u])

def remove_edge(graph, u, v, *, directed=False):
    _require_endpoints(graph, u, v)
    if v not in graph[u]:
        raise KeyError((u, v))
    graph[u].remove(v)
    if not directed:
        graph[v].remove(u)

def remove_vertex(graph, v):
    if v not in graph:
        raise KeyError(v)
    for u in graph:
        if u != v and v in graph[u]:
            graph[u].remove(v)
    del graph[v]

def vertex_count(graph):
    return len(graph)

def edge_count(graph, *, directed=False):
    entries = sum(len(adjacent) for adjacent in graph.values())
    return entries if directed else entries // 2

def build_graph(vertices, edges, *, directed=False):
    graph = {}
    for v in vertices:
        add_vertex(graph, v)
    for u, v in edges:
        add_edge(graph, u, v, directed=directed)
    return graph
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function add_vertex(graph, v) {
    if (v === null) throw new TypeError("null is reserved for missing parents");
    if (!graph.has(v)) graph.set(v, []);
}
function require_endpoints(graph, u, v) {
    if (!graph.has(u)) throw new KeyError(String(u));
    if (!graph.has(v)) throw new KeyError(String(v));
}
function add_edge(graph, u, v, directed = false) {
    require_endpoints(graph, u, v);
    if (u === v) throw new RangeError("no self-loops");
    if (!graph.get(u).includes(v)) graph.get(u).push(v);
    if (!directed && !graph.get(v).includes(u)) graph.get(v).push(u);
}
function has_edge(graph, u, v) { require_endpoints(graph, u, v); return graph.get(u).includes(v); }
function neighbours(graph, u) {
    if (!graph.has(u)) throw new KeyError(String(u)); return graph.get(u).slice();
}
function remove_edge(graph, u, v, directed = false) {
    require_endpoints(graph, u, v);
    const i = graph.get(u).indexOf(v);
    if (i < 0) throw new KeyError("missing edge");
    graph.get(u).splice(i, 1);
    if (!directed) graph.get(v).splice(graph.get(v).indexOf(u), 1);
}
function remove_vertex(graph, v) {
    if (!graph.has(v)) throw new KeyError(String(v));
    for (const [u, adjacent] of graph) {
        const i = adjacent.indexOf(v); if (u !== v && i >= 0) adjacent.splice(i, 1);
    }
    graph.delete(v);
}
function vertex_count(graph) { return graph.size; }
function edge_count(graph, directed = false) {
    let entries = 0; for (const a of graph.values()) entries += a.length;
    return directed ? entries : entries / 2;
}
function build_graph(vertices, edges, directed = false) {
    const graph = new Map();
    for (const v of vertices) add_vertex(graph, v);
    for (const [u, v] of edges) add_edge(graph, u, v, directed);
    return graph;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function add_vertex!(graph, v)
    v === nothing && throw(ArgumentError("nothing is reserved for missing parents"))
    get!(graph, v, Any[]); return nothing
end
function require_endpoints(graph, u, v)
    haskey(graph, u) || throw(KeyError(u)); haskey(graph, v) || throw(KeyError(v))
end
function add_edge!(graph, u, v; directed=false)
    require_endpoints(graph, u, v)
    u == v && throw(ArgumentError("no self-loops"))
    !(v in graph[u]) && push!(graph[u], v)
    !directed && !(u in graph[v]) && push!(graph[v], u)
    return nothing
end
has_edge(graph, u, v) = (require_endpoints(graph, u, v); v in graph[u])
neighbours(graph, u) = copy(graph[u])
function remove_edge!(graph, u, v; directed=false)
    require_endpoints(graph, u, v)
    i = findfirst(==(v), graph[u]); i === nothing && throw(KeyError((u,v)))
    deleteat!(graph[u], i)
    !directed && deleteat!(graph[v], findfirst(==(u), graph[v]))
    return nothing
end
function remove_vertex!(graph, v)
    haskey(graph, v) || throw(KeyError(v))
    for u in keys(graph)
        if u != v
            i = findfirst(==(v), graph[u]); i !== nothing && deleteat!(graph[u], i)
        end
    end
    delete!(graph, v); return nothing
end
vertex_count(graph) = length(graph)
function edge_count(graph; directed=false)
    entries = sum(length, values(graph); init=0)
    return directed ? entries : div(entries, 2)
end
function build_graph(vertices, edges; directed=false)
    graph = Dict{Any,Vector{Any}}()
    for v in vertices; add_vertex!(graph, v); end
    for (u,v) in edges; add_edge!(graph, u, v; directed=directed); end
    return graph
end
```

:::

::::

`remove_vertex` visits all vertex lists because incoming connections are not indexed separately. It changes lists during that loop but deletes the dictionary key only afterwards. The simple-graph invariant means each other list contains v at most once. Successful operations preserve valid endpoints, distinct neighbours and, where applicable, reciprocity.

(graph-operation-trace)=
## Observe which changes affect later traversals

Build `g = build_graph("ABH", [("A", "B")])`. It contains `{"A": ["B"], "B": ["A"], "H": []}`: three vertices and one edge. Repeating `add_vertex(g, "A")` or `add_edge(g, "A", "B")` changes nothing. Appending H to `neighbours(g, "A")` changes only that temporary snapshot.

Removing A–B leaves three isolated vertices. Removing B then leaves A and H. With `directed=True`, inserting A→B changes A's list only; deleting B still removes A's incoming reference to B. It does not create A→H or any replacement route.

(graph-update-costs)=
## Compare the implementation choices and costs

Let n be the current vertex count, m the edge count and d(u) the outgoing-list length (degree for an undirected graph). Bounds assume constant-cost labels and expected dictionary access. Dynamic Python lists and dictionaries may occasionally allocate or copy storage.

| Operation | Shown list-based implementation | Additional result/workspace |
|---|---|---|
| Add vertex | Expected amortised O(1); allocation can cost more on one call | One empty list; dictionary growth can temporarily use O(n+1) space |
| Add directed edge / test edge | O(d(u)+1) scan; insertion includes amortised append | O(1) local workspace; append resizing can temporarily use O(d(u)+1) space |
| Add undirected edge | O(d(u)+d(v)+1), including scans and list growth | Same allocation qualification at both endpoints |
| Neighbour snapshot | Θ(d(u)+1) | Θ(d(u)+1) returned list |
| Remove directed edge | O(d(u)+1), including scan and shifts | O(1) local workspace; list shrink may allocate/copy |
| Remove undirected edge | O(d(u)+d(v)+1) | Same qualification at both endpoints |
| Remove vertex | O(n+m+1), including incoming scans and shifts | O(1) local workspace; list shrink can temporarily use O(n+1) space |
| Vertex count / emptiness / outgoing degree | O(1) | O(1) |
| Vertex snapshot | Θ(n+1) | Θ(n+1) returned list |
| Edge count | Θ(n+1), summing cached list lengths | O(1) |

Persistent graph storage is Θ(n+m+1). `build_graph` starts a new dictionary and repeatedly uses the checked insertions: construction is **not automatically O(n+m)** with duplicate-detection list scans. For n distinct supplied vertices and m distinct edges in a simple graph, its worst-case bound is O(n+m(n+1)); repeated input records add their own scans. A trusted edge list can be appended in linear total time when uniqueness and endpoints are guaranteed, as in the later weighted builder.

Neighbour sets offer expected constant-time edge membership and updates, but no promised traversal order. A matrix offers constant-time edge tests/updates after allocation, while enumeration scans a full row. Compact matrix vertex removal requires row/column and index-map maintenance; an inactive-slot policy trades that work for spare storage. These are representation choices under related graph contracts, not changes to BFS's FIFO rule.

:::{tip} Common misconception
**An edge update should silently create missing vertices.** That is a possible alternative API, but this contract requires explicit vertex creation and preserves isolated vertices independently of edges.
:::

(graph-operations-checks)=
## Check your understanding

Predict the result before opening the explanation.

**1. A directed graph stores A→B and isolated H. After removing B, how many vertices and edges remain?**

:::{dropdown} Show explanation
Two vertices, A and H, and zero edges. Removing B also removes A's reference to B; isolated vertices are still part of the graph.
:::

**2. Does replacing neighbour lists with sets preserve our exact BFS trace automatically?**

:::{dropdown} Show explanation
No. Reachability and shortest hop distances remain the same, but neighbour iteration can change discovery order and tied parents. Specify an ordering policy if the exact trace matters.
:::

Next: [Breadth-first search](breadth-first-search.md).
