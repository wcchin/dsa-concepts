# 5. Sequences, stacks, queues and deques

Suppose tasks arrive as A, B, C and D. Which should leave next: A, D, or an item at a specified position? Choose that behaviour before selecting storage.

## Reading route

1. [ADTs and contracts](adts-and-contracts.md): operations, returned results and rejected requests.
2. [Sequences](sequence-adt.md): get, set, insert, append and remove by position.
3. [Stacks](stacks.md): push, peek and pop at the newest end.
4. [Queues](queues-and-deques.md): enqueue, front and dequeue in arrival order.
5. [Deques](deques.md): add, inspect and remove at either end.
6. [Arrays](arrays.md): indexed slots, replacement, shifting and locality.
7. [Dynamic arrays](dynamic-arrays.md): length/capacity, growth and amortised costs.
8. [Linked structures](linked-structures.md): traversal, known-node edits and safe reference updates.
9. [Circular-array queues](circular-queues.md): fixed capacity, wraparound and full-state rejection.
10. [Linked queues](linked-queues.md): head/tail/size invariants and empty transitions.
11. [Choosing an ADT and representation](choosing-linear-structures.md): compare the same operations under stated assumptions.

Each ADT reading follows **purpose → operation contracts → representation and invariant → trace → implementation → implementation choices and correctness → time/space costs → suitability → self-checks**. Implementation readings connect those contracts to storage mechanics rather than inventing a new ADT. Every reading starts with goals and prerequisites and ends with two open prediction checks.

## Common operation families

| Family | What the client must know |
|---|---|
| Insert/add | Where the record goes; additions here return `None` |
| Inspect | Which record is returned without changing the collection |
| Remove/extract | Which record disappears; these removal methods also return it |
| Replace | Sequence `set` changes an existing record without changing length |
| Size/empty | `size()` and `len` agree; `is_empty()` tests whether that count is zero |

Empty endpoint access raises `IndexError`. The sequence page specifies valid indices; the fixed circular queue specifies full-state rejection. Duplicate values and `None` remain legitimate records. Optional search, iteration and arbitrary-value deletion need separate contracts; we do not add them indiscriminately to endpoint ADTs.

## Compare implementations without changing the promise

| Contract | Main code here | Alternatives explained |
|---|---|---|
| Sequence | Strict-index Python-list wrapper | Array shifts, dynamic growth, linked positional access |
| Stack | Python list with top at the back | Linked head as top |
| Queue | Restricted library-deque adapter, fixed circular queue, linked head/tail queue | List front removal and its shifting cost |
| Deque | Library-deque adapter with explicit first/last names | Circular buffers and doubly linked endpoints |

The wrappers are complete implementations of their stated interfaces; they delegate underlying library storage management. Linked known-node updates are low-level examples, not a complete positional linked-list class. We do not supply a second full deque allocator. All code uses ordinary Python and the standard library, with no notebook or additional package.

Review [Topic 1’s ADT introduction](../foundations/adt-basics.md), [objects and references](../foundations/objects-and-references.md), [classes and invariants](../foundations/collections-and-classes.md) and [algorithm analysis](../analysis/analysis.md). Later topics develop maps, sets and priority queues as separate ADT families.

Start with [contracts](adts-and-contracts.md), or use the [concept index](../../concepts.md) for an individual operation.
