# Choosing an ADT and representation

(linear-adt-selection)=
## Begin with the next-item rule

The noun in a story does not determine the ADT. Tasks can be processed by arrival, recency or urgency. Start with the operations and the rule for selecting the next item.

| Requirement | Natural abstraction | Reason |
|---|---|---|
| Undo the most recent action | Stack | Remove the newest outstanding action |
| Process print jobs in arrival order | Queue | Remove the oldest waiting job |
| Retain the most recent sensor readings | Queue policy, often implemented with a deque | Add at back and evict at front |
| Compare and remove opposite ends | Deque | Both endpoints are required |
| Edit a route by position | List / Sequence | Positions are part of the interface |
| Select the most urgent task | Priority queue | Priority determines the next item |

The last case needs a different policy, introduced in [priority queues and heaps](../heaps/heaps.md). No choice among the four linear ADTs should be forced onto a requirement it cannot express.

(linear-representation-costs)=
## Then check the frequent operations

Assume constant-time reference access and fixed-size node allocation. These are representation costs, not universal ADT guarantees:

| Operation | Dynamic array | Singly linked, with head and tail | Fixed circular-array queue |
|---|---|---|---|
| Valid indexed access | $O(1)$ | $O(n)$ worst case | Not exposed by this queue interface |
| Add at back | $O(1)$ amortised; $O(n)$ resize | $O(1)$ | $O(1)$ when not full |
| Remove front | $O(n)$ shifts | $O(1)$ | $O(1)$ when not empty |
| Insert after known position | Up to $O(n)$ shifts | $O(1)$ after a known node | Not exposed |
| Remove back | $O(1)$ without shrinking; typically amortised with resizing | $O(n)$ worst case to find predecessor | Not exposed |

For linked insertion, the cheap step assumes the relevant node is already available. If the input is an index or a key, finding the place can dominate. For a circular queue, constant-time operations do not imply unlimited capacity. The bounded implementation rejects insertions when full.

Memory and practical speed also matter: dynamic arrays have spare slots and resizing pauses; linked nodes have per-item links and allocation overhead. Contiguous references can improve cache locality. An implementation with attractive asymptotic costs can still be a poor fit for a small workload or a strict latency requirement.

(browser-history-stacks)=
## Some problems combine ADTs

Browser navigation can use a current page and two stacks: Back holds previously left pages, and Forward holds pages that can be restored after backing out. Here each stack is written bottom to top, with the top on the right.

| Action | Back stack | Current page | Forward stack |
|---|---|---|---|
| Start | `[]` | NUS | `[]` |
| Visit Canvas | `[NUS]` | Canvas | `[]` |
| Visit Week 5 | `[NUS, Canvas]` | Week 5 | `[]` |
| Back | `[NUS]` | Canvas | `[Week 5]` |
| Back | `[]` | NUS | `[Week 5, Canvas]` |
| Forward | `[NUS]` | Canvas | `[Week 5]` |
| Visit Python docs | `[NUS, Canvas]` | Python docs | `[]` |

Back pushes the current page onto Forward and pops Back into current. Forward does the reverse. A new visit pushes current onto Back and clears Forward: it creates a new continuation rather than preserving the abandoned one. An empty history disables the corresponding action. Explicitly keeping current separate avoids ambiguity about whether it is included in either history stack.

(adt-reasoning-process)=
## A reusable justification

State the required behaviour, identify its ADT, choose a representation for the frequent operations, and explain which invariant makes the implementation correct. Then give operation costs with their assumptions, including empty/full transitions and resizing.

For a printer: arrival-order service requires a Queue ADT; a linked head/tail representation removes at the head and appends at the tail; both endpoints are cleared when empty; each successful endpoint operation takes constant work under the stated allocation model. This is a complete argument, whereas “use a linked list because it is fast” omits the required policy and conditions.

Return to the [topic overview](linear-structures.md), look up a term in the [concept index](../../concepts.md), or continue to [Maps, Sets and Hashing](../maps-sets-hashing/maps-sets-hashing.md).
