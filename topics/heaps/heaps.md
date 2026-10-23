# 9. Priority queues and heaps

A queue chooses the oldest waiting item. A priority queue chooses the most important item under a stated priority rule. A binary heap implements that rule by keeping an extreme priority at the root while maintaining a compact, shallow tree.

## Reading route

1. [Priority-queue behaviour](priority-queues.md): define selection, empty cases and ties.
2. [Heap order, shape and array indices](heap-representation.md): connect a complete tree to its array representation.
3. [Insertion and sift-up](heap-insertion.md): append at the next leaf and repair one ancestor path.
4. [Root removal and sift-down](heap-removal.md): preserve complete shape and choose the correct child.
5. [Bottom-up heap construction](heap-construction.md): build in linear time rather than repeatedly inserting.
6. [Python heaps and application records](heap-applications.md): attach payloads, resolve ties and handle changing priorities.
7. [Heapsort, costs and choices](heap-sorting-costs.md): distinguish extraction from in-place sorting and compare heaps with search trees.

Review [ADTs](../linear-structures/adts-and-contracts.md), [dynamic arrays](../linear-structures/dynamic-arrays.md), [tree terminology](../searching/tree-basics.md) and [sorting properties](../sorting/sorting-properties.md). AVL implementation is not a prerequisite, but the final comparison explains how their invariants support different operations.

The core follows the lecture's min-heap `[2, 5, 4, 9, 7, 6]`. Teaching functions store finite numeric priorities, with constant-time comparisons and assignments assumed. Application examples separately attach records. No notebook is needed.

## Consistent operation and implementation route

Each reading follows **purpose/contract → representation and invariant → visual trace → implementation → choices/correctness → time/space → suitability → self-checks**, adapted to the helper or algorithm it explains. All seven readings start with goals/prerequisites and end with two open prediction checks. The original nine diagrams and numerical traces remain.

| Layer | Return and mutation contract | What the code implements |
|---|---|---|
| Numeric list heap | Push returns None; peek observes a priority; pop removes and returns one | Min-heap sifts, push, peek, pop and copying bottom-up build |
| Record priority queue | Insert returns None; peek observes an item; remove/extract returns and removes it | Stable min queue and numeric-priority max adapter, size/empty and FIFO ties |
| Sorting | Return None and reorder the supplied list | Iterative max-heap heapsort, O(1) workspace and no stability promise |

The public [min/max contract table](priority-queues.md#priority-queue-adt) separates entry count, duplicate payloads and empty behaviour. Record adapters delegate internal storage to heapq; numeric functions expose the repair mechanics. Bulk construction is shown for numeric priorities, not as an unimplemented method on the record class.

Arbitrary-item removal, indexed priority changes, automatic obsolete-entry cleanup and hard latency guarantees are not supplied by the small queue classes. Their conceptual strategies remain explained separately. The [cost comparison](heap-sorting-costs.md#heap-operation-costs) counts resizing, output and key-operation assumptions explicitly.
