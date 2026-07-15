# Backtracking

Backtracking is a systematic way to explore all possible configurations of a solution by building candidates incrementally and abandoning a candidate ("pruning") as soon as it violates a constraint. It is essentially DFS on the decision tree of choices.

## When to Apply

Use backtracking when the problem asks you to generate all valid combinations, permutations, subsets, or arrangements that satisfy constraints. It works when the solution space can be represented as a decision tree and invalid partial solutions can be detected early, allowing you to prune entire branches.

## Recognition Signals

- The problem asks for "all possible" combinations, permutations, subsets, or arrangements.
- You need to place or assign items under constraints (e.g., N-Queens, Sudoku).
- The problem can be decomposed into a sequence of choices where each choice restricts future options.
- A brute-force enumeration is too slow but constraint-based pruning can reduce the search space.

## Worked Example

Given an array of distinct integers, return all possible permutations.

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
        return result;
    }

    private void backtrack(int[] nums, List<Integer> current, boolean[] used, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, current, used, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}
```

## Practice Problems

1. **Permutations** – generate all permutations of distinct integers (LeetCode 46)
2. **N-Queens** – place N queens on an N x N board so no two attack each other (LeetCode 51)
3. **Combination Sum** – find all unique combinations that sum to a target (LeetCode 39)
4. **Word Search** – determine if a word exists in a grid by following adjacent cells (LeetCode 79)

## Complexity

- Time: O(n!) for permutation problems; generally exponential depending on branching factor and pruning
- Space: O(n) for the recursion stack depth where n is the number of decisions
