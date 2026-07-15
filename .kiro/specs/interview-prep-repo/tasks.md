# Implementation Plan: Interview-Prep Repository

## Overview

This plan turns the design into ordered, incremental authoring and scripting steps. The work is documentation/knowledge-organization plus one small Node validation script (no application runtime). Sequencing follows dependency order: the Note_Template is authored first because every note conforms to it, then the DSA content and its index, then the README hub and Gap_Plan (which link to that content), then normalization of existing notes and Roadmap sync, and finally the Node structural checker that enumerates the repository to validate all 17 correctness properties. Each task references the requirements and/or design properties it satisfies.

The structural checker is written in **JavaScript (Node)** using only the Node standard library (`fs`, `path`), with no external dependencies. Its checks are enumeration-based (walking the fixed repository state), not randomized property-based tests, matching the design's Testing Strategy.

## Tasks

- [x] 1. Author the Note_Template
  - [x] 1.1 Create `Note_Template.md` at the repository root
    - Document the required note shape: exactly one first-level (`#`) title; a summary of 1–5 sentences not exceeding 500 characters placed directly under the title with no intervening heading; a body where every content section is under a second-level (`##`) heading
    - Include a filled-in illustrative skeleton and the Pattern_Note extension (When to Apply, Recognition Signals, Worked Example, Practice Problems, Complexity) so authors can copy it
    - _Requirements: 4.1_

- [x] 2. Build the DSA section
  - [x] 2.1 Create `Concepts/DSA/` and the first five pattern notes
    - Create the folder `Concepts/DSA/`
    - Author `Sliding-Window.md`, `Two-Pointers.md`, `Fast-And-Slow-Pointers.md`, `Binary-Search.md`, `Breadth-First-Search.md`, each addressing exactly one pattern and following the Pattern_Note structure (When to Apply ≥ 1 sentence; Recognition Signals ≥ 2 triggers; ≥ 1 worked example with a problem statement and a fenced code block ≥ 1 line; Practice Problems ≥ 2 titled; time and space complexity in Big-O)
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.2 Create the remaining five pattern notes
    - Author `Depth-First-Search.md`, `Backtracking.md`, `Dynamic-Programming.md`, `Greedy.md`, `Top-K-Elements.md` in `Concepts/DSA/`, each addressing exactly one pattern and following the same Pattern_Note structure as 2.1
    - _Requirements: 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.3 Create the DSA index `Concepts/DSA/README.md`
    - Add a title, a summary, and a Patterns list containing exactly one resolving Cross_Link per pattern note (link count == note count == 10)
    - _Requirements: 2.3, 2.5_

- [x] 3. Author the Gap_Plan
  - [x] 3.1 Create `Gap_Plan.md` at the repository root
    - Add a Prioritized Topics table with columns Priority, Topic, Target File; include at minimum JPA & Hibernate, Testing (JUnit & Mockito), Java 8+ Features, Docker & Kubernetes, SQL & Database Design, Git branching strategies, Frontend basics; each topic appears once with exactly one priority from {High, Medium, Low} and one non-empty target path; order rows High → Medium → Low; keep priorities consistent with the Roadmap's "Gaps to Fill" table
    - Add an Inconsistencies section recording the misspelled `SptingBoot` folder with proposed name `SpringBoot`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 4.6_

- [x] 4. Build the README navigation hub
  - [x] 4.1 Rewrite `README.md` as the hub
    - Add title + one-line purpose; a Topic Index listing the eight canonical topic areas exactly once, each with a resolving Cross_Link (or a visible gap label such as `_(no notes yet)_` for Frontend, Databases, Behavioral); a Preparation Priority ordered list that is a permutation of the eight topic areas; a Repository Map naming every top-level folder (`2026/`, `Concepts/`, `english/`, `FastAPI/`, `Gradle/`, `SptingBoot/`); and a Key Documents section with exactly one Cross_Link to the Roadmap plus links to Gap_Plan and Note_Template; include the Cross_Link to `Concepts/DSA/README.md`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.3, 2.4_

- [-] 5. Checkpoint - verify hub and DSA links resolve
  - Ensure every Cross_Link authored so far resolves and no dangling links remain; ask the user if questions arise.
  - _Requirements: 1.6, 2.6_

- [x] 6. Normalize existing notes and sync the Roadmap
  - [x] 6.1 Normalize existing Notes_Files to the Note_Template
    - Apply the template to files lacking structure (e.g., `SptingBoot/layeredArchitecture.md`): add exactly one top-level title, one conforming summary (1–5 sentences, ≤ 500 chars), and ≥ 1 second-level heading, preserving all existing code blocks, commands, and defined terms unchanged; reconcile any conflicting term definitions across two notes to one consistent definition; if a file has no content mappable to a top-level title, leave it unchanged and record it under Gap_Plan Inconsistencies
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 6.2 Update the Roadmap coverage flags
    - Mark topics that now have at least one linked Notes_File (notably DSA) as covered, and keep any Roadmap priorities consistent with the Gap_Plan
    - _Requirements: 6.2, 5.5_

- [ ] 7. Implement the Node structural checker
  - [-] 7.1 Create the checker scaffold and shared utilities
    - Create a Node script (e.g., `scripts/check-structure.js`) with no external dependencies; implement repo-walking helpers, a Markdown link extractor, a link-resolver against the filesystem, and a findings collector producing `{ property, sourceFile, detail }`; implement the link-integrity check
    - **Property 1: Link integrity (no dangling cross-links)**
    - **Validates: Requirements 1.6, 2.5, 2.6, 6.4, 6.5**

  - [~] 7.2 Implement README structure checks
    - Enumerate the README index, priority list, folder map, and key-documents section; compare against the canonical 8 topic areas and the live top-level folder listing
    - **Property 2: README topic-index completeness/uniqueness (Req 1.1)**
    - **Property 3: README topic link-or-gap-label (Req 1.3, 1.4)**
    - **Property 4: README priority-order permutation (Req 1.5)**
    - **Property 5: Single Roadmap link (Req 1.2)**
    - **Property 6: README folder completeness (Req 6.3)**

  - [~] 7.3 Implement DSA structure checks
    - Map pattern names to files, assert the 10-way bijection, index link parity, and the README→DSA-index link
    - **Property 7: DSA pattern bijection (Req 2.2)**
    - **Property 8: DSA index link parity (Req 2.3, 2.4)**

  - [~] 7.4 Implement pattern-note conformance check
    - For each of the 10 notes, parse headings and section contents and assert the minimums (When to Apply ≥ 1 sentence, Recognition Signals ≥ 2 items, worked example with problem statement + code block, Practice Problems ≥ 2 titled, Big-O time and space tokens)
    - **Property 9: Pattern-note template conformance (Req 3.1–3.5)**

  - [~] 7.5 Implement normalized-note and content-preservation checks
    - Assert single H1, one summary within limits, ≥ 1 H2 per normalized note; where a pre-normalization snapshot exists, diff fenced code blocks/commands and assert each prior block is present unchanged
    - **Property 10: Normalized-note conformance (Req 4.2)**
    - **Property 11: Content preservation under normalization (Req 4.3)**

  - [~] 7.6 Implement Gap_Plan checks
    - Parse rows; assert required-topic membership and uniqueness, per-row well-formedness (one priority ∈ {High, Medium, Low}, one non-empty target path), and non-increasing priority order
    - **Property 12: Gap_Plan completeness/uniqueness (Req 5.1)**
    - **Property 13: Gap_Plan row well-formedness (Req 5.2, 5.3)**
    - **Property 14: Gap_Plan priority ordering (Req 5.4)**

  - [~] 7.7 Implement cross-file consistency and reachability checks
    - Join Roadmap and Gap_Plan on topic for priority equality; join Roadmap coverage flags against actual linked notes; build the incoming-link set per note and assert each non-hub/index note has ≥ 1 incoming link
    - **Property 15: Roadmap ↔ Gap_Plan priority consistency (Req 5.5)**
    - **Property 16: Roadmap coverage consistency (Req 6.2)**
    - **Property 17: Note reachability (Req 6.1)**

  - [~] 7.8 Wire the top-level runner and run the checker
    - Aggregate all property checks in a single runner, print findings and a non-zero exit code when findings exist; run it against the repo and fix any reported violations
    - _Requirements: 1.6, 2.6_

  - [ ]* 7.9 Write self-tests for the checker
    - Add small fixture-based tests that feed the checker a known-good and a known-bad snippet per property group and assert expected findings
    - _Requirements: 2.6_

- [~] 8. Final checkpoint - run the full structural checker
  - Run the checker, ensure zero findings across all 17 properties, and ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- The checker uses enumeration over the fixed repository state (not randomized property-based testing), so each property maps to a deterministic assertion, matching the design's Testing Strategy.
- Each task references specific requirements; checker sub-tasks additionally reference the design property they validate.
- Checkpoints ensure links resolve incrementally before more content is layered on.
- The `SptingBoot` folder is intentionally not renamed here; it is recorded as an inconsistency to avoid breaking existing Roadmap links.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1", "6.1"] },
    { "id": 2, "tasks": ["2.3", "6.2"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["7.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6", "7.7"] },
    { "id": 6, "tasks": ["7.8", "7.9"] }
  ]
}
```
