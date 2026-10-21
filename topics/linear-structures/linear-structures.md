# 5. Abstract data types and linear structures

Suppose tasks arrive as A, B, C and D. Which should leave next: A, D, or a task at a specified position? The stored values do not answer that question. We need a rule for accessing and changing them.

This topic follows the Week 5 reasoning chain: describe the problem, specify the required behaviour, choose an ADT, choose a representation, preserve its invariants, and analyse the operations.

## Reading route

1. [ADTs and contracts](adts-and-contracts.md): separate visible behaviour from storage decisions.
2. [Stacks](stacks.md): trace LIFO operations and match nested brackets.
3. [Queues and deques](queues-and-deques.md): trace FIFO and both-end access, including rolling windows.
4. [Arrays and positional operations](arrays.md): explain direct indexing and why insertion shifts items.
5. [Dynamic arrays](dynamic-arrays.md): distinguish length from capacity and amortised from individual cost.
6. [Linked structures](linked-structures.md): traverse nodes and update references without losing the remainder.
7. [Circular-array queues](circular-queues.md): reuse front space with wraparound indices.
8. [Linked queues](linked-queues.md): maintain head, tail and the empty-state invariant.
9. [Choosing an ADT and representation](choosing-linear-structures.md): connect requirements to costs and combine structures when needed.

Review [objects and references](../foundations/objects-and-references.md), [classes and invariants](../foundations/collections-and-classes.md), and [algorithm analysis](../analysis/analysis.md). The code uses ordinary Python; no notebook or third-party package is required.

After reading, you should be able to choose an access policy, trace operations, distinguish a contract from an implementation, and justify a cost claim with its preconditions. Use the [concept index](../../concepts.md) for individual terms.
