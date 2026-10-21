# Heap order, complete shape and array indices

(complete-binary-tree)=
## Shape fixes the next leaf position

A **complete binary tree** has every level full except possibly the last, and the last level fills from left to right. A missing position before a later occupied position on that level violates completeness.

For $n\geq1$ nodes, this shape has edge-height $\lfloor\log_2 n\rfloor$. Appending fills the next available leaf; removing the final leaf retains complete shape. The representation does not need an AVL balance factor to keep paths logarithmic.

(min-heap-invariant)=
## Parent priority is at most each child's

A **binary min-heap** combines complete shape with **heap order**: every parent priority is less than or equal to each existing child's priority. Following a path from the root never decreases the priority, so the root is a global minimum. The mirrored max-heap has parent priority at least each child's.

![The min-heap 2, 5, 4, 9, 7, 6 is shown as a complete tree and a level-order array, with matching indices.](../../assets/heaps/heap-tree-array.svg)

(heap-versus-bst)=
## Siblings and subtrees need no total order

The lecture heap `[2, 5, 4, 9, 7, 6]` is valid even though 5 precedes 4 and 9 precedes 7. Siblings need not be sorted, and the left subtree need not contain smaller priorities than the right subtree. Inorder traversal does not produce sorted heap output.

A BST instead uses whole-subtree bounds around a key. That supports eliminating an entire side during arbitrary-key lookup. Heap order does not justify the same search decision: a larger target could occur in either child subtree.

(heap-array-indices)=
## Store the tree in level order

For zero-based position i:

| Relationship | Position |
|---|---|
| Left child | `2 * i + 1` |
| Right child | `2 * i + 2` |
| Parent, for i > 0 | `(i - 1) // 2` |

A child exists only when its index is below the active heap size. The root at index 0 has no parent; calculating its parent formula in Python gives −1, which is a valid list index with the **wrong meaning** here. Test `i > 0` first.

In the six-item example, index 1 has children 3 and 4. Index 5 has parent 2. Index 2 has a left child at 5, but its right-child position 6 is outside the heap.

(heap-shape-order)=
## Check both invariants separately

![One example has complete shape but broken parent order; another has ordered keys but a gap in the last level. Neither is a binary heap.](../../assets/heaps/heap-two-invariants.svg)

An array prefix naturally encodes complete shape; the priority comparisons still need checking. In a drawn linked tree, both shape and order must be checked. The last internal index is `n // 2 - 1`; positions `n // 2` through `n - 1` are leaves. Empty and singleton heaps have no internal node needing repair.

Next: [Insertion and sift-up](heap-insertion.md).
