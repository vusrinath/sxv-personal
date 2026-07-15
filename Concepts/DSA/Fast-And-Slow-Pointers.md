# Fast and Slow Pointers

The Fast and Slow Pointers pattern (Floyd's Tortoise and Hare) uses two pointers moving at different speeds through a sequence to detect cycles, find middle elements, or identify structural properties of linked lists without extra space.

## When to Apply

Use this pattern when dealing with linked lists or sequences that may contain cycles, or when you need to find the middle node of a linked list in one pass. It also applies to problems where a value sequence forms an implicit linked list (such as detecting a cycle in a number transformation). The core idea is that if a cycle exists, the fast pointer will eventually lap the slow pointer.

## Recognition Signals

- The data structure is a linked list or an implicit sequence with a "next" relationship.
- The problem asks whether a cycle exists or where a cycle begins.
- You need the middle element of a linked list without knowing its length in advance.
- A brute-force approach would use a hash set to track visited nodes, costing O(n) extra space.

## Worked Example

Given the head of a singly linked list, determine if the linked list has a cycle (i.e., a node's next pointer points back to a previously visited node).

```java
public boolean hasCycle(ListNode head) {
    if (head == null) return false;

    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}
```

## Practice Problems

1. **Linked List Cycle II** – find the node where the cycle begins, or return null if there is no cycle (LeetCode 142)
2. **Middle of the Linked List** – return the middle node of a linked list (LeetCode 876)
3. **Happy Number** – determine if a number eventually reaches 1 under the sum-of-squares-of-digits transformation, detecting infinite loops (LeetCode 202)

## Complexity

- Time: O(n) — the fast pointer traverses the list at most twice before meeting or reaching the end
- Space: O(1) — only two pointer variables regardless of input size
