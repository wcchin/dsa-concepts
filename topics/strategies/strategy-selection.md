# Choose a strategy from the problem

**After this page, you should be able to:**

- Select a strategy from the required result, constraints and reusable information.
- Explain the correctness obligation and resource parameters before optimising.

**Builds on:** [Contracts and invariants](../analysis/correctness.md), [recursion](../recursion/recursion.md) and [sorting](../sorting/sorting.md).

(algorithm-design-strategies)=
## Establish a baseline before looking for a shortcut

Specify the required result, identify a straightforward correct search, then ask what structure makes some of its work unnecessary. An unproved fast-looking choice is not an improvement over a correct baseline.

| Strategy | What it uses | Main question to justify |
|---|---|---|
| Brute force | Enumerate candidates | Does the enumeration cover every valid answer? |
| Divide-and-conquer | Smaller parts that can be recombined | Why does the combination solve the whole problem? |
| Greedy | A choice that can be fixed safely | Why can some optimum include this choice? |
| Dynamic programming | Repeated subproblems | Does the state contain everything the future needs? |
| Backtracking | A partial candidate and reversible decisions | Does each prune exclude only impossible or irrelevant completions? |

(state-and-subproblem)=
## Define state by future relevance

State records the information needed to continue a computation. A shortest-path label describes a best route cost to a vertex; a coin-change subproblem can be the remaining amount. For choosing each item at most once, the remaining amount alone is insufficient: which positions remain available also matters.

Two histories can share a stored result only when their future possibilities and required result are equivalent under the state definition. Accidentally forgetting a constraint makes a small state fast but incorrect.

(algorithm-reduction)=
## Reuse a solved problem through a justified reduction

Sometimes design means translating a new question into an existing operation. A dependency schedule becomes topological ordering; a minimum connection network becomes an MST problem; a repeated exact-key query suggests a map. Explain how solutions to the translated problem satisfy the original requirements, including any information lost by the representation.

Algorithms can combine strategies and structures. Dijkstra uses a heap but depends on a greedy settlement proof. DAG shortest paths can be viewed as dynamic programming over dependency-ordered states. Recursion is a way to express execution; it does not itself identify which design strategy is being used.

(strategy-contract-checklist)=
## Compare problem contracts before comparing strategies

| Example in this topic | Required result | Constraint that changes the design |
|---|---|---|
| Activity selection | A compatible set of maximum cardinality | Half-open intervals; maximise count, not reward |
| Unbounded coin change | Minimum coin count, optionally with one reconstruction | Each positive denomination can be reused |
| Subset enumeration | Every matching subset of input positions | Each position used at most once; equal values can be distinct items |
| Sorted two-sum | One pair of distinct indices, or `None` | Sorted input and consistent numeric operations |
| Prefix totals / fixed windows | Range totals / the best fixed-width total | Snapshot inputs / specified valid width |

A result can be a boolean, a count, one witness or every witness. Those requests are not interchangeable. Before combining states or pruning candidates, state which distinctions the result must retain and which input assumptions justify eliminating work.

No strategy name has one universal time/space bound. Count candidate branches, distinct states and transitions, preprocessing, retained state and emitted output for the chosen implementation. A heap is a representation choice; greedy selection is a correctness policy; recursion is an execution mechanism. Several can appear in one algorithm.

:::{tip} Common misconception
**A smaller state is always an improvement.** Forgetting a constraint can merge histories whose legal future choices differ, producing a fast answer to the wrong problem.
:::

(strategy-selection-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. For choosing each item at most once, can remaining amount alone always identify a reusable state?**

:::{dropdown} Show explanation
No. The available positions also matter. Two histories with the same remaining amount may have different usable items.
:::

**2. Does a heap prove that a local minimum choice is globally optimal?**

:::{dropdown} Show explanation
No. It efficiently supplies a candidate. A settlement, exchange or other problem-specific argument must justify committing to it.
:::

Next: [Greedy design](greedy.md).
