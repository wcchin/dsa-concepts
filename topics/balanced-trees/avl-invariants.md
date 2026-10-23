# Heights, balance factors and AVL invariants

**After this page, you should be able to:**

- Check strict BST order, stored heights and local AVL balance separately.
- Explain why local balance bounds the global path length.

**Builds on:** [BST whole-subtree order](../searching/tree-basics.md) and [height-dependent costs](../searching/search-costs.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/balanced-trees.js) · [Julia](../../examples/languages/balanced-trees.jl).

The same BST readers and OrderedSet interface are reused from Topic 7. Julia updates use function calls, not dot methods. All variants use empty height −1, leaf height 0, and left height minus right height; rotations must return and reconnect the new subtree root.

(avl-invariant)=
## Add balance to BST order

An **AVL tree** satisfies both the strict BST ordering rule and this local height condition at **every** node:

$$ |h(v.left)-h(v.right)|\leq1. $$

A small height difference only at the root is insufficient. A descendant can be unbalanced while the root's two subtrees happen to have equal heights. Likewise, a short unordered binary tree is not an AVL search tree.

## Representation and helper contracts

`AVLNode(key)` creates a leaf. `height(None)` returns −1; `height(node)` observes a cached integer. `update_height(node)` mutates one nonempty node's metadata and returns None, assuming its child heights are current. `balance_factor(node)` observes a nonempty node and returns left height minus right height. These are internal helpers, not public ordered-set operations.

(avl-height-convention)=
## Store heights consistently

We count edges on the longest downward path. An empty subtree has height −1, a leaf has height 0, and a nonempty node has height one plus the larger child height.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 0

def height(node):
    return -1 if node is None else node.height

def update_height(node):
    node.height = 1 + max(height(node.left), height(node.right))

def balance_factor(node):
    return height(node.left) - height(node.right)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class AVLNode {
    constructor(key) { this.key = key; this.left = null; this.right = null; this.height = 0; }
}
function height(node) { return node === null ? -1 : node.height; }
function update_height(node) { node.height = 1 + Math.max(height(node.left), height(node.right)); }
function balance_factor(node) { return height(node.left) - height(node.right); }
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct AVLNode
    key
    left
    right
    height::Int
end
AVLNode(key) = AVLNode(key, nothing, nothing, 0)
height(node) = node === nothing ? -1 : node.height
update_height!(node) = (node.height = 1 + max(height(node.left), height(node.right)); nothing)
balance_factor(node) = height(node.left) - height(node.right)
```

:::

::::

The helper reads cached child heights. It does not traverse their descendants. Recomputing every subtree height from scratch at each ancestor would defeat the intended constant local work per update level.

(avl-balance-factor)=
## The sign identifies the heavy side

With $BF=h(left)-h(right)$, positive means left-heavy and negative means right-heavy. Valid AVL factors are −1, 0 and +1. A single insertion or deletion into an otherwise valid AVL tree can temporarily produce +2 or −2 along the affected ancestor path.

![A small AVL tree labels each node with its cached height and left-minus-right balance factor.](../../assets/balanced-trees/avl-heights.svg)

Other references may use the opposite sign or count nodes instead of edges. The algorithm must use one consistent convention; changing the sign without changing the rotation conditions gives incorrect decisions.

(avl-height-bound)=
## Local balance implies logarithmic global height

Let $N(h)$ be the minimum number of nodes in an AVL tree of height $h$. To obtain that height with as few nodes as possible, the child heights are $h-1$ and $h-2$:

$$N(-1)=0,\quad N(0)=1,\quad N(h)=1+N(h-1)+N(h-2).$$

For heights 0, 1, 2, 3 and 4, the minimum node counts are 1, 2, 4, 7 and 12. This Fibonacci-like growth is exponential in height, so height is $O(\log(n+1))$ in the number of nodes. That is the reason path-based lookup and updates can have logarithmic worst-case bounds.

## Implementation choices and costs

Caching one height per node makes height, update-height and factor computation O(1), using O(1) workspace. Persistent storage remains O(n+1). Height is not the node count; a separate global count in the [adapter](../searching/ordered-set-operations.md) supports size. A balance-factor-only design or parent links would require different metadata maintenance; this book uses cached heights and recursive return paths.

AVL balance does **not** require a perfect or complete binary tree, equal child sizes, or the smallest possible height. It permits enough shape flexibility to support local repair.

:::{tip} Common misconception
**A balanced root proves the entire tree AVL-valid.** Every descendant must satisfy the balance and metadata conditions.
:::

(tree-avl-invariant-checks)=
## Check your understanding

Predict the returned result, links or invariant before opening the explanation.

**1. Under this convention, what are empty and leaf heights?**

:::{dropdown} Show explanation
−1 and 0. Mixing conventions without adjusting formulas corrupts balance decisions.
:::

**2. Can sorted inorder output prove cached heights correct?**

:::{dropdown} Show explanation
No. Recompute actual heights from links and compare metadata at every node.
:::

Next: [Rotations](avl-rotations.md).
