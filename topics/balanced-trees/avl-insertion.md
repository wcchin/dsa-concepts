# AVL insertion

**After this page, you should be able to:**

- Trace BST insertion followed by bottom-up height and balance repair.
- Separate constant local rotation work from logarithmic update paths.

**Builds on:** [Node/height definitions](avl-invariants.md), [rotations](avl-rotations.md) and [rebalance](avl-cases.md).

## Operation contract

`avl_insert(root,key)` returns a new subtree root, preserving all existing distinct keys and adding key only if absent. Empty input creates an AVL leaf; duplicates are no-ops. It requires a valid AVL input and stable total-order comparisons. This helper returns a root, not the public add result; [the adapter](avl-operations.md) handles count and interface results.

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

## Implementation choices and suitability

Recursion remembers the ancestor path. Child-root assignment happens before rebalance reads child heights, and the top-level caller must save the returned root. Reusing a single repair helper avoids inconsistent insertion/deletion case conventions. Each successful insertion stores one new node; persistent tree storage is O(n+1), while the path uses logarithmic workspace. AVL balancing is useful when sorted or adversarial insertion order would otherwise produce long paths.

:::{tip} Common misconception
**Each rotation is logarithmic work.** A rotation is constant local work; the ancestor path supplies the logarithmic factor.
:::

(tree-avl-insert-checks)=
## Check your understanding

Predict the returned result, links or invariant before opening the explanation.

**1. Insert 30,10,20. What is the repaired root?**

:::{dropdown} Show explanation
20, with left child 10 and right child 30. The LR repair preserves all three keys.
:::

**2. Must a valid single insertion cause rotations at every ancestor?**

:::{dropdown} Show explanation
No. Repair at the lowest unbalanced ancestor restores its pre-insertion height. Higher ancestors are still visited for metadata, but need no further rotations.
:::

Next: [AVL deletion](avl-deletion.md).
