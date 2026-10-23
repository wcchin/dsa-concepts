# Linked structures and safe updates

**After this page, you should be able to:**

- Trace traversal and safe link updates without losing a suffix.
- Separate locating a position from constant-link changes at a known node.

**Builds on:** [Object references](../foundations/objects-and-references.md) and the [sequence contract](sequence-adt.md).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/linear-structures.js) · [Julia](../../examples/languages/linear-structures.jl).

Julia uses one-based positions and named functions such as enqueue! rather than Python-style instance methods. Endpoint adapters use the supplied linked DequeBuffer, so they do not hide linear array-front shifts. Empty operations reject the request; null/nothing remain valid payloads.

## Operation contracts and representation invariant

A finite acyclic chain represents records in link order. `linked_values(head)` returns a new list without changing the chain. The insertion trace adds after a **known node**, while `remove_after(node)` removes and returns its successor's value, raising `IndexError` if none exists. These are low-level known-node operations, not a complete positional List class. A positional `insert(i,x)` must locate the predecessor first; compare the [sequence contract](sequence-adt.md).

(singly-linked-list)=
## The links establish the sequence

A singly linked node stores a value and a reference to its successor. The **head** refers to the first node; the last node's `next` is `None`. An empty chain has `head = None`. Nodes need not occupy consecutive memory locations.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

c = Node("C")
b = Node("B", c)
head = Node("A", b)
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class Node {
    constructor(value, next_node = null) { this.value = value; this.next = next_node; }
}
var c = new Node("C"), b = new Node("B", c), head = new Node("A", b);
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct Node
    value
    next
end
Node(value) = Node(value, nothing)
c = Node("C"); b = Node("B", c); head = Node("A", b)
```

:::

::::

This is the same reference idea as [Topic 1's route nodes](../foundations/collections-and-classes.md#linked-objects), with a generic `value` field. The node and its payload are separate concepts: the node supplies a position in the chain.

(linked-traversal)=
## Traverse without changing the links

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def linked_values(head):
    values = []
    current = head
    while current is not None:
        values.append(current.value)
        current = current.next
    return values

assert linked_values(head) == ["A", "B", "C"]
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function linked_values(head) {
    const values = [];
    for (let current = head; current !== null; current = current.next) values.push(current.value);
    return values;
}
console.assert(JSON.stringify(linked_values(head)) === '["A","B","C"]');
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function linked_values(head)
    values = Any[]; current = head
    while current !== nothing
        push!(values, current.value); current = current.next
    end
    return values
end
@assert linked_values(head) == ["A", "B", "C"]
```

:::

::::

Before each iteration, `current` is the next unvisited node. Rebinding it advances the traversal; it does not change `head` or any link. Visiting $n$ nodes takes $\Theta(n)$ time. This collecting helper also uses $\Theta(n)$ output space; traversal that only processes each item needs $O(1)$ auxiliary space apart from that processing.

The termination argument assumes a finite acyclic chain. A cycle can prevent `current` from reaching `None`. To retrieve index $i$, follow $i$ links from the head, giving $\Theta(i+1)$ time for a valid index and $O(n)$ worst-case access.

(linked-insertion)=
## Preserve the successor before replacing its link

To insert X after the already-known node B, first connect X to B's old successor C, then connect B to X.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
new = Node("X")
new.next = b.next
b.next = new
assert linked_values(head) == ["A", "B", "X", "C"]
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
var added = new Node("X");
added.next = b.next; b.next = added;
console.assert(JSON.stringify(linked_values(head)) === '["A","B","X","C"]');
```

:::

:::{tab-item} Julia
:sync: julia

```julia
added = Node("X")
added.next = b.next; b.next = added
@assert linked_values(head) == ["A", "B", "X", "C"]
```

:::

::::

![Two reference updates insert X after B: first preserve the link from X to C, then redirect B to X. Reversing these unsaved assignments makes X point to itself.](../../assets/linear-structures/linked-updates.svg)

If we instead execute `b.next = new` followed by `new.next = b.next`, the second statement makes X point to itself. The old link to C has already been overwritten. A separately saved successor reference would permit another safe ordering, but the old remainder must remain reachable somewhere.

(linked-removal)=
## Bypass the unwanted node

To remove the node after B, redirect B to that node's successor. Require that B has a successor; otherwise there is no node to remove.

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def remove_after(node):
    if node.next is None:
        raise IndexError("no successor to remove")
    removed = node.next
    node.next = removed.next
    removed.next = None
    return removed.value

assert remove_after(b) == "X"
assert linked_values(head) == ["A", "B", "C"]
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function remove_after(node) {
    if (node.next === null) throw new RangeError("no successor");
    const removed = node.next; node.next = removed.next; removed.next = null;
    return removed.value;
}
console.assert(remove_after(b) === "X");
console.assert(JSON.stringify(linked_values(head)) === '["A","B","C"]');
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function remove_after!(node)
    node.next === nothing && throw(BoundsError())
    removed = node.next; node.next = removed.next; removed.next = nothing
    return removed.value
end
@assert remove_after!(b) == "X"
@assert linked_values(head) == ["A", "B", "C"]
```

:::

::::

Detaching the removed node makes this operation's intent explicit; other references may still keep that object alive. Removing the head instead requires updating the head reference itself. Structures that maintain a tail or a length must update that metadata too.

(linked-update-cost)=
## Finding the place differs from changing it

Insertion after a known node and removal after a known predecessor change only a constant number of references: $O(1)$ work. Finding that node by value or index may first cost $O(n)$. Merely holding the node to delete does not generally supply its predecessor in a singly linked list.

(doubly-linked-list)=
## A second link supports the reverse direction

A **doubly linked** node also stores `prev`. For adjacent nodes, `u.next is v` must agree with `v.prev is u`. With head and tail references, both-end insertion and removal can be constant time, and a known node can be removed by reconnecting both neighbours.

![A doubly linked sequence maintains next and prev in opposite directions, with head.prev and tail.next both None.](../../assets/linear-structures/doubly-linked.svg)

The benefit costs one extra link per node and more updates. The first and last nodes need endpoint handling; the only node requires changing both head and tail to `None`. Extra metadata makes more operations cheap only when its invariants are maintained.

## Implementation choices, space and suitability

A singly linked node stores one successor; a doubly linked node also stores a predecessor. Maintaining tail and size fields can speed append and size queries, but every update must preserve them. A traversal with only a cursor uses O(1) workspace; collecting its n outputs uses O(n) result storage. An insertion allocates one node; removal updates O(1) links after the predecessor is known. Persistent storage is O(n+1), with per-node overhead.

Use links when endpoint or known-node updates matter. Prefer arrays when frequent indexed access and locality dominate. The code here deliberately illustrates reference updates; the [linked queue](linked-queues.md) adds complete endpoint and size maintenance.

:::{tip} Common misconception
**Deleting a known singly linked node always takes constant time.** The operation may still need its predecessor; our helper receives that predecessor.
:::

(linear-linked-checks)=
## Check your understanding

Predict the operation result and the resulting state before opening the explanation.

**1. Why assign new.next before replacing b.next in the insertion trace?**

:::{dropdown} Show explanation
It preserves the old successor C before overwriting B’s outgoing link.
:::

**2. Does holding tail make removal of a singly linked tail O(1)?**

:::{dropdown} Show explanation
No. Its predecessor is still needed to repair the new tail link.
:::

Next: [Circular-array queues](circular-queues.md).
