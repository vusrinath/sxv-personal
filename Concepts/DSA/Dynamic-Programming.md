# Dynamic Programming

Dynamic Programming (DP) solves optimization and counting problems by breaking them into overlapping subproblems, solving each subproblem once, and storing results to avoid redundant computation. It applies when a problem has optimal substructure and overlapping subproblems.

## When to Apply

Use DP when the problem asks for an optimal value (minimum, maximum, longest, shortest) or a count of ways, and the solution can be expressed as a recurrence relation where the answer to a larger problem depends on answers to smaller subproblems that repeat across recursive calls.

## Recognition Signals

- The problem asks for minimum cost, maximum profit, longest/shortest sequence, or number of ways.
- A recursive solution re-computes the same subproblem multiple times.
- The problem has optimal substructure: an optimal solution contains optimal solutions to its subproblems.
- You can define a state (e.g., `dp[i]`, `dp[i][j]`) and a transition between states.

## Worked Example

Given a list of coin denominations and a target amount, find the minimum number of coins needed to make up that amount. Return -1 if it cannot be made.

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

## Practice Problems

1. **Coin Change** – minimum coins to make an amount (LeetCode 322)
2. **Longest Increasing Subsequence** – find the length of the longest strictly increasing subsequence (LeetCode 300)
3. **House Robber** – maximize loot without robbing adjacent houses (LeetCode 198)
4. **Unique Paths** – count paths in a grid from top-left to bottom-right (LeetCode 62)
5. **0/1 Knapsack** – maximize value within a weight capacity (classic DP problem)

## Complexity

- Time: O(n * m) for most 1D/2D DP problems where n is the number of states and m is the transition cost per state
- Space: O(n) with space optimization (rolling array) or O(n * m) for full table
