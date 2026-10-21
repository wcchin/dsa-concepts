# Python heaps, records and ties

(python-heapq)=
## A heap interface operates on an ordinary list

Python's `heapq` min-heap functions work with lists: `heapify` establishes heap order, `heappush` inserts, and `heappop` removes the minimum. The minimum can be inspected at index 0. The list still exposes ordinary list operations, so the caller must preserve the heap invariant.

```python
import heapq

values = [9, 5, 6, 2, 3, 4]
heapq.heapify(values)
heapq.heappush(values, 1)
assert heapq.heappop(values) == 1
assert values[0] == 2
```

The teaching sift functions show one valid implementation. Their exact intermediate layout need not match the library's; compare invariants and returned results rather than requiring an identical tied layout.

(heap-record-priorities)=
## Keep the payload separate from its selection key

An application often needs jobs or records, not bare numbers. An entry `(priority, sequence, item)` associates the priority with its payload. Tuple comparison examines fields from left to right.

(priority-queue-stable-ties)=
## Use a unique arrival sequence for FIFO ties

An increasing sequence number selects earlier arrivals among equal priorities. Because sequence numbers are unique, comparison resolves before reaching `item`; payload objects such as dictionaries do not need an ordering operation.

For arrivals A with priority 4, B with 1, C with 1 and D with 3, store sequence numbers 0, 1, 2 and 3. Removal gives B, C, D, A: priority first, then arrival only within ties. The sequence does not turn the whole structure into a FIFO queue.

![Entries with priorities and unique sequence numbers remove in priority order, with B preceding equal-priority C by arrival number.](../../assets/heaps/stable-priority-ties.svg)

```python
from itertools import count

class MinPriorityQueue:
    def __init__(self):
        self._heap = []
        self._sequence = count()

    def __len__(self):
        return len(self._heap)

    def insert(self, item, priority):
        entry = (priority, next(self._sequence), item)
        heapq.heappush(self._heap, entry)

    def peek_min(self):
        if not self._heap:
            raise IndexError("peek at empty priority queue")
        return self._heap[0][2]

    def remove_min(self):
        if not self._heap:
            raise IndexError("remove from empty priority queue")
        return heapq.heappop(self._heap)[2]
```

This class reuses the `heapq` import above. It returns **items**, while the numeric teaching heap returns priorities. Inputs must have consistently ordered priorities. Each instance owns its own heap and arrival counter; empty operations raise, so `None` can safely be an item.

(heap-changing-priorities)=
## Changing a key requires a maintenance strategy

The stored priority is a snapshot used for ordering. Editing a field inside the payload does not update that entry's tuple key. Directly changing an ordering field in the underlying heap can invalidate parent–child order.

One design maintains an item-to-index map and repairs the affected path, updating the map during swaps. Another adds a revised entry and skips obsolete entries when they are removed. That lazy design needs an explicit way to recognise obsolete entries and may store more entries than active items. These are additional algorithms, not features of the small class above.

Scheduled events, repeated next-job selection and maintaining a small set of best candidates are common uses. [Topic 11](../graph-algorithms/graph-algorithms.md) uses priorities in graph algorithms. Interface reference: [Python's heapq documentation](https://docs.python.org/3/library/heapq.html).
