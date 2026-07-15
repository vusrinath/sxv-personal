# Two Pointers

The Two Pointers pattern uses two index variables that traverse a sorted or linear data structure from different positions or directions, reducing the need for nested loops and bringing quadratic solutions down to linear time.

## When to Apply

Use this pattern when the input is a sorted array (or can be sorted) and the problem requires finding pairs or triplets that satisfy a condition, or when you need to compare elements from both ends of a sequence. It also applies to in-place array partitioning problems like removing duplicates or moving zeros.

## Recognition Signals

- The array is sorted or the problem benefits from sorting first.
- You need to find pairs (or groups) of elements that sum to a target or satisfy a relational condition.
- A brute-force approach would use nested loops producing O(n²) comparisons.
- The problem involves partitioning or rearranging an array in-place.

## Worked Example

Given a sorted array of integers, find two numbers that add up to a specific target. Return the indices (1-based) of the two numbers.

```java
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[] { left + 1, right + 1 };
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[] { -1, -1 }; // no solution found
}
```

## Practice Problems

1. **3Sum** – find all unique triplets in an array that sum to zero (LeetCode 15)
2. **Container With Most Water** – find two lines that together with the x-axis form a container holding the most water (LeetCode 11)
3. **Remove Duplicates from Sorted Array** – remove duplicates in-place and return the new length (LeetCode 26)

## Complexity

- Time: O(n) for a single pass with two pointers on a pre-sorted array; O(n log n) if sorting is required first
- Space: O(1) — only two index variables are used
