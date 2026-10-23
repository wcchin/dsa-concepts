# Sequences: positions are part of the contract

**After this page, you should be able to:**

- Distinguish access, replacement, insertion and removal by position.
- Connect a strict sequence interface to array and linked representations.

**Builds on:** [ADTs and contracts](adts-and-contracts.md) separates required behaviour from storage choices.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/linear-structures.js) · [Julia](../../examples/languages/linear-structures.jl).

Julia uses one-based positions and named functions such as enqueue! rather than Python-style instance methods. Endpoint adapters use the supplied linked DequeBuffer, so they do not hide linear array-front shifts. Empty operations reject the request; null/nothing remain valid payloads.

(sequence-operation-contract)=
## Purpose and operation contracts

A **sequence** keeps records in a linear order, including repeated values. Its positions are numbered 0 through n−1. Unlike a stack or queue, its interface permits choosing a position instead of only the next endpoint item.

| Operation | Returned result | Effect and valid request |
|---|---|---|
| `get(i)` | Item at i | Observe; require 0≤i<n |
| `set(i, x)` | `None` | Replace item at i; length unchanged; require 0≤i<n |
| `insert(i, x)` | `None` | Add x before the old item at i; permit 0≤i≤n |
| `append(x)` | `None` | Add x at position n |
| `remove_at(i)` | Removed item | Close the gap and reduce length; require 0≤i<n |
| `size()` / `len(s)` | n | Observe number of items |
| `is_empty()` | Boolean | Observe whether n=0 |

This teaching contract rejects negative and out-of-range indices with `IndexError`, and non-`int` indices, including Boolean values, with `TypeError`. Validation happens before mutation. These rules deliberately differ from Python's negative indexing and its clamping of `list.insert` positions. An empty sequence permits `insert(0,x)` and `append(x)`, but has no valid item to get, set or remove.

Removal here selects a **position**, not the first equal value: Python's `list.remove(x)` has a different contract. Membership, search and iteration can be added, but they should have their own stated behaviour and costs.

## Representation and invariant

Our `ArraySequence` wraps a Python list. Its invariant is that `_items` holds exactly the logical records in order, and its length equals the logical size. No separate size field needs synchronising. A linked sequence can satisfy the same positional contract by traversing links to find an index.

## Trace an edit before reading the code

| Operation | Return | Sequence afterwards |
|---|---|---|
| Start | — | A, B, C, D |
| `get(1)` | B | A, B, C, D |
| `set(1, "X")` | `None` | A, X, C, D |
| `insert(1, "Y")` | `None` | A, Y, X, C, D |
| `remove_at(2)` | X | A, Y, C, D |

Replacement preserves positions. Insertion shifts the old item at i and later records right; removal shifts later records left. The [array diagrams](arrays.md#array-insertion) show these movements explicitly.

(array-sequence-code)=
## Python implementation

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class ArraySequence:
    def __init__(self, values=()):
        self._items = list(values)

    def __len__(self):
        return len(self._items)

    def size(self):
        return len(self)

    def is_empty(self):
        return len(self) == 0

    def _check_index(self, i, allow_end=False):
        if type(i) is not int:
            raise TypeError("index must be an integer")
        upper = len(self) if allow_end else len(self) - 1
        if not 0 <= i <= upper:
            raise IndexError("index out of range")

    def get(self, i):
        self._check_index(i)
        return self._items[i]

    def set(self, i, item):
        self._check_index(i)
        self._items[i] = item

    def insert(self, i, item):
        self._check_index(i, allow_end=True)
        self._items.insert(i, item)

    def append(self, item):
        self._items.append(item)

    def remove_at(self, i):
        self._check_index(i)
        return self._items.pop(i)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class ArraySequence {
    constructor(values = []) { this._items = [...values]; }
    size() { return this._items.length; }
    is_empty() { return this.size() === 0; }
    _check_index(i, allow_end = false) {
        if (!Number.isInteger(i)) throw new TypeError("integer index required");
        if (i < 0 || i > this.size() - (allow_end ? 0 : 1)) throw new RangeError("index out of range");
    }
    get(i) { this._check_index(i); return this._items[i]; }
    set(i, item) { this._check_index(i); this._items[i] = item; }
    insert(i, item) { this._check_index(i, true); this._items.splice(i, 0, item); }
    append(item) { this._items.push(item); }
    remove_at(i) { this._check_index(i); return this._items.splice(i, 1)[0]; }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct ArraySequence
    items::Vector{Any}
end
ArraySequence(values=()) = ArraySequence(Any[values...])
Base.length(s::ArraySequence) = length(s.items)
Base.isempty(s::ArraySequence) = isempty(s.items)
function check_index(s::ArraySequence, i, allow_end=false)
    i isa Int || throw(ArgumentError("integer index required"))
    1 <= i <= length(s) + (allow_end ? 1 : 0) || throw(BoundsError(s.items, i))
end
function get_at(s::ArraySequence, i)
    check_index(s, i); return s.items[i]
end
function set_at!(s::ArraySequence, i, item)
    check_index(s, i); s.items[i] = item; return nothing
end
function insert_at!(s::ArraySequence, i, item)
    check_index(s, i, true); insert!(s.items, i, item); return nothing
end
append_item!(s::ArraySequence, item) = (push!(s.items, item); nothing)
function remove_at!(s::ArraySequence, i)
    check_index(s, i); item = s.items[i]; deleteat!(s.items, i); return item
end
```

:::

::::

The constructor makes a shallow list copy: payload objects remain shared. `None` and duplicate values are valid records. The wrapper restricts how clients address positions; it does not implement Python's storage allocator itself.

## Implementation choices and correctness

Checking indices before delegation enforces our contract instead of inheriting all Python-list policies. Indexed assignment changes exactly one record. The list insertion/removal algorithms preserve the relative order of every surviving record, establishing the postconditions in the table. Clients should not bypass the interface to edit `_items`.

(sequence-operation-costs)=
## Time and space costs

With n live records and constant-time reference operations:

| Operation | Array-backed version here | Singly linked alternative |
|---|---|---|
| Get or set a valid position | O(1) | O(i+1), worst O(n) |
| Insert at i | O(n−i+1) shifts without growth; O(n+1) if resized | O(i+1) to locate/update; O(1) at head |
| Append | O(1) amortised; O(n+1) individual growth | O(1) with a maintained tail; O(n+1) without |
| Remove at i | O(n−i) without shrinking; O(n+1) if resized | O(i+1) to locate/update; O(1) at head |
| Size / empty | O(1) | O(1) with maintained size metadata |

The array-backed collection uses O(n+1) storage under geometric capacity management; linked nodes use O(n+1) with per-record links. Ordinary reads/updates need O(1) extra working storage; array resizing can temporarily need O(n+1). Constructing from n supplied items takes O(n+1) time and reference storage. Returning a removed record does not copy its payload.

## When to use it

Choose a positional sequence for editing a route or accessing records by index. If the application only needs newest-first or oldest-first removal, a restricted stack or queue interface expresses that policy more clearly.

:::{tip} Common misconception
**Replacing an item and inserting an item are interchangeable.** Replacement keeps the length; insertion increases it and changes later positions.
:::

(linear-sequence-checks)=
## Check your understanding

**1. Starting empty, which is valid: `insert(0,"A")` or `set(0,"A")`?**

:::{dropdown} Show explanation
Only insertion. Position 0 is the permitted insertion boundary, but no existing item can be replaced.
:::

**2. Does O(1) linked insertion after a known node imply O(1) `insert(i,x)` for any index?**

:::{dropdown} Show explanation
No. The positional interface must first locate the predecessor, which can require traversal. A known-node operation has different information available.
:::

Next: [Stacks](stacks.md).
