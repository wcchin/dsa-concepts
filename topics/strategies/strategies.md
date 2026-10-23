# 14. Algorithmic problem-solving strategies

The course's core topics supply representations and several algorithms. This optional extension asks how to design another algorithm: what state is needed, which alternatives can be discarded, and what justifies the choice?

## Reading route

1. [Choose a strategy](strategy-selection.md): distinguish exhaustive search, divide-and-conquer, greedy choice and state reuse.
2. [Greedy design](greedy.md): prove an earliest-finish choice and find counterexamples to plausible alternatives.
3. [Dynamic programming](dynamic-programming.md): define subproblems, memoise or tabulate them, and reconstruct a result.
4. [Backtracking](backtracking.md): enumerate constrained choices with safe pruning and reversible state.
5. [Sequence patterns](sequence-patterns.md): use prefix sums, two pointers and fixed sliding windows.
6. [Complexity and practical limits](complexity-limits.md): relate output size, numeric input magnitude and tractability.

This material extends the syllabus; it does not change the assessment scope of CS2040HS. Read Topics 1–4 first. [DAG relaxation](../graph-algorithms/dag-shortest-paths.md) and [MST exchange reasoning](../graph-algorithms/spanning-trees.md) provide additional connections. [Topic 16](../applications/applications.md) integrates the graph algorithms in a complete transport-network case.

These are introductions, not a claim to cover every dynamic program, string algorithm or advanced data structure. The [coverage review](../../coverage-review.md) distinguishes implemented material from the remaining roadmap.

## A common design route

Across six readings, specify the problem/output contract, define sufficient state, justify each commitment or prune, trace the code, then count preprocessing, working state and returned data. Cost claims use the [stated numeric/word model](../analysis/counting-work.md#cost-model), with preprocessing and output counted explicitly. Trace the candidate schedule, subproblem, partial subset or window before comparing strategies. The examples introduce these design patterns; further DP families and complexity theory are listed in the coverage review.

Code listings offer Python, JavaScript and Julia tabs where a runnable example is present. Python remains the explanation and trace language; see the [language guide](../../code-languages.md) for native conventions and runnable topic downloads.
