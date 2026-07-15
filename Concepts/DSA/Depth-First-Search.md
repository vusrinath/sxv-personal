# Depth-First Search

Depth-First Search (DFS) explores a graph or tree by going as deep as possible along each branch before backtracking. It uses a stack (explicit or via recursion) and is fundamental for traversal, cycle detection, topological sorting, and connected-component analysis.

## When to Apply

Use DFS when the problem requires exhaustive exploration of all paths or branches in a graph or tree, such as detecting cycles, finding connected components, performing topological sorts on DAGs, or searching for a target node at arbitrary depth. It is preferred over BFS when you need to explore full paths before considering alternatives.

## Recognition Signals

- The problem involves traversing or searching a tree/graph structure.
- You need to explore all possible paths (e.g., find all paths from source to target).
- The problem asks about connectivity, cycles, or topological ordering.
- The input is a matrix or grid where you need to explore connected regions (islands, flood fill).

## Worked Example

Given a 2D grid of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

```java
class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    dfs(grid, i, j);
                    count++;
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') {
            return;
        }
        grid[i][j] = '0'; // mark visited
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
}
```

## Practice Problems

1. **Number of Islands** – count connected land regions in a grid (LeetCode 200)
2. **Clone Graph** – deep copy a connected undirected graph (LeetCode 133)
3. **Course Schedule** – detect if a cycle exists in prerequisite graph (LeetCode 207)
4. **Path Sum II** – find all root-to-leaf paths that sum to a target (LeetCode 113)

## Complexity

- Time: O(V + E) where V is vertices and E is edges (or O(m * n) for a grid)
- Space: O(V) for the recursion stack in the worst case (or O(m * n) for a grid)
