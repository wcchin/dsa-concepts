# Maps: keys, values and operations

**After this page, you should be able to:**

- Trace map insertion, replacement, strict lookup and removal with explicit results.
- Separate the map contract from hash-table storage and insertion-order guarantees.

**Builds on:** [ADTs and contracts](../linear-structures/adts-and-contracts.md) distinguishes behaviour, mutation and implementation.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/maps-sets-hashing.js) · [Julia](../../examples/languages/maps-sets-hashing.jl).

Native containers have different equality and iteration rules. JavaScript examples use primitive keys; array keys compare by identity. The low-level helpers use the supplied teaching hash: h(k)=k for integer traces. Julia helper indices are one-based; table layouts for other native hash functions need not match Python. Snapshot containers differ in type, not ownership.

A **Map** associates each distinct key with one value. A key identifies an entry; the value carries its associated information. Different keys may have equal values. A key may also be associated with a collection, such as a list of readings, without changing the one-key/one-value rule.

## Map ADT and operations

| Operation | Returned result | State change / absence policy |
|---|---|---|
| `put(key, value)` | `None` | Add a new key or replace its value; size grows only for a new key |
| `get(key)` | Associated value | Observe; missing key raises `KeyError` |
| `remove(key)` | Removed value | Delete the association; missing key raises `KeyError` |
| `contains_key(key)` | Boolean | Observe key membership |
| `size()` / `len(m)` | Distinct-key count | Observe only |
| `is_empty()` | Boolean | Observe whether size is zero |
| `keys()` / `items()` | Tuple snapshot of keys / key-value pairs | Observe; no order required by this ADT |

This contract's `get` is strict, unlike Python's default-returning `dict.get`. Removal returns the value because the key is already supplied. Values may be repeated, mutable or `None`; keys in the hash-backed versions must be hashable. Key operations must maintain consistent equality and hashing. Snapshot containers are new, but their payload objects are shared, not deep-copied.

The Map ADT does not specify that keys occupy any particular array position. It also does not require hashing: other implementations are possible.

## Representation, invariant and operation trace

The representation below wraps a Python dictionary. Each distinct key has exactly one associated value, and logical size equals the number of associations. Updating an equal key replaces its value rather than creating a duplicate.

| Call, starting empty | Return | Associations afterwards |
|---|---|---|
| `put("S01", "Central")` | `None` | S01 → Central |
| `put("S02", None)` | `None` | S01 → Central; S02 → None |
| `put("S01", "Downtown")` | `None` | S01 → Downtown; S02 → None |
| `get("S02")` | `None` | Unchanged; S02 is present |
| `remove("S01")` | Downtown | S02 → None |

(map-interface-code)=
## Python implementation of the stated interface

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class HashMap:
    def __init__(self):
        self._entries = {}

    def __len__(self):
        return len(self._entries)

    def size(self):
        return len(self)

    def is_empty(self):
        return len(self) == 0

    def put(self, key, value):
        self._entries[key] = value

    def get(self, key):
        return self._entries[key]

    def remove(self, key):
        return self._entries.pop(key)

    def contains_key(self, key):
        return key in self._entries

    def keys(self):
        return tuple(self._entries)

    def items(self):
        return tuple(self._entries.items())
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class HashMap {
    constructor() { this._entries = new Map(); }
    size() { return this._entries.size; }
    is_empty() { return this.size() === 0; }
    put(key, value) { this._entries.set(key, value); }
    get(key) { if (!this.contains_key(key)) throw new KeyError(String(key)); return this._entries.get(key); }
    remove(key) { const value = this.get(key); this._entries.delete(key); return value; }
    contains_key(key) { return this._entries.has(key); }
    keys() { return [...this._entries.keys()]; }
    items() { return [...this._entries]; }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct HashMap
    entries::Dict{Any,Any}
end
HashMap() = HashMap(Dict{Any,Any}())
Base.length(m::HashMap) = length(m.entries)
Base.isempty(m::HashMap) = isempty(m.entries)
put!(m::HashMap, key, value) = (m.entries[key] = value; nothing)
get_value(m::HashMap, key) = m.entries[key]
remove!(m::HashMap, key) = pop!(m.entries, key)
contains_key(m::HashMap, key) = haskey(m.entries, key)
key_snapshot(m::HashMap) = Tuple(keys(m.entries))
item_snapshot(m::HashMap) = Tuple(pairs(m.entries))
```

:::

::::

## Implementation choices and correctness

The wrapper delegates hashing, collision handling and resizing to `dict`. Assignment preserves one association per key; indexing observes it; `pop` removes and returns its value. Failed strict lookup/removal leaves the associations unchanged. Clients use these methods rather than modifying `_entries` directly.

The [chaining](chaining.md) and [probing](open-addressing.md) readings expose storage mechanics explicitly. Their `put_*` helpers return a Boolean indicating a new key, useful for updating size metadata; that is an **internal helper result**, not this public `put` contract. A tree-based map can offer the same exact-key behaviour with different cost and ordering properties.

## Map operations in Python

Python’s `dict` supplies Map behaviour, although the operation names differ from our abstract contract.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
directory = {"S01": "Central", "S02": "Museum"}
directory["S03"] = "Harbour"     # insert a new key
directory["S01"] = "Downtown"    # replace an existing value
name = directory["S02"]          # retrieve: "Museum"
del directory["S03"]             # remove one association
present = "S04" in directory     # False: membership checks keys
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var directory = new Map([["S01", "Central"], ["S02", "Museum"]]);
directory.set("S03", "Harbour"); directory.set("S01", "Downtown");
var name = directory.get("S02"); directory.delete("S03");
var present = directory.has("S04");
```

:::

:::{tab-item} Julia
:sync: julia

```julia
directory = Dict("S01"=>"Central", "S02"=>"Museum")
directory["S03"] = "Harbour"; directory["S01"] = "Downtown"
name = directory["S02"]; delete!(directory, "S03")
present = haskey(directory, "S04")
```

:::

::::

The final directory has two keys. Updating S01 changes its associated name; it does not add a second S01 entry. In contrast, `"Museum" in directory` tests whether that string is a **key**, not whether it occurs among the values. Use `directory.values()` when the question concerns values.

## Missing keys and `None` values

`directory[key]` raises `KeyError` when the key is absent. `directory.get(key)` returns `None` by default, but `None` may itself be a legitimate stored value. If the distinction matters, test membership or supply a unique sentinel:

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
missing = object()
result = directory.get("S04", missing)
if result is missing:
    print("No such station")
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var missing = Symbol("missing");
var result = directory.has("S04") ? directory.get("S04") : missing;
if (result === missing) console.log("No such station");
```

:::

:::{tab-item} Julia
:sync: julia

```julia
missing_key = Ref(nothing) # unique sentinel, not Julia's missing value
result = get(directory, "S04", missing_key)
result === missing_key && println("No such station")
```

:::

::::

The sentinel is compared by identity because it represents one particular marker object.

## Dictionary insertion order

Python dictionaries preserve insertion order. That is a property of Python’s dictionary, not a requirement of every Map, and it is not sorted-key order. Replacing a value does not make the key numerically or alphabetically sorted.

If you only need to know which identifiers occur, read [Sets](sets.md). To see how a key can guide retrieval, continue to [Hashing](hashing.md).

## Time, space and suitability

Under suitable distribution, controlled occupancy and constant-cost hashing/equality, hash-map get, membership and removal are expected O(1), and insertion is expected amortised O(1). Worst-case collisions can make an operation linear; a resize also makes an individual update expensive. Size/empty are O(1). Snapshots visit storage and return n records: for table capacity m, allow O(n+m+1) scan time and O(n) result storage rather than assuming every table is dense.

Persistent hash-table storage is O(n+m+1); ordinary exact-key operations use O(1) working space, while a rebuild can need linear additional storage. The dictionary adapter does not expose its capacity or implement its own resize policy. See [the qualified operation comparison](performance.md#hash-operation-costs).

Use a map for station directories, counts and associated records. Insertion order is not sorted-key order and does not supply range queries.

:::{tip} Common misconception
**A None lookup result proves absence.** None may be stored; strict get raises on absence, while a default-returning API needs membership or a sentinel.
:::

(hash-maps-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. Put S01 twice with different values. What is the size and which value is retrieved?**

:::{dropdown} Show explanation
Size is one; the most recent value replaces the earlier association.
:::

**2. After put("S02", None), does remove("S02") return an error?**

:::{dropdown} Show explanation
No. It returns the stored None and removes the key. Removing it again raises KeyError.
:::

Next: [Sets](sets.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
