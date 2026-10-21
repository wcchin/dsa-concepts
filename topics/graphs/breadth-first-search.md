# Breadth-first search: layers and a FIFO frontier

(breadth-first-search)=
## Expand the earliest discovered waiting vertex

**Breadth-first search (BFS)** starts with one vertex and explores its reachable region in layers of hop distance. A FIFO queue stores the **frontier**: discovered vertices whose neighbour lists have not yet been fully examined.

A vertex is **discovered** when first encountered and recorded. It is **expanded** when removed from the queue so that its neighbours can be examined. Returning a vertex's neighbours is different from returning the vertex itself as a result.

(bfs-code)=
## Mark a vertex when it joins the queue

This code uses the adjacency-list contract from the previous page. `distance` also serves as the discovered set. Invalid start labels raise `KeyError`; isolated but valid vertices are ordinary inputs.

```python
from collections import deque

def bfs(graph, start):
    if start not in graph:
        raise KeyError(start)
    distance = {start: 0}
    parent = {start: None}
    order = []
    queue = deque([start])
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            if v not in distance:
                distance[v] = distance[u] + 1
                parent[v] = u
                queue.append(v)
    return order, parent, distance
```

(bfs-discovery-marking)=
## Discovery prevents duplicate work

Record a neighbour **before** enqueueing it. Once E is discovered from B, D must not enqueue E again. Once F is discovered from C, E must not enqueue F again. Waiting in the queue still counts as discovered; it does not mean available for rediscovery.

If marking were delayed until removal, different vertices could enqueue the same neighbour before its first expansion. That can duplicate work or overwrite parent choices. The shown invariant is simpler: each discovered vertex is queued at most once and receives one parent on first discovery.

![A BFS trace shows the queue after each expansion, distinguishing the front at the left and the newly appended vertices.](../../assets/graphs/bfs-frontier.svg)

With the stored alphabetical lists, expansion order from A is **A, B, C, D, E, F, G**. H is absent because it is unreachable from A. From H alone, the order is `[H]`, its distance is 0 and its parent is `None`.

(bfs-hop-distance)=
## Why first discovery gives shortest hop distance

The queue processes vertices in nondecreasing distance. Expanding a vertex at distance d discovers any new neighbour at d+1, after all earlier layers have already had the opportunity to discover it. A shorter path would have supplied a predecessor in an earlier layer, so an undiscovered neighbour cannot require fewer hops than its assigned distance.

![The BFS parent tree groups A, then B and C, then D E F, then G into distance layers zero through three. Non-tree graph edges remain visible as dashed connections.](../../assets/graphs/bfs-parent-tree.svg)

The distances are A:0; B,C:1; D,E,F:2; G:3. This is a **shortest-hop** guarantee for unweighted graphs, or equal positive edge costs. It does not minimise arbitrary unequal weights.

(bfs-parent-path)=
## Parents recover one route

```python
def path_to(parent, target):
    if target not in parent:
        return None
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = parent[current]
    path.reverse()
    return path
```

Here parent dictionaries come from a traversal and vertex labels are non-`None` strings. `None` marks the start's missing parent. Following G's parents backwards gives G, F, C, A; reversing yields **A, C, F, G**. A path to the start is `[A]`; an unreachable H returns `None`.

Parents form a tree of first discoveries, not a copy of all graph edges. If several shortest paths exist, neighbour order can select a different parent without changing the shortest distance. Recovering a path of length k takes $O(k+1)$ time and output space. Next: [DFS](depth-first-search.md).
