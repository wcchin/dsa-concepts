# Data structures, algorithms and problem requirements

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

The problem is **first-occurrence search**, not sorting or finding every match. The input order matters: the first MUS is at index 1. Python indices begin at zero. Here `None` explicitly reports absence, while index 0 is a valid answer. A client should test `result is None`, rather than use a truth-value check that would also treat 0 as false.

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

We will later separate an **abstract data type**, which specifies behaviour, from an implementation that supplies it. [Maps and Sets](../maps-sets-hashing/maps-sets-hashing.md) illustrate why a requirement such as key lookup does not itself prescribe hashing.

## Questions to revisit

Why does first-occurrence search stop at the first match? What does an empty input return? Would a Set preserve the information needed by this particular problem? Each answer depends on the specification, not just the Python syntax.

Next: [Objects, references, identity and equality](objects-and-references.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
