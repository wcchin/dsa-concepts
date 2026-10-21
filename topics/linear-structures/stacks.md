# Stacks: newest first

(stack-adt)=
## LIFO and the top

A **stack** adds and removes items at one logical end, the **top**. It follows **last in, first out (LIFO)**: the most recently pushed item still present is the next one popped.

| Operation | Meaning |
|---|---|
| `push(x)` | Add x at the top |
| `pop()` | Remove and return the top item |
| `peek()` | Return the top item without removing it |
| `is_empty()` | Report whether the stack has no items |

![A stack trace pushes A, B and C, pops C, then pushes D, leaving A, B, D from bottom to top.](../../assets/linear-structures/stack-trace.svg)

(stack-underflow)=
## Empty operations need a policy

Popping an empty stack is **underflow**. Here both empty `pop()` and empty `peek()` raise `IndexError`. Returning `None` instead would be ambiguous if `None` were a legitimate stored item, unless the interface supplied another way to distinguish these outcomes.

(array-stack)=
## An array-backed implementation

Use the back of a Python list as the top. Adding or removing there avoids shifting the earlier references.

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def is_empty(self):
        return not self._items
```

The representation rule is: `_items` holds the logical stack from bottom to top, and its last position is the top. The underscore marks internal state by convention; clients should use the stack methods. `push` returns `None`, while `pop` returns the removed item.

Dynamic-array resizing makes pushing $O(1)$ amortised, with an occasional linear-cost resize. Back removal does not shift items; a resizable implementation may occasionally shrink storage, so constant amortised cost need not imply a constant worst-case cost for every pop. A linked stack with its top at the head uses a different implementation of the same LIFO rule.

(stack-applications)=
## Reversing and nesting

Undo history reverses recent actions: changing a colour is undone before the earlier action of adding a label. A useful stack stores enough information to reverse each action, not merely its name. Function calls also nest: a called function finishes before its caller resumes. See [the call stack](../recursion/call-stack.md).

(bracket-matching)=
## Match the most recent unmatched opener

For nested brackets, keep unmatched opening symbols in a stack. A closing symbol must match the top. Counting opening and closing symbols is insufficient: `({)}` has equal counts but incorrect nesting.

```python
def brackets_balanced(text):
    openers = []
    matching = {')': '(', ']': '[', '}': '{'}
    for symbol in text:
        if symbol in '([{':
            openers.append(symbol)
        elif symbol in matching:
            if not openers or openers.pop() != matching[symbol]:
                return False
    return not openers
```

The invariant is that the stack contains exactly the unmatched openers in the processed prefix, in nesting order. An unexpected closer or wrong type rejects immediately; leftover openers reject at the end. This teaching function ignores all non-bracket characters; it does not parse quoted strings or comments in a programming language.

![The bracket matcher rejects the closing parenthesis in an opening-parenthesis, opening-brace, closing-parenthesis sequence because the top opener is a brace.](../../assets/linear-structures/bracket-matching.svg)

For $n$ characters, the scan takes $O(n)$ time and up to $O(n)$ auxiliary space; early rejection can finish sooner. Next: [Queues and deques](queues-and-deques.md).
