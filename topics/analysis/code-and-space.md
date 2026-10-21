# Analysing code and additional storage

Loop syntax suggests where to look, but iteration counts and operation costs determine the result. Explain the count first, then simplify its growth.

(consecutive-loops)=
## Consecutive loops add their costs

```python
def count_two_passes(values):
    work = 0
    for value in values:
        work += 1
    for value in values:
        work += 1
    return work

print(count_two_passes(["KR", "MUS", "UTN"]))  # 6
```

For n items, the selected operation executes n + n = 2n times. Including setup and loop overhead does not change tight time Θ(n) under a unit-cost model. Two consecutive linear passes do not become quadratic.

(nested-and-triangular-loops)=
## Count the inner work in nested loops

```python
def count_pairs(n):
    full = 0
    for i in range(n):
        for j in range(n):
            full += 1

    triangular = 0
    for i in range(n):
        for j in range(i):
            triangular += 1
    return full, triangular

print(count_pairs(5))  # (25, 10)
```

The first nest performs n operations for each of n outer iterations: n² total. In the second, the inner range depends on i, so add the row lengths:

$$
0+1+\cdots+(n-1)=\frac{n(n-1)}{2}.
$$

![Two five-by-five grids show 25 full-loop operations and 10 triangular-loop operations; each occupied cell corresponds to one pair of indices.](../../assets/analysis/loop-counts.svg)

Both counts have tight quadratic growth. For n ≥ 2, the triangular count lies between n²/4 and n²/2. Shorter rows reduce the count but do not make it linear. For n = 0 or 1, its inner body executes zero times; asymptotic claims concern large n.

Nesting does not always mean Θ(n²). If an inner loop performs a fixed three operations per outer iteration, the count is 3n. A full scan of n rows and m columns visits nm cells; retaining both parameters exposes that dependence.

(repeated-halving)=
## Repeated halving gives logarithmic iteration counts

```python
def halving_steps(n):
    if n < 1:
        raise ValueError("n must be positive")
    steps = 0
    remaining = n
    while remaining > 1:
        remaining //= 2
        steps += 1
    return steps

print(halving_steps(16))  # 4
print(halving_steps(13))  # 3
print(halving_steps(1))   # 0
```

Assume n is a positive integer. For 16, updates give 8, 4, 2, 1. For 13, floor division gives 6, 3, 1. After k updates, the remainder is floor(n/2ᵏ). The exact body count is **floor(log₂ n)**, not generally ceil(log₂ n). Division and the stopping condition determine the rounding.

Time is Θ(log n) asymptotically with constant-cost arithmetic. Θ(1 + log n) also makes fixed work at n = 1 explicit. Here n is the starting numerical value; measured against its binary bit length b, the iteration count is Θ(b). The integer precondition is part of the example; the code is not a general-purpose numeric validator.

(branch-costs)=
## Count the branch that runs

```python
def inspect_count(values, detailed):
    if not values:
        return 0
    if not detailed:
        return 1
    return count_two_passes(values)
```

This calls `count_two_passes` from the first example on this page. For a nonempty list, the non-detailed path takes fixed time, while the detailed path traverses it twice. Over both choices of `detailed`, best-case time is Θ(1) and worst-case time is Θ(n). If `detailed` is fixed by the specification, analyse that restricted input family.

Alternative branches are not automatically added as if both ran. Conditions and all work along the selected path still count.

(space-complexity)=
## Time and space measure different resources

Space complexity describes storage as size grows. Distinguish existing input, returned output and additional working storage. Count the maximum live storage, not every allocation that ever occurred.

(auxiliary-and-output-space)=
### State whether output storage is included

```python
def count_values(values):
    count = 0
    for value in values:
        count += 1
    return count

def copy_values(values):
    result = []
    for value in values:
        result.append(value)
    return result
```

| Function | Time | Working storage excluding input/output | Output storage |
|---|---|---|---|
| `count_values` | Θ(n) | Θ(1) words | Θ(1) words |
| `copy_values` | Θ(n) | Θ(1) words | Θ(n) references |

Here list append is amortised constant time, and a counter or reference occupies one word in our model. The copy creates a new outer list, not copies of every object; see [shallow copying](../foundations/mutation-and-copying.md#shallow-copy).

In this book, **auxiliary space excluding the input includes newly allocated result storage**, unless explicitly stated otherwise. Thus `copy_values` uses Θ(n) auxiliary space. If output is excluded, report its Θ(1) additional working space **and** Θ(n) output separately. Make the convention explicit.

Under a bit-level model, a counter up to n needs Θ(log n) bits, rather than one word. These introductory analyses use the stated word model. Recursive calls also consume working storage through the call stack, developed in [Topic 3](../recursion/recursion.md).

(complete-complexity-claim)=
## Write a complete complexity claim

Define input size, choose a resource, specify the case and cost assumptions, derive the count, and state the most informative justified bound.

For example: “For n list elements with constant-cost equality, linear search uses n target comparisons in the worst case, giving tight time Θ(n), and maintains Θ(1) extra words.” This explains more than “the code is Big-O”.

**Browse:** [Analysing algorithms](analysis.md) · [Concept index](../../concepts.md)
