# An operator asks whether places are connected

**After this page, you should be able to:**

- Explain a union result and component count after each link opening.
- Separate incremental membership state from the graph needed to recover routes.

**Builds on:** [The shared model](transport-model.md) and [union–find operations](../union-find/union-find.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/applications.js) · [Julia](../../examples/languages/applications.jl).

Reuse the translated graph algorithms and the same invented dataset. Julia travel/build columns are 3 and 4, versus 2 and 3 in Python/JavaScript. The translated construction adjacency is named build_graph_view to distinguish it from the graph-builder function. All versions keep the isolated harbour, distinguish absence from a zero-length route, and separate minutes from construction units.

(transport-incremental-connectivity)=
## Answer after each arriving connection

Imagine opening candidate links in the declared input order. Before any are opened, every place is separate. After each opening, an operator asks how many groups remain. This is a useful [union–find](../union-find/union-find.md) workload: merges and membership queries are interleaved.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
place_index = {place: i for i, place in enumerate(places)}
sets = DisjointSet(len(places))
opening_log = []
for u, v, minutes, build_units in links:
    merged = sets.union(place_index[u], place_index[v])
    opening_log.append((u, v, merged, sets.components))
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var place_index = new Map([...places.keys()].map((v,i) => [v,i]));
var sets = new DisjointSet(places.size), opening_log = [];
for (const [u,v,minutes,build_units] of links) {
    const merged = sets.union(place_index.get(u), place_index.get(v));
    opening_log.push([u,v,merged,sets.components]);
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
place_index = Dict(v=>i for (i,v) in enumerate(keys(places)))
sets = DisjointSet(length(places)); opening_log = Any[]
for (u,v,minutes,build_units) in links
    merged = union_sets!(sets, place_index[u], place_index[v])
    push!(opening_log, (u,v,merged,sets.components))
end
```

:::

::::

(transport-connectivity-trace)=
## A connection can be useful without merging two components

AB merges two sets; AC merges another. BC then returns `False`, since B and C are already connected through A. Later BD, CE and DF each merge a new place into that group. The final component count is **two**: A–F together and isolated G.

![Opening links in input order changes component counts from seven to two; links within an existing component do not decrement the count.](../../assets/applications/transport-connectivity.svg)

A false union result does not mean the link is useless for transport. BC is central to the 13-minute route even though it does not change reachability when it opens. A new link may improve time or provide redundancy without changing the partition.

(transport-connectivity-versus-routes)=
## Preserve graph edges when routes are needed

The disjoint-set parent arrays are bookkeeping, not input connections. Compression can create shortcuts between members that have no direct link. Recover actual routes from the graph's adjacency lists and traversal/shortest-path predecessors, not from union–find parents.

For one static snapshot, BFS/DFS can label all undirected components in linear time. Union–find earns its role when connectivity queries recur between added links. Removing an arbitrary link is different: ordinary union–find does not split a merged component or determine whether a redundant alternative remains.

## Update contract, state and costs

The identifier map assigns each declared place a fixed integer index. `union` mutates the disjoint-set representation and returns `True` exactly when it merges two previous components; otherwise it returns `False`. The component counter decreases once per successful merge, independent of the chosen representative. `connected` returns a Boolean and may compress parents without changing membership. Neither query reports a route or a weight.

After processing the first i links, two places share a representative exactly when they are connected using those opened links. Initially all seven are singletons; a new link either joins two components or stays inside one. Thus seven minus the number of successful unions equals the current count. The displayed SVG traces this partition invariant.

An unknown place fails the `place_index` lookup with `KeyError`; an out-of-range member passed directly to the disjoint set raises `IndexError`. The fixed universe includes G from initialisation. This workload adds edges only: it does not add places or support arbitrary edge deletion.

Building the map and singleton sets costs O(n) time/storage. With union by size and path compression, m updates take O(m α(n)) amortised time for n≥2, rather than guaranteeing constant time for each individual call. Keeping every opening record adds O(m) output storage. A repeated link leaves the partition unchanged; a physically closed link can require recomputing connectivity from the remaining graph.

:::{tip} Common misconception
**Disjoint-set parents are road connections.** They represent membership and may change under compression. Preserve adjacency and route predecessors for actual journeys.
:::

(transport-connectivity-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. Does the false union result for BC justify discarding BC from a fastest-route graph?**

:::{dropdown} Show explanation
No. B and C were already connected through A, but the direct BC link improves travel time. It participates in the 13-minute route despite leaving the partition unchanged.
:::

**2. After all openings, what happens to the component count if AB is processed again? What if G is omitted at initialisation?**

:::{dropdown} Show explanation
Repeating AB returns False and leaves two components. Omitting G would incorrectly report one component for a different vertex universe, hiding the unserved place.
:::

Next: [Network design](transport-design.md).
