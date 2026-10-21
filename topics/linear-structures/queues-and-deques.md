# Queues and deques

(queue-adt)=
## FIFO and the two ends

A **queue** inserts at the **back** and removes from the **front**. Its **first in, first out (FIFO)** rule selects the earliest inserted item still waiting.

`enqueue(x)` adds at the back; `dequeue()` removes and returns the front; `front()` observes it. As with the stack, the empty case belongs to the contract. A name such as `jobs` or `queue` cannot establish FIFO: adding at the back and popping from the back implements LIFO.

![Identical additions and one removal leave different results: a stack removes C and a queue removes A.](../../assets/linear-structures/queue-versus-stack.svg)

FIFO expresses a policy, such as first-come, first-served print jobs. Emergency triage requires additional priority rules, so a simple queue alone cannot represent it. Later, [graph traversal](../graphs/graphs.md) will use a queue to explore vertices in discovery order.

(deque-adt)=
## A deque exposes both ends

A **deque** (double-ended queue) allows insertion and removal at both ends. Distinguish the container name *deque* from the queue operation *dequeue*.

| Abstract operation | Python `collections.deque` method |
|---|---|
| Add at back | `append(x)` |
| Add at front | `appendleft(x)` |
| Remove at back | `pop()` |
| Remove at front | `popleft()` |
| Inspect front / back | `d[0]` / `d[-1]` |

```python
from collections import deque

items = deque()
items.append("B")
items.appendleft("A")
items.append("C")
assert items.pop() == "C"
items.appendleft("X")
assert items.popleft() == "X"
assert list(items) == ["A", "B"]
```

Python's deque supports approximately constant-time additions and removals at either end. Indexed access near the middle is linear, so a deque is not a replacement for an array when arbitrary indexed access dominates. Empty endpoint removal or inspection raises `IndexError`.

A deque can implement stack behaviour by using only one end, or queue behaviour by adding at one end and removing at the other. A restricted stack or queue interface can still communicate the intended policy more clearly.

(rolling-window)=
## Keep the latest readings

To retain the latest four readings, add each new reading at the back and discard the oldest at the front when the window exceeds four items.

```python
window = deque([12, 15, 14, 18])
window.append(20)
if len(window) > 4:
    window.popleft()
assert list(window) == [15, 14, 18, 20]
```

![A rolling window discards the oldest reading 12 and adds 20, retaining 15, 14, 18, 20.](../../assets/linear-structures/rolling-window.svg)

The invariant after each update is: the window contains the most recent at most four readings, in arrival order. This policy intentionally discards old data. A bounded `deque(maxlen=4)` can perform that eviction automatically on append, while a bounded queue may instead reject an insertion when full. These are different contracts.

(palindrome-deque)=
## Compare the front and back

A palindrome reads the same in both directions. A deque can hold its characters: repeatedly remove and compare both ends until fewer than two remain. `RACECAR` gives matching pairs R/R, A/A and C/C, with E left in the middle.

```python
def is_palindrome(sequence):
    remaining = deque(sequence)
    while len(remaining) > 1:
        if remaining.popleft() != remaining.pop():
            return False
    return True
```

This checks exact element equality: it does not remove spaces or normalise case. Building and scanning the deque takes $O(n)$ time and $O(n)$ additional space for $n$ input elements. Two indices into an existing sequence can avoid that extra copy; the deque version illustrates the access policy.

Further reading: [Python's deque documentation](https://docs.python.org/3/library/collections.html#collections.deque). Next: [Arrays](arrays.md).
