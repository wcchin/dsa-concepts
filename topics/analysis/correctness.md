# Correctness, termination and evidence

**After this page, you should be able to:**

- Connect a contract to invariant initialisation, maintenance, exit and progress.
- Distinguish correctness evidence, termination and resource analysis.

**Builds on:** [Counting work](counting-work.md), [cases/bounds](cases-and-bounds.md) and [complete complexity claims](code-and-space.md#complete-complexity-claim).

(algorithm-contract-reasoning)=
## State the claim before proving it

Specify the valid inputs, required output, allowed mutation and exceptional cases. A sort must preserve records as well as order them. A search returning any match has a different contract from first-occurrence search. A cost proof cannot establish either behaviour on its own.

(loop-invariant-method)=
## An invariant connects intermediate states to the goal

For a loop, explain three steps: **initialisation** establishes the invariant; **maintenance** shows one iteration preserves it; **exit** combines the invariant with the stopping condition to establish the result. For binary search, the invariant retains all possible matches in the candidate interval; an empty interval then proves absence.

An invariant need not say that the whole result is already correct. In insertion sort, only the processed prefix is sorted. In BFS, discovered vertices include both waiting and already expanded vertices. State exactly which part of the computation is described.

(linear-search-proof)=
## Work one complete argument through linear search

Use [`contains_with_count`](counting-work.md#cost-model) on a finite unchanged list of n values, with equality behaving consistently. Its contract is to report whether a target match exists and count the comparisons performed, stopping at the first match.

Before the next comparison, let k be the number of already examined positions. The invariant is: **the first k positions contain no match, and `comparisons == k`**. Initially k=0, so the empty processed prefix establishes it. On an iteration, incrementing the counter records the new comparison. If equality succeeds, returning `True` is justified by that matching value and the count is k+1. If equality fails, one more nonmatching position extends the invariant to k+1.

If the loop exhausts the list, k=n, so the invariant proves no position matches and returning `(False, n)` is correct. The empty input follows this exit argument immediately. Each non-returning iteration reduces the remaining positions n−k by one, so the finite traversal terminates.

The same argument connects correctness to cost without confusing them: first success at index j gives j+1 comparisons; absence gives n. Those counts become total-time bounds only after applying the [cost model](counting-work.md#cost-model).

(termination-variant)=
## Progress needs a bounded decreasing measure

Termination uses a **variant** or progress measure: for example, remaining search-interval length, unprocessed items, or the distance to a recursion base case. It must decrease on every relevant step and cannot decrease forever within the valid domain.

Correct partial results do not guarantee termination. Likewise, a terminating function can return the wrong answer. Python's recursion limit can prevent a mathematically terminating recursive algorithm from completing on large inputs.

(inductive-algorithm-reasoning)=
## Recursion uses smaller valid instances

Prove the base case, assume the recursive result for a strictly smaller instance, then explain why the remaining local work gives the required larger result. Merge sort needs a correct merge; BST deletion needs reconnection that preserves ancestor bounds. “It calls itself” is neither a correctness proof nor a cost analysis.

(counterexamples-and-tests)=
## Tests can expose a false claim

A single counterexample refutes an unconditional claim. Empty inputs, singletons, repeated keys, extreme orderings and disconnected graphs often reveal missing assumptions. Compare small results with a simpler trusted method, and check invariants after every update where practical.

Passing examples increases confidence but does not prove the claim for every input. Use tests alongside the invariant, induction, exchange or other argument appropriate to the algorithm. Later, [greedy design](../strategies/greedy.md) explains why plausible local choices need a separate proof.

## Choose an argument that matches the procedure

| Claim | Suitable evidence | What remains to establish |
|---|---|---|
| A loop preserves candidate answers or a processed prefix | An invariant with initialisation, maintenance and exit reasoning | Progress/termination and operation costs |
| A recursive result is correct | Base cases, strictly smaller valid calls and a correct combine step | Call/stack costs and runtime limits |
| A greedy choice preserves an optimum completion | A problem-specific exchange or other safe-choice argument | Feasible progress and implementation costs |
| A proposed universal claim is false | One valid counterexample | The corrected claim or algorithm |
| The implementation matches expected small results | Independent oracle and boundary/invariant checks | A general argument beyond those tested cases |

An invariant/progress proof does not have a single generic complexity class. Count the work in maintaining the invariant, including any validation performed by the implementation. A debug check that scans an entire structure after every local update can change runtime even when the update itself is constant-time.

Use proof and testing together: identify the promised behaviour first, explain why it holds, then count how the implementation achieves it. An efficient wrong answer does not meet the contract; a correct but nonterminating procedure does not establish total correctness.

:::{tip} Common misconception
**A decreasing progress measure proves the returned answer is correct.** It establishes termination when properly bounded; the returned result still needs a correctness argument.
:::

(analysis-correctness-checks)=
## Check your understanding

Predict the count or assess the claim before opening the explanation.

**1. For linear search, does “the examined prefix has no match” need to hold after a successful match returns?**

:::{dropdown} Show explanation
No. The invariant is stated before the next comparison and after a failed comparison. A successful comparison takes a separate return branch whose matching value proves the positive result.
:::

**2. A routine passes every test for lists of length at most five. Does that prove it works for every finite list?**

:::{dropdown} Show explanation
No. The tests cover those cases only. A larger valid counterexample could still refute the claim; an invariant or another general argument is needed.
:::

Continue to [Recursion](../recursion/recursion.md), return to [algorithm analysis](analysis.md), or use the [reading guide](../../reading-guide.md) to connect the examples across topics.
