# A visitor asks for the fewest links

(transport-bfs-question)=
## Give every edge the same contribution

The question is: from Gate A to Park F, which route uses the fewest links? This is a hop-count objective. It could describe fewest direct connections traversed, but does not yet describe fewest vehicle transfers: the model contains no service identities.

The [BFS implementation](../graphs/breadth-first-search.md#bfs-code) stores discovered hop distances in a dictionary, waiting vertices in a deque, and one predecessor per discovered vertex. It marks at enqueue, so alternative routes do not add the same vertex repeatedly.

```python
order, hop_parent, hop_distance = bfs(hop_graph, "A")
fewest_route = path_to(hop_parent, "F")
fewest_minutes = route_total(fewest_route, links, 2)
```

(transport-bfs-result)=
## Read the route and its guarantee separately

With the declared neighbour order, `order` is `["A","B","C","D","E","F"]`. Hop distances are A:0, B:1, C:1, D:2, E:2, F:3. G is absent from the reached-distance dictionary because it is unreachable from A.

The returned route is **A–B–D–F**: three links and **23 minutes**, from 12+3+8. Another three-link route, A–C–D–F, takes 20 minutes. BFS is allowed to return the 23-minute route because its contract minimises hops, not travel time or a secondary time tie-break.

![BFS layers put A first, B and C second, D and E third, F fourth, and G outside the reached set; the selected route is A B D F.](../../assets/applications/transport-bfs.svg)

The queue processes layers in nondecreasing hop distance. Reordering neighbour lists can change a chosen route among tied hop counts; it cannot reduce the minimum count below three. Following parent links recovers one answer, not every shortest route.

(transport-bfs-boundaries)=
## Distinguish absence, a zero-length trip and a different objective

`path_to(hop_parent, "G")` returns `None`. The route to A is `["A"]`, with zero links and zero minutes. An unknown label is invalid input rather than another declared isolated place.

**Think first:** can we sort every neighbour list by travel time and then claim BFS finds the fastest route? **Reasoning:** no. Local neighbour order does not make the FIFO frontier prioritise cumulative route time. Use the next page's weighted algorithm for that objective.

Next: [Least travel time](transport-times.md).
