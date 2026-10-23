# 2. Analysing algorithms

A search through three shuttle stops feels immediate. A search through a million records may not. Algorithm analysis asks how the work changes when the input grows, and which assumptions make that prediction valid.

## Reading route

1. [Counting work](counting-work.md): define input size and a cost model, then count operations.
2. [Growth rates](growth-rates.md): compare scaling and interpret dominant terms.
3. [Cases and bounds](cases-and-bounds.md): separate input situations from upper, lower and tight bounds.
4. [Analysing code and space](code-and-space.md): reason through loops, halving, branches and additional storage.
5. [Correctness and proof habits](correctness.md): connect contracts, invariants, progress and counterexamples.

The search examples extend [Topic 1](../foundations/foundations.md). They are small enough to trace manually, but the resulting functions describe entire families of input sizes.

## Before you start

You should be able to read basic Python loops and functions. Familiarity with powers and simple sums helps; logarithms are explained through repeated halving. No notebook or package is needed to follow the examples.

By the end, you should be able to justify a cost expression, distinguish best/worst/average cases from O/Ω/Θ notation, and state time and space claims with their assumptions.

## A common analysis route

Across the five readings, start with the operation contract and size parameters, choose a resource and cost model, identify the input family or probability/sequence guarantee, derive the work or maximum live storage, then state a justified bound. Correctness and termination need their own arguments; the final reading works the linear-search example through that reasoning.

Use the worked counts to justify a bound before reading its simplified growth class. Later topics apply the same cost models to sorting, recursion, hashing, trees and graphs.

Use the [concept index](../../concepts.md) for a particular term. Continue with [Recursion and divide-and-conquer](../recursion/recursion.md). For a later application, see [hash-table performance](../maps-sets-hashing/performance.md).
