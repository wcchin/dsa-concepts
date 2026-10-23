"""Original fictional transport case for DSA Concepts, Topic 16.

Run: python transport_network.py
Python standard library only. Reused algorithm definitions match Topics 11, 12
and 13; case calculations match the Topic 16 listings. This is a teaching model,
not a real transport service or a timetable-aware route planner.
"""

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

from math import inf

def weighted_path_to(source, target, distance, parent):
    if distance[target] == inf:
        return None
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = parent[current]
    path.reverse()
    return path

from heapq import heappush, heappop

from itertools import count

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

class DisjointSet:
    def __init__(self, n):
        if type(n) is not int or n < 0:
            raise ValueError("n must be a nonnegative integer")
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def _check(self, x):
        if type(x) is not int or not 0 <= x < len(self.parent):
            raise IndexError("member index out of range")

    def find(self, x):
        self._check(x)
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != x:
            next_x = self.parent[x]
            self.parent[x] = root
            x = next_x
        return root

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)

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

places = {
    "A": "Gate", "B": "Museum", "C": "Library",
    "D": "Market", "E": "Clinic", "F": "Park", "G": "Harbour",
}

links = [
    ("A", "B", 12, 3), ("A", "C", 3, 6),
    ("B", "C", 2, 2), ("B", "D", 3, 4),
    ("C", "D", 9, 1), ("C", "E", 12, 7),
    ("D", "E", 3, 5), ("D", "F", 8, 2),
    ("E", "F", 2, 3),
]

def adjacency_view(places, links, weight_column=None):
    if weight_column not in (None, 2, 3):
        raise ValueError("choose unweighted, travel time or construction cost")
    graph = {place: [] for place in places}
    for row in links:
        u, v = row[:2]
        if weight_column is None:
            graph[u].append(v)
            graph[v].append(u)
        else:
            weight = row[weight_column]
            graph[u].append((v, weight))
            graph[v].append((u, weight))
    return graph

hop_graph = adjacency_view(places, links)

time_graph = adjacency_view(places, links, 2)

build_graph = adjacency_view(places, links, 3)

def route_total(route, links, weight_column):
    if weight_column not in (2, 3):
        raise ValueError("choose travel time or construction cost")
    if route is None:
        return None
    weights = {frozenset((row[0], row[1])): row[weight_column]
               for row in links}
    return sum(weights[frozenset((u, v))]
               for u, v in zip(route, route[1:]))

order, hop_parent, hop_distance = bfs(hop_graph, "A")

fewest_route = path_to(hop_parent, "F")

fewest_minutes = route_total(fewest_route, links, 2)

time_distance, time_parent = dijkstra(time_graph, "A")

fastest_route = weighted_path_to("A", "F", time_distance, time_parent)

fastest_minutes = route_total(fastest_route, links, 2)

place_index = {place: i for i, place in enumerate(places)}

sets = DisjointSet(len(places))

opening_log = []

for u, v, minutes, build_units in links:
    merged = sets.union(place_index[u], place_index[v])
    opening_log.append((u, v, merged, sets.components))

construction_edges = [(cost, u, v) for u, v, minutes, cost in links]

chosen_build, build_total, build_components = kruskal_forest(
    places, construction_edges
)

prim_chosen, prim_total, prim_components = prim_forest(build_graph)

chosen_pairs = {frozenset((u, v)) for cost, u, v in chosen_build}

built_links = [row for row in links
               if frozenset((row[0], row[1])) in chosen_pairs]

built_time_graph = adjacency_view(places, built_links, 2)

built_distance, built_parent = dijkstra(built_time_graph, "A")

built_route = weighted_path_to("A", "F", built_distance, built_parent)

if __name__ == "__main__":
    print("Fewest links:", fewest_route, "minutes:", fewest_minutes)
    print("Least time:", fastest_route, "minutes:", fastest_minutes)
    print("Final components:", sets.components)
    print("Construction forest:", chosen_build)
    print("Construction units:", build_total, "components:", build_components)
    print("Prim agreement:", prim_total, prim_components)
    print("Route after construction:", built_route, "minutes:", built_distance["F"])
    print("Harbour reachable from A:", time_distance["G"] != inf)
