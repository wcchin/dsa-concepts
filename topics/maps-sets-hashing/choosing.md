# Choosing a structure

**After this page, you should be able to:**

- Choose map or set behaviour before choosing a storage method.
- Compare exact-key workloads with ordering, range, prefix and proximity requirements.

**Builds on:** The operation contracts, collision traces and costs in the preceding readings.

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

For keys sharing initial symbols, [Topic 15: strings and tries](../strings/strings.md) develops prefix reporting and explains why string length also matters to hash-table costs. Exact lookup and finding all keys beginning with a prefix are different operations.

## Questions to revisit

- Why can unequal keys share an index?
- Why must replacement search for an equal key before adding an entry?
- Why can chaining delete directly but probing needs to preserve the search path?
- Why can live load look small while a probing search remains slow?
- Which assumptions are hidden in an expected constant-time claim?

Revisit [hashing](hashing.md), [chaining](chaining.md), [open addressing](open-addressing.md) and [performance](performance.md) to connect each question to its invariant.

Related topics: [ADTs and linear structures](../linear-structures/linear-structures.md), [BSTs](../searching/searching.md), [priority queues](../heaps/heaps.md), and [k-d trees](../kd-trees/kd-trees.md).

## Compare implementation choices without changing the ADT

| Requirement | Implementation consequence |
|---|---|
| Frequent exact-key updates | Hashing is suitable under distribution and load assumptions |
| Ordered traversal, predecessor or key ranges | Compare an ordered tree; insertion order is not key order |
| Predictable bounded storage | Fixed probing can reject full insertion; chaining uses growing buckets |
| Frequent deletion | Chaining removes bucket entries directly; probing needs path preservation and tombstone management |
| Distinctness versus associated values | Choose Set versus Map before choosing a collision strategy |

A complete explanation includes results and error policies as well as time and space. In this chapter Map remove returns its associated value; Set remove returns None. Consistency means making both contracts explicit, not forcing every ADT to have identical returns. For ordinary Python application code, use dict/set unless implementing the storage mechanism is the learning goal.

:::{tip} Common misconception
**A hash table directly answers every search question quickly.** Exact equality is different from ordered ranges, prefixes and spatial proximity.
:::

(hash-choices-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. Must a Set return elements in insertion order because a Python dictionary preserves it?**

:::{dropdown} Show explanation
No. That dictionary property is not a Set guarantee or a universal Map requirement.
:::

**2. Would a set of visited station IDs preserve how often each station was seen?**

:::{dropdown} Show explanation
No. Use a map from station to count when frequency matters.
:::

Next: [Searching and BSTs](../searching/searching.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
