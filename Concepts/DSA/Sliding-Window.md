# Sliding Window

The Sliding Window pattern maintains a window over a contiguous subarray or substring, expanding or contracting its boundaries to satisfy a condition while avoiding redundant re-computation of overlapping elements.

## When to Apply

Use this pattern when the problem asks for an optimal contiguous subarray or substring of variable or fixed length. Typical scenarios include finding the longest substring without repeating characters, the maximum sum subarray of size k, or the minimum-size subarray whose sum meets a threshold. The key insight is that moving the window boundary by one position reuses most of the previous computation.

## Recognition Signals

- The input is a linear sequence (array or string) and the problem involves contiguous sub-ranges.
- A brute-force solution would enumerate all O(n²) subarrays or substrings.
- The problem asks for a maximum, minimum, or count over subarrays of variable or fixed length.
- Adding/removing one element at the window edge can be done in O(1).

## Worked Example

Given an integer array and a target sum, find the length of the smallest contiguous subarray whose sum is greater than or equal to the target. Return 0 if no such subarray exists.

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0;
    int sum = 0;
    int minLen = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
```

## Practice Problems

1. **Longest Substring Without Repeating Characters** – find the length of the longest substring with all unique characters (LeetCode 3)
2. **Maximum Average Subarray I** – find the contiguous subarray of length k with the maximum average (LeetCode 643)
3. **Longest Repeating Character Replacement** – longest substring with at most k character replacements allowed (LeetCode 424)

## Complexity

- Time: O(n) — each element is visited at most twice (once by right, once by left)
- Space: O(1) for fixed-window problems; O(min(n, m)) when a hash set tracks window contents, where m is the character set size
