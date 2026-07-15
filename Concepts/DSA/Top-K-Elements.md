# Top-K Elements

The Top-K Elements pattern efficiently finds the k largest, smallest, or most frequent elements from a collection using a heap (priority queue). Instead of fully sorting the input, a heap of size k maintains the answer in O(n log k) time.

## When to Apply

Use this pattern when the problem asks for the k-th largest/smallest element, the k most frequent elements, or the k closest points. A min-heap of size k gives you the top-k largest, while a max-heap of size k gives you the top-k smallest. This avoids a full O(n log n) sort when k is much smaller than n.

## Recognition Signals

- The problem explicitly asks for "top k", "k largest", "k smallest", or "k most frequent".
- You need a partial ordering of elements rather than a full sort.
- The input stream is potentially unbounded or very large, but you only need k results.
- The problem involves distances, frequencies, or scores where only the extremes matter.

## Worked Example

Given an integer array and an integer k, return the k most frequent elements. You may return the answer in any order.

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // Min-heap by frequency, size k
        PriorityQueue<Integer> heap = new PriorityQueue<>(
            (a, b) -> freqMap.get(a) - freqMap.get(b)
        );

        for (int key : freqMap.keySet()) {
            heap.offer(key);
            if (heap.size() > k) {
                heap.poll();
            }
        }

        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = heap.poll();
        }
        return result;
    }
}
```

## Practice Problems

1. **Top K Frequent Elements** – find the k most frequent elements in an array (LeetCode 347)
2. **Kth Largest Element in an Array** – find the k-th largest without full sorting (LeetCode 215)
3. **K Closest Points to Origin** – find k points nearest to (0, 0) (LeetCode 973)
4. **Find Median from Data Stream** – maintain a running median using two heaps (LeetCode 295)

## Complexity

- Time: O(n log k) where n is the number of elements and k is the heap size
- Space: O(n) for the frequency map plus O(k) for the heap
