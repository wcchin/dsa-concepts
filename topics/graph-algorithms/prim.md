# Prim: grow a tree across a cut

**After this page, you should be able to:**

- Trace light crossing-edge selection and reject stale internal candidates.
- Specify forest outputs, disconnected restarts, tie choices and lazy-heap costs.

**Builds on:** [The cut property](spanning-trees.md#mst-cut-property) and [stable heap records](../heaps/heap-applications.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/graph-algorithms.js) · [Julia](../../examples/languages/graph-algorithms.jl).

These versions reuse the translated deque, heap and disjoint-set definitions. Julia Dict order can select a different valid topological order or tied forest; compare the objective, feasibility and optimum cost rather than requiring an identical printed edge order. Heap counters avoid comparing payloads.

(prim-algorithm)=
## Candidates are edge costs, not source distances

Start at any vertex and maintain the set already reached in its component. Choose a cheapest edge crossing from that set to an unreached vertex. Its weight is the cost of **that edge**, not a cumulative distance from the start. This is how Prim differs from Dijkstra despite both using heaps.

(prim-contract)=
## Return a minimum forest, not a source-distance table

`prim_forest(graph)` accepts reciprocal undirected weighted lists and returns `(chosen, total, components)` under the [forest contract](spanning-trees.md#spanning-forest-contract). It scans all dictionary keys to restart disconnected components; no source argument is required. Empty input returns `([], 0, 0)`; an isolated vertex increments the count without selecting an edge. Negative and zero weights are allowed.

The code assumes valid endpoints, matching reciprocal weights and finite weights; it does not validate those conditions. It observes the input. Dictionary/neighbour iteration order and arrival counters determine tied choices without requiring ordered vertex labels. A returned edge's orientation reflects discovery, not a directed connection.

(lazy-prim-code)=
## Ignore edges whose destinations have already joined

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
from heapq import heappush, heappop
from itertools import count

def prim_forest(graph):
    seen, chosen = set(), []
    total, components = 0, 0
    sequence = count()
    for root in graph:
        if root in seen:
            continue
        components += 1
        seen.add(root)
        heap = []
        for v, w in graph[root]:
            if v not in seen:
                heappush(heap, (w, next(sequence), root, v))
        while heap:
            w, _, u, v = heappop(heap)
            if v in seen:
                continue
            seen.add(v)
            chosen.append((w, u, v))
            total += w
            for x, cost in graph[v]:
                if x not in seen:
                    heappush(heap, (cost, next(sequence), v, x))
    return chosen, total, components
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function prim_forest(graph) {
    const seen = new Set(), chosen = []; let total = 0, components = 0, sequence = 0;
    for (const root of graph.keys()) {
        if (seen.has(root)) continue;
        components++; seen.add(root); const heap = new MinHeap(entry_less);
        for (const [v,w] of graph.get(root)) if (!seen.has(v)) heap.push([w, sequence++, root, v]);
        while (heap.size()) {
            const [w,serial,u,v] = heap.pop(); if (seen.has(v)) continue;
            seen.add(v); chosen.push([w,u,v]); total += w;
            for (const [x,cost] of graph.get(v)) if (!seen.has(x)) heap.push([cost, sequence++, v, x]);
        }
    }
    return [chosen, total, components];
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function prim_forest(graph)
    seen = Set{Any}(); chosen = Any[]; total = 0; components = 0; sequence = 0
    for root in keys(graph)
        root in seen && continue
        components += 1; push!(seen, root); heap = MinHeap(entry_less)
        for (v,w) in graph[root]
            if !(v in seen); heap_push!(heap, (w,sequence,root,v)); sequence += 1; end
        end
        while !isempty(heap.data)
            w,serial,u,v = heap_pop!(heap); v in seen && continue
            push!(seen, v); push!(chosen, (w,u,v)); total += w
            for (x,cost) in graph[v]
                if !(x in seen); heap_push!(heap, (cost,sequence,v,x)); sequence += 1; end
            end
        end
    end
    return (chosen, total, components)
end
```

:::

::::

The listing includes its heap and counter imports. Input adjacency lists must represent an undirected graph with reciprocal edges of equal weights. The function leaves them unchanged and returns chosen edges, their total and the component count.

(prim-invariant-trace)=
## The next valid pop is a light crossing edge

Every candidate originates at an already reached vertex. New edges are offered when their source joins. Some later become internal edges because their destination is reached another way. Skipping those preserves a cheapest valid edge across the current cut, and the cut argument makes that choice safe.

![Prim's accepted edges A-C, C-B, B-D, D-E and E-F grow the shared tree with total weight 13; obsolete candidates do not count as accepted edges.](../../assets/graph-algorithms/prim-trace.svg)

From A, the accepted weights are **2, 1, 5, 2, 3**, totalling 13. They need not be nondecreasing: reaching a new vertex can reveal a cheaper edge. The orientation C–B in the output denotes the same undirected edge as B–C.

(prim-forest-cost)=
## Restarts cover disconnected inputs

When the heap empties, that connected component is finished. The outer loop starts another tree at any unseen vertex. An isolated vertex increases the component count without adding an edge. An empty graph returns `([], 0, 0)`.

Each undirected edge is offered at most once from its earlier reached endpoint, so there are $O(m)$ candidate entries and pops. Including outer-loop work gives $O(n+m\log(m+2))$ time and $O(n+m)$ auxiliary storage, with expected dictionary/set costs and constant-time weight arithmetic. Lazy candidate storage may be linear in the number of edges, not just vertices.

## Implementation choices and space

The shown Prim uses edge candidates, rather than an indexed heap of the best attachment per outside vertex. Candidates whose destination has already joined become stale. A different implementation can maintain one key per vertex but must implement key decreases and index updates; its storage claims cannot be transferred to this edge-heap code.

The accepted-edge output uses O(n+1) space; seen vertices use O(n+1), and pending edge records can use O(m+1) workspace. The resulting O(n+m+1) additional bound includes both working state and output. Heap work is O(m log(m+2)); outer-loop work adds O(n+1), under the standard hashing/arithmetic assumptions.

Use Prim when reciprocal neighbour access is convenient. The next edge can be cheaper than the previously selected one because reaching a vertex exposes new candidates. This differs from globally sorted Kruskal and from cumulative route-distance ordering in Dijkstra.

:::{tip} Common misconception
**Prim chooses the cheapest complete route from the first vertex.** Its priority is one crossing edge's weight, not a route sum.
:::

(prim-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. The shared accepted weights begin 2 then 1. Does that violate Prim's rule?**

:::{dropdown} Show explanation
No. Reaching C exposes C–B of weight 1. Each step chooses a cheapest currently crossing edge, not a globally nondecreasing sequence.
:::

**2. What does a graph containing only three isolated keys return?**

:::{dropdown} Show explanation
([], 0, 3). All vertices are included through three singleton components, with no selected edges.
:::

Next: [Kruskal](kruskal.md), after the [union–find implementation](../union-find/union-compression.md).
