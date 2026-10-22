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

## Check your understanding

If two classes both provide `push` and `pop`, but one removes the oldest item, are both stacks? No: the second violates LIFO. Matching operation names is not enough.

For detailed contracts, observers and mutators, and implementation comparisons, continue later with [ADTs and contracts](../linear-structures/adts-and-contracts.md). Next in the main reading route: [Analysing algorithms](../analysis/analysis.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
