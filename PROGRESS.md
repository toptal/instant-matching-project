# Implementation Progress — Toptal AI Matching Workspace
> Based on **User Stories v1.0** (PRD v1.3) · Last audited: 2026-03-22

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented |
| 🟡 | Partially implemented — core UI exists, gaps noted |
| ❌ | Not implemented |
| 🔌 | Requires real API (cannot be fully mocked) |

---

## Summary Table

| Epic | Stories | Done | Partial | Missing |
|------|---------|------|---------|---------|
| E1 Workspace Shell | US-001–003 | 0 | 3 | 0 |
| E2 Onboarding | US-004–006 | 1 | 1 | 1 |
| E3 Progress Model | US-007–010 | 2 | 1 | 1 |
| E4 Requirements | US-011–016 | 1 | 0 | 5 |
| E5 Candidate Matching | US-017–022 | 4 | 0 | 2 |
| E6 SidePanel | US-023–028 | 1 | 1 | 4 |
| E7 Matcher Integration | US-029–033 | 2 | 1 | 2 |
| E8 Conversation Layer | US-034–038 | 0 | 2 | 3 |
| E9 History & Audit | US-039–041 | 0 | 1 | 2 |
| **TOTAL** | **41** | **11** | **10** | **20** |

---

## Epic 1 — Workspace Shell

### US-001 `P0` — Split-panel layout
**Status:** 🟡 Partial

Implemented:
- Two-column layout with left chat panel and right sidebar
- White card on light grey background
- Toptal logo top-left

Gaps:
- Canvas width is **1024px** — spec requires **1032px** (PageContent) within 1440px canvas
- Gap between panels is not exactly 48px as specced
- No `max-width: 1440px` outer container

---

### US-002 `P0` — Sticky header with role title + phase indicator
**Status:** 🟡 Partial

Implemented:
- Role title rendered ("Java Script Back-end Developer")
- `IndicatorContainer` renders below title
- HeadingContainer visually present

Gaps:
- Header is **not CSS `position: sticky`** — scrolling the thread will scroll the header away
- Role title is hardcoded — not driven by application state
- `IndicatorContainer` phase is hardcoded at `activePhase=1`, not wired to global phase state

---

### US-003 `P0` — Fixed input area at bottom
**Status:** 🟡 Partial

Implemented:
- `ChatInput` component renders at the bottom
- Placeholder text "Write anything..."
- Voice mode toggle button (waveform icon)

Gaps:
- No actual `<input>` or `<textarea>` — cannot type anything
- No `isLoading` state — Stop button never appears
- Keyboard shortcut hints render slightly different from spec (⌘⇧/ not shown)
- Voice/Stop toggle swap not implemented

---

## Epic 2 — Onboarding & Entry

### US-004 `P0` — Welcome video + onboarding bullets
**Status:** ✅ Done

`VideoSnippet` component renders with thumbnail placeholder, play button, "Show transcription" toggle, and all 5 bullet points. AI welcome messages are present in the thread.

---

### US-005 `P0` — Voice/chat mode selection quick-reply pills
**Status:** 🟡 Partial

Implemented:
- Two buttons "Yes, let's use the voice mode" and "Yes, let's chat" render below the thread

Gaps:
- Buttons are **hardcoded static HTML** — not an `InteractionOptions` quick-reply component
- Clicking does not post a `UserMessage` to the thread
- No phase transition triggered
- "I cannot watch the video now" secondary option missing
- Pills do not grey out / disappear after selection

---

### US-006 `P1` 🔌 — JD generation from client input
**Status:** ❌ Not implemented

No input handling exists. No JD generation flow. No phase transition triggered by input.

---

## Epic 3 — Progress Model

### US-007 `P0` — IndicatorContainer — 6 phase dots
**Status:** ✅ Done

6 dots with correct color states (green/blue/grey), phase label text, and correct phase strings implemented.

Gap: Phase is **hardcoded** (`activePhase=1`) — not driven by global state.

---

### US-008 `P0` — AISnippetSteps — inline progress card
**Status:** ✅ Done

Card renders with all 6 steps, correct icon states (done/current/pending), and "Where we are now?" title. Step data is hardcoded to Phase 2 being current.

Gap: Card is **static** — always shows Phase 2 as current, not wired to phase state.

---

### US-009 `P0` — Phase indicator sync (header + thread)
**Status:** ❌ Not implemented

There is no shared global phase state. `IndicatorContainer` and `AISnippetSteps` are independent, hardcoded components. No React Context or Zustand store exists. This is a foundational prerequisite for most of the conversation flow.

---

### US-010 `P1` — Phase transition messages
**Status:** 🟡 Partial

Some transition-like messages are hardcoded in the thread. The required specific messages for each transition (Phase 1→2, 2→3, etc.) are not triggered programmatically by phase changes.

---

## Epic 4 — Requirements

### US-011 `P0` — AISnippetRequirements card
**Status:** ✅ Done

`AISnippetRequirements` renders inline in the thread with scrollable content, "Job Details" header, and Copy icon. Content is hardcoded (generic Front-End Developer JD).

Gap: Content is **not driven by state** — always shows the same hardcoded JD.

---

### US-012 `P1` 🔌 — Clarifying questions one at a time
**Status:** ❌ Not implemented

No question sequencing, no `questionIndex` state, no dynamic follow-up questions.

---

### US-013 `P1` — JD confirmation + Phase 3→4 advance
**Status:** ❌ Not implemented

No "Does this summary reflect your needs?" message, no "Yes" pill, no phase advance trigger.

---

### US-014 `P1` — JD updates appended to thread
**Status:** ❌ Not implemented

JD is static. No mechanism to update JD state or append new `AISnippetRequirements` cards.

---

### US-015 `P2` — JD version history in SidePanel
**Status:** ❌ Not implemented

No version selector, no `jdVersions` array in state.

---

### US-016 `P2` 🔌 — JD completeness signal
**Status:** ❌ Not implemented

---

## Epic 5 — Candidate Matching

### US-017 `P0` — AISnippetTalents card stack
**Status:** ✅ Done

3-card stacked effect with correct absolute positioning, depth shadow, navigation arrows (left/right), and `frontIndex` state for cycling candidates.

---

### US-018 `P0` — Candidate front card content (fit signals, skills, availability)
**Status:** ✅ Done

Left column (photo placeholder, name, role, CTA button) and right column (fit signals with bold emphasis, availability, skill pills) implemented. 3 hardcoded candidate objects.

Gap: "Auto-matched" vs "Suggested by Matcher" badge — only "Auto-matched" variant present.

---

### US-019 `P0` — Interested / Not a Fit actions
**Status:** ✅ Done

Decision flow implemented: clicking "Review Candidate" → opens modal; decisions tracked in `decisions[]` state; card advances to next candidate after decision; overlay label on card (green "Interested" / grey "Not a fit").

Minor gap: Pass reason not prompted inline on the card (only available in the modal's reason dropdown).

---

### US-020 `P0` — Full profile overlay (CandidateModal)
**Status:** ✅ Done

Full modal with dark navy header, fit signals, skills, availability, scrollable body (About + Experience), sticky action bar with Interested/Not a Fit buttons, navigation arrows, and close button. Reason dropdown for "Not a Fit" implemented.

---

### US-021 `P1` 🔌 — Pass feedback → re-ranking
**Status:** ❌ Not implemented

No re-ranking logic. No acknowledgment AIMessage after passing a candidate.

---

### US-022 `P2` — Side-by-side candidate comparison
**Status:** ❌ Not implemented (correctly deferred — v2.0 scope)

---

## Epic 6 — SidePanel

### US-023 `P0` — Matcher card (default SidePanel view)
**Status:** ✅ Done

`MatcherCard` renders with photo placeholder, "Monitoring your activity" green status dot, Call/Chat buttons, and description bullets. `NavRow` items for Job Details and Candidates present. Static "Updated" badge on Job Details row.

---

### US-024 `P0` — SidePanel slide animation (default ↔ detail views)
**Status:** ❌ Not implemented

SidePanel has only one view. No `activePanel` state, no translateX animation, no detail views accessible.

---

### US-025 `P0` — Job Details panel (SidePanel detail view)
**Status:** ❌ Not implemented

No slide-in Job Details view. Clicking "Job Details" row does nothing.

---

### US-026 `P0` — Candidates panel + filter grid
**Status:** ❌ Not implemented

No slide-in Candidates view. Clicking "Candidates" row does nothing.

---

### US-027 `P1` — Badge counts update in real time
**Status:** 🟡 Partial

"Updated" badge on Job Details row is statically hardcoded. "Candidates" row has no badge. No state tracks `lastOpenedJobDetails` or `lastOpenedCandidates`.

---

### US-028 `P1` — Scroll position preserved across panel open/close
**Status:** ❌ Not implemented

---

## Epic 7 — Matcher Integration

### US-029 `P1` — Matcher tooltip + trigger conditions
**Status:** 🟡 Partial

`MatcherTooltip` UI is implemented (correct dimensions, arrow, two buttons, dismiss/accept callbacks). Tooltip is hardcoded to show on load via `showTooltip = true` initial state.

Gaps:
- **No trigger conditions** implemented (10-min timer, 2+ passes without reason, keyword detection, inactivity)
- Tooltip always shows on page load regardless of context
- "Help me refine" does not post an AIMessage
- No suppressed-trigger tracking

---

### US-030 `P1` — Matcher-suggested candidate badges
**Status:** 🟡 Partial

"Auto-matched" badge exists on candidate cards with correct purple styling. No "Suggested by [Name]" variant (different label/colour) implemented. No `source` field on candidate data.

---

### US-031 `P1` — Matcher JD update + attribution inline
**Status:** ❌ Not implemented

---

### US-032 `P2` — Call/Chat buttons (non-functional prototype)
**Status:** ✅ Done

Call and Chat buttons render correctly. onClick is a no-op (prototype requirement met).

---

### US-033 `P2` — Matcher online status indicator
**Status:** ✅ Done

Green dot + "Monitoring your activity" text overlay on matcher photo. Hardcoded as "active" (prototype requirement met).

---

## Epic 8 — Conversation Layer

### US-034 `P0` — Chat thread rendering (AIMessage / UserMessage)
**Status:** 🟡 Partial

Thread content renders left-aligned AI text and a right-aligned user message bubble. AI snippet components render inline.

Gaps:
- Thread is **hardcoded HTML** — not a data-driven `messages[]` array
- No auto-scroll to bottom on new message
- No proper message type system (`ai-text` | `user-text` | `snippet-*`)
- Append-only model not enforced — everything is static JSX

---

### US-035 `P0` 🔌 — Text input + submit (send message)
**Status:** ❌ Not implemented

`ChatInput` renders a visual placeholder but has **no `<input>` element**, no `onChange`/`onSubmit` handler, no message append logic, no `isLoading` state.

---

### US-036 `P0` — Quick-reply pills (InteractionOptions)
**Status:** 🟡 Partial

Two option buttons exist in the hardcoded thread. Not implemented as a reusable `InteractionOptions` component. No post-selection behavior (no UserMessage appended, no greying out).

---

### US-037 `P1` — Loading state + animated typing indicator + Stop button
**Status:** ❌ Not implemented

No `isLoading` state anywhere. No typing indicator. No Stop button.

---

### US-038 `P2` — Voice mode (functional)
**Status:** ❌ Not implemented (correctly deferred — v1.1 scope)

---

## Epic 9 — History & Audit

### US-039 `P1` — Candidate history + status reversal
**Status:** 🟡 Partial

Decision state (`decisions[]`) persists in session within `AISnippetTalents`. Status can be changed in the modal (re-clicking Interested from Not a Fit).

Gaps:
- No `statusHistory` array per candidate
- No change log with timestamps
- Not accessible from Candidates panel (US-026 not implemented)
- Shortlist count not displayed anywhere

---

### US-040 `P2` — JD change log
**Status:** ❌ Not implemented

---

### US-041 `P2` — Audit log (in-state, no UI required)
**Status:** ❌ Not implemented

No `auditLog` array in state.

---

## What Still Needs to Be Built

### P0 — Must have (prototype breaks without it)

These are the **critical gaps** that block the core user journey:

| # | Story | What to build |
|---|-------|--------------|
| US-001 | Layout dimensions | Fix canvas to 1440px outer / 1032px PageContent; exact 48px gap |
| US-002 | Sticky header | Add `position: sticky; top: 0` to HeadingContainer |
| US-003 | Working input area | Add `<input>`, Enter-to-submit, Stop button toggle |
| US-005 | Quick-reply pills | Build `InteractionOptions` component; wire voice/chat pill clicks to phase change |
| US-009 | Global phase state | Create React Context (or Zustand) for phase; wire `IndicatorContainer` + `AISnippetSteps` to it |
| US-024 | SidePanel slide animation | Build two-panel CSS transform slide; `activePanel` state |
| US-025 | Job Details panel | Build Job Details detail view inside SidePanel |
| US-026 | Candidates panel | Build Candidates grid detail view inside SidePanel |
| US-034 | Data-driven thread | Replace hardcoded JSX with `messages[]` array + conditional rendering; add auto-scroll |
| US-035 | Text input + submit | Input state, Enter handler, append to thread, loading state, mock AI response |
| US-036 | Quick-reply as data | `InteractionOptions` as proper message type; post UserMessage on click; grey out |

### P1 — Should have (core happy path)

| # | Story | What to build |
|---|-------|--------------|
| US-006 🔌 | JD generation | Input → mock structured JD → append `AISnippetRequirements` to thread |
| US-010 | Transition messages | Hardcoded strings triggered by phase state change |
| US-012 🔌 | Clarifying questions | `questionIndex` state; show questions sequentially after JD draft |
| US-013 | JD confirm → Phase 3→4 | "Does this look right?" + Yes pill → phase advance → matching |
| US-014 | JD updates in thread | Append new `AISnippetRequirements` card on JD update |
| US-021 🔌 | Pass re-ranking | Simulate shuffle; acknowledgment AIMessage |
| US-027 | Badge counts | Track `lastOpened` timestamps; derive badges from state |
| US-028 | Scroll preservation | Store `scrollTop` per panel; restore on open |
| US-029 | Tooltip triggers | Keyword detection (condition 4) for demo; setTimeout for conditions 1 & 2 |
| US-030 | Matcher badge variant | Add `source: 'system'|'matcher'` to candidate; render teal "Suggested by" badge |
| US-031 | Matcher JD attribution | Append JD version with `matcherName`; show attribution label |
| US-037 | Loading indicator | Typing animation component; `isLoading` state; Stop button |
| US-039 | Candidate status history | `statusHistory[]` per candidate; shortlist count derived and displayed |

### P2 — Nice to have (v1.1 / v2.0)

| # | Story | Notes |
|---|-------|-------|
| US-015 | JD version history dropdown | `jdVersions` array; version selector in Job Details panel |
| US-016 🔌 | JD completeness signal | Hardcode for prototype; real AI for v1.1 |
| US-022 | Side-by-side comparison | v2.0 scope |
| US-038 | Voice mode | v1.1 scope; non-functional toggle already present |
| US-040 | JD change log | Display in version dropdown |
| US-041 | Audit log | In-state, no UI needed for prototype |

---

## Recommended Build Order

Given dependencies between stories, the suggested implementation sequence:

**Phase A — Foundations (unblocks everything)**
1. Global phase state (US-009) — React Context or Zustand
2. Data-driven thread / messages array (US-034)
3. Working text input + submit (US-035)

**Phase B — Core flow**
4. Quick-reply pills as proper component (US-005, US-036)
5. Phase transitions with messages (US-010)
6. JD state + AISnippetRequirements wired to state (US-011 wire-up, US-014)
7. JD confirmation flow (US-013)
8. SidePanel slide animation + Job Details + Candidates panels (US-024, US-025, US-026)

**Phase C — Conversation depth**
9. JD generation mock (US-006)
10. Clarifying questions (US-012)
11. Loading state + typing indicator (US-037)
12. Matcher tooltip trigger conditions (US-029)

**Phase D — Polish & audit**
13. Badge counts (US-027, US-028)
14. Matcher-suggested badges (US-030)
15. Candidate status history (US-039)
16. Pass feedback acknowledgment (US-021)

---

## Component Inventory

| Component | File | Status |
|-----------|------|--------|
| MatchingWorkspace | `components/MatchingWorkspace.tsx` | Exists — needs state wiring |
| IndicatorContainer | `components/IndicatorContainer.tsx` | Exists — needs phase state input |
| AISnippetSteps | `components/AISnippetSteps.tsx` | Exists — needs phase state input |
| AISnippetRequirements | `components/AISnippetRequirements.tsx` | Exists — needs JD state input |
| AISnippetTalents | `components/AISnippetTalents.tsx` | Exists — mostly complete |
| CandidateModal | `components/CandidateModal.tsx` | Exists — mostly complete |
| VideoSnippet | `components/VideoSnippet.tsx` | Exists — complete for prototype |
| SidePanel | `components/SidePanel.tsx` | Exists — needs slide animation + detail views |
| MatcherCard | `components/MatcherCard.tsx` | Exists — complete for prototype |
| MatcherTooltip | `components/MatcherTooltip.tsx` | Exists — needs trigger logic |
| ChatInput | `components/ChatInput.tsx` | Exists — needs real `<input>` + submit |
| NavRow | `components/NavRow.tsx` | Exists — needs onClick handlers |
| ToptalLogo | `components/ToptalLogo.tsx` | Exists — complete |
| **InteractionOptions** | _missing_ | **New component needed** |
| **ThreadMessage** | _missing_ | **New component or hook needed** |
| **PhaseContext / store** | _missing_ | **New state layer needed** |
| **JobDetailsPanel** | _missing_ | **New sub-panel needed** |
| **CandidatesPanel** | _missing_ | **New sub-panel needed** |
