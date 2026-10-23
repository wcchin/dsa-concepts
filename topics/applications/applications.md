# 16. Integrated applications: a transport network

A visitor wants to reach the park. An operator wants to know which places are connected. A planner wants to connect facilities at minimum construction cost. They can use the same candidate links, but they need different answers.

This worked example follows one small fictional network through those questions. The data are deliberately small enough to trace by hand. Place names and weights are invented; they are not observations of a real transport system.

## Reading route

1. [Model the network](transport-model.md): identify records, links, units and assumptions before choosing an algorithm.
2. [Find a route with fewest links](transport-hops.md): use a map, FIFO queue, BFS and parents.
3. [Find a route with least travel time](transport-times.md): use relaxation and a heap through Dijkstra.
4. [Maintain connectivity as links arrive](transport-connectivity.md): use union–find without confusing its parents with routes.
5. [Design a minimum-cost connecting network](transport-design.md): compare Kruskal and Prim, including an isolated place.
6. [Compare answers and revise the model](transport-decisions.md): distinguish objectives, account for preparation costs and inspect limitations.

Review [graph traversal](../graphs/graphs.md), [heaps](../heaps/heaps.md), [graph optimisation](../graph-algorithms/graph-algorithms.md) and [union–find](../union-find/union-find.md) as needed. The examples reuse those implementations and link back to their invariants.

## Consistent questions, flexible case structure

This topic integrates earlier concepts rather than introducing one new ADT. Follow **question → model → method → result → interpretation**. Each reading makes its assumptions, state or invariant, implementation choices, time/space costs and limits explicit, with two open prediction checks and collapsed explanations. A case need not force insertion, extraction or deletion headings where those operations do not answer its question.

The transport case offers six readings and twelve checks. Preserve the distinction between an optimal answer to the supplied model and a recommendation for a real network. All five figures use the same invented dataset; its isolated place is part of the problem.

## Run the listings together

[Download the standalone Python example](../../examples/transport_network.py). It includes the reused algorithms, shared data and all case-study calculations. Save the downloaded file as `transport_network.py`, then run `python transport_network.py` with Python 3; no external package, notebook or private course repository is required. To follow the page listings, keep the downloaded module in the working directory and read them in route order in one Python session.

The first integrated case is developed here. Dependency scheduling and a spatial service directory remain possible future applications, rather than completed lessons. This material is independent of course assessments.
