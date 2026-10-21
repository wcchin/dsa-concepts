# The call stack and waiting work

Recursion does not replace the current call. It starts another call while the caller retains the state needed to continue afterwards.

(stack-frames)=
## Each call has a separate frame

A **call frame** records the execution state of one invocation, including local bindings and where execution should resume. A **call stack** tracks active invocations. For ordinary sequential calls, the most recently called function must finish before its caller can continue.

![At the base case there are four live sum_to frames for n equal to 3, 2, 1 and 0. After the innermost return, three frames remain; after all returns, no sum_to frame remains.](../../assets/recursion/stack-frames.svg)

The diagram shows snapshots at different times. It omits the surrounding module or caller’s own frame. In the first snapshot, `sum_to(0)` is active and the three earlier calls are suspended. When the base case returns, its frame is removed and `sum_to(1)` resumes with the returned value 0.

Local bindings are separate, but referenced objects may still be shared. Passing a list to a recursive call does not automatically copy it. The [object model](../foundations/mutation-and-copying.md#function-arguments) still applies.

(return-vs-print)=
## Returning a result differs from printing it

`return` supplies a value to the caller and ends that invocation. `print` displays text and does not supply that text as the function’s result. A function that reaches its end without an explicit return value returns `None`.

The distinction is especially visible when work occurs on both sides of a recursive call:

```python
def trace_calls(n):
    if n == 0:
        print("base")
        return
    print("enter", n)
    trace_calls(n - 1)
    print("leave", n)

trace_calls(2)
```

For this example, n is a nonnegative integer. The output is:

```text
enter 2
enter 1
base
leave 1
leave 2
```

The first prints happen during descent. The later prints happen as calls finish. A recursive function intended to compute a sum must **return** its child result; merely printing the child result would not make it available for the caller’s addition.

(depth-and-calls)=
## Depth, total calls and live storage differ

For `sum_to(3)`, four invocations occur in total and four are simultaneously live at the base case. In a branching computation those numbers generally differ: one branch can finish and release its frames before another branch begins.

Maximum live depth determines frame storage when each frame has constant-sized state. Total calls contributes to time, along with the work performed in each call. A shallow tree can contain many calls; counting its depth alone is not a time analysis.

For `sum_to(n)`, there are n + 1 calls and n + 1 live frames at maximum depth. Under the [word-cost model](../analysis/code-and-space.md#space-complexity), constant local work per frame gives Θ(n) time and Θ(n) frame storage. The addition result grows with n, so a more detailed bit-cost analysis would need to account for integer sizes too.

(python-recursion-limit)=
## Mathematical termination does not guarantee a successful Python run

Python limits recursion depth to protect the interpreter stack. A mathematically terminating computation can raise `RecursionError` before reaching its base case. The practical limit is finite and environment-dependent; it is not a complexity class.

An iterative version avoids growing the Python call stack:

```python
def sum_to_iterative(n):
    if type(n) is not int or n < 0:
        raise ValueError("Expected a nonnegative integer")
    total = 0
    for value in range(1, n + 1):
        total += value
    return total

print(sum_to_iterative(3))  # 6
```

Both versions perform linear work in n under the introductory model, but this loop uses Θ(1) working words. A recursive call placed last in a function does not make Python eliminate its frame. Prefer a suitable loop or explicit stack when input-dependent recursion can become deep, rather than assuming a larger recursion limit solves the design problem.

Next: [Divide, conquer and combine](divide-and-conquer.md).

**Browse:** [Recursion](recursion.md) · [Concept index](../../concepts.md)
