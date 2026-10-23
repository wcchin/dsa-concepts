# 8. Balanced search trees

A BST can be correctly ordered and still be slow because its paths are long. An AVL tree adds a height-balance condition and repairs it during updates, while preserving the key order needed by search.

## Reading route

1. [Heights and AVL balance](avl-invariants.md): state the two invariants and the height convention.
2. [Rotations and subtree transfer](avl-rotations.md): preserve order, links and height metadata.
3. [The four rotation cases](avl-cases.md): identify LL, RR, LR and RL from the heavy path.
4. [AVL insertion](avl-insertion.md): insert as in a BST, then repair bottom-up.
5. [AVL deletion](avl-deletion.md): reconnect children and continue checking ancestors.
6. [The complete AVL operation route](avl-operations.md): reuse the ordered-set interface and compare every operation’s costs.

Read [Topic 7](../searching/searching.md) first, especially BST deletion and height-dependent costs. The examples retain one node per distinct key. They use height −1 for an empty subtree, height 0 for a leaf, and balance factor **left height minus right height**.

The figures show where every retained subtree goes. A rotation is complete only after the caller reconnects the returned root and stored heights match the new links. This is ordinary one-key ordering; [k-d trees](../kd-trees/kd-trees.md) need different spatial invariants.

## Same contract, stronger maintained invariant

[Topic 7’s ordered-set contract](../searching/ordered-set-operations.md#ordered-set-contract) applies unchanged. Add, remove, discard and extreme extraction use AVL mutation; exact lookup, traversal, ranges and strict neighbours reuse the BST readers. Rotation, rebalance and returned-root conventions are internal implementation contracts, not extra public ADT operations.

Follow contracts, invariants, visual traces, code, implementation choices and costs. When drawing a rotation, account for both middle and outside subtrees before checking the cached heights.

Check ordering, actual versus cached heights and every balance factor after updates; the owning adapter also maintains total size. Full node-identity preservation, parent pointers and rank/select augmentation are outside this implementation. The [final operation table](avl-operations.md#avl-all-operation-costs) separates path length from traversal/output size and local rotation work.

Code listings offer Python, JavaScript and Julia tabs where a runnable example is present. Python remains the explanation and trace language; see the [language guide](../../code-languages.md) for native conventions and runnable topic downloads.
