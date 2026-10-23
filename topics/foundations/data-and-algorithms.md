# Data structures, algorithms and problem requirements

**After this page, you should be able to:**

- Connect a problem specification to a representation and its required operations.
- Trace first-occurrence search, including duplicates, zero indices and absence.

**Builds on:** Basic assignments, lists, functions, conditionals and loops; this opening page introduces the book's reasoning vocabulary.

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/foundations.js) · [Julia](../../examples/languages/foundations.jl).

These are language comparisons: Python-specific identity, type-hint and default-argument explanations remain about Python. JavaScript arrays use identity equality; the comparison example checks contents explicitly. Julia uses mutable structs and function-style methods; its default expressions, like JavaScript’s, are evaluated per call.

A campus shuttle route seems simple: keep a sequence of stops and visit them in order. But a useful program must also answer questions. Which stop comes next? Has a stop already been visited? What changes when a new stop is inserted?

These questions connect the information we store to the operations we need. That connection is the starting point for studying data structures and algorithms.

(data-structure)=
## What is a data structure?

A **data structure** organises data and the relationships between items so that operations can be performed on them. A sequence represents position; a key-value association represents identification; a network represents connections. The same real-world objects can appear in several representations because we ask different questions about them.

For example, a list of station codes describes an ordered route. A dictionary from code to station name describes a directory. A set of visited codes describes membership. None of these alone describes every possible journey through a transport network.

(algorithm)=
## What is an algorithm?

An **algorithm** is a procedure with sufficiently precise steps for solving a specified problem. For an algorithm intended to finish on valid finite inputs, the steps must make progress towards termination. Its specification describes the valid inputs and required outputs or effects.

Consider finding the first occurrence of a target stop in an ordered route:

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
def find_stop(route, target):
    for index, stop in enumerate(route):
        if stop == target:
            return index
    return None

route = ["KR", "MUS", "UTN", "MUS"]
print(find_stop(route, "MUS"))  # 1
print(find_stop(route, "CLM"))  # None
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
function find_stop(route, target) {
    for (let index = 0; index < route.length; index++) {
        if (route[index] === target) return index;
    }
    return null;
}
let route = ["KR", "MUS", "UTN", "MUS"];
console.log(find_stop(route, "MUS")); // 1
console.log(find_stop(route, "CLM")); // null
```

:::

:::{tab-item} Julia
:sync: julia

```julia
function find_stop(route, target)
    for (index, stop) in enumerate(route)
        stop == target && return index
    end
    return nothing
end
route = ["KR", "MUS", "UTN", "MUS"]
println(find_stop(route, "MUS")) # 2
println(find_stop(route, "CLM")) # nothing
```

:::

::::

The problem is **first-occurrence search**, not sorting or finding every match. The input order matters: the first MUS is at index 1. Python indices begin at zero. Here `None` explicitly reports absence, while index 0 is a valid answer. A client should test `result is None`, rather than use a truth-value check that would also treat 0 as false.

(first-search-contract)=
## Make the example's contract explicit

`find_stop(route, target)` expects a finite list of stop values, unchanged during the search, with a consistent equality comparison. It returns the **zero-based index of the first match**, or `None` when no match exists. It leaves the list and its order unchanged. Duplicates are allowed; the function does not remove them, return every occurrence, or sort the input.

The empty list returns `None`. A match at the first position returns 0, which is a successful result even though 0 is false in a boolean test. Even `None` can be a stored value: `find_stop([None], None)` returns 0. The absence marker is unambiguous because successful results are indices, not the stored stop values.

This teaching function does not perform a separate input-validation pass or promise an exception for every malformed request. State preconditions before reasoning about its normal result; other search interfaces may choose different returns or errors.

(algorithm-reasoning)=
## Follow the work and explain why it finishes

| Step for target MUS | Item examined | Decision |
|---|---|---|
| 1 | index 0: KR | Unequal; continue |
| 2 | index 1: MUS | Equal; return 1 |

Before examining index i, every earlier item has been checked and is unequal to the target. This observation explains why the first match can be returned immediately. Each unsuccessful iteration moves to the next item, so a finite route cannot keep the loop running forever. If there is no match, the function examines the whole route and returns `None`. An empty route reaches that same absence result without examining an item.

This example introduces four questions we will use throughout the book:

- **Specification:** what counts as a correct result?
- **Representation:** how are the input and relationships stored?
- **Correctness and termination:** why do the steps produce the required result and finish?
- **Cost:** how much work and additional storage do the steps require?

The loop above may inspect one item or every item. [Analysing algorithms](../analysis/analysis.md) will formalise that distinction; we do not need a timing experiment to see it.

(representation-and-operations)=
## Choose representations from required operations

| Requirement | Starting representation | Meaning |
|---|---|---|
| Keep stops in route order, including repeated visits | `list` | Positions form a sequence |
| Store a coordinate pair | `tuple` | Positions have fixed meanings |
| Retrieve a station name from its code | `dict` | A key identifies an associated value |
| Remember which stops have been visited | `set` | Membership matters; repetitions collapse |

A Set would lose route order and repeated visits. A list can store directory entries, but key lookup would need a search unless additional organisation is provided. “Can it store the data?” is therefore only the first question. Ask which operations recur and what their meaning must be.

The [ADT introduction later in this topic](adt-basics.md) separates an **abstract data type**, which specifies behaviour, from an implementation that supplies it. [Maps and Sets](../maps-sets-hashing/maps-sets-hashing.md) illustrate why a requirement such as key lookup does not itself prescribe hashing.

## Questions to revisit

Why does first-occurrence search stop at the first match? What does an empty input return? Would a Set preserve the information needed by this particular problem? Each answer depends on the specification, not just the Python syntax.

## Compare the complete request, not just the container

For a route of n stops, the first-match search examines at most n positions. A first-position match examines one; an empty route examines none. It keeps a fixed number of local references and returns one index or `None`, rather than copying the route. These are counts and storage observations; [Topic 2](../analysis/counting-work.md) introduces formal bounds and the assumptions behind constant-cost comparisons.

A set is useful for distinct membership but loses both repeated visits and route positions. A dictionary can retrieve a name by code, but that does not answer which occurrence comes first in a route. Choose the question and operation contract before comparing implementations; a faster answer to a different question does not meet this specification.

:::{tip} Common misconception
**A false-valued search result always means absence.** Index 0 is a valid first match. Test `result is None` for this particular interface.
:::

(foundation-problem-checks)=
## Check your understanding

Predict the result or draw the references before opening the explanation.

**1. For ["KR", "MUS", "KR"], what do searches for "KR" and "UTN" return?**

:::{dropdown} Show explanation
The first returns 0, and the second returns None. The later KR at index 2 does not replace the first-occurrence answer.
:::

**2. Can a set of stop codes replace the route without changing what find_stop must return?**

:::{dropdown} Show explanation
No. A set does not retain repeated visits or their sequence positions, so it cannot directly supply the required first route index.
:::

Next: [Objects, references, identity and equality](objects-and-references.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
