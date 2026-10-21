# Correctness, termination and evidence

(algorithm-contract-reasoning)=
## State the claim before proving it

Specify the valid inputs, required output, allowed mutation and exceptional cases. A sort must preserve records as well as order them. A search returning any match has a different contract from first-occurrence search. A cost proof cannot establish either behaviour on its own.

(loop-invariant-method)=
## An invariant connects intermediate states to the goal

For a loop, explain three steps: **initialisation** establishes the invariant; **maintenance** shows one iteration preserves it; **exit** combines the invariant with the stopping condition to establish the result. For binary search, the invariant retains all possible matches in the candidate interval; an empty interval then proves absence.

An invariant need not say that the whole result is already correct. In insertion sort, only the processed prefix is sorted. In BFS, discovered vertices include both waiting and already expanded vertices. State exactly which part of the computation is described.

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

Return to [algorithm analysis](analysis.md) or use the [reading guide](../../reading-guide.md) to connect the examples across topics.
