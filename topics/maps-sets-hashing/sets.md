# Sets: membership and distinctness

**After this page, you should be able to:**

- Trace duplicate additions, membership and strict versus tolerant removal.
- Compute set combinations without confusing distinctness, frequency or order.

**Builds on:** [Maps](maps.md) associates keys with values; a set retains only membership.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/maps-sets-hashing.js) · [Julia](../../examples/languages/maps-sets-hashing.jl).

Native containers have different equality and iteration rules. JavaScript examples use primitive keys; array keys compare by identity. The low-level helpers use the supplied teaching hash: h(k)=k for integer traces. Julia helper indices are one-based; table layouts for other native hash functions need not match Python. Snapshot containers differ in type, not ownership.

A **Set** stores distinct elements and answers membership questions. Unlike a [Map](maps.md), it does not associate a separate value with each element. Adding an equal element again leaves the size unchanged.

(set-operation-contract)=
## Set ADT and operation contracts

| Operation | Returned result | State change / absence policy |
|---|---|---|
| `add(x)` | `None` | Ensure membership; an equal duplicate changes nothing |
| `contains(x)` | Boolean | Observe membership |
| `remove(x)` | `None` | Delete x; absent x raises `KeyError` |
| `discard(x)` | `None` | Delete x if present; absence is a no-op |
| `size()` / `len(s)` | Distinct-element count | Observe only |
| `is_empty()` | Boolean | Observe whether size is zero |
| `elements()` | Tuple snapshot | Observe; no insertion or sorted order promised |
| `union(other)` | New set | Elements in either; neither operand changes |
| `intersection(other)` | New set | Elements in both; neither operand changes |
| `difference(other)` | New set | Elements in this set but not other; operands unchanged |

Set removal here deletes an already-specified element and returns `None`. Unlike map removal or stack pop, it is **not** a remove-and-return operation. An arbitrary-element `pop` is possible in other interfaces but is not needed by this contract. Empty sets support additions, snapshots and combinations; strict removal of any absent element raises. `None` is a valid element.

## Representation, invariant and trace

`HashSet` wraps a Python set; each equality class is represented once. Valid inputs are hashable elements with stable, consistent equality/hash behaviour. Different hashable types can compare equal: for example, Python treats `1` and `True` as equal set keys.

Starting empty, add S01, S02, S01: all three calls return `None`, and size is two. `contains("S01")` returns True without removing anything. Removing S01 returns `None` and leaves only S02; a second strict removal raises `KeyError`. Discarding S01 instead succeeds without changing that state.

(set-interface-code)=
## Python implementation of the stated interface

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class HashSet:
    def __init__(self, elements=()):
        self._elements = set(elements)

    def __len__(self):
        return len(self._elements)

    def size(self):
        return len(self)

    def is_empty(self):
        return len(self) == 0

    def add(self, item):
        self._elements.add(item)

    def contains(self, item):
        return item in self._elements

    def remove(self, item):
        self._elements.remove(item)

    def discard(self, item):
        self._elements.discard(item)

    def elements(self):
        return tuple(self._elements)

    def union(self, other):
        return HashSet(self._elements | other._elements)

    def intersection(self, other):
        return HashSet(self._elements & other._elements)

    def difference(self, other):
        return HashSet(self._elements - other._elements)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class HashSet {
    constructor(elements = []) { this._elements = new Set(elements); }
    size() { return this._elements.size; }
    is_empty() { return this.size() === 0; }
    add(item) { this._elements.add(item); }
    contains(item) { return this._elements.has(item); }
    remove(item) { if (!this.contains(item)) throw new KeyError(String(item)); this._elements.delete(item); }
    discard(item) { this._elements.delete(item); }
    elements() { return [...this._elements]; }
    union(other) { return new HashSet([...this._elements, ...other._elements]); }
    intersection(other) { return new HashSet([...this._elements].filter(x => other.contains(x))); }
    difference(other) { return new HashSet([...this._elements].filter(x => !other.contains(x))); }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct HashSet
    elements::Set{Any}
end
HashSet(elements=()) = HashSet(Set{Any}(elements))
Base.length(s::HashSet) = length(s.elements)
Base.isempty(s::HashSet) = isempty(s.elements)
add!(s::HashSet, item) = (push!(s.elements, item); nothing)
contains_item(s::HashSet, item) = item in s.elements
function remove!(s::HashSet, item)
    item in s.elements || throw(KeyError(item))
    delete!(s.elements, item); return nothing
end
discard!(s::HashSet, item) = (delete!(s.elements, item); nothing)
element_snapshot(s::HashSet) = Tuple(s.elements)
set_union(a::HashSet, b::HashSet) = HashSet(union(a.elements, b.elements))
set_intersection(a::HashSet, b::HashSet) = HashSet(intersect(a.elements, b.elements))
set_difference(a::HashSet, b::HashSet) = HashSet(setdiff(a.elements, b.elements))
```

:::

::::

`other` must be another `HashSet`. Construction and combinations create independent membership containers, not deep copies of the elements. Subsequent additions to the result do not add records to its operands. This is an adapter, not a custom hash-table allocator.

## Implementation choices and correctness

Delegating to a set preserves distinctness; add never increases size for an equal existing element. Strict remove reports a violated presence assumption; discard supports idempotent cleanup. Choosing between them is an interface decision. The internal storage can change while these observable promises remain the same. The [hashing readings](hashing.md) explain the implementation assumptions separately.

## Set operations and membership

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
visited = set()             # {} would create an empty dictionary
visited.add("S01")
visited.add("S02")
visited.add("S01")          # already present
present = "S02" in visited  # True
count = len(visited)        # 2
visited.discard("S03")      # absent: no change
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var visited = new Set();
visited.add("S01"); visited.add("S02"); visited.add("S01");
var present = visited.has("S02"), count = visited.size;
visited.delete("S03"); // missing member: no change
```

:::

:::{tab-item} Julia
:sync: julia

```julia
visited = Set{String}()
push!(visited, "S01"); push!(visited, "S02"); push!(visited, "S01")
present = "S02" in visited; count = length(visited)
delete!(visited, "S03")
```

:::

::::

Python also provides `remove`, which raises `KeyError` if the element is absent. The choice between `remove` and `discard` expresses how the client wants to handle absence.

The Set contains S01 and S02. Do not interpret its printed arrangement as an insertion or sorted-order guarantee. Sorting the elements for display creates a separate ordered result.

## Membership does not preserve frequency

Suppose the observations are S01, S02, S01. A Set records two distinct stations but loses the fact that S01 appeared twice. Use a Map from station to count when frequency matters:

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
observations = ["S01", "S02", "S01"]
counts = {}
for station in observations:
    counts[station] = counts.get(station, 0) + 1
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var observations = ["S01", "S02", "S01"], counts = new Map();
for (const station of observations) counts.set(station, (counts.get(station) ?? 0) + 1);
```

:::

:::{tab-item} Julia
:sync: julia

```julia
observations = ["S01", "S02", "S01"]
counts = Dict{String,Int}()
for station in observations
    counts[station] = get(counts, station, 0) + 1
end
```

:::

::::

The resulting associations are S01 → 2 and S02 → 1. This illustrates a question to ask before choosing a collection: do we need distinctness, frequency, order, or associated records?

## Union, intersection and difference

For sets A and B, the union contains elements in either, the intersection contains elements in both, and the difference A − B contains elements in A but not B. Python spells these operations `A | B`, `A & B`, and `A - B`.

For A={S01,S02} and B={S02,S03}, the results are {S01,S02,S03}, {S02} and {S01}. In particular, A−B and B−A differ. The wrapper methods return new sets rather than mutating their operands.

A Set ADT can be implemented in several ways. Python’s hash-based `set` requires hashable elements. A general Set concept does not by itself impose that implementation requirement. Continue with [hashability and equality](hashing.md).

## Time, space and suitability

With suitable hash distribution and occupancy, membership/removal/discard are expected O(1), while addition is expected amortised O(1). Worst-case collisions can make them linear. Size/empty are O(1). Snapshot traversal scans storage and emits every element; allow O(n+m+1) time and O(n) result space with capacity m.

For operands with s and t elements, bounded proportional storage and constant key costs, O(s+t+1) is a safe expected upper bound for each combination here, including constructing its new wrapper. Individual library strategies can do less work, but we do not promise constant-time set algebra. Temporary and result membership storage are at most O(s+t+1); worst-case collisions can make combination time quadratic. Initial construction from q supplied elements is expected O(q+1) under those assumptions; q can exceed the number of distinct results. See [the cost qualifications](performance.md#hash-operation-costs).

Use a set for distinct visitors, duplicate detection and overlap questions. Use a map of counts when frequency matters, and a sequence when arrival order must be retained.

:::{tip} Common misconception
**Removing a set element must return that element.** Our strict remove reports success with None; the selected value was already supplied. Return behaviour belongs to the contract.
:::

(hash-sets-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. A={S01,S02}, B={S02,S03}. What is A−B, and does A change?**

:::{dropdown} Show explanation
The result is {S01}; A remains {S01,S02}. Difference here returns a new set.
:::

**2. What differs between removing an absent item and discarding it?**

:::{dropdown} Show explanation
Strict remove raises KeyError; discard is a no-op. Neither changes membership.
:::

Next: [Hashing fundamentals](hashing.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
