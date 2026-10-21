# Concept index

Find a concept by its name or browse concepts by topic.

The wiki is being developed progressively. Topic 6, Maps, Sets and Hashing, is the first developed topic. Other topics currently provide scope outlines.

## Browse by topic

- [1. Foundations and Python’s object model](topics/foundations/foundations.md)
- [2. Analysing algorithms](topics/analysis/analysis.md)
- [3. Recursion and divide-and-conquer](topics/recursion/recursion.md)
- [4. Sorting](topics/sorting/sorting.md)
- [5. Abstract data types and linear structures](topics/linear-structures/linear-structures.md)
- [6. Maps, sets and hashing](topics/maps-sets-hashing/maps-sets-hashing.md)
- [7. Searching and binary search trees](topics/searching/searching.md)
- [8. Balanced search trees](topics/balanced-trees/balanced-trees.md)
- [9. Priority queues and heaps](topics/heaps/heaps.md)
- [10. Graphs and traversal](topics/graphs/graphs.md)
- [11. Graph ordering, paths and spanning trees](topics/graph-algorithms/graph-algorithms.md)
- [12. K-d trees](topics/kd-trees/kd-trees.md)
- [13. Union–find](topics/union-find/union-find.md)
- [14. Additional applications](topics/applications/applications.md)

## Find a concept alphabetically

This index currently covers the developed Maps, Sets and Hashing topic. Entries link to the relevant explanation.

### A
- [Amortised complexity](topics/maps-sets-hashing/performance.md#expected-and-amortised-complexity)

### B
- [Buckets](topics/maps-sets-hashing/chaining.md#buckets-and-lookup-in-separate-chaining)

### C
- [Collision](topics/maps-sets-hashing/hashing.md#hash-collisions-and-key-equality)

### D
- [Dictionary (`dict`)](topics/maps-sets-hashing/maps.md#map-operations-in-python)
- [Deletion in open addressing](topics/maps-sets-hashing/open-addressing.md#deletion-and-tombstones)

### E
- [Equality and hashing](topics/maps-sets-hashing/hashing.md#hash-collisions-and-key-equality)
- [Expected complexity](topics/maps-sets-hashing/performance.md#expected-and-amortised-complexity)

### H
- [Hash code](topics/maps-sets-hashing/hashing.md#keys-hash-codes-and-table-indices)
- [Hash function](topics/maps-sets-hashing/hashing.md#keys-hash-codes-and-table-indices)
- [Hashability](topics/maps-sets-hashing/hashing.md#hashability-in-python)

### I
- [Insertion order](topics/maps-sets-hashing/maps.md#dictionary-insertion-order)

### K
- [Key-value association](topics/maps-sets-hashing/maps.md#map-adt-and-operations)

### L
- [Linear probing](topics/maps-sets-hashing/open-addressing.md#linear-probing-and-wraparound)
- [Load factor](topics/maps-sets-hashing/performance.md#load-factor-and-collision-strategies)

### M
- [Map ADT](topics/maps-sets-hashing/maps.md#map-adt-and-operations)
- [Missing keys](topics/maps-sets-hashing/maps.md#missing-keys-and-none-values)

### O
- [Open addressing](topics/maps-sets-hashing/open-addressing.md)

### P
- [Probing](topics/maps-sets-hashing/open-addressing.md#linear-probing-and-wraparound)

### R
- [Rehashing](topics/maps-sets-hashing/performance.md#why-changing-capacity-requires-rehashing)
- [Replacement in a Map](topics/maps-sets-hashing/maps.md#map-adt-and-operations)

### S
- [Separate chaining](topics/maps-sets-hashing/chaining.md)
- [Set ADT](topics/maps-sets-hashing/sets.md)
- [Set difference](topics/maps-sets-hashing/sets.md#union-intersection-and-difference)
- [Set intersection](topics/maps-sets-hashing/sets.md#union-intersection-and-difference)
- [Set membership](topics/maps-sets-hashing/sets.md#set-operations-and-membership)
- [Set union](topics/maps-sets-hashing/sets.md#union-intersection-and-difference)

### T
- [Tombstone](topics/maps-sets-hashing/open-addressing.md#deletion-and-tombstones)

### U
- [Used load](topics/maps-sets-hashing/performance.md#live-load-and-used-load)

### W
- [Wraparound](topics/maps-sets-hashing/open-addressing.md#linear-probing-and-wraparound)

## Concepts grouped by topic

### 6. Maps, sets and hashing

**Maps**

- [Map ADT and operations](topics/maps-sets-hashing/maps.md#map-adt-and-operations)
- [Map operations in Python](topics/maps-sets-hashing/maps.md#map-operations-in-python)
- [Missing keys and `None` values](topics/maps-sets-hashing/maps.md#missing-keys-and-none-values)
- [Dictionary insertion order](topics/maps-sets-hashing/maps.md#dictionary-insertion-order)

**Sets**

- [Set operations and membership](topics/maps-sets-hashing/sets.md#set-operations-and-membership)
- [Membership and frequency](topics/maps-sets-hashing/sets.md#membership-does-not-preserve-frequency)
- [Union, intersection and difference](topics/maps-sets-hashing/sets.md#union-intersection-and-difference)

**Hashing**

- [Keys, hash codes and table indices](topics/maps-sets-hashing/hashing.md#keys-hash-codes-and-table-indices)
- [Hash collisions and key equality](topics/maps-sets-hashing/hashing.md#hash-collisions-and-key-equality)
- [Hashability in Python](topics/maps-sets-hashing/hashing.md#hashability-in-python)
- [Deterministic traces](topics/maps-sets-hashing/hashing.md#deterministic-traces)

**Separate chaining**

- [Buckets and lookup](topics/maps-sets-hashing/chaining.md#buckets-and-lookup-in-separate-chaining)
- [Python implementation](topics/maps-sets-hashing/chaining.md#reading-the-code)
- [Insertion and replacement](topics/maps-sets-hashing/chaining.md#insertion-and-replacement)
- [Separate bucket objects](topics/maps-sets-hashing/chaining.md#separate-bucket-objects)

**Open addressing**

- [Linear probing and wraparound](topics/maps-sets-hashing/open-addressing.md#linear-probing-and-wraparound)
- [Empty, occupied and deleted slots](topics/maps-sets-hashing/open-addressing.md#empty-occupied-and-deleted-slots)
- [Deletion and tombstones](topics/maps-sets-hashing/open-addressing.md#deletion-and-tombstones)
- [Bounded lookup](topics/maps-sets-hashing/open-addressing.md#a-bounded-lookup)
- [Tombstones and insertion](topics/maps-sets-hashing/open-addressing.md#tombstones-and-insertion)
- [Clustering and alternatives](topics/maps-sets-hashing/open-addressing.md#clustering-and-alternatives)

**Performance**

- [Load factor and collision strategies](topics/maps-sets-hashing/performance.md#load-factor-and-collision-strategies)
- [Live load and used load](topics/maps-sets-hashing/performance.md#live-load-and-used-load)
- [Rehashing](topics/maps-sets-hashing/performance.md#why-changing-capacity-requires-rehashing)
- [Expected and amortised complexity](topics/maps-sets-hashing/performance.md#expected-and-amortised-complexity)

**Choosing a structure**

- [Choosing by operations and complexity](topics/maps-sets-hashing/choosing.md#choosing-by-operations-and-complexity)
- [Questions to revisit](topics/maps-sets-hashing/choosing.md#questions-to-revisit)
