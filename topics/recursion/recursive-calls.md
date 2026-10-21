# Recursive calls, base cases and termination

A function is recursive when its computation leads to another call of itself, directly or through other functions. The examples here use direct recursion: the same function solves a smaller instance and uses its result to finish the original task.

(recursive-definition)=
## Express the problem using a smaller instance

For a nonnegative integer n, define S(n) as the sum of the integers from 1 through n. The empty sum S(0) is zero. For n > 0:

$$
S(n)=n+S(n-1),\qquad S(0)=0.
$$

The recursive rule does not yet perform the addition. It says that the result of S(n − 1) is needed first.

(base-and-recursive-cases)=
## Base case and recursive case

```python
def sum_to(n):
    if type(n) is not int or n < 0:
        raise ValueError("Expected a nonnegative integer")
    if n == 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(3))  # 6
print(sum_to(0))  # 0
```

The **base case** returns an answer directly. The **recursive case** calls the same function on a smaller value, then completes the pending addition. The guard rejects inputs outside the stated domain; otherwise a negative input would keep decreasing without reaching zero. The explicit check accepts Python `int` values exactly, excluding Booleans and other types.

(calls-and-returns)=
## Calls go down; answers return up

![The calls sum_to(3), sum_to(2), sum_to(1) and sum_to(0) descend towards the base case. Return values 0, 1, 3 and 6 complete the waiting additions in reverse order.](../../assets/recursion/calls-and-returns.svg)

For `sum_to(3)`, the outer call waits for `sum_to(2)`. That call waits for `sum_to(1)`, which waits for `sum_to(0)`. Returning 0 does not return from every call at once: it completes the innermost call only. The waiting additions then finish in reverse order.

| Call being completed | Returned child result | Remaining operation | This call returns |
|---|---:|---|---:|
| `sum_to(0)` | none | Base case | 0 |
| `sum_to(1)` | 0 | 1 + 0 | 1 |
| `sum_to(2)` | 1 | 2 + 1 | 3 |
| `sum_to(3)` | 3 | 3 + 3 | 6 |

Each call has its own argument value. The n in the outer call is still 3 while another call is working with n = 2. It has not been globally overwritten.

(recursive-termination)=
## A base case must be reachable

To justify termination, identify a measure that decreases on every recursive step and cannot decrease forever within the valid domain. Here that measure is the nonnegative integer n. Every recursive call reduces it by one, so zero must eventually be reached in the mathematical process.

A function that tests n == 0 but calls itself with n + 1 does not make progress from positive n. A call with the unchanged n fails for the same reason. A base case written in the code is insufficient unless valid recursive paths reach it.

Smaller need not always mean “subtract one”. Halving a positive size, advancing along a finite acyclic chain, or reducing an interval can also establish progress. The stopping rule must match the measure and domain.

(recursive-correctness)=
## Why can we trust the recursive result?

Separate termination from correctness. First, the base case gives the correct empty sum. Then assume the smaller call correctly returns 1 + … + (n − 1). Adding n gives the required sum through n. This reasoning is valid because the call is on a smaller instance and the sequence reaches a correct base case; it is not permission to assume an arbitrary self-call will work.

The formula n(n + 1)/2 can compute this sum without recursion. We use recursive summation to expose the call mechanism, not to recommend it as the fastest or safest implementation for large n.

Next: [The call stack](call-stack.md).

**Browse:** [Recursion](recursion.md) · [Concept index](../../concepts.md)
