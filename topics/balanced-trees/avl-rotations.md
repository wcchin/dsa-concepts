# Rotations and subtree transfer

(bst-rotation)=
## Change parent relationships while keeping key order

A **rotation** changes a constant number of links around a node and one child. It preserves the inorder order of every key. It does not sort keys again, rebuild the entire tree, or discard the opposite subtree.

For a right rotation, let the old root be `z`, its left child `y`, and `y.right` the **middle subtree**. The key ranges occur in this order:

$$ \text{left of y} < y < \text{middle} < z < \text{right of z}. $$

(rotation-middle-subtree)=
## The middle subtree changes parent, not key range

When `y` becomes the root and `z` its right child, the middle subtree must become `z.left`. Its keys exceed `y` but remain below `z`, so this is precisely the location preserving all ancestor bounds.

![A right rotation promotes 30 above 50 and transfers subtree 40 from 30.right to 50.left. Subtrees 20 and 70 remain present.](../../assets/balanced-trees/rotation-transfer.svg)

The example deliberately keeps the opposite subtree 70 and the transferred subtree 40 visible. A rotation can be explained on an already balanced tree; that does not mean the balancing algorithm should rotate it. A height violation determines **whether** a repair is necessary.

(rotation-code)=
## Save, reconnect, update and return

The helpers below reuse `height` and `update_height` from the previous page. Right rotation requires an existing left child; left rotation requires an existing right child.

```python
def rotate_right(z):
    y = z.left
    middle = y.right
    y.right = z
    z.left = middle
    update_height(z)
    update_height(y)
    return y

def rotate_left(z):
    y = z.right
    middle = y.left
    y.left = z
    z.right = middle
    update_height(z)
    update_height(y)
    return y
```

(rotation-height-updates)=
## Update the lower node before the new root

After a rotation, the former root `z` is below `y`. Update `z.height` first so that updating `y.height` reads the correct child height. Swapping that order can leave stale metadata even when the links and inorder keys look correct.

(rotation-reconnection)=
## The caller must retain the returned root

For a whole-tree right rotation, write `root = rotate_right(root)`. For a child subtree, reconnect it through the parent, such as `parent.left = rotate_right(parent.left)`. Merely calling the helper and ignoring its return value leaves the external reference at the former root and can make part of the tree unreachable from that reference.

Each rotation performs $O(1)$ local work using cached heights. A double rotation is two such operations, still constant work locally. This does not make an entire search-tree update constant-time: the algorithm must first reach the edited location and then check its ancestors.

Next: [The four cases](avl-cases.md).
