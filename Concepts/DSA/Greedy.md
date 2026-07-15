# Greedy

The Greedy pattern builds a solution step by step, always choosing the locally optimal option at each stage with the expectation that local optima lead to a global optimum. It works when the problem has the greedy-choice property and optimal substructure.

## When to Apply

Use a greedy approach when making the best local choice at each step provably leads to a globally optimal solution. This typically works for interval scheduling, activity selection, minimum spanning trees, shortest paths (Dijkstra), and problems where a sorting-based strategy eliminates the need for exploring all combinations.

## Recognition Signals

- The problem asks for a minimum or maximum that can be achieved by a sequence of choices.
- A locally optimal choice does not invalidate future options (greedy-choice property).
- Sorting the input by some criterion (deadline, weight, interval end) simplifies the decision at each step.
- The problem involves intervals, scheduling, or resource allocation.

## Worked Example

Given a set of intervals, find the minimum number of intervals to remove so that the remaining intervals do not overlap.

```java
class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int removals = 0;
        int prevEnd = Integer.MIN_VALUE;

        for (int[] interval : intervals) {
            if (interval[0] >= prevEnd) {
                prevEnd = interval[1]; // keep this interval
            } else {
                removals++; // remove the overlapping interval
            }
        }
        return removals;
    }
}
```

## Practice Problems

1. **Non-overlapping Intervals** – minimum removals to eliminate all overlaps (LeetCode 435)
2. **Jump Game** – determine if you can reach the last index (LeetCode 55)
3. **Meeting Rooms II** – minimum number of conference rooms required (LeetCode 253)
4. **Task Scheduler** – minimum intervals to execute all tasks with a cooldown (LeetCode 621)

## Complexity

- Time: O(n log n) when sorting dominates, or O(n) for problems with pre-sorted or bounded input
- Space: O(1) extra space for most greedy solutions (excluding input storage)
