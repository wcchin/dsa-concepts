# Ordered range queries in a BST

(bst-range-query)=
## Report every key inside an interval

Exact lookup asks for one key. A range query asks for all keys satisfying `low <= key <= high`. BST whole-subtree ordering lets us skip the left subtree when the current key is at most low, and skip the right subtree when it is at least high.

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

The function assumes the strict, distinct-key BST invariant from this topic and returns keys in ascending order because it preserves inorder traversal. Before insertion of 65 into the reference tree, interval `[35,70]` returns `[40,50,60,70]`. An empty tree returns an empty list.

(bst-range-pruning-cost)=
## Output size is part of the cost

For a nonempty tree with height h and r reported keys, time is $O(h+r+1)$: outside the reported interval, traversal is restricted to boundary search paths. An AVL tree therefore supports $O(\log(n+1)+r)$ reporting. A chain can still require linear work even when r is small.

An empty tree takes constant time and returns an empty list. For a nonempty tree, the recursive stack uses $O(h+1)$ space and the returned list uses $O(r)$. This contrasts with a hash table, whose ordinary placement rule does not directly organise ordered intervals. It also prepares the distinction from [k-d-tree range search](../kd-trees/kd-range-search.md), where different axes define spatial regions.

Return to [BST traversal](bst-traversal.md) or continue to [deletion](bst-deletion.md).
