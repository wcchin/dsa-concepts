# Abstract data types: behaviour before representation

**After this page, you should be able to:**

- Distinguish an ADT's promises from its representation and implementation.
- Read a small operation contract, including its empty-state behaviour.

**Builds on:** [Collections and classes](collections-and-classes.md) introduces objects, methods and valid states.

(adt-introduction)=
## Three related questions

An **abstract data type (ADT)** describes the values being managed, the available operations and their required behaviour. It lets us reason about what a collection promises before choosing how to store it.

| Concept | Question | Stack example |
|---|---|---|
| ADT | What behaviour must operations provide? | Push adds an item; pop removes the most recently pushed item still present |
| Data structure | How are the data and relationships organised? | A dynamic array, or linked nodes with a reference to the top |
| Implementation | How do code and algorithms realise that organisation? | A class using a Python list, or a class updating node references |

A class can implement an ADT, but its method names alone do not establish the required behaviour. A queue also adds and removes items, yet removes the earliest waiting item instead of the newest one.

(adt-intro-stack-trace)=
## The same stack behaviour with different storage

Imagine recording shuttle-stop codes so the latest addition can be undone first. This is **last in, first out (LIFO)**. Read the following states from bottom to top:

| Operation, starting empty | Returned result | Stack afterwards |
|---|---|---|
| `push("KR")` | `None` | KR |
| `push("MUS")` | `None` | KR, MUS |
| `push("UTN")` | `None` | KR, MUS, UTN |
| `pop()` | `"UTN"` | KR, MUS |
| `peek()` | `"MUS"` | KR, MUS |

Both an array-backed stack and a linked-node stack should produce these results under the same contract. `peek()` observes the top; `pop()` also removes it. The client can use these operations without inspecting an array index or a node link.

The costs and memory layout can differ. An array may occasionally grow and copy references; a linked implementation allocates nodes and stores links. Matching behaviour does not imply identical efficiency. We will develop the implementations and their costs in [Topic 5](../linear-structures/linear-structures.md).

(adt-intro-contract)=
## State the exceptional cases, too

An **operation contract** specifies valid requests, returned results and changes to the logical state. For this example, `push` returns `None`; successful `pop` removes and returns exactly the top item. Both empty `pop` and empty `peek` raise `IndexError`, leaving the stack empty. Other interfaces can choose another policy, but must state it clearly.

These promises describe externally observable behaviour. Internal details can change as long as supported operations continue to satisfy the contract. This separation will help us compare several implementations of the same ADT throughout the book.

(adt-intro-operation-checklist)=
## Read a contract without exposing the storage

For each supported operation, ask what inputs are valid, what it returns, what logical state changes, and what happens at boundaries or on failure. An observer such as `peek` leaves the logical stack unchanged; a mutator such as `pop` changes it. Internal bookkeeping can change without changing the abstract value, provided the promised behaviour remains the same.

| Question | Stack contract here | A different requirement |
|---|---|---|
| Which waiting item is selected? | Most recently pushed | A queue selects the earliest waiting item |
| Does observation remove it? | No; use `peek` | `pop` removes and returns it |
| Can equal values appear twice? | Yes; each push adds one entry | A set keeps distinct values |
| What happens when empty? | `peek` and `pop` raise `IndexError` | Another API may choose a different stated policy |

The trace does not require the client to know an array capacity or node address. Repeated equal values are still separate stack entries. An empty error is distinguishable from a stored `None`: `None` can be a legitimate item, while empty `pop` raises an exception.

## Implementation choices and the later reading route

Two implementations can satisfy the same functional contract while differing in allocation, layout, per-operation costs and worst-case guarantees. A dynamic array and linked stack therefore need both a behavioural comparison and an implementation-specific cost analysis. Those details belong with [stacks](../linear-structures/stacks.md), not in this brief introduction.

The rest of the book applies this distinction to [sequences/queues/deques](../linear-structures/linear-structures.md), [maps and sets](../maps-sets-hashing/maps-sets-hashing.md), [ordered sets](../searching/ordered-set-operations.md), [priority queues](../heaps/priority-queues.md) and [disjoint sets](../union-find/disjoint-sets.md). Their operations differ because their promised behaviour differs; every ADT need not expose the same insert/remove names.

:::{tip} Common misconception
**Matching method names establish the same ADT.** Clients need matching behaviour, returns and boundary policies, not merely functions called push and pop.
:::

(foundation-adt-checks)=
## Check your understanding

Predict the result or draw the references before opening the explanation.

**1. Two classes both offer push and pop, but one removes the oldest waiting entry. Are both stacks under this contract?**

:::{dropdown} Show explanation
No. The oldest-entry policy violates LIFO. It is queue-like behaviour even if its methods use stack names.
:::

**2. Starting empty, push(None) then pop(). Is the returned None proof that pop failed?**

:::{dropdown} Show explanation
No. It successfully removes the stored None item. Calling pop again on the now-empty stack raises IndexError, so failure is not encoded by that payload value.
:::

For detailed contracts, observers and mutators, and implementation comparisons, continue later with [ADTs and contracts](../linear-structures/adts-and-contracts.md). Next in the main reading route: [Analysing algorithms](../analysis/analysis.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
