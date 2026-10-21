# DAGs and topological order

(directed-acyclic-graph)=
## Dependencies require direction without cycles

A **directed acyclic graph (DAG)** has no directed cycle. An edge u → v means u must precede v. A **topological order** lists every vertex exactly once with every edge pointing forward in the list. It need not be unique, and unrelated vertices need no specified relative order.

![The shared dependency graph has A and B preceding C, B preceding D, C and D preceding E, and E preceding F; G is isolated.](../../assets/graph-algorithms/dependency-dag.svg)

```python
dag = {
    "A": ["C"], "B": ["C", "D"],
    "C": ["E"], "D": ["E"],
    "E": ["F"], "F": [], "G": [],
}

def valid_topological_order(graph, order):
    if len(order) != len(graph) or set(order) != set(graph):
        return False
    position = {v: i for i, v in enumerate(order)}
    return all(position[u] < position[v]
               for u in graph for v in graph[u])
```

Length and membership checks together exclude missing vertices, duplicates and unexpected labels. As throughout this topic, every listed destination must be a graph key.

(kahn-algorithm)=
## Ready vertices have no remaining prerequisites

**Indegree** counts incoming edges. Kahn's algorithm maintains indegrees within the **unprocessed** graph, removes a zero-indegree vertex, and decreases its outgoing neighbours' counts.

```python
from collections import deque

def topological_sort(graph):
    degree = {v: 0 for v in graph}
    for u in graph:
        for v in graph[u]:
            degree[v] += 1
    ready = deque(v for v in graph if degree[v] == 0)
    order = []
    while ready:
        u = ready.popleft()
        order.append(u)
        for v in graph[u]:
            degree[v] -= 1
            if degree[v] == 0:
                ready.append(v)
    if len(order) != len(graph):
        raise ValueError("directed cycle: no complete order")
    return order
```

(kahn-invariant-trace)=
## Counts describe what remains, not original degree

At each iteration, the queue contains the unprocessed vertices whose remaining indegree is zero. Removing one is safe: all its prerequisites have already been output. Every removed edge is accounted for by exactly one decrement.

![Kahn's FIFO queue starts A B G and produces A B G C D E F as indegrees reach zero.](../../assets/graph-algorithms/kahn-trace.svg)

For the declared dictionary and neighbour order, the result is **A, B, G, C, D, E, F**. Choosing another ready vertex can give another valid order. A min-heap could choose the smallest ready label, but adds heap work; FIFO is not globally alphabetical.

(topological-cycle-detection)=
## Failure to process all vertices proves a cycle exists

Every nonempty finite DAG has a zero-indegree vertex: following incoming edges forever would otherwise revisit a vertex and form a cycle. Therefore if vertices remain but none are ready, the remainder contains a directed cycle. The empty graph correctly returns an empty order.

Unprocessed vertices are **not necessarily all on cycles**. A vertex downstream of a cycle can also remain blocked. With A → B, B → A and B → C, C is blocked but not part of the A–B cycle. The processed-count test reports existence of a cycle, not its exact members.

With adjacency lists, time is $O(n+m)$ and auxiliary storage is $O(n)$ under expected constant-time dictionary operations. Next: [Shortest-path state](shortest-path-state.md).
