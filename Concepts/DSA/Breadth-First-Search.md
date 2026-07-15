# Breadth-First Search

Breadth-First Search (BFS) explores a graph or tree level by level using a queue, guaranteeing the shortest path in unweighted graphs and making it the go-to approach for minimum-step and level-order problems.

## When to Apply

Use BFS when you need the shortest path or minimum number of steps in an unweighted graph or grid, when the problem requires level-order traversal of a tree, or when you must explore all nodes at distance k before moving to distance k+1. It is also the right choice for multi-source shortest-path problems (e.g., rotting oranges spreading simultaneously from multiple sources).

## Recognition Signals

- The problem asks for the shortest path, minimum moves, or fewest transformations in an unweighted structure.
- You need to process nodes level by level (e.g., level-order traversal, shortest distance in a grid).
- The search space is a graph or implicit graph (grid, word ladder, state space) with uniform edge weights.
- A DFS approach would find a path but not necessarily the shortest one.

## Worked Example

Given a binary tree, return the level-order traversal of its nodes' values (i.e., from left to right, level by level).

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
```

## Practice Problems

1. **Shortest Path in Binary Matrix** – find the shortest clear path from top-left to bottom-right in a grid (LeetCode 1091)
2. **Word Ladder** – find the length of the shortest transformation sequence from a begin word to an end word (LeetCode 127)
3. **Rotting Oranges** – determine the minimum time for all fresh oranges to rot via BFS from multiple sources (LeetCode 994)

## Complexity

- Time: O(V + E) where V is the number of vertices and E is the number of edges; for a grid of size m×n this is O(m·n)
- Space: O(V) for the queue in the worst case (widest level of the graph/tree)
