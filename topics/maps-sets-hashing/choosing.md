# Choosing a structure

Choose the behaviour a problem needs before choosing a representation. Maps and Sets answer different questions; a hash table can implement either. A Set implementation can store keys without separate associated records, while a Map must retain the values as well.

| Required question | Starting choice | Reason |
|---|---|---|
| Which name belongs to station S01? | Map | An identifier retrieves an associated record |
| Have we visited S01? | Set | Only membership matters |
| How often was S01 visited? | Map of counts | Distinctness alone loses frequency |
| Which task arrived first? | Queue | Arrival order determines removal |
| Which pending task has highest priority? | Priority Queue | Priority determines removal |
| Which station is nearest to this coordinate? | Spatial search structure | Exact-key hashing does not directly organise proximity |

## Choosing by operations and complexity

A complete design explanation states the required operations, their meaning, the chosen representation, the invariant it preserves and the cost assumptions. “Use hashing because it is O(1)” leaves out whether the query is exact-key lookup and what keeps the table efficient.

For a station directory, a hash-based Map is a plausible choice when exact identifier lookup and updates dominate. If ordered key traversal or range queries matter, compare it with a search-tree representation. A Python dictionary’s insertion order does not turn it into a sorted search tree.

## Questions to revisit

- Why can unequal keys share an index?
- Why must replacement search for an equal key before adding an entry?
- Why can chaining delete directly but probing needs to preserve the search path?
- Why can live load look small while a probing search remains slow?
- Which assumptions are hidden in an expected constant-time claim?

Revisit [hashing](hashing.md), [chaining](chaining.md), [open addressing](open-addressing.md) and [performance](performance.md) to connect each question to its invariant.

Related topics: [ADTs and linear structures](../linear-structures/linear-structures.md), [BSTs](../searching/searching.md), [priority queues](../heaps/heaps.md), and [k-d trees](../kd-trees/kd-trees.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)

