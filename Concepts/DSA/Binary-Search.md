# Binary Search

Binary Search repeatedly halves the search space in a sorted or monotonic structure to locate a target value or boundary in O(log n) time, making it essential for problems where linear scanning is too slow.

## When to Apply

Use this pattern when the input is sorted (or has a monotonic property) and you need to find a specific element, the first/last occurrence, or a boundary condition (e.g., minimum value satisfying a predicate). It also applies to "search the answer" problems where you binary-search over the solution space itself, such as finding the minimum capacity to ship packages within a deadline.

## Recognition Signals

- The input array is sorted, or the problem has a monotonic (non-decreasing or non-increasing) decision function.
- The problem asks for O(log n) time complexity or mentions that n can be very large (10⁵–10⁹).
- You are looking for a boundary: the first position where a condition becomes true or the last position where it is false.
- The brute-force approach would scan every element in O(n) but the sorted structure allows halving.

## Worked Example

Given a sorted array of integers and a target value, return the index of the target if found, otherwise return the index where it would be inserted to keep the array sorted.

```java
public int searchInsert(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left;
}
```

## Practice Problems

1. **Find First and Last Position of Element in Sorted Array** – find the starting and ending position of a given target value (LeetCode 34)
2. **Search in Rotated Sorted Array** – search for a target in a rotated sorted array in O(log n) (LeetCode 33)
3. **Koko Eating Bananas** – find the minimum eating speed to finish all bananas within h hours (LeetCode 875)

## Complexity

- Time: O(log n) — the search space is halved on each iteration
- Space: O(1) for iterative implementation; O(log n) for recursive due to call stack
