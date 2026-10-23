# Complexity, output size and practical limits

**After this page, you should be able to:**

- Distinguish output-sensitive and pseudopolynomial costs from encoded-size bounds.
- Interpret decision/optimisation/enumeration and problem-level hardness carefully.

**Builds on:** [Cases and bounds](../analysis/cases-and-bounds.md), [coin-change state costs](dynamic-programming.md#dp-cost-and-model) and [subset output](backtracking.md#backtracking-cost).

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

(strategy-resource-comparison)=
## Compare the actual workloads and guarantees

| Workload | Main resource parameter | Consequence for selection |
|---|---|---|
| Activity selection | n interval records | Sorting plus scanning; optimum count guarantee depends on the exchange proof |
| Coin DP | Distinct coin count k and numeric target A | State/transition cost depends on A, not just its bit length |
| Subset enumeration | n positions and total reported indices Z | Exponential branching and potentially large output; feasibility is a different request |
| Static range totals | n values and number of later queries | Pay preprocessing once; do not charge every query for rebuilding unless the data changes |

For positive A, bit length is floor(log₂ A)+1; zero uses a constant-sized encoding. The O(kA) phrase describes the main DP on nontrivial inputs, while [the full implementation bound](dynamic-programming.md#dp-cost-and-model) includes empty cases and denomination normalisation. Numeric arithmetic may also need a bit-cost model when values grow.

An exponential upper bound for one program does not establish an exponential lower bound for its problem. Likewise, an algorithm that is fast only on a restricted input family has not settled the general problem. State the domain, output, guarantee and resource model together before deciding whether a method meets the application's needs.

:::{tip} Common misconception
**NP means that every instance requires non-polynomial computation.** NP describes polynomially verifiable yes-certificates for decision problems; it is not that claim about runtime.
:::

(complexity-limit-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. If a target amount grows from 2¹⁰ to 2²⁰, does its DP table merely double because its bit length roughly doubles?**

:::{dropdown} Show explanation
No. The numeric target grows by a factor of 2¹⁰=1024, so an amount-indexed table grows by about that factor. Encoded length and numeric magnitude differ.
:::

**2. Must an algorithm returning every matching subset use the same resources as one returning only whether a match exists?**

:::{dropdown} Show explanation
No. Enumeration must also emit all witnesses. A boolean feasibility result can avoid that output cost and may permit more state reuse.
:::

Return to the [strategy overview](strategies.md) or the [coverage review](../../coverage-review.md).
