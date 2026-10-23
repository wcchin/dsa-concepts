# 1. Foundations and Python’s object model

How can the same assignment sometimes appear to change several variables and sometimes leave them alone? Why does a list of stops behave differently from a dictionary of stops? These questions are the foundation for reading and reasoning about data structures in Python.

## Reading route

1. [Data structures and algorithms](data-and-algorithms.md): begin with the question and required operations.
2. [Objects and references](objects-and-references.md): trace names, identity, equality and absence.
3. [Mutation and copying](mutation-and-copying.md): distinguish object updates from reference updates.
4. [Collections and classes](collections-and-classes.md): choose built-in representations and connect custom objects safely.
5. [Abstract data types](adt-basics.md): separate promised behaviour, data organisation and implementation.

The campus shuttle examples run through these five pages. They are small enough to trace by hand and lead naturally to linked structures, search and graph representations.

## Before you start

You should be able to read basic Python assignments, function calls, `if` statements and loops. This is a conceptual Python refresher for DSA, rather than a complete first programming course. No notebook or additional package is needed to follow the explanations.

After reading, you should be able to draw references between objects, predict the effect of mutation and rebinding, explain shallow copying, identify the invariant maintained by a small class, and distinguish an ADT contract from its implementation.

## Carry the same questions into every structure

Begin with the required result and state changes. Identify which names, container slots and attributes reach each object; distinguish local rebinding from mutation through shared references. If a copy is made, determine exactly which levels remain shared. Then check which invariant the supported operations preserve and separate that behavioural promise from storage choices.

Use the reference diagrams to predict which object a name, slot or attribute reaches before running the code. Full container interfaces and formal time/space analysis are developed in later topics; the goal here is to explain the state change correctly.

For a particular term, use the [concept index](../../concepts.md). Continue with [Analysing algorithms](../analysis/analysis.md). For a developed application of these foundations, see [Maps, Sets and Hashing](../maps-sets-hashing/maps-sets-hashing.md).

Code listings offer Python, JavaScript and Julia tabs where a runnable example is present. Python remains the explanation and trace language; see the [language guide](../../code-languages.md) for native conventions and runnable topic downloads.
