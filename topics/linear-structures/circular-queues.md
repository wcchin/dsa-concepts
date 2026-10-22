# Circular-array queues

**After this page, you should be able to:**

- Trace FIFO operations when logical order wraps around physical slots.
- Explain full/empty policies, invariants and fixed-capacity costs.

**Builds on:** [Queue contracts](queues-and-deques.md) and [array indexing](arrays.md).

## Operation contract for this implementation

Use the [queue operation table](queues-and-deques.md#queue-adt): enqueue returns `None`; front observes; dequeue removes and returns the front record. `size()` and `len(q)` agree. Empty front/dequeue raise `IndexError`; a full enqueue raises `OverflowError` before mutation. Capacity must be a positive exact integer or construction raises `ValueError`. `None` is a valid record.

(circular-array-queue)=
## Reuse space instead of shifting

An array queue can remove the front by advancing an index rather than moving every remaining item. Without reuse, this leaves unused space before the front. A **circular array** wraps indices back to zero, making that space available for later insertions.

For positive capacity $c$, maintain `front` and the number of live items `size`. Logical item $i$ occupies physical slot

$$ (\text{front}+i)\bmod c, \qquad 0\leq i<\text{size}. $$

(circular-queue-invariant)=
## Length separates empty from full

Maintain $0\leq\text{size}\leq c$ and $0\leq\text{front}<c$. The next enqueue position is `(front + size) % c`. That position equals `front` both when empty and when full; `size` distinguishes the two states. Looking only at the two endpoint indices is insufficient for this representation.

![A capacity-five queue removes A and B, adds E, then wraps F into slot zero. Its logical order becomes C, D, E, F.](../../assets/linear-structures/circular-wrap.svg)

(bounded-queue)=
## A complete fixed-capacity implementation

This queue rejects an enqueue when full. It does not silently discard an older item. `None` is allowed as data: occupancy is determined by indices and size, not by testing whether a slot contains `None`.

```python
class CircularQueue:
    def __init__(self, capacity):
        if type(capacity) is not int or capacity <= 0:
            raise ValueError("capacity must be a positive integer")
        self._data = [None] * capacity
        self._front = 0
        self._size = 0

    def __len__(self):
        return self._size

    def size(self):
        return len(self)

    def is_empty(self):
        return self._size == 0

    def enqueue(self, item):
        if self._size == len(self._data):
            raise OverflowError("queue is full")
        back = (self._front + self._size) % len(self._data)
        self._data[back] = item
        self._size += 1

    def front(self):
        if self.is_empty():
            raise IndexError("front of empty queue")
        return self._data[self._front]

    def dequeue(self):
        item = self.front()
        self._data[self._front] = None
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return item
```

`dequeue` first uses the observing method `front()` to check for emptiness and save the item. Clearing the vacated slot releases the queue's reference to that object. Then the index advances modulo capacity and the size decreases. No remaining item shifts.

Enqueue writes after the existing logical items and increases size. Both methods preserve the logical FIFO order even when physical slot order wraps around. Rejected operations raise before changing the state. Capacity one works with the same formulas.

(circular-queue-cost)=
## Fixed capacity changes the guarantee

Each successful endpoint operation takes $O(1)$ time under constant-time indexing and arithmetic. Initialisation takes $\Theta(c)$ time and storage. The backing array still occupies $\Theta(c)$ space when the queue is empty.

A growing circular queue can obtain more space when full, but it must copy items in **logical** order, starting at the old front. Typically it resets the new front to zero. Geometric resizing gives amortised constant-time enqueue; an individual resizing enqueue remains linear. The fixed-capacity code above has no resize step.

## Implementation choices and suitability

Storing a size makes full and empty distinguishable without reserving an unused slot. Clearing a removed slot releases its reference; testing slot contents would confuse a stored `None` with emptiness. Each operation uses O(1) workspace, while allocated storage remains Θ(c), independent of current size. Choose a fixed buffer when a known capacity and no resizing copies are desired; a full buffer rejects new arrivals under this contract.

:::{tip} Common misconception
**Matching endpoint indices alone distinguish empty from full.** Our stored size separates those states.
:::

(linear-circular-checks)=
## Check your understanding

Predict the operation result and the resulting state before opening the explanation.

**1. For capacity 5, front=2 and size=4, where does the next enqueue go?**

:::{dropdown} Show explanation
Physical slot (2+4) mod 5 = 1. Logical order can wrap across the end of storage.
:::

**2. Can a stored None be dequeued successfully?**

:::{dropdown} Show explanation
Yes. Size and indices track occupancy. A stored None is returned normally; only size zero means empty.
:::

Next: [Linked queues](linked-queues.md).
