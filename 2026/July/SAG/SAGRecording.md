# SAG Exit - Zoom Recording Summary

## Meeting Details
- **Topic:** Software AG (SAG) Exit Initiative - Knowledge Transfer & Planning
- **Participants:** Ranjit Hota, Vijay Kudumula, Mohit Pradhan, Sweta Jaiswal, Vibhas Jamoriya, Amit Ainapure, Satheesh Nagabhairava

---

## 1. Introduction & Roll Call (00:00 - 01:05)

- **Ranjit Hota** confirmed key attendees (Vibhas, Mohit, Swetha) were present and decided to proceed.
- **Vijay Kudumula** asked if any technical leads were needed since this is a technical project.
- **Ranjit** stated he would share the recording with respective teams once he understood which areas would be touched. This was his first time hearing the full scope.

---

## 2. Context: What is Software AG (SAG)? (01:47 - 05:30)

**Vijay Kudumula** provided the overview:

- **Software AG** is a vendor product with mainframe modules running in production.
- Many applications consume these mainframe modules through different means.
- **Mainframe modules are expected to be decommissioned by end of 2026.**
- All applications within Account Management and D&D value streams that directly or indirectly call these mainframe modules must move to alternative data sources/APIs.

### Four Ways Applications Call Mainframe Modules:

| # | Method | Description | Purpose |
|---|--------|-------------|---------|
| 1 | **DSV (Data Services)** | Consumer calls DSV API → DSV internally calls mainframe modules | Read-oriented (fetch/retrieve data) |
| 2 | **DSV Generic** | Consumer tells DSV which specific mainframe module to call (pass-through) | Read-oriented |
| 3 | **Synchronous Proxy V2** | Proxy API called for read or write purposes | Read & Write (many update calls) |
| 4 | **ISV** | Consumers call with specific command names (e.g., update CWF, log CWF, update ACES enrollment) | Specific commands |

**Additional Note:** If any application references **EntireX** in code, it needs to be checked as it's also an interim interaction that requires remediation.

---

## 3. DSV Details & Impact Scope (05:30 - 10:11)

- Not all DSV calls go to mainframe — only specific DSV **documents** that internally invoke mainframe are impacted.
- A **master list** of all mainframe modules being decommissioned exists.
- A **master list** of all impacted DSV documents exists.
- ISV-specific commands that are impacted have been identified.
- When a consumer calls DSV Generic, it passes a module name — if that module is on the decommission list, the interaction is impacted.

---

## 4. Analysis Approach Using Kiro (10:11 - 14:24)

- An **analysis MD file** (markdown) was created containing rules related to all SAG patterns.
- Placing this file in Kiro (local, application-specific code) and asking about decommission impact provides automated impact analysis.
- **Example:** Participant Form WSV1 calls DSV (document: "Stats Form Selection V1") and Synchronous Proxy — Kiro identifies all mainframe touchpoints and can generate sample request/response pairs.
- This helps identify what data is returned so teams can determine where to get equivalent data in the target state.

---

## 5. Application Inventory & Estimation (14:24 - 17:43)

- A **spreadsheet** lists all applications within Account Management and D&D value streams with completed analysis.
- **20+ applications** identified with SAG impact.
- Analysis includes effort sizing (small/medium/large) based on number of integrations.
- **Splunk activity data** shows production call volumes — e.g., Participant Download is the highest volume consumer.
- Volume data helps prioritize which applications are most critical to remediate.

---

## 6. Next Steps & Scope Clarification (17:43 - 22:43)

### Action Items:
1. Dev folks/tech leads to review the application list and validate analysis.
2. Provide cost estimates for remediation.

### Key Points:
- **Associate Desktop Release Train** is excluded — they are handling SAG exit separately with direct program funding.
- Remaining scope: **~16 applications** (after excluding Associate Desktop).
- Some applications require simple **code removal** (e.g., RPT — consumers told to get data elsewhere).
- Others require **re-routing to alternative APIs** (e.g., Participant Form WS — tax form selection V1 needs alternative).
- A **"Potential Submissions" Word document** from the program team provides recommended alternatives for some services.
- For services without alternatives yet, teams work with program leads (George Bothwell's team) to identify target data sources.

### Budget:
- Current estimation: **~$1.5 million** (including Associate Desktop applications).
- Accenture team needs to validate and confirm the cost estimate.

---

## 7. Associate Desktop Exclusion Clarification (22:59 - 25:37)

- **Vibhas** asked about the difference in approach for Associate Desktop vs. rest of Account Management.
- **Vijay:** Associate Desktop wants to work directly with the program team and secure funding separately.
- **Amit:** A work order called "SAG Exit" has already been submitted listing 10 applications — Associate Desktop is NOT included.
- **Update from Anand (morning of meeting):** Leadership wants to execute the **entire scope** — all 16 applications (not just the original 10).
- DSV exit = SAG Exit (same initiative, different names).
- **All 16 applications must be delivered by end of 2026.**

---

## 8. Testing & Validation Discussion (27:31 - 37:34)

### Challenge:
- There is **no one-to-one replacement** for mainframe calls — alternative APIs may return similar (not identical) data.
- Multiple backend systems (mainframe, MDM, ODS) may need to be called to replicate what a single DSV call provided.
- Data mapping and orchestration is required.

### Testing Approach:
- **Unit Testing:** Use stubbed responses for new API interactions.
- **QA/Validation:** Compare current mainframe data with new API data — verify same data elements are available.
- **Validation methods:** Splunk logs, data field mapping via Kiro, end-user interface verification.
- Accenture team to work with respective app owners for domain knowledge and baseline data.

### Concern (Amit):
- With 16 apps and fixed timeline, Accenture shouldn't spin wheels figuring out correctness without baseline data.
- App owners or automated test suites should provide baseline snapshots for comparison.

### Resolution:
- Data mapping and validation IS part of Accenture's scope.
- Accenture works with app owners who understand the functionality.
- Some apps are already part of managed services — team may already have familiarity.

---

## 9. Team Constraints & Onboarding (38:25 - 42:00)

### Key Constraint (Ranjit):
- Team being factored for this work is coming from **Enrollment BCTB** work order (Team NOAA).
- **Account Management will be completely new** for these resources — learning curve expected.
- Cannot expect immediate productivity from people who spent 1-1.5 years in enrollment/profile areas.
- Production support team handholding will be needed.
- Same applies vice versa (Vibhas's team learning enrollment).

### Funding Context (Amit):
- Enrollment BCTB funding ran out end of June.
- 40% (~$450K) redirected to DCX Fastlane.
- Remaining work covered by SAG Exit — without these two initiatives, the entire team would have been off-boarded.

---

## 10. Follow-Up & Timeline (42:00 - 45:14)

### Agreed Actions:
| Action | Owner | Timeline |
|--------|-------|----------|
| Share recording with respective teams | Ranjit | Immediate |
| Team reviews applications & prepares questions | Ranjit/Swetha/Vibhas | Friday |
| Share questions before follow-up call | Ranjit | Before Monday/Tuesday |
| Follow-up call setup | Ranjit or Swetha | Monday or Tuesday |
| Share spreadsheet with application list | Vijay | Immediate |
| Identify applications team already has knowledge on | Ranjit | Before follow-up |
| Share Confluence link | Vijay | Immediate |
| Finalize estimation & scope | All | No later than July 17th |

### Critical Timeline Note (Amit):
- **Time is of essence** — estimation phase must be completed no later than **July 17th**.
- New people onboarding will take 4-6 weeks after identification.
- The sooner this phase ends, the more execution time available.

---

## Key Artifacts Referenced:
1. Confluence page (SAG Exit go-to page)
2. Analysis MD file (for Kiro-based impact analysis)
3. Master list of decommissioned mainframe modules (spreadsheet)
4. Master list of impacted DSV documents (spreadsheet)
5. ISV impacted commands list
6. Splunk production activity data (DSV, ISV, SyncMF)
7. Application inventory spreadsheet (16 apps with sizing)
8. "Potential Submissions" Word document (alternative API recommendations)
9. SAG Exit work order
