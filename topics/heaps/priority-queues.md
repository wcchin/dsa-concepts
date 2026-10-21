# Priority queues: select by importance

(priority-queue-adt)=
## Specify which priority wins

A **priority queue** manages items with associated priorities. A **min-priority queue** returns the item with the smallest priority among the items currently stored. A **max-priority queue** selects the largest. Whether a small number means “urgent” belongs to the application convention, not to the word *priority* itself.

| Min-priority operation | Meaning |
|---|---|
| `insert(item, priority)` | Add an item with its priority |
| `peek_min()` | Return a minimum-priority item without removing it |
| `remove_min()` | Remove and return a minimum-priority item |
| `is_empty()` or `len(...)` | Inspect whether any items remain |

(priority-versus-fifo)=
## Arrival and priority are different policies

Suppose A, B and C arrive with priorities 4, 1 and 3. FIFO removes A, B, C; a min-priority queue removes B, C, A if all three are waiting before removals start.

![Identical arrivals A with priority 4, B with 1 and C with 3 produce FIFO order A B C and min-priority order B C A.](../../assets/heaps/priority-policy.svg)

Selection applies to **currently stored** items. Removing B now does not promise that its priority is below every priority that will arrive later. A scheduler may insert new events between removals; the queue is not necessarily sorting one fixed batch.

(priority-queue-contract)=
## Empty states and ties belong to the contract

The code in this topic raises `IndexError` for empty minimum inspection or removal. A singleton has a clear minimum; removing it leaves an empty queue. The application may use `None` as a payload because empty operations raise rather than returning an ambiguous sentinel.

If two items have equal priority, the basic priority rule does not specify which comes first. Some systems require FIFO within each priority; others permit any tied item. A stable tie rule must be implemented deliberately. A heap's tree shape alone does not supply it.

(priority-queue-implementations)=
## One ADT has several possible implementations

An unsorted list can append cheaply but may scan all items to locate a minimum. A sorted list exposes an extreme at an end, but insertion can shift many references. A binary heap balances efficient extreme selection with logarithmic path repairs during updates.

These are implementation trade-offs under the same behaviour, following [Topic 5's ADT distinction](../linear-structures/adts-and-contracts.md). A variable named `heap` does not establish the required invariant; arbitrary list operations can break it.

Next: [Heap representation](heap-representation.md).
