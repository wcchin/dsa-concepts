# Counting work: input size and operation counts

**After this page, you should be able to:**

- Define input-size parameters and justify the chosen basic operation.
- Separate exact counts, complete-operation costs and measured runtime.

**Builds on:** [Objects, references and collections](../foundations/foundations.md) and basic Python loops/functions.

Observed runtime tells us how long one implementation took on one input in one environment. Algorithm analysis asks how its resource use depends on the input.

(input-size)=
## Define the input size

Input size measures the amount of input relevant to the work. It is not automatically the number of function arguments or the numerical magnitude of a value.

| Problem | Useful size measure |
|---|---|
| Search a sequence | n elements |
| Follow a finite route chain | n reachable nodes |
| Scan a rectangular grid | r rows and c columns; rc cells |
| Process a network | V vertices and E edges |
| Process an integer’s binary digits | Number of bits in its representation |

One `grid` argument can contain millions of cells. Two networks with the same number of vertices can have different numbers of edges. Keep multiple size parameters when one would hide relevant work.

Here n usually means list length. A search input also includes the target, even though n counts only list elements.

(analysis-counting-contract)=
## State what each example promises

The functions below assume a finite list that is unchanged during each traversal. `contains_with_count(values, target)` returns `(found, comparisons)` and stops at the first equality match; an empty list returns `(False, 0)`. `visit_count(values)` returns the number of visited elements, including zero for an empty list. Both observe the input without changing its elements or order.

The later node snippet has a different purpose: it **mutates links** after a valid known node. Its two assignments do not include a search, allocation, validation or copying a whole route. A useful complexity claim must cover the requested operation's actual contract rather than a convenient fragment of its code.

(cost-model)=
## Choose a cost model and basic operation

A **cost model** states what work we count and what operations we treat as constant cost. For a simple search, a useful basic operation is an equality comparison with the target:

```python
def contains_with_count(values, target):
    comparisons = 0
    for value in values:
        comparisons += 1
        if value == target:
            return True, comparisons
    return False, comparisons

stations = ["KR", "MUS", "UTN", "CLM"]
print(contains_with_count(stations, "UTN"))  # (True, 3)
print(contains_with_count(stations, "BG"))   # (False, 4)
```

The counter makes our selected work visible; it is instrumentation, not a necessary part of membership search. Count comparisons with the target, not source lines or every occurrence of an operator.

We initially treat list access, reference updates and operations on small values as constant time. Comparing long strings or doing arithmetic on very large Python integers can violate that assumption. State the model before applying it; more detailed models can produce different analyses.

(operation-count)=
## Exact counts depend on what is counted

```python
def visit_count(values):
    visits = 0
    for value in values:
        visits += 1
    return visits

print(visit_count(["KR", "MUS", "UTN"]))  # 3
print(visit_count([]))                      # 0
```

There are exactly n body executions. A corresponding `while` loop that tests whether more items remain checks its condition n + 1 times, including the final failed test. Different selected operations can have different counts.

A weighted model for the complete traversal might be T(n) = an + b, with positive constants a and b representing per-item and setup work. This is a consistent abstract model, not a universal count of Python machine instructions. Counting comparisons can characterise total time when the remaining overhead has a compatible bound; that connection should be justified rather than assumed for every algorithm.

(constant-vs-linear-work)=
## Separate finding a position from changing it

For a finite acyclic route, listing every stop or searching unsuccessfully visits all n nodes. Insertion after an **already known** node can use two link assignments:

```python
class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

known = Node("KR", Node("UTN"))
new = Node("MUS")
new.next = known.next
known.next = new
```

The assignments link KR to MUS and MUS to UTN. Here `new` is an unlinked node and `known` is a valid supplied node. The update count is two, independent of the route’s length; allocation and validation are separate work.

If the caller first searches for the insertion position, the complete request also includes that search. A constant-cost update does not make locating the position constant cost.

| n | Visit every node | Unsuccessful search | Link updates after a known node |
|---:|---:|---:|---:|
| 1 | 1 | 1 | 2 |
| 2 | 2 | 2 | 2 |
| 4 | 4 | 4 | 2 |
| 8 | 8 | 8 | 2 |

(measurement-and-analysis)=
## Analysis and timing complement each other

Timing helps evaluate implementations and practical input sizes. It depends on hardware, interpreter, representation and other activity. Operation counts explain scaling under assumptions. Use measurements to investigate performance and analysis to explain its pattern.

## From a comparison count to time and space

For the shown search on n list elements, a first match at zero-based index j uses exactly j+1 target comparisons; an absent target uses n. Under constant-cost equality and list iteration, total time is Θ(j+1) for that successful input and Θ(n+1) for an unsuccessful search. The added 1 includes empty-input setup/return work even when there are zero target comparisons.

The search and visit counter use O(1) working words and return O(1) result words in the stated word model. They do not allocate an n-element result. Exact comparison counts alone do not establish constant-cost equality: for strings of length at most L, a comparison may inspect O(L+1) symbols, so worst-case scan time can be O(n(L+1)+1) under a symbol-cost model.

Use operation counts to explain the mechanism and scaling; use timing to compare real implementations and finite workloads. Keep construction, validation, position lookup and the update itself separate when their costs differ.

:::{tip} Common misconception
**Zero target comparisons means zero runtime.** An empty search still enters the function, sets up its result and returns. The selected operation is only one part of total work.
:::

(analysis-counting-checks)=
## Check your understanding

Predict the count or assess the claim before opening the explanation.

**1. For ["KR", "UTN", "UTN"], what does searching for "UTN" return?**

:::{dropdown} Show explanation
(True, 2). The function stops at the first matching value; the later duplicate is not examined.
:::

**2. A link insertion performs two assignments after finding its position by a full scan. Is the complete request constant-time?**

:::{dropdown} Show explanation
No. The update is constant-time under the reference model, but the preceding scan takes linear time in the worst case.
:::

Next: [Growth rates](growth-rates.md).

**Browse:** [Analysing algorithms](analysis.md) · [Concept index](../../concepts.md)
