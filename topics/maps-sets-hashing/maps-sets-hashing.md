# 6. Maps, sets and hashing

A station directory answers “which name belongs to this identifier?” A visitor log answers “have we seen this identifier before?” The first question needs an association; the second needs membership. Neither question requires a numerical position in a sequence.

Maps and Sets describe these two kinds of behaviour. Hashing is a technique that can support both. Keeping the levels separate lets us reason about correctness before selecting an implementation.

## Reading route

Looking for a particular term? Use the [concept index](../../concepts.md) to find concepts alphabetically or browse them by topic.

1. [Maps](maps.md): associate unique keys with values.
2. [Sets](sets.md): represent distinct elements and membership.
3. [Hashing fundamentals](hashing.md): turn a key into an initial table index.
4. [Separate chaining](chaining.md): handle collisions within buckets.
5. [Open addressing](open-addressing.md): handle collisions through probing.
6. [Performance](performance.md): understand load, rebuilding and cost claims.
7. [Choosing a structure](choosing.md): connect the required operation to the design.

## Prerequisites

You should be able to read Python lists, loops, tuples and functions, and distinguish mutation from rebinding. The planned [ADTs topic](../linear-structures/linear-structures.md) develops the contract/implementation distinction; the [analysis topic](../analysis/analysis.md) develops asymptotic bounds.

By the end, you should be able to trace lookup, insertion, replacement and deletion, explain why collisions do not imply equal keys, and state the assumptions behind a constant-time claim.

