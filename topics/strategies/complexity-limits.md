# Complexity, output size and practical limits

(output-sensitive-algorithms)=
## Returning many answers requires work

Reporting r records needs at least proportional work to emit them. A balanced BST range query therefore has an output term as well as its search cost; a subset enumerator can have exponentially many results even if finding one result is easy. State both search work and output storage.

(pseudopolynomial-time)=
## Numeric magnitude differs from encoded input size

The coin-change DP uses $O(kA)$ work for target amount A. A binary encoding of A uses only $\Theta(\log(A+1))$ bits. Doubling the bit count can make the numeric table vastly larger. A bound polynomial in numeric magnitudes but not necessarily in encoded input length is **pseudopolynomial**.

This connects back to [Topic 2's input-size model](../analysis/counting-work.md). It also explains why replacing an exponential search by a numeric DP does not automatically establish polynomial time in the original input encoding.

(decision-optimisation)=
## Decide what must be returned

A decision problem asks whether a solution exists. An optimisation problem asks for the best objective value or an optimal solution. Enumeration asks for all solutions. Related problems can have different useful algorithms and different unavoidable output costs.

(complexity-p-np)=
## Hardness is a statement about problems, not one slow program

P contains decision problems solvable in polynomial time. NP contains decision problems whose yes-instances have polynomial-length certificates verifiable in polynomial time. NP does **not** mean “non-polynomial.” An NP-complete problem is in NP and is at least as hard as every problem in NP under polynomial-time reductions.

Whether P equals NP remains unresolved. A slow brute-force implementation does not prove that no faster algorithm exists; such a claim needs a problem-level argument. Conversely, a fast result under restricted inputs may not solve the general problem.

For an application, restrictions, approximation, heuristics or smaller parameter ranges may be useful. State which guarantee changes. This page introduces the distinction; it does not teach reductions or a full complexity-theory course. Reference: [Clay Mathematics Institute's P versus NP description](https://www.claymath.org/millennium/p-vs-np/).

Return to the [strategy overview](strategies.md) or the [coverage review](../../coverage-review.md).
