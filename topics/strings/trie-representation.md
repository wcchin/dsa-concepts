# Trie representation and complete keys

**After this page, you should be able to:**

- Read prefix paths, sparse child maps and terminal markers as separate information.
- Explain root/empty-key behaviour and key-length/node-storage costs.

**Builds on:** [String contracts](string-model.md), [tree terminology](../searching/tree-basics.md) and [dictionary models](../maps-sets-hashing/hashing.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/strings.js) · [Julia](../../examples/languages/strings.jl).

All matching positions count Unicode code points. JavaScript and Julia collect characters into arrays for constant-time access, adding O(n+m) preparation and storage to text/pattern scans; this is additional to the Python bounds. Julia results are one-based character-array positions, not byte indices into a Julia String. Rolling hashes use BigInt arithmetic explicitly; JavaScript custom base/modulus arguments are BigInts (for example 3n).

(trie-prefix-invariant)=
## A node represents the path from the root

A **trie** stores keys by successive symbols. The root represents the empty prefix. Following an edge labelled b, then u, then s reaches the prefix `"bus"`. Keys with a common prefix share that path instead of repeating it in separate root-to-key comparisons.

Our shared set is `{"be", "bus", "buses", "busy", "car"}`. Nodes do not store whole prefixes; the path and edge labels determine them.

![A trie shares b across be and bus, shares bus across buses and busy, and separately stores car; terminal nodes mark all five complete keys.](../../assets/strings/shared-trie.svg)

(trie-terminal-marker)=
## A complete key can also have descendants

The node for `"bus"` is terminal and has children because `"buses"` and `"busy"` are stored too. Conversely, the node for `"bu"` exists but is not terminal. Reaching it proves a prefix path exists, not that `"bu"` is stored.

A leaf test cannot replace the terminal flag. Terminal flags also let the root store the empty key without inventing a special edge symbol that might collide with real input.

(trie-sparse-children)=
## Store only the outgoing symbols that exist

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.terminal = False
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class TrieNode {
    constructor() { this.children = new Map(); this.terminal = false; }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct TrieNode
    children::Dict{Char,Any}
    terminal::Bool
end
TrieNode() = TrieNode(Dict{Char,Any}(), false)
```

:::

::::

Every child dictionary maps a one-code-point string to one node. Each node has at most one outgoing edge for a given symbol. Different incoming symbols lead to different nodes: this representation is a tree, not a graph that merges equal suffixes.

A fixed alphabet could use one array slot per symbol, trading direct access for empty slots. A dictionary stores sparse children and accommodates the Unicode symbols encountered. We use expected constant-time child lookup under the same hash-table assumptions as Topic 6; this is not an unconditional worst-case dictionary guarantee.

(trie-storage-bound)=
## Shared paths reduce nodes but do not erase overhead

Let S be the sum of lengths of all distinct stored keys. There is one node per distinct nonempty prefix, plus the root, so at most S+1 nodes. Space is $O(S+1)$ in the node/reference model. Even an empty trie has a root. Many Python objects and small dictionaries can still consume substantial memory.

This shape depends on symbols, not on balance rotations or numerical key intervals. A long single key creates a long path. Trie lookup depends on key length rather than a logarithmic height guarantee in the number of stored keys.

## Invariants, construction and representation choices

Every node describes one root-to-node prefix, each outgoing symbol names at most one child, and terminal status records whether that prefix is a complete stored key. Node construction creates a fresh empty child dictionary and a nonterminal flag; it does not insert a key. [`Trie`](trie-operations.md) owns the root and maintains complete-key count separately.

If S is the sum of distinct key lengths, there are at most S+1 nodes, including the permanent root. With sparse expected dictionary access, one key walk takes O(L+1) time; space depends on stored prefixes rather than a logarithmic balance guarantee. A fixed-alphabet child array has different occupancy costs, and compressed/radix representations can reduce unary chains but need different edge-walk code.

Use the trie when prefix structure is relevant. A dictionary may be simpler for exact whole-key queries alone. Neither trie paths nor code-point ordering supplies locale-aware collation or relevance ranking.

:::{tip} Common misconception
**Only leaves can be complete keys.** A terminal node can have descendants, and the root can represent a stored empty key.
:::

(trie-representation-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. If bus and buses are stored, must the bus node be a leaf?**

:::{dropdown} Show explanation
No. It is terminal and has descendants. Removing leaf-only assumptions is essential for keys that prefix other keys.
:::

**2. Does an empty trie have zero nodes?**

:::{dropdown} Show explanation
No. It has a root, but zero stored keys until a terminal marker is set. Root existence and empty-key membership are different facts.
:::

Next: [Trie operations](trie-operations.md).
