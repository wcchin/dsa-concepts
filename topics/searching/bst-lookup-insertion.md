# BST lookup and insertion

(bst-node)=
## Represent the two possible continuations

```python
class BSTNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
```

`None` represents an empty subtree. A root variable holds a node reference, not a copied tree. Distinguish changing `node.left` from merely rebinding a local variable.

(bst-search)=
## Each comparison excludes a subtree

```python
def bst_search(node, target):
    while node is not None:
        if target == node.key:
            return node
        if target < node.key:
            node = node.left
        else:
            node = node.right
    return None
```

The return value is the matching **node**, or `None`. If a target is below the current key, the entire right subtree is impossible by the BST invariant. Otherwise an unequal larger target excludes the left subtree. Reaching an empty child proves absence within the remaining candidate subtree.

In the reference tree, finding 60 follows `50 → 70 → 60`. Searching for 65 follows those same comparisons and then reaches the missing right child of 60. These are sequential decisions, not simultaneous searches of both sides.

(bst-insertion)=
## Insert where unsuccessful search stops

```python
def bst_insert(node, key):
    if node is None:
        return BSTNode(key)
    if key < node.key:
        node.left = bst_insert(node.left, key)
    elif key > node.key:
        node.right = bst_insert(node.right, key)
    return node

root = None
for key in [50, 30, 70, 20, 40, 60, 80]:
    root = bst_insert(root, key)
root = bst_insert(root, 65)
```

Each call returns the root of its resulting subtree. The caller reconnects that result to the appropriate child field. At the top level, `root = ...` handles the initially empty tree. The equality case returns the existing node without adding a duplicate.

![Insertion of 65 follows 50 right, 70 left and 60 right, creating one new leaf while retaining the existing tree.](../../assets/searching/bst-insert.svg)

(bst-insertion-correctness)=
## Why a local leaf satisfies global bounds

The path to the new leaf consists of comparisons with all relevant ancestors. Choosing the correct branch at each ancestor narrows the permitted interval. When an empty child is reached, the inserted key satisfies every accumulated bound, so adding the leaf preserves whole-subtree ordering.

Both lookup and insertion follow a path of length at most the tree height plus one. Their time is $O(h+1)$; for nonempty growing trees this is usually written $O(h)$. Iterative lookup uses $O(1)$ auxiliary space; the recursive insertion uses $O(h+1)$ stack space. An ordinary BST does not maintain a height bound: ascending insertions can form a chain.

**Check your understanding:** does adding 65 change where 80 belongs? No. Only the formerly empty child of 60 changes; the ancestor comparisons already establish `50 < 65 < 70`. Next: [Traversal](bst-traversal.md).
