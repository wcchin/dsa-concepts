# A planner asks for the cheapest connecting network

(transport-construction-objective)=
## Change the objective and choose the matching weight

Suppose the candidate links have not yet been built. The planner wants a connected network at minimum total **construction units**, without a travel-time requirement or redundancy constraint. With an undirected model, this is a minimum-spanning-tree question inside each candidate-connected component.

Because G has no candidate link, no spanning tree can connect all seven places. An algorithm can construct a [minimum spanning forest](../graph-algorithms/spanning-trees.md), but it cannot invent a missing harbour connection.

```python
construction_edges = [(cost, u, v) for u, v, minutes, cost in links]
chosen_build, build_total, build_components = kruskal_forest(
    places, construction_edges
)
prim_chosen, prim_total, prim_components = prim_forest(build_graph)
```

(transport-mst-result)=
## Verify both the total and the retained coverage

Kruskal accepts **CD(1), BC(2), DF(2), AB(3), EF(3)**. They form a tree covering A–F with construction total **11**. G remains a singleton tree, so the result has two components and 7−2=5 selected edges. Prim agrees on the total and component count; its accepted order and edge orientation need not match Kruskal's list.

![The five selected links CD BC DF AB EF cost eleven construction units; the harbour remains isolated.](../../assets/applications/transport-mst.svg)

The cut/exchange argument justifies accepting these light edges without sacrificing an optimum completion. By contrast, taking every input-order edge that initially merges components would select AB, AC, BD, CE and DF, costing **22** units. Avoiding cycles alone does not establish minimum cost; Kruskal's increasing-weight scan matters.

(transport-design-route-tradeoff)=
## A cheap network can make travel slower

```python
chosen_pairs = {frozenset((u, v)) for cost, u, v in chosen_build}
built_links = [row for row in links
               if frozenset((row[0], row[1])) in chosen_pairs]
built_time_graph = adjacency_view(places, built_links, 2)
built_distance, built_parent = dijkstra(built_time_graph, "A")
built_route = weighted_path_to("A", "F", built_distance, built_parent)
```

On this constructed tree, A-to-F follows **A–B–C–D–F**, taking **31 minutes**: 12+2+9+8. The full candidate network offered 13 minutes. Minimising edge construction cost did not preserve fastest routes; the chosen tree also has no backup route if an edge fails.

**Think first:** is adding one more candidate link always wrong after finding an MST? **Reasoning:** it increases construction cost, but may serve a different objective such as shorter trips or resilience. The MST solves the stated single objective, not every planning concern.

Next: [Compare decisions and model limits](transport-decisions.md).
