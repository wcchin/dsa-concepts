# AVL insertion

(avl-insertion)=
## Use the BST path, then repair on return

Insertion first follows ordinary BST comparisons. A missing child becomes a new leaf; an existing equal key changes nothing. The recursive return path then updates heights and repairs imbalance.

This function uses `AVLNode` and the helpers from the previous pages. Its return value is the root of the resulting subtree.

```python
def avl_insert(node, key):
    if node is None:
        return AVLNode(key)
    if key < node.key:
        node.left = avl_insert(node.left, key)
    elif key > node.key:
        node.right = avl_insert(node.right, key)
    else:
        return node
    return rebalance(node)

root = None
for key in [30, 10, 20]:
    root = avl_insert(root, key)
```

(avl-bottom-up-repair)=
## Children must be correct before their parent is checked

After inserting 20 below 10's right link, node 10 is right-heavy by one and remains valid. At node 30, the left subtree has grown while the right is empty: its factor is +2. Its left child's factor is −1, so this is LR.

The first rotation promotes 20 within the left child subtree; the second promotes 20 above 30. The final root is 20, with children 10 and 30. All three leaf-to-root height calculations agree with the final links.

![Bottom-up insertion of 20 checks 10 before 30, then repairs the LR imbalance to produce root 20.](../../assets/balanced-trees/avl-insert-return.svg)

Only ancestors of the insertion point can have changed height. Unvisited branches remain ordered and balanced. This is why we can repair along one return path rather than checking every node in the tree.

(avl-insertion-cost)=
## Separate path length from local work

Inserting into an AVL tree takes $O(\log(n+1))$ time: a logarithmic search path, constant work per visited ancestor, and constant work per rotation. The recursive implementation uses $O(\log(n+1))$ stack space; the new stored node is additional output structure.

For a single insertion into a valid AVL tree, repairing the lowest unbalanced ancestor restores that subtree to its height before insertion. Higher ancestors therefore need no further rotations. The code still returns through them and recomputes their metadata, which is simple and preserves the same asymptotic bound. This fact differs from [deletion](avl-deletion.md), where height loss can continue upward.

An ascending input sequence remains a useful test: the ordinary BST becomes a chain, while this insertion function rotates as needed. Random input is not required for the AVL height guarantee.
