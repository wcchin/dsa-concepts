# Choose a strategy from the problem

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

Next: [Greedy design](greedy.md).
