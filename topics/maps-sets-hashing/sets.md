# Sets: membership and distinctness

A **Set** stores distinct elements and answers membership questions. Unlike a [Map](maps.md), it does not associate a separate value with each element. Adding an equal element again leaves the size unchanged.

## Set operations and membership

```python
visited = set()             # {} would create an empty dictionary
visited.add("S01")
visited.add("S02")
visited.add("S01")          # already present
present = "S02" in visited  # True
count = len(visited)        # 2
visited.discard("S03")      # absent: no change
```

Python also provides `remove`, which raises `KeyError` if the element is absent. The choice between `remove` and `discard` expresses how the client wants to handle absence.

The Set contains S01 and S02. Do not interpret its printed arrangement as an insertion or sorted-order guarantee. Sorting the elements for display creates a separate ordered result.

## Membership does not preserve frequency

Suppose the observations are S01, S02, S01. A Set records two distinct stations but loses the fact that S01 appeared twice. Use a Map from station to count when frequency matters:

```python
observations = ["S01", "S02", "S01"]
counts = {}
for station in observations:
    counts[station] = counts.get(station, 0) + 1
```

The resulting associations are S01 → 2 and S02 → 1. This illustrates a question to ask before choosing a collection: do we need distinctness, frequency, order, or associated records?

## Union, intersection and difference

For sets A and B, the union contains elements in either, the intersection contains elements in both, and the difference A − B contains elements in A but not B. Python spells these operations `A | B`, `A & B`, and `A - B`.

A Set ADT can be implemented in several ways. Python’s hash-based `set` requires hashable elements. A general Set concept does not by itself impose that implementation requirement. Continue with [hashability and equality](hashing.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
