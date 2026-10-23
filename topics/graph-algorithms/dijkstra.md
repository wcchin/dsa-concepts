# Dijkstra's algorithm and lazy heap entries

**After this page, you should be able to:**

- Explain nonnegative-weight settlement and identify obsolete heap entries.
- Connect the lazy implementation to its result contract, tie policy and costs.

**Builds on:** [Relaxation](shortest-path-state.md) and [stable heap records](../heaps/heap-applications.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/graph-algorithms.js) · [Julia](../../examples/languages/graph-algorithms.jl).

These versions reuse the translated deque, heap and disjoint-set definitions. Julia Dict order can select a different valid topological order or tied forest; compare the objective, feasibility and optimum cost rather than requiring an identical printed edge order. Heap counters avoid comparing payloads.

(dijkstra)=
## Settle the smallest current tentative distance

Under **nonnegative** edge weights, the smallest current tentative distance can be finalised. Any competing route through an unsettled vertex would reach that vertex at a cost at least as large, then add only nonnegative edges. It cannot lead back to a smaller answer for the selected vertex.

That is a greedy correctness argument, not just a statement that a heap is fast. Marking a vertex final when first inserted is wrong: B in the shared graph improves from 4 to 3 after its first insertion.

(dijkstra-contract)=
## Specify weights, errors and tied results

`dijkstra(graph, source)` returns all-vertex `(distance, parent)` dictionaries under the [shortest-path contract](shortest-path-state.md#shortest-path-contract). It rejects a missing source with `KeyError` and any negative edge anywhere with `ValueError`, including an unreachable negative edge. Zero weights are allowed; finite numeric weights and valid destination keys are preconditions. An empty graph has no valid source.

The input remains unchanged. Strict relaxations retain the first equal-cost route already found; the counter resolves heap ties in candidate insertion order without comparing labels. The function computes distances for every source-reachable vertex and does not stop at one target.

(lazy-dijkstra-code)=
## Insert improved candidates and skip obsolete ones

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
from heapq import heappush, heappop
from itertools import count
from math import inf

def dijkstra(graph, source):
    if source not in graph:
        raise KeyError(source)
    if any(w < 0 for edges in graph.values() for _, w in edges):
        raise ValueError("Dijkstra requires nonnegative weights")
    distance = {v: inf for v in graph}
    parent = {v: None for v in graph}
    distance[source] = 0
    sequence = count()
    heap = [(0, next(sequence), source)]
    while heap:
        cost, _, u = heappop(heap)
        if cost != distance[u]:
            continue
        for v, w in graph[u]:
            candidate = cost + w
            if candidate < distance[v]:
                distance[v] = candidate
                parent[v] = u
                heappush(heap, (candidate, next(sequence), v))
    return distance, parent
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function dijkstra(graph, source) {
    if (!graph.has(source)) throw new KeyError(String(source));
    for (const adjacent of graph.values()) for (const [v,w] of adjacent)
        if (w < 0) throw new RangeError("Dijkstra requires nonnegative weights");
    const distance = new Map([...graph.keys()].map(v => [v, Infinity]));
    const parent = new Map([...graph.keys()].map(v => [v, null]));
    distance.set(source, 0); let sequence = 0;
    const heap = new MinHeap(entry_less); heap.push([0, sequence++, source]);
    while (heap.size()) {
        const [cost, serial, u] = heap.pop();
        if (cost !== distance.get(u)) continue;
        for (const [v,w] of graph.get(u)) {
            const candidate = cost + w;
            if (candidate < distance.get(v)) {
                distance.set(v, candidate); parent.set(v, u); heap.push([candidate, sequence++, v]);
            }
        }
    }
    return [distance, parent];
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function dijkstra(graph, source)
    haskey(graph, source) || throw(KeyError(source))
    any(w < 0 for adjacent in values(graph) for (v,w) in adjacent) && throw(ArgumentError("Dijkstra requires nonnegative weights"))
    distance = Dict(v=>Inf for v in keys(graph)); parent = Dict{Any,Any}(v=>nothing for v in keys(graph))
    distance[source] = 0; sequence = 0; heap = MinHeap(entry_less)
    heap_push!(heap, (0, sequence, source)); sequence += 1
    while !isempty(heap.data)
        cost, serial, u = heap_pop!(heap)
        cost != distance[u] && continue
        for (v,w) in graph[u]
            candidate = cost + w
            if candidate < distance[v]
                distance[v] = candidate; parent[v] = u
                heap_push!(heap, (candidate, sequence, v)); sequence += 1
            end
        end
    end
    return (distance, parent)
end
```

:::

::::

The listing includes all its imports. The counter resolves equal-cost heap ties without comparing vertex objects, as in [priority-queue entries](../heaps/heap-applications.md). The code checks negativity across the whole input, including unreachable edges. Its other input preconditions include finite weights and destinations that are graph keys.

(dijkstra-stale-entries)=
## A heap pop is not always a settlement

When B improves to 3, its old entry at 4 remains in the heap. The equality test discards that entry later. Successful relaxations create new candidates rather than modifying entries already inside the heap.

![Dijkstra's distances after each valid pop reach A0 C1 B3 D4 E7 F8, while obsolete B4, D6, F9 and E10 entries are skipped.](../../assets/graph-algorithms/dijkstra-trace.svg)

The settlement order is **A, C, B, D, E, F**; G never enters the heap. Zero-weight edges are permitted. A fixed vertex's distance cannot improve after its valid pop under the preconditions, but obsolete candidates for it may still pop later.

(dijkstra-cost)=
## Lazy storage changes the space bound

Each validly reached vertex scans its outgoing list once; each successful relaxation creates an entry, at most m across m edges. The heap can contain $O(m+1)$ entries, so a push/pop costs $O(\log(m+2))$.

Including initialisation and the whole-input weight check gives $O(n+m\log(m+2))$ time and $O(n+m)$ auxiliary storage for a nonempty graph. These assume expected constant-time dictionary operations and constant-cost arithmetic. For a simple graph, the usual $O((n+m)\log(n+1))$ time bound follows. The lazy heap is not limited to one entry per vertex.

(dijkstra-negative-weights)=
## The nonnegative condition is essential

With A→B(2), A→C(5), C→B(−4), greedily declaring B final at 2 would be wrong: its optimum is 1. The function above rejects such input. For an acyclic graph with negative edges, use [DAG shortest paths](dag-shortest-paths.md). General graphs with negative edges require another algorithm and attention to negative cycles; see the book's [extension roadmap](../../coverage-review.md).

## Implementation choices and suitability

This is a **lazy candidate heap**: improvements insert new records and old records remain until popped. It deliberately does not call a decrease-key operation on the small priority-queue class. An indexed heap could keep one live record per vertex but needs an item-to-index map and index maintenance during swaps.

The shown time bound includes whole-input initialisation and negativity checking. Distance/parent results occupy O(n+1); heap records require O(m+1) working space, so total additional space is O(n+m+1). Storage is not merely O(n) because a vertex can have multiple candidates. This accounts for the implementation actually shown rather than importing an indexed-heap bound.

Use Dijkstra for nonnegative route costs on directed or reciprocal undirected weighted lists. For unweighted hops, BFS is simpler. For negative edges in a DAG, use topological relaxation. The priority is a complete route cost, unlike the individual edge weights used by Prim.

:::{tip} Common misconception
**Every heap pop finalises a new vertex.** Obsolete candidates are discarded and do not represent a new settlement.
:::

(dijkstra-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. After B improves from 4 to 3, what happens when the old B(4) candidate is popped?**

:::{dropdown} Show explanation
It fails cost == distance[B] and is skipped. It does not rescan B's outgoing edges.
:::

**2. Can an unreachable negative edge be ignored by this implementation?**

:::{dropdown} Show explanation
No. The explicit whole-input check rejects it, even though it would not affect paths from the source. This is part of the shown function's contract.
:::

Next: [Shortest paths in a DAG](dag-shortest-paths.md).
