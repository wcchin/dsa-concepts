# One ordered-set contract, two tree implementations

**After this page, you should be able to:**

- Specify ordered-set operations independently of BST or AVL balancing.
- Distinguish public results, node-returning queries and root-returning update helpers.

**Builds on:** [BST lookup/insertion](bst-lookup-insertion.md), [ordered queries](bst-traversal.md), [ranges](bst-range-queries.md) and [deletion](bst-deletion.md) supply the functions used below.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/searching.js) · [Julia](../../examples/languages/searching.jl).

Python and JavaScript positions are zero-based; Julia vector positions and insertion boundaries are one-based. A missing lookup is None/null/nothing, while a boundary query can return the one-past-end position. Julia public ordered-set operations use functions such as add!, ordered_keys and range_keys.

(ordered-set-contract)=
## Purpose and operation contracts

An **ordered set** retains distinct keys and supports queries by their ordering as well as equality. BST and AVL trees can implement this same ADT. These chapters store keys only; adding associated values would require a map contract and corresponding node fields.

| Public operation | Returned result | State change / exceptional policy |
|---|---|---|
| `add(key)` | `None` | Insert if absent; equal duplicates change nothing |
| `contains(key)` | Boolean | Observe membership |
| `remove(key)` | `None` | Delete key; absence raises `KeyError` |
| `discard(key)` | `None` | Delete if present; absence is a no-op |
| `minimum()` / `maximum()` | Extreme key | Observe; empty set raises `KeyError` |
| `successor(key)` / `predecessor(key)` | Smallest stored key strictly greater / largest strictly smaller | Observe; no such key raises `KeyError`; query need not be stored |
| `extract_min()` / `extract_max()` | Removed extreme key | Remove and return it; empty set raises `KeyError` |
| `keys()` | New ascending list | Snapshot of all keys; empty gives `[]` |
| `range_keys(low, high)` | New ascending list | Closed interval; invalid low>high raises `ValueError` |
| `size()` / `len(s)`; `is_empty()` | Count; Boolean | Observe only |

Keys and queries must share a stable, consistent total order: equality must agree with the less/greater comparisons. Hashability is unnecessary. Do not change a stored key in a way that changes its order. No insertion-order or node-identity guarantee is part of this public contract.

Set `remove` deletes an already specified key and returns `None`, as in [Topic 6](../maps-sets-hashing/sets.md). Extraction chooses an extreme and returns that removed key. The two operations have different purposes.

## Representation, invariant and trace

The adapter owns a private root and a cached total count. Reachable nodes hold each logical key exactly once under strict BST ordering; the count equals that node count. An AVL implementation additionally maintains correct cached heights and balance. This total count is not a subtree-size augmentation for rank/select.

| Operation | Return | Keys afterwards |
|---|---|---|
| Add 50,30,70,20,40,60,80 | Each returns `None` | 20,30,40,50,60,70,80 |
| `add(30)` | `None` | Unchanged; size seven |
| `successor(55)` | 60 | Unchanged; query 55 need not be present |
| `extract_min()` | 20 | 30,40,50,60,70,80 |
| `remove(50)` | `None` | 30,40,60,70,80 |
| `range_keys(35,70)` | `[40,60,70]` | Unchanged |

(ordered-set-adapter)=
## Python implementation

Read the preceding helper listings in one session first. Both kinds of nodes expose `key`, `left` and `right`, so the read-only helpers can work on either. The constructor receives the chosen pair of insert/delete algorithms; use a matching pair for one representation throughout its lifetime.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class OrderedSet:
    def __init__(self, insert_key, delete_key):
        self._root = None
        self._size = 0
        self._insert_key = insert_key
        self._delete_key = delete_key

    def __len__(self):
        return self._size

    def size(self):
        return len(self)

    def is_empty(self):
        return len(self) == 0

    def contains(self, key):
        return bst_search(self._root, key) is not None

    def add(self, key):
        if not self.contains(key):
            self._root = self._insert_key(self._root, key)
            self._size += 1

    def remove(self, key):
        if not self.contains(key):
            raise KeyError(key)
        self._root = self._delete_key(self._root, key)
        self._size -= 1

    def discard(self, key):
        if self.contains(key):
            self.remove(key)

    def _required_key(self, node):
        if node is None:
            raise KeyError("no key satisfies the query")
        return node.key

    def minimum(self):
        return self._required_key(bst_minimum(self._root))

    def maximum(self):
        return self._required_key(bst_maximum(self._root))

    def successor(self, key):
        return self._required_key(bst_successor(self._root, key))

    def predecessor(self, key):
        return self._required_key(bst_predecessor(self._root, key))

    def extract_min(self):
        key = self.minimum()
        self.remove(key)
        return key

    def extract_max(self):
        key = self.maximum()
        self.remove(key)
        return key

    def keys(self):
        return inorder_keys(self._root)

    def range_keys(self, low, high):
        return bst_range_keys(self._root, low, high)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class OrderedSet {
    constructor(insert_key, delete_key) {
        this._root = null; this._size = 0;
        this._insert_key = insert_key; this._delete_key = delete_key;
    }
    size() { return this._size; }
    is_empty() { return this._size === 0; }
    contains(key) { return bst_search(this._root, key) !== null; }
    add(key) {
        if (!this.contains(key)) { this._root = this._insert_key(this._root, key); this._size++; }
    }
    remove(key) {
        if (!this.contains(key)) throw new KeyError(String(key));
        this._root = this._delete_key(this._root, key); this._size--;
    }
    discard(key) { if (this.contains(key)) this.remove(key); }
    _required_key(node) { if (node === null) throw new KeyError("no matching key"); return node.key; }
    minimum() { return this._required_key(bst_minimum(this._root)); }
    maximum() { return this._required_key(bst_maximum(this._root)); }
    successor(key) { return this._required_key(bst_successor(this._root, key)); }
    predecessor(key) { return this._required_key(bst_predecessor(this._root, key)); }
    extract_min() { const key = this.minimum(); this.remove(key); return key; }
    extract_max() { const key = this.maximum(); this.remove(key); return key; }
    keys() { return inorder_keys(this._root); }
    range_keys(low, high) { return bst_range_keys(this._root, low, high); }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct OrderedSet
    root
    n::Int
    insert_key
    delete_key
end
OrderedSet(insert_key, delete_key) = OrderedSet(nothing, 0, insert_key, delete_key)
Base.length(s::OrderedSet) = s.n
Base.isempty(s::OrderedSet) = s.n == 0
contains_key(s::OrderedSet, key) = bst_search(s.root, key) !== nothing
function add!(s::OrderedSet, key)
    if !contains_key(s, key); s.root = s.insert_key(s.root, key); s.n += 1; end
    return nothing
end
function remove!(s::OrderedSet, key)
    contains_key(s, key) || throw(KeyError(key))
    s.root = s.delete_key(s.root, key); s.n -= 1; return nothing
end
discard!(s::OrderedSet, key) = (contains_key(s, key) && remove!(s, key); nothing)
function required_key(node)
    node === nothing && throw(KeyError("no matching key"))
    return node.key
end
Base.minimum(s::OrderedSet) = required_key(bst_minimum(s.root))
Base.maximum(s::OrderedSet) = required_key(bst_maximum(s.root))
successor(s::OrderedSet, key) = required_key(bst_successor(s.root, key))
predecessor(s::OrderedSet, key) = required_key(bst_predecessor(s.root, key))
function extract_min!(s::OrderedSet)
    key = minimum(s); remove!(s, key); return key
end
function extract_max!(s::OrderedSet)
    key = maximum(s); remove!(s, key); return key
end
ordered_keys(s::OrderedSet) = inorder_keys(s.root)
range_keys(s::OrderedSet, low, high) = bst_range_keys(s.root, low, high)
```

:::

::::

Create `ordinary = OrderedSet(bst_insert, bst_delete)`. After reading Topic 8, create `balanced = OrderedSet(avl_insert, avl_delete)` instead. The adapter starts empty; it does not convert an existing BST into an AVL tree.

## Implementation choices and correctness

Membership checks make the size change exactly once for a new insertion or successful removal. They add path traversals but do not change the O(h+1) update bound. `discard` deliberately favours reuse and clarity over avoiding a repeated membership check. Every update retains the returned root, so empty-tree, root-replacement and rotation cases are handled uniformly.

Queries leave links unchanged; `keys` and `range_keys` create new lists of key references, not deep copies. The public interface does not expose nodes. Bypassing it to edit `_root`, keys or metadata would invalidate these promises.

(ordered-set-costs)=
## Time, space and suitability

| Operation | Ordinary BST, height h | AVL tree |
|---|---|---|
| Contains; add/remove/discard | O(h+1) | O(log(n+2)) |
| Minimum/maximum; successor/predecessor | O(h+1) | O(log(n+2)) |
| Extract an extreme | O(h+1), including lookup and deletion | O(log(n+2)) |
| Sorted snapshot | O(n+1) time; O(n) result | Same |
| Closed range with r results | O(h+r+1) | O(log(n+2)+r) |
| Size/empty | O(1), cached count | Same |

Persistent storage is O(n+1); AVL adds one cached height per node. Iterative single-path queries use O(1) workspace. Recursive updates use O(h+1) stack space, logarithmic for AVL. Snapshot/range traversals also use O(h+1) stack plus their returned output. Empty operations take constant time, with the specified errors or empty results.

Choose this ADT for changing keys with ordered output, neighbours and ranges. A hash set is a different implementation choice for exact membership; a mostly static sorted array trades cheap indexing for shifting on ordered updates. A set of keys does not itself implement a directory's key–value association.

:::{tip} Common misconception
**A delete helper's returned root is the deleted key.** It identifies where the caller should reconnect the surviving tree. Public removal/extraction results are specified separately.
:::

(ordered-set-checks)=
## Check your understanding

**1. Does `successor(55)` require inserting 55 first in the seven-key reference set?**

:::{dropdown} Show explanation
No. It asks for the smallest stored key greater than the query, which is 60. The query itself need not be stored.
:::

**2. After `extract_min()` on a singleton set, what is returned and what remains?**

:::{dropdown} Show explanation
The sole key is returned and the set becomes empty with size zero. Calling it again raises KeyError rather than returning an ambiguous missing-key marker.
:::

Next: [Search costs and representation choices](search-costs.md).
