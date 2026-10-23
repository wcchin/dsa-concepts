# Kruskal: sort edges and merge components

**After this page, you should be able to:**

- Trace globally sorted edges and use union returns to reject cycles.
- Specify forest inputs/results, stable weight ties, dependencies and costs.

**Builds on:** [Union–find operations](../union-find/disjoint-sets.md#disjoint-set-interface), [the complete class](../union-find/union-compression.md#disjoint-set-code) and [safe-edge reasoning](spanning-trees.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/graph-algorithms.js) · [Julia](../../examples/languages/graph-algorithms.jl).

These versions reuse the translated deque, heap and disjoint-set definitions. Julia Dict order can select a different valid topological order or tied forest; compare the objective, feasibility and optimum cost rather than requiring an identical printed edge order. Heap counters avoid comparing payloads.

(kruskal-algorithm)=
## Consider the globally lightest remaining edge

Kruskal scans edges in nondecreasing weight order. Initially each vertex is its own component. Accept an edge exactly when its endpoints currently belong to different components; then merge those components. An edge within one component would close a cycle and is rejected.

Read [Topic 12's disjoint-set class](../union-find/union-compression.md) first. This page deliberately reuses that class rather than presenting a second version with different tie or compression rules.

(kruskal-contract)=
## Preserve vertices, consume edges and retain one optimum forest

`kruskal_forest(vertices, edges)` returns `(chosen, total, components)` under the [forest contract](spanning-trees.md#spanning-forest-contract). It first copies the vertex iterable and maps labels to integer indices for `DisjointSet`. Duplicate vertices raise `ValueError`; an edge endpoint outside that map raises `KeyError`. Finite weights and valid edge record shapes are preconditions. Input lists remain unchanged; iterables are consumed.

Run the complete [DisjointSet class](../union-find/union-compression.md#disjoint-set-code) first. There is one shared implementation, including its union return and tie policies. Sorting uses weight only and is stable: equal-weight edges retain input order without comparing labels. Negative and zero weights are allowed. Empty vertices/edges return `([], 0, 0)`.

(kruskal-code)=
## Union reports whether a merge actually occurred

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def kruskal_forest(vertices, edges):
    vertices = list(vertices)
    index = {v: i for i, v in enumerate(vertices)}
    if len(index) != len(vertices):
        raise ValueError("vertices must be unique")
    sets = DisjointSet(len(vertices))
    chosen, total = [], 0
    for w, u, v in sorted(edges, key=lambda edge: edge[0]):
        if sets.union(index[u], index[v]):
            chosen.append((w, u, v))
            total += w
    return chosen, total, sets.components
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function kruskal_forest(vertices, edges) {
    vertices = [...vertices]; const index = new Map(vertices.map((v,i) => [v,i]));
    if (index.size !== vertices.length) throw new RangeError("vertices must be unique");
    const sets = new DisjointSet(vertices.length), chosen = []; let total = 0;
    for (const [w,u,v] of [...edges].sort((a,b) => a[0]-b[0])) {
        if (!index.has(u) || !index.has(v)) throw new KeyError("unknown endpoint");
        if (sets.union(index.get(u), index.get(v))) { chosen.push([w,u,v]); total += w; }
    }
    return [chosen, total, sets.components];
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function kruskal_forest(vertices, edges)
    vertices = collect(vertices); index = Dict(v=>i for (i,v) in enumerate(vertices))
    length(index) == length(vertices) || throw(ArgumentError("vertices must be unique"))
    sets = DisjointSet(length(vertices)); chosen = Any[]; total = 0
    for (w,u,v) in sort(collect(edges); by=e->e[1], alg=MergeSort)
        if union_sets!(sets, index[u], index[v]); push!(chosen, (w,u,v)); total += w; end
    end
    return (chosen, total, sets.components)
end
```

:::

::::

The edge list contains each undirected edge once, with valid endpoints and finite numeric weights. Sorting creates a new list; it does not mutate the input. Equal weights retain input order because Python's sort is stable. This makes the trace reproducible without comparing vertex labels, but another tie order could yield another equally good forest.

(kruskal-trace-correctness)=
## Accepted components remain acyclic and safely extendable

In the shared graph, accept BC(1), AC(2), DE(2), EF(3); reject AB(4), which closes a cycle; then accept BD(5). The final total is **13**, with five selected edges and one component.

![Kruskal's sorted scan accepts BC, AC, DE, EF and BD, rejecting AB because its endpoints are already connected.](../../assets/graph-algorithms/kruskal-trace.svg)

For an edge joining two components, consider the cut around one current component. Any lighter crossing edge would already have merged it with another component. The chosen edge is therefore a light crossing edge for a cut respecting the accepted forest. The exchange argument proves that accepting it preserves an optimum completion.

(kruskal-cost)=
## Sorting and union–find have different costs

Initialisation takes $\Theta(n)$, sorting m edges takes $O(m\log(m+1))$, and the edge checks take $O(m\alpha(n))$ amortised with union by size and path compression for n≥2. The usual summary is $O(n+m\log(m+1))$ for this implementation, with the tiny union–find factor understood in the standard model. Isolated vertices must still be included in the n term.

The copied sorted edge list uses $O(m)$ storage; parent and size arrays use $O(n)$. Chosen edges add at most n−c entries. The full scan handles disconnected graphs uniformly. Once a nonempty connected graph has one component, an implementation could stop early, but this code continues and rejects the remaining cycle-forming edges.

The union–find parent forest is bookkeeping; its parent links are not necessarily selected graph edges. Return `chosen` when the actual spanning forest is needed.

## Choices, storage and suitability

Kruskal is natural for an edge list: no adjacency matrix or reciprocal neighbour lists are required. Global sorting supplies a different selection policy from Prim's expanding frontier. Pre-sorted edges could be scanned directly by another implementation, but this function always creates a sorted copy and includes that work in its bound.

The vertex copy/index map and disjoint-set arrays use O(n+1) workspace. The sorted copy and Python sorting workspace use O(m+1); chosen output uses O(n+1). Total additional storage is O(n+m+1). Initialisation, sorting, and amortised union checks contribute separately to the time bound already stated above.

Representatives are implementation metadata. Keep the actual accepted `(weight, u, v)` records when the constructed network is needed. A different order among equal weights can return another equally light forest; the correctness claim is minimum total cost for each component, not a unique sequence of endpoints.

:::{tip} Common misconception
**Union–find parents are Kruskal's selected edges.** Root links and compression are bookkeeping; only `chosen` stores the accepted input edges.
:::

(kruskal-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. Why is AB(4) rejected in the shared trace even though its weight is smaller than BD(5)?**

:::{dropdown} Show explanation
A and B are already connected through accepted AC and BC. AB would close a cycle; BD later joins different components.
:::

**2. If two equal-weight edges exchange their input positions, must the returned edge list stay identical?**

:::{dropdown} Show explanation
No. Stable sorting preserves that changed tie order. Both results can be valid minimum forests with the same optimum total.
:::

Next: [Compare the objectives](graph-algorithm-choices.md).
