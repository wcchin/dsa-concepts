# Traversal and ordered operations

(tree-traversals)=
## One tree, several visiting orders

Traversal visits every node rather than looking for one key. The names below locate the current node relative to its recursive child visits:

| Traversal | Visit order | Reference-tree output |
|---|---|---|
| Preorder | node, left, right | 50, 30, 20, 40, 70, 60, 80 |
| Inorder | left, node, right | 20, 30, 40, 50, 60, 70, 80 |
| Postorder | left, right, node | 20, 40, 30, 60, 80, 70, 50 |

These outputs refer to the seven-node reference tree **before** inserting 65. Preorder visits a parent before its descendants; postorder visits it after them. The tree's links stay unchanged.

(bst-inorder)=
## Inorder exposes the BST's sorted order

```python
def inorder_keys(root):
    result = []

    def visit(node):
        if node is None:
            return
        visit(node.left)
        result.append(node.key)
        visit(node.right)

    visit(root)
    return result
```

Why sorted? Recursively sorted left keys are all smaller than the node; recursively sorted right keys are all larger. Concatenating them in left–node–right order preserves ascending order. This conclusion uses the **BST** invariant: inorder on an arbitrary binary tree need not be sorted.

![Inorder traversal numbers visits from 20 through 80 in ascending order, independently of each node's depth.](../../assets/searching/bst-inorder.svg)

The helper performs constant local work per node, so time is $\Theta(n)$. Its returned list occupies $\Theta(n)$ output space; the recursion needs $O(h+1)$ additional stack space. Avoid repeatedly concatenating subtree lists if you intend this linear-time analysis.

(bst-minimum-maximum)=
## Extreme keys are at opposite edges

```python
def bst_minimum(node):
    if node is None:
        return None
    while node.left is not None:
        node = node.left
    return node
```

Follow left links to find the minimum; follow right links for the maximum. The result is a node, or `None` for an empty tree. Each operation takes $O(h+1)$ time and constant iterative auxiliary space.

(bst-successor)=
## The successor is the next larger key

If a node has a right subtree, its **inorder successor** is that subtree's minimum. It may be the immediate right child or a deeper descendant. If there is no right subtree, the successor is the lowest ancestor for which the node lies in its left subtree; finding it requires parent information or a search from the root. The largest key has no successor.

For node 50, the reference successor is 60. Adding a right child 65 to 60 does not change that fact. The successor's own left child must be empty, but its right child need not be. This is crucial for [two-child deletion](bst-deletion.md).
