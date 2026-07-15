# Note Template

This document defines the common structure for all notes in the repository and provides a Pattern_Note extension for DSA content. Copy the relevant skeleton when creating or normalizing a note.

## General Note Shape

Every note in this repository follows this structure:

```markdown
# <Single Top-Level Title>

<Summary: 1–5 sentences, ≤ 500 characters, no heading before it>

## <Section 1>
...
## <Section N>
```

### Rules

- Exactly one first-level (`#`) title.
- A summary block of 1–5 sentences, no more than 500 characters, placed immediately under the title with no intervening heading.
- All body content lives under second-level (`##`) headings. Every content section must be an H2.

## Illustrative Skeleton

```markdown
# Redis Caching

Redis is an in-memory data store used as a cache, message broker, and database. It supports multiple data structures and provides sub-millisecond latency for read-heavy workloads.

## Core Concepts
- Key-value store with optional persistence
- Supports strings, hashes, lists, sets, sorted sets

## Common Use Cases
- Session caching
- Rate limiting
- Pub/Sub messaging

## Configuration Tips
- Set `maxmemory-policy` to `allkeys-lru` for cache workloads
- Use `AUTH` and TLS in production
```

## Pattern_Note Extension (for DSA notes)

DSA pattern notes extend the general shape with required sections:

```markdown
# <Pattern Name>

<Summary: 1–5 sentences, ≤ 500 characters>

## When to Apply
<At least one sentence describing the problem conditions under which this pattern is used.>

## Recognition Signals
- <Trigger condition 1>
- <Trigger condition 2>
- (list at least two)

## Worked Example
<Problem statement: at least one sentence describing the problem.>

\```<language>
// Code sample: at least one line demonstrating the pattern
\```

## Practice Problems
1. **<Problem Title 1>** – brief description or link
2. **<Problem Title 2>** – brief description or link
   (list at least two)

## Complexity
- Time: O(...)
- Space: O(...)
```

## Filled-In Pattern_Note Example

```markdown
# Sliding Window

The Sliding Window pattern maintains a window over a contiguous subarray or substring, expanding or contracting its boundaries to satisfy a condition while avoiding redundant re-computation.

## When to Apply
Use this pattern when the problem asks for an optimal contiguous subarray or substring of variable length, such as the longest substring without repeating characters or the minimum-size subarray with a sum ≥ target.

## Recognition Signals
- The input is a linear sequence (array or string).
- You need to find a contiguous sub-range satisfying a condition.
- A brute-force approach would check all O(n²) subarrays.

## Worked Example
Find the length of the longest substring without repeating characters in a given string.

\```python
def length_of_longest_substring(s: str) -> int:
    seen = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len
\```

## Practice Problems
1. **Minimum Size Subarray Sum** – find the minimal length subarray with sum ≥ target
2. **Longest Repeating Character Replacement** – longest substring with at most k replacements

## Complexity
- Time: O(n)
- Space: O(min(n, m)) where m is the character set size
```
