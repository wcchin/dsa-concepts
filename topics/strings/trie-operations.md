# Maintaining a trie string set

**After this page, you should be able to:**

- Specify insertion, complete lookup, path queries, deletion and size/empty observers.
- Trace terminal flags and safe suffix pruning without losing other keys.

**Builds on:** [TrieNode and prefix invariants](trie-representation.md), [state contracts](../foundations/adt-basics.md) and [hash-table assumptions](../maps-sets-hashing/performance.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/strings.js) · [Julia](../../examples/languages/strings.jl).

All matching positions count Unicode code points. JavaScript and Julia collect characters into arrays for constant-time access, adding O(n+m) preparation and storage to text/pattern scans; this is additional to the Python bounds. Julia results are one-based character-array positions, not byte indices into a Julia String. Rolling hashes use BigInt arithmetic explicitly; JavaScript custom base/modulus arguments are BigInts (for example 3n).

(trie-set-contract)=
## State duplicates, empty keys and return values

The following class reuses `TrieNode` from the previous page. `insert` returns whether a new key was added; `delete` returns whether a stored key was removed. Repeated insertion does not increase `size`. `contains` checks a complete key; `has_prefix` checks whether its path exists.

All query arguments must be strings. The empty prefix has a path even in an empty trie, so `has_prefix("")` returns `True`. The empty key is stored only when the root is terminal. Clients should use these operations rather than editing nodes or `size` directly.

(trie-complete-interface)=
## Read the public string-set interface

Run the preceding [`TrieNode` definition](trie-representation.md#trie-sparse-children) before this class. The root is retained even when no keys are stored.

| Operation | Result / logical change | Missing or empty case |
|---|---|---|
| `insert(word)` | `True` for a new key; `False` for an existing key | `""` marks the root terminal; duplicates leave key count unchanged |
| `contains(word)` | Boolean complete-key membership | A path alone is insufficient |
| `has_prefix(prefix)` | Boolean path existence | `""` is always a path, even in an empty trie |
| `delete(word)` | `True` if removed; `False` if not stored | Missing keys leave state unchanged; deleting `""` clears only root terminal status |
| `len(trie)` / `trie.size` | Number of stored complete keys | Empty key, when stored, counts as one |
| `is_empty()` | Whether zero keys are stored | Existing root/path objects do not count as stored keys |

All word/prefix arguments must be strings; the class raises `TypeError` for other arguments before changing state. `insert` and `delete` deliberately report a boolean state change rather than using the `None` returns of some earlier Set adapters. Those are different documented interfaces. The `size` field is retained for existing clients; prefer `len(trie)` for observation, and do not edit this metadata or nodes directly.

(trie-set-implementation)=
## Walk, mark, and prune only unused suffixes

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.size = 0

    def __len__(self):
        return self.size

    def is_empty(self):
        return self.size == 0

    def _walk(self, text):
        if not isinstance(text, str):
            raise TypeError("expected a string")
        node = self.root
        for char in text:
            node = node.children.get(char)
            if node is None:
                return None
        return node

    def contains(self, word):
        node = self._walk(word)
        return node is not None and node.terminal

    def has_prefix(self, prefix):
        return self._walk(prefix) is not None

    def insert(self, word):
        if not isinstance(word, str):
            raise TypeError("expected a string")
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        if node.terminal:
            return False
        node.terminal = True
        self.size += 1
        return True

    def delete(self, word):
        if not isinstance(word, str):
            raise TypeError("expected a string")
        node = self.root
        path = []
        for char in word:
            child = node.children.get(char)
            if child is None:
                return False
            path.append((node, char, child))
            node = child
        if not node.terminal:
            return False
        node.terminal = False
        self.size -= 1
        for parent, char, child in reversed(path):
            if child.terminal or child.children:
                break
            del parent.children[char]
        return True
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class Trie {
    constructor() { this.root = new TrieNode(); this.size = 0; }
    is_empty() { return this.size === 0; }
    _walk(text) {
        if (typeof text !== "string") throw new TypeError("expected a string");
        let node = this.root;
        for (const char of text) { node = node.children.get(char); if (node === undefined) return null; }
        return node;
    }
    contains(word) { const node = this._walk(word); return node !== null && node.terminal; }
    has_prefix(prefix) { return this._walk(prefix) !== null; }
    insert(word) {
        if (typeof word !== "string") throw new TypeError("expected a string");
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) node.children.set(char, new TrieNode());
            node = node.children.get(char);
        }
        if (node.terminal) return false;
        node.terminal = true; this.size++; return true;
    }
    delete(word) {
        if (typeof word !== "string") throw new TypeError("expected a string");
        let node = this.root; const path = [];
        for (const char of word) {
            const child = node.children.get(char); if (child === undefined) return false;
            path.push([node,char,child]); node = child;
        }
        if (!node.terminal) return false;
        node.terminal = false; this.size--;
        for (let i = path.length - 1; i >= 0; i--) {
            const [parent,char,child] = path[i];
            if (child.terminal || child.children.size) break;
            parent.children.delete(char);
        }
        return true;
    }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct Trie
    root::TrieNode
    n::Int
end
Trie() = Trie(TrieNode(), 0)
Base.length(t::Trie) = t.n
Base.isempty(t::Trie) = t.n == 0
function trie_walk(t::Trie, text)
    text isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root
    for char in text
        node = get(node.children, char, nothing)
        node === nothing && return nothing
    end
    return node
end
function trie_contains(t::Trie, word)
    node = trie_walk(t, word); return node !== nothing && node.terminal
end
has_prefix(t::Trie, prefix) = trie_walk(t, prefix) !== nothing
function trie_insert!(t::Trie, word)
    word isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root
    for char in word
        if !haskey(node.children, char); node.children[char] = TrieNode(); end
        node = node.children[char]
    end
    node.terminal && return false
    node.terminal = true; t.n += 1; return true
end
function trie_delete!(t::Trie, word)
    word isa AbstractString || throw(ArgumentError("expected a string"))
    node = t.root; path = Any[]
    for char in word
        child = get(node.children, char, nothing); child === nothing && return false
        push!(path, (node,char,child)); node = child
    end
    !node.terminal && return false
    node.terminal = false; t.n -= 1
    for (parent,char,child) in Iterators.reverse(path)
        (child.terminal || !isempty(child.children)) && break
        delete!(parent.children, char)
    end
    return true
end
```

:::

::::

Build the shared example once, in this order, for the prefix-query traces on the next page:

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
trie = Trie()
for word in ["be", "bus", "buses", "busy", "car"]:
    trie.insert(word)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var trie = new Trie();
for (const word of ["be","bus","buses","busy","car"]) trie.insert(word);
```

:::

:::{tab-item} Julia
:sync: julia

```julia
trie = Trie()
for word in ["be","bus","buses","busy","car"]; trie_insert!(trie, word); end
```

:::

::::

(trie-deletion-invariant)=
## Deleting a key must preserve other keys' prefixes

After unmarking the target, a nonterminal child with no descendants is unused and can be removed. Repeat upwards until a terminal node or a node with another child is reached. A missing key changes nothing.

Deleting `"bus"` only clears its flag because its descendants still store `"buses"` and `"busy"`. Starting from the original shared set, deleting `"buses"` removes its final s and then e, but stops at the terminal, branching `"bus"` node. Those are two separate scenarios, not cumulative updates.

![Two deletion scenarios distinguish unmarking bus while retaining descendants from pruning the es suffix of buses while retaining bus and busy.](../../assets/strings/trie-deletion.svg)

Insertion preserves the invariant by adding only missing prefix nodes and marking exactly the final node. Deletion preserves every other key because it removes only nodes that neither terminate a key nor lead to one.

(trie-operation-costs)=
## Separate traversal space from new stored nodes

For a key of length L, lookup, insertion and deletion take expected $O(L+1)$ time under the dictionary model. Lookup and insertion use constant auxiliary working space; insertion can allocate up to L new persistent nodes. Deletion stores up to L path entries, using $O(L+1)$ auxiliary space. All loops are iterative, so a long key does not consume a recursive Python call per symbol.

`size` counts complete stored keys, not nodes. It is available in constant time. Turning this set into a map would require stored values at terminal nodes and a policy distinguishing absence from a legitimate value such as `None`.

## Costs and public observations

The key-walk, persistent-node and deletion-path bounds above apply unchanged. The added `len(trie)` and `is_empty()` observers read the cached complete-key count in O(1) time and O(1) working space; they do not traverse the nodes. The retained `trie.size` field reports the same count.

A false-valued mutation result reports that no complete key was added/removed; it does not report that no relevant prefix path exists. The iterative loops handle long keys without one Python recursive frame per symbol. A map extension would require stored payloads and their replacement/absence rules; this class remains a string set.

:::{tip} Common misconception
**Deleting a key means deleting every node on its path.** Shared prefixes and terminal ancestors must remain while another stored key needs them.
:::

(trie-operation-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. After inserting bus and buses, delete bus. What are contains("bus"), has_prefix("bus") and len(trie)?**

:::{dropdown} Show explanation
False, True and 1. The terminal marker is cleared, but the path remains for buses.
:::

**2. In an empty trie, what are has_prefix(""), contains("") and is_empty()?**

:::{dropdown} Show explanation
True, False and True. The empty path exists; the empty key is not stored until the root is marked terminal.
:::

Next: [Prefix queries](trie-prefix-queries.md).
