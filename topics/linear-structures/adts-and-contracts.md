# ADTs and contracts

**After this page, you should be able to:**

- Specify selection, results and state changes independently of representation.
- Distinguish an observer, a mutator and a rejected request.

**Builds on:** [Topic 1’s ADT introduction](../foundations/adt-basics.md) supplies the first stack example.

Here we make operation contracts precise and connect them to the implementations in this topic.

(abstract-data-type)=
## Specify operations and behaviour

An **abstract data type (ADT)** describes the values being managed, the operations available, and the rules those operations must follow. It leaves the internal representation unspecified. The word *abstract* means we can reason about what an operation does without first knowing how the computer performs it.

Two objects that both provide `add(x)` and `remove()` need not implement the same ADT. One might remove the oldest item, while another removes the newest. Names alone do not establish behaviour.

(adt-contract)=
## An interface is a behavioural contract

Consider a queue for print jobs. A suitable contract says:

| Operation | Result and state change |
|---|---|
| `enqueue(job)` | Add the job after all waiting jobs |
| `dequeue()` | Remove and return the earliest waiting job |
| `front()` | Return the earliest waiting job without removing it |
| `size()` / `len(q)` | Return the number of waiting jobs without changing state |
| `is_empty()` | Report whether any jobs remain |

The contract must also explain exceptional cases. In the implementations here, removal or inspection of an empty collection raises `IndexError`. A fixed-capacity queue also raises `OverflowError` if an enqueue finds it full. Other designs can choose other policies, but clients must know which policy applies.

(linear-operation-vocabulary)=
## Add, inspect, remove and extract

An insertion adds a record; an inspection observes one without changing the collection. A removal must specify which record disappears and whether it is returned. “Extract” commonly means remove **and return**; stack `pop` and queue `dequeue` already express that behaviour, so we do not add duplicate extract methods.

| ADT | Add | Inspect | Remove and return |
|---|---|---|---|
| Sequence | `insert(i,x)`, `append(x)` | `get(i)` | `remove_at(i)` |
| Stack | `push(x)` | `peek()` | `pop()` |
| Queue | `enqueue(x)` | `front()` | `dequeue()` |
| Deque | `add_first(x)`, `add_last(x)` | `peek_first()`, `peek_last()` | `remove_first()`, `remove_last()` |

All implementations expose `size()` and `is_empty()`; `len(collection)` is also supported. Sequence `set(i,x)` replaces an existing record. Additions and replacement return `None`; removal/extraction returns the selected record, which itself may be `None`. No arbitrary-value deletion is promised by these endpoint ADTs.

For each operation, read **arguments → result → state change → invalid/empty/full cases → trace → time and extra-space cost**. The interface selects the behaviour; the representation determines how efficiently it can be supplied.

(observers-and-mutators)=
## Observing differs from modifying

An **observer**, such as `front()`, returns information without changing the logical collection. A **mutator**, such as `dequeue()`, changes it. Both might return the same job on one call, yet leave different states afterwards.

An operation contract includes preconditions, returned results, and postconditions. For example, after a successful dequeue, exactly one job is removed and the remaining jobs preserve their arrival order. A rejected empty dequeue should leave the state unchanged.

(adt-and-representation)=
## One behaviour, several representations

A queue can use a circular array or linked nodes. Either implementation can satisfy the same arrival-order rule. Conversely, one representation can support several ADTs: a dynamic array can implement a sequence or a stack, depending on the operations exposed.

![Behaviour is separated from representation: stack and queue contracts each have more than one possible implementation.](../../assets/linear-structures/adt-representations.svg)

Correctness and efficiency are separate questions. `list.append(x)` paired with `list.pop(0)` produces correct FIFO behaviour, but every front removal shifts the remaining references. A circular array preserves FIFO without those shifts.

(linear-sequence-adt)=
## Linear order and positional access

In a **linear** collection, items have a sequential order. This logical arrangement does not require the objects to occupy neighbouring memory locations. Linked nodes also form a linear sequence.

A List or Sequence ADT exposes positions through operations such as `get(i)`, `set(i, x)`, `insert(i, x)` and `remove_at(i)`. Here `remove_at` means removal by position; Python's `list.remove(x)` instead searches for a value. After insertion or removal, later positions change. Starting with `[A, B, C, D]`, removing position 1 gives `[A, C, D]`; setting position 1 to X then gives `[A, X, D]`.

Stack and queue interfaces deliberately expose fewer access choices. Those restrictions express the intended policy and make accidental violations harder. Choose the policy from the problem before choosing a familiar Python container.

:::{tip} Common misconception
**Operation names alone define an ADT.** Selection order, returns and exceptional behaviour are also part of the contract.
:::

(linear-contracts-checks)=
## Check your understanding

Predict the operation result and the resulting state before opening the explanation.

**1. Can `front()` and `dequeue()` return the same record yet behave differently?**

:::{dropdown} Show explanation
Yes. Front leaves it stored; dequeue removes it. The post-state distinguishes the operations.
:::

**2. Do we need a separate extract method beside queue dequeue?**

:::{dropdown} Show explanation
Not for this contract: dequeue already removes and returns the selected record.
:::

Next: [Sequence operations](sequence-adt.md), followed by stacks, queues and deques.
