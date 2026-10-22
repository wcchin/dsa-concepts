# Compare the answers before making a decision

(transport-objective-comparison)=
## One candidate network supports several questions

| Question | Representation and algorithm | Answer in this example |
|---|---|---|
| Fewest links from A to F | Unweighted adjacency, BFS/deque | A–B–D–F; 3 links, 23 minutes |
| Least supplied travel time from A to F | Time-weighted adjacency, Dijkstra/heap | A–C–B–D–E–F; 5 links, 13 minutes |
| Which places are connected as links open? | Identifier map, union–find | Two final components; G remains separate |
| Cheapest network within each available component | Construction weights, Kruskal/union–find or Prim/heap | Five links, 11 construction units, two components |
| Least travel time after building that forest | Time weights on the selected edges, Dijkstra | A–B–C–D–F; 4 links, 31 minutes |

Each answer is correct for its own contract. A heap alone does not identify what is being optimised: Dijkstra stores cumulative travel time, while Prim stores one connection's construction cost. A parent reference alone does not tell us whether it denotes an actual route edge or partition bookkeeping.

(transport-end-to-end-costs)=
## Include preparation, queries and outputs

Let n count declared places and m count undirected candidate links. Under the book's expected constant-time dictionary/set model and fixed-cost arithmetic:

| Stage | Work and storage to account for |
|---|---|
| Build adjacency views | Each takes O(n+m) time and storage; keeping all three adds a constant factor |
| Run BFS | O(n+m) time upper bound, O(n) auxiliary state; this implementation stores reached vertices |
| Run lazy Dijkstra | O(n+m log(m+2)) time, O(n+m) auxiliary state including lazy candidates |
| Process incremental connectivity | O(n+m α(n)) total for n≥2, including initialisation; O(n) disjoint-set state |
| Keep the opening log | An additional O(m) records, beyond the disjoint-set structure |
| Run Kruskal | O(n+m log(m+1)) usual time bound, O(n+m) extra storage including sorted edges |
| Recover one k-edge route | O(k+1) time and output |

The simple `route_total` helper rebuilds an O(m) edge-weight map on each call, then scans the route: O(m+k+1) time and O(m+1) working storage, with endpoint-pair hashing constant here. For repeated measurements, prepare that map once. Comparing algorithm costs without accounting for adapters and output would hide part of the actual program.

(transport-model-revisions)=
## Change the state when the question changes

| New requirement | What must be reconsidered |
|---|---|
| One-way links | Use directed adjacency; ordinary union–find no longer answers directed reachability |
| Fewest service transfers | Represent service/boarding state, not only place vertices |
| Timetables or congestion | Replace fixed additive times with an appropriate time-dependent model |
| An alternative when a link fails | Model redundancy explicitly; an MST has no cycles |
| Harbour service | Add justified candidate links or report infeasibility; do not silently omit G |
| Nearest facility | Add coordinates, a distance model and a spatial-search method; hop count is not geometric distance |

These are model changes, not parameter adjustments that the current algorithms can automatically interpret. More sophisticated constraints may require different algorithms altogether.

(transport-independent-checks)=
## Use a small instance to check the whole reasoning chain

Check that every candidate endpoint exists, each undirected adjacency entry has a reciprocal counterpart, recovered route edges exist, and route totals use the intended column. Compare BFS with an enumeration of short paths, Dijkstra with a small independent path search, and the chosen forest with all candidate spanning subsets. Small reference methods are useful even when they would not scale to a real network.

The standalone example exposes the same data and computations as these pages. No plotting or third-party package is required to run it. The figures are exact traces of this invented dataset, not screenshots of a routing service.

Further integrated cases could study dependency scheduling or a spatial directory. Return to the [application overview](applications.md), [reading guide](../../reading-guide.md) or [concept index](../../concepts.md).
