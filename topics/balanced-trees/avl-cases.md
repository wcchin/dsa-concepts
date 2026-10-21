# LL, RR, LR and RL cases

(avl-four-cases)=
## Name the heavy path from the unbalanced node

Let `z` be the ancestor being repaired. The first letter describes its heavy child; the second describes the heavy direction within that child. The names describe the **shape causing imbalance**, not the direction of the corrective rotation.

| Case | Example insertion order | Repair |
|---|---|---|
| LL | 30, 20, 10 | Right rotation at 30 |
| RR | 10, 20, 30 | Left rotation at 10 |
| LR | 30, 10, 20 | Left rotation at 10, then right at 30 |
| RL | 10, 30, 20 | Right rotation at 30, then left at 10 |

![The four three-key imbalance patterns each repair to root 20 with children 10 and 30. Double rotations show their intermediate shape.](../../assets/balanced-trees/avl-four-cases.svg)

(avl-double-rotation)=
## Straighten an inner bend before promoting it

In LR, node 20 is too deep in the left child's right branch. First rotate that child left, converting the local shape to LL. Then rotate the old root right. RL is the mirror image.

A single rotation in the original LR shape may preserve sorted order but fail to establish AVL balance. Order preservation and balance repair are different obligations; a correct repair must do both. Larger examples retain the middle and outside subtrees exactly as described on the [rotation page](avl-rotations.md).

(avl-rebalance)=
## Choose the repair from child balance factors

```python
def rebalance(node):
    update_height(node)
    bf = balance_factor(node)
    if bf > 1:
        if balance_factor(node.left) < 0:
            node.left = rotate_left(node.left)
        return rotate_right(node)
    if bf < -1:
        if balance_factor(node.right) > 0:
            node.right = rotate_right(node.right)
        return rotate_left(node)
    return node
```

This helper requires a nonempty node whose child subtrees are already AVL-valid with correct heights. The current node may need repair after a single-key update. Bottom-up recursion establishes that precondition at each level.

The strict `< 0` and `> 0` inner tests matter for deletion: a heavy child with factor **zero** uses a single rotation. Insertion-only rules based on the newly inserted key cannot simply be reused for deletion, where no inserted key identifies a path.

**Check your understanding:** if `BF(z) = +2` and `BF(z.left) = -1`, which link receives the first returned root? `z.left`; then the right rotation returns the new root of the whole subtree. Next: [Insertion](avl-insertion.md).
