# Ordered range queries in a BST

**After this page, you should be able to:**

- Report a closed key range while preserving ascending order.
- Count boundary-path work separately from the number of answers.

**Builds on:** [Inorder traversal and BST ordering](bst-traversal.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/searching.js) · [Julia](../../examples/languages/searching.jl).

Python and JavaScript positions are zero-based; Julia vector positions and insertion boundaries are one-based. A missing lookup is None/null/nothing, while a boundary query can return the one-past-end position. Julia public ordered-set operations use functions such as add!, ordered_keys and range_keys.

## Operation contract

`bst_range_keys(root,low,high)` observes a distinct-key BST and returns a new ascending list for the **closed** interval. Equal bounds can report one stored key. A valid empty-tree query returns `[]`; low>high raises `ValueError` even when the tree is empty. Bounds and keys must use the same total order.

(bst-range-query)=
## Report every key inside an interval

Exact lookup asks for one key. A range query asks for all keys satisfying `low <= key <= high`. BST whole-subtree ordering lets us skip the left subtree when the current key is at most low, and skip the right subtree when it is at least high.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def bst_range_keys(root, low, high):
    if low > high:
        raise ValueError("lower bound exceeds upper bound")
    out = []

    def visit(node):
        if node is None:
            return
        if low < node.key:
            visit(node.left)
        if low <= node.key <= high:
            out.append(node.key)
        if node.key < high:
            visit(node.right)

    visit(root)
    return out
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function bst_range_keys(root, low, high) {
    if (low > high) throw new RangeError("lower bound exceeds upper bound");
    const out = [];
    function visit(node) {
        if (node === null) return;
        if (low < node.key) visit(node.left);
        if (low <= node.key && node.key <= high) out.push(node.key);
        if (node.key < high) visit(node.right);
    }
    visit(root); return out;
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function bst_range_keys(root, low, high)
    low <= high || throw(ArgumentError("lower bound exceeds upper bound"))
    out = Any[]
    function visit(node)
        node === nothing && return
        low < node.key && visit(node.left)
        low <= node.key <= high && push!(out, node.key)
        node.key < high && visit(node.right)
    end
    visit(root); return out
end
```

:::

::::

The function assumes the strict, distinct-key BST invariant from this topic and returns keys in ascending order because it preserves inorder traversal. Before insertion of 65 into the reference tree, interval `[35,70]` returns `[40,50,60,70]`. An empty tree returns an empty list.

(bst-range-pruning-cost)=
## Output size is part of the cost

For a nonempty tree with height h and r reported keys, time is $O(h+r+1)$: outside the reported interval, traversal is restricted to boundary search paths. An AVL tree therefore supports $O(\log(n+1)+r)$ reporting. A chain can still require linear work even when r is small.

An empty tree takes constant time and returns an empty list. For a nonempty tree, the recursive stack uses $O(h+1)$ space and the returned list uses $O(r)$. This contrasts with a hash table, whose ordinary placement rule does not directly organise ordered intervals. It also prepares the distinction from [k-d-tree range search](../kd-trees/kd-range-search.md), where different axes define spatial regions.

## Implementation choices, correctness and suitability

The strict child tests match distinct keys and closed bounds. When a node key equals low, all its left keys are strictly too small; when it equals high, all its right keys are strictly too large. Every retained matching key is appended in inorder, proving sorted output without an extra sort. Visiting only qualifying subtrees improves on a full scan when few results and short boundary paths suffice.

The output list is a shallow snapshot. A callback/generator interface would have a different result contract; it is not the implementation shown. Ordinary hashing does not supply these ordering certificates, whereas the same helper works unchanged on AVL nodes.

:::{tip} Common misconception
**A range that returns one key always takes constant time.** Reaching its boundary can still require a long tree path.
:::

(tree-range-checks)=
## Check your understanding

Predict the returned result, links or invariant before opening the explanation.

**1. Before inserting 65, what does the closed range [35,70] return?**

:::{dropdown} Show explanation
[40,50,60,70], in ascending order. Endpoints are included when stored.
:::

**2. What does a valid query return on an empty tree?**

:::{dropdown} Show explanation
An empty list. Invalid low>high instead raises ValueError before traversal.
:::

Return to [BST traversal](bst-traversal.md) or continue to [deletion](bst-deletion.md).
