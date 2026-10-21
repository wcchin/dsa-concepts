# BST deletion without losing subtrees

(bst-deletion-cases)=
## Search, then identify the structural case

Deletion removes a key while retaining every other key and the ordering invariant. First locate the target. Then act according to its number of children:

| Children | Replacement for the target's subtree root |
|---|---|
| Zero | `None` |
| One | The existing child, with its whole subtree |
| Two | Keep the node, copy a successor key into it, then delete the original successor |

The examples below are **independent** edits of the tree containing `50, 30, 70, 20, 40, 60, 80, 65`. They are not one cumulative sequence.

(bst-leaf-one-child-deletion)=
## Leaf and one-child removal reconnect the parent

Delete leaf 20 by setting `30.left = None`. Delete one-child node 60 by setting `70.left` to node 65. If 65 had descendants, those links would remain intact: replacing a node by its child retains the entire child subtree, not just its key.

![Independent BST deletions remove leaf 20 or bypass 60 with its child 65, preserving all other links.](../../assets/searching/bst-simple-deletions.svg)

Deleting a root follows the same rule, except the external `root` reference must be updated. A singleton root becomes `None`; a root with one child becomes that child.

(bst-two-child-deletion)=
## Copy the successor, then remove its original node

For target 50, the successor is 60, the minimum in the right subtree. Copy 60 into the key field of the node formerly holding 50. That node stays in place with its child links. Then remove the **original** successor node by connecting `70.left` to its right child 65.

![Deleting 50 copies successor key 60 into the original root and reconnects 70.left to 65, preserving the successor's right subtree.](../../assets/searching/bst-successor-delete.svg)

The successor is greater than all left-subtree keys and smaller than every other right-subtree key. Its original node has no left child, so its removal reduces to a leaf or one-child case. The final inorder sequence is `20, 30, 40, 60, 65, 70, 80`.

Choosing the largest key in the left subtree—the **predecessor**—is also valid with the mirrored procedure. The choice of successor is a convention, not a reason that the left side cannot be used.

(bst-delete-code)=
## Return the root after each edit

This code reuses `BSTNode` and `bst_minimum` from the preceding pages. Deleting an absent key leaves the key set unchanged.

```python
def bst_delete(node, key):
    if node is None:
        return None
    if key < node.key:
        node.left = bst_delete(node.left, key)
    elif key > node.key:
        node.right = bst_delete(node.right, key)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        successor = bst_minimum(node.right)
        node.key = successor.key
        node.right = bst_delete(node.right, successor.key)
    return node
```

Call it as `root = bst_delete(root, key)`. Returning and reconnecting subtree roots handles root replacement and internal edits uniformly. Searching and removing the successor together still follow only $O(h+1)$ links overall; recursive stack space is $O(h+1)$.

(bst-key-versus-node)=
## A key is not the identity of its node

Copying a successor key changes the contents of the target node; it does not move that object. Any external reference to that node now observes the replacement key. In a key–value map, copy the associated value too. If clients require stable record or node identities, choose a deletion design that explicitly supports that requirement.

Next: [Search costs and choices](search-costs.md).
