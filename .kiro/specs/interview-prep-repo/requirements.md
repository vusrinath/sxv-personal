# Requirements Document

## Introduction

This feature transforms the `sxv-personal` repository from a loose collection of interview-prep notes into a well-organized, navigable knowledge base for a Fullstack Developer interview. The repository already has strong coverage in Spring Boot, REST API design, System Design, and DevOps, but the entry-point README is a one-line stub, the notes lack a consistent structure, there is no Data Structures & Algorithms (DSA) content, and several topics flagged in the existing roadmap have no notes yet.

The work is documentation and knowledge-organization, not application code. The deliverables are: a navigation hub, a normalized note structure, a dedicated DSA section with core patterns, and a prioritized content-gap plan. The goal is a repository a candidate can open and prepare from efficiently.

## Glossary

- **Repository**: The `sxv-personal` file collection at the workspace root that stores all interview-preparation notes.
- **README_Hub**: The top-level `README.md` file, repurposed as the primary navigation entry point for the Repository.
- **Roadmap**: The existing `Fullstack-Interview-Roadmap.md` file that maps topic coverage and marks gaps.
- **Notes_File**: Any Markdown (`.md`) or text (`.txt`) file in the Repository that contains study content.
- **DSA_Section**: A dedicated folder (`Concepts/DSA/`) that holds Data Structures & Algorithms content.
- **Pattern_Note**: A Notes_File within the DSA_Section that documents one DSA pattern (for example, Sliding Window or Two Pointers).
- **Note_Template**: The agreed common structure applied to normalized Notes_File content (heading hierarchy, summary, and cross-links).
- **Gap_Plan**: A prioritized list of missing topics and the target file for each, maintained as a Notes_File.
- **Author**: The person creating or editing notes in the Repository.
- **Cross_Link**: A relative Markdown link from one Notes_File to another location in the Repository.

## Requirements

### Requirement 1: Navigation Entry Point

**User Story:** As an Author preparing for interviews, I want a README that serves as a navigation hub, so that I can reach any topic quickly from a single starting point.

#### Acceptance Criteria

1. THE README_Hub SHALL contain a categorized index that lists each of the following eight topic areas exactly once: Backend, Frontend, System Design, DevOps and CI/CD, Databases, Data Structures & Algorithms, Networking and Security, and Behavioral.
2. THE README_Hub SHALL provide exactly one Cross_Link to the Roadmap.
3. WHERE a topic area has at least one existing Notes_File, THE README_Hub SHALL provide, next to that topic area in the index, at least one Cross_Link resolving to an existing Notes_File or its containing folder within the Repository.
4. WHERE a topic area has no existing Notes_File, THE README_Hub SHALL display, next to that topic area in the index, a visible textual gap label (for example "no notes yet") that distinguishes it from topic areas that have a Cross_Link.
5. THE README_Hub SHALL include a section containing an ordered list that ranks all eight topic areas from highest to lowest recommended preparation priority, with each topic area appearing exactly once.
6. IF a Cross_Link in the README_Hub points to a path that does not resolve to an existing file or folder in the Repository, THEN THE Author SHALL correct or remove that Cross_Link before completing the feature.

### Requirement 2: Dedicated DSA Section

**User Story:** As an Author, I want a dedicated DSA folder with core patterns, so that I can practice coding-round patterns that currently have no notes.

#### Acceptance Criteria

1. THE DSA_Section SHALL exist at the path `Concepts/DSA/`.
2. THE DSA_Section SHALL contain exactly one dedicated Pattern_Note for each of the following 10 patterns, with each Pattern_Note addressing exactly one pattern: Sliding Window, Two Pointers, Fast and Slow Pointers, Binary Search, Breadth-First Search, Depth-First Search, Backtracking, Dynamic Programming, Greedy, and Top-K Elements.
3. THE DSA_Section SHALL contain exactly one index Notes_File that provides exactly one Cross_Link for each Pattern_Note in the DSA_Section, such that the count of Cross_Links equals the count of Pattern_Notes.
4. THE README_Hub SHALL provide a Cross_Link to the DSA_Section index Notes_File.
5. WHEN a Cross_Link in the DSA_Section index Notes_File or the README_Hub is resolved, THE System SHALL resolve it to an existing target Notes_File within the repository.
6. IF a Cross_Link's target Notes_File does not exist within the repository, THEN THE System SHALL be considered non-compliant for that Cross_Link, identifying the unresolved Cross_Link and its source Notes_File.

### Requirement 3: Pattern Note Content

**User Story:** As an Author, I want each DSA pattern note to follow a consistent, complete structure, so that I can study any pattern the same way and recognize when to apply it.

#### Acceptance Criteria

1. THE Pattern_Note SHALL contain a non-empty "When to Apply" section with at least one sentence that describes the problem conditions under which the pattern is used.
2. THE Pattern_Note SHALL contain a "Recognition Signals" section that lists at least two trigger conditions indicating that the pattern applies.
3. THE Pattern_Note SHALL contain at least one worked example consisting of a problem statement of at least one sentence and a code sample of at least one line.
4. THE Pattern_Note SHALL contain a "Practice Problems" section that lists at least two practice problems, each identified by a title.
5. THE Pattern_Note SHALL state both the time complexity and the space complexity of the pattern's typical solution, each expressed in Big-O notation.

### Requirement 4: Notes Normalization

**User Story:** As an Author, I want existing notes normalized to a common structure, so that all notes read consistently and are easy to scan.

#### Acceptance Criteria

1. THE Note_Template SHALL define exactly one required top-level (first-level) title, a summary of 1 to 5 sentences not exceeding 500 characters, and a body in which every content section appears under a second-level heading.
2. WHEN an existing Notes_File is normalized, THE Author SHALL apply the Note_Template so that the resulting Notes_File contains exactly one top-level title, exactly one summary conforming to criterion 1, and one or more second-level headings.
3. WHEN an existing Notes_File is normalized, THE Author SHALL preserve the file's existing technical content, including all code blocks, commands, and defined terms, with their text unchanged.
4. WHERE two Notes_File items describe the same defined term differently, THE Author SHALL reconcile the descriptions to use one consistent definition applied to both Notes_File items.
5. IF an existing Notes_File contains no content that can be mapped to the required top-level title during normalization, THEN THE Author SHALL record that Notes_File as an inconsistency in the Gap_Plan and leave the file's existing content unchanged.
6. THE Author SHALL record the misspelled folder name `SptingBoot` as an inconsistency in the Gap_Plan together with a proposed corrected name.

### Requirement 5: Content Gap Plan

**User Story:** As an Author, I want a prioritized plan of missing topics, so that I know what to write next and in what order.

#### Acceptance Criteria

1. THE Gap_Plan SHALL list each missing topic identified from the Roadmap, with each topic appearing exactly once, and SHALL include at minimum the following topics: JPA and Hibernate, Testing with JUnit and Mockito, Java 8 and later features, Docker and Kubernetes, SQL and Database Design, Git branching strategies, and Frontend basics.
2. THE Gap_Plan SHALL assign to each listed topic exactly one priority level selected from the set {High, Medium, Low}.
3. THE Gap_Plan SHALL specify for each listed topic exactly one non-empty target file path.
4. THE Gap_Plan SHALL order listed topics by priority level such that all High-priority topics appear before all Medium-priority topics, and all Medium-priority topics appear before all Low-priority topics.
5. WHERE the Roadmap and the Gap_Plan reference the same topic, THE Author SHALL keep the priority level consistent between the two files.

### Requirement 6: Discoverability and Consistency Maintenance

**User Story:** As an Author, I want navigation artifacts to stay accurate as content changes, so that the Repository remains trustworthy to prepare from.

#### Acceptance Criteria

1. WHEN a new Notes_File is added under a topic area, THE Author SHALL, before the change is committed to the Repository, add a Cross_Link to that Notes_File from the section index of that topic area, and if no section index exists for that topic area, from the README_Hub.
2. WHEN a topic gains its first Notes_File, THE Author SHALL, before the change is committed to the Repository, update the Roadmap to mark that topic as covered.
3. THE README_Hub SHALL list every top-level folder of the Repository by name.
4. WHEN a Notes_File is moved to a new path, THE Author SHALL update every Cross_Link that referenced the previous path such that zero Cross_Links continue to point to the previous path.
5. WHEN a Notes_File is deleted from the Repository, THE Author SHALL remove every Cross_Link that referenced that Notes_File such that zero Cross_Links continue to point to the deleted Notes_File.
