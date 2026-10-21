# Greedy design and exchange reasoning

(greedy-choice)=
## Fix a choice only when it is safe

A **greedy** algorithm makes a local choice and commits to it. The key obligation is to prove that the choice can participate in a globally correct result. Merely choosing the smallest, nearest or shortest candidate does not supply that proof.

(interval-scheduling)=
## Select as many compatible activities as possible

Activities occupy half-open intervals `[start,end)` with start < end. Touching endpoints are compatible: an activity ending at 3 can precede one starting at 3. To maximise the number selected, sort by finish time and repeatedly take the next compatible activity.

```python
def select_activities(activities):
    activities = list(activities)  # (name, start, end)
    if any(start >= end for _, start, end in activities):
        raise ValueError("activities require start < end")
    chosen = []
    last_end = float("-inf")
    for activity in sorted(activities, key=lambda a: (a[2], a[1])):
        if activity[1] >= last_end:
            chosen.append(activity)
            last_end = activity[2]
    return chosen
```

Finite numeric endpoints and bounded-cost comparisons are assumed. The function returns activity records and leaves the caller's input unchanged. Sorting dominates at $O(n\log(n+1))$ time; this copying implementation uses $O(n)$ space including the returned records' references.

(greedy-exchange-proof)=
## Replace an optimum's first activity

Let g be an activity with earliest finish, and let o be the first activity in some optimum selection. Because g finishes no later than o, replacing o with g leaves every later chosen activity feasible. The replacement has the same count, so an optimum exists beginning with g. Apply the same argument to the remaining compatible activities.

![Two long compatible activities beat a single shorter activity placed across their shared endpoint, showing why shortest duration is not the safe greedy rule.](../../assets/strategies/interval-greedy.svg)

The plausible rule “choose shortest duration first” fails on A=[0,3), B=[3,6), C=[2,4): C is shortest but blocks both A and B. Earliest finish selects A and B, with count two.

(greedy-limits)=
## Changing the objective can invalidate the proof

If activities have rewards and the goal is maximum total reward, replacing an activity by an earlier-finishing one may lose reward. The count-maximisation proof no longer establishes optimality. Similarly, with coin values 1,3,4 and amount 6, repeatedly taking the largest coin gives 4+1+1, whereas 3+3 uses fewer coins.

Compare the [MST cut argument](../graph-algorithms/spanning-trees.md): it proves a particular local choice safe under particular constraints. Next: [Dynamic programming](dynamic-programming.md).
