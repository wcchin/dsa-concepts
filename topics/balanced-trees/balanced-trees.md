# 8. Balanced search trees

A BST can be correctly ordered and still be slow because its paths are long. An AVL tree adds a height-balance condition and repairs it during updates, while preserving the key order needed by search.

## Reading route

1. [Heights and AVL balance](avl-invariants.md): state the two invariants and the height convention.
2. [Rotations and subtree transfer](avl-rotations.md): preserve order, links and height metadata.
3. [The four rotation cases](avl-cases.md): identify LL, RR, LR and RL from the heavy path.
4. [AVL insertion](avl-insertion.md): insert as in a BST, then repair bottom-up.
5. [AVL deletion](avl-deletion.md): reconnect children and continue checking ancestors.

Read [Topic 7](../searching/searching.md) first, especially BST deletion and height-dependent costs. The examples retain one node per distinct key. They use height −1 for an empty subtree, height 0 for a leaf, and balance factor **left height minus right height**.

The figures show where every retained subtree goes. A rotation is complete only after the caller reconnects the returned root and stored heights match the new links. This is ordinary one-key ordering; [k-d trees](../kd-trees/kd-trees.md) need different spatial invariants.
