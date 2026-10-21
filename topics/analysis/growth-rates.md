# Growth rates and dominant terms

An exact count describes work at a particular size. A growth rate describes how that count changes as size increases. This helps compare methods whose costs cross over as inputs grow.

(asymptotic-growth)=
## Asymptotic analysis looks beyond a fixed input size

Consider T_A(n) = 3n + 20 and T_B(n) = n² + 2. Their units are counted operations, not seconds.

| n | T_A(n) | T_B(n) |
|---:|---:|---:|
| 2 | 26 | 6 |
| 6 | 38 | 38 |
| 10 | 50 | 102 |
| 100 | 320 | 10,002 |

Method B has less modelled work at n = 2, while A has less at n = 100. A lower growth rate does not promise less work at every finite size.

**Asymptotic analysis** studies behaviour as input size becomes sufficiently large. It distinguishes fixed multiplicative differences from changes to the long-run growth pattern.

(dominant-term)=
## Why the dominant term matters

For T(n) = 3n² + 5n + 2, divide by n²:

$$
\frac{T(n)}{n^2}=3+\frac{5}{n}+\frac{2}{n^2}.
$$

As n grows, the final two terms approach zero. The quadratic contribution controls growth, although the other terms still affect the exact count.

This reasoning applies to fixed-coefficient polynomials with a positive leading term. It does not justify visually deleting terms from any expression. If a coefficient, exponent or loop limit itself depends on n, that dependence matters.

(growth-classes)=
## Common growth classes

| Function | Name | Representative pattern |
|---|---|---|
| 1 | Constant | Fixed work independent of n |
| log₂ n | Logarithmic | Repeatedly halve a positive problem size |
| n | Linear | Visit every item once |
| n log₂ n | Linearithmic | Logarithmically many levels, each with linear work |
| n² | Quadratic | Examine every ordered pair |
| 2ⁿ | Exponential | A search space that doubles for each added choice |

These are patterns to justify from an algorithm, not labels to attach from its name. Implementations of the same idea can have different costs.

![Six model growth functions with a linear input-size axis and a logarithmic counted-work axis. Exponential work eventually rises much faster than polynomial work.](../../assets/analysis/growth-functions.svg)

The vertical axis is logarithmic so the fastest curves do not hide the others. Equal vertical distances represent equal multiplicative changes, not equal additions. These mathematical curves have multiplier 1; they are not benchmarks.

(doubling-input)=
## What happens when the input doubles?

Compare f(2n) with f(n), for n > 1:

| f(n) | Effect of doubling n |
|---|---|
| 1 | No change |
| log₂ n | Adds 1 |
| n | Multiplies by 2 |
| n log₂ n | Ratio 2(1 + 1/log₂ n), approaching 2 |
| n² | Multiplies by 4 |
| 2ⁿ | Multiplies by 2ⁿ |

The n log n row is not exactly “double”: its logarithmic factor also changes. The exponential ratio itself grows with n.

(logarithms-and-base)=
## Logarithms count repeated reductions

The equation 2ᵏ = n asks how many factors of 2 produce n. Its inverse is k = log₂ n. Repeated halving asks the same question in reverse: how many reductions take n down to a constant-sized remainder?

Changing to another fixed base greater than 1 changes only a constant multiplier:

$$
\log_b n=\frac{\log_2 n}{\log_2 b}.
$$

We therefore often write “log n” for a growth class, while specifying the base for exact counts. The [halving trace](code-and-space.md#repeated-halving) explains integer division and stopping details.

## Growth is not yet a bound claim

Identifying a dominant term prepares us to state a bound. We still need to choose upper, lower or tight bounds, and specify which input cases the cost function describes.

Next: [Cases and bounds](cases-and-bounds.md).

**Browse:** [Analysing algorithms](analysis.md) · [Concept index](../../concepts.md)
