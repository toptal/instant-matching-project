// =============================================================================
// MATCHER SCENARIO — Steven Kovacel (Human Matcher) Matching-Stage Script
// =============================================================================
//
// WHAT THIS FILE IS
// -----------------
// This file defines the scripted conversation that plays when Steven Kovacel,
// the human matching expert, joins the chat during the matching stage — after
// candidates have already been revealed. It is separate from the requirements
// scenario (data/matcherScenario.ts) and focuses on helping the user evaluate
// and pick from the candidates that have been surfaced.
//
// The engine in `components/MatchingWorkspace.tsx` reads this array in order,
// one step at a time, advancing when the user responds.
//
// WHEN THE MATCHING SCENARIO TRIGGERS
// ------------------------------------
// Steven's matching conversation is activated in two ways:
//   1. The user clicks the "Chat" button on Steven's profile card in the sidebar
//      during the matching stage (phase >= 3).
//   2. A tooltip appears when the user has reviewed candidates with limited
//      interest — if accepted, this matching scenario starts.
//
// Steven's messages appear in GREEN chat bubbles (vs. grey for the AI).
// A "Steven Kovacel joined the conversation" separator is shown when he enters,
// and a "Steven Kovacel left the conversation" separator appears when the
// scenario ends (after the last step).
//
// HOW TO CUSTOMISE
// ----------------
// Download this file from Settings → Matcher Scenario — Matching → "Download default",
// edit it, then upload it back. The uploaded file must:
//   - Be a .ts file
//   - Export a single `const` array (the name does not matter)
//   - Each element must be a valid MatcherScenarioStep (see type below)
//
// HOW STEPS WORK
// --------------
// Steps play sequentially. The scenario advances to the next step whenever
// the user sends any message (including clicking a chip from `userOptions`).
//
// After the last step is played, Steven automatically leaves the conversation.
//
// =============================================================================
// TYPE REFERENCE
// =============================================================================
//
// ── MatcherScenarioStep ───────────────────────────────────────────────────────
//
//   {
//     id: string;
//     matcherText: string;
//     userOptions: string[];
//     requirementSnippet?: "draft" | "draft-updated" | "validation" | "validated" | "updated";
//     talentsSnippet?: true;
//   }
//
//   id                  — Unique identifier for readability (e.g. "m1", "m2").
//                         The engine plays steps by array position, not by id.
//
//   matcherText         — The message Steven sends, shown in a green chat bubble
//                         with his name and avatar. Supports \n for line breaks.
//                         Write in a warm, direct, expert tone — Steven is a
//                         human professional, not an AI assistant.
//
//   userOptions         — Quick-reply chips shown to the user after Steven speaks.
//                         Each string becomes a clickable chip that sends that
//                         text as the user's response and advances to the next step.
//                         Use [] (empty array) to show no chips — the user must
//                         type a free-text reply to continue.
//
//   requirementSnippet  — Optional. If set, renders the job requirements card
//                         immediately after Steven's message, in the specified state.
//
//   talentsSnippet      — Optional. Set to `true` to render a candidate list card
//                         immediately after Steven's message. Use this on the final
//                         step where Steven delivers his handpicked candidates.
//
// =============================================================================

import type { MatcherScenarioStep } from "./matcherScenario";

export const MATCHER_MATCHING_SCENARIO: MatcherScenarioStep[] = [
  // Step m1 — Steven opens by asking about the user's perspective on candidates so far.
  {
    id: "m1",
    matcherText:
      "Hey, Steven here. I've been reviewing your requirements and the candidates you've seen so far. What's your perspective after going through them — anything specific you'd like to see more of?",
    userOptions: ["More talents", "Different skills", "More senior"],
  },

  // Step m2 — Steven confirms he understood and goes to work.
  {
    id: "m2",
    matcherText:
      "Got it. I know exactly what to look for. I'm going to go through my network right now and pull the people I'd personally put in front of you.",
    userOptions: ["Sounds good", "Take your time"],
  },

  // Step m3 — Steven delivers his handpicked candidates.
  // talentsSnippet renders a matcher-pick batch after Steven's message.
  {
    id: "m3",
    matcherText:
      "Here are my picks. These are people I'd vouch for — I've matched similar profiles before and I'm confident they're worth your time. Have a look.",
    talentsSnippet: true,
    userOptions: [],
  },

  // Step m4 — Steven asks for feedback on his picks.
  {
    id: "m4",
    matcherText:
      "Have a look through them and let me know what you think.",
    userOptions: ["Profiles look good"],
  },

  // Step m5 — Steven wraps up and hands off.
  // Steven leaves the conversation automatically after this step.
  {
    id: "m5",
    matcherText:
      "Glad I could help! I'm switching off for now — feel free to continue reviewing and shortlisting. If you need me again, just let me know.",
    userOptions: [],
  },
];
