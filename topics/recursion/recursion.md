# 3. Recursion and divide-and-conquer

A recursive solution delegates work to smaller instances of the same problem. Understanding it requires two views: how calls are created, and how their results return to complete the waiting work.

## Reading route

1. [Recursive calls and termination](recursive-calls.md): identify the base case, progress and returned results.
2. [The call stack](call-stack.md): follow separate frames and distinguish live depth from total calls.
3. [Divide, conquer and combine](divide-and-conquer.md): connect splitting to a complete worked sorting example.
4. [Recursion trees and costs](recursion-costs.md): explain balanced and unbalanced shapes, levels, time and space.
5. [Implementation choices](implementation-costs.md): compare index-based merging with front removal and account for slicing.

The figures show the calls, state and intermediate results used by the code. Read each diagram with the surrounding trace, rather than treating the tree as a picture of simultaneous execution.

## Before you start

Review [objects and references](../foundations/objects-and-references.md) and [algorithm analysis](../analysis/analysis.md). Basic function calls, loops and list indexing are assumed. No notebook is required.

After reading, you should be able to trace calls and returns, justify termination for valid inputs, distinguish recursion from divide-and-conquer, and explain why recursion depth alone does not determine time complexity.

For a particular term, use the [concept index](../../concepts.md). The planned [Sorting topic](../sorting/sorting.md) will compare merge sort with other strategies; here merge sort supplies a concrete example of recursive decomposition.
