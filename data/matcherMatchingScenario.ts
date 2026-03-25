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
// CONVERSATION DESIGN TIPS
// =============================================================================
//
// - Keep Steven's voice human: opinionated, concise, occasionally informal.
//   He is an expert who has "done this hundreds of times" — not a chatbot.
//
// - The matching-stage arc: open → understand what's blocking them →
//   identify the single must-have → deliver handpicked candidates. 5 steps
//   is a natural length; avoid going beyond 7 or the flow feels slow.
//
// - The last step should always include `talentsSnippet: true` so Steven's
//   contribution is tangible.
//
// - `userOptions` on the final step should be positive closers like
//   "Thanks, Steven!" — they signal the user is done.
//
// =============================================================================

import type { MatcherScenarioStep } from "./matcherScenario";

export const MATCHER_MATCHING_SCENARIO: MatcherScenarioStep[] = [
  // Step m1 — Steven opens with a single focused question to calibrate his picks.
  // Chips make it easy to answer quickly — no typing required.
  {
    id: "m1",
    matcherText:
      "Hey, Steven here. I've been watching what you're seeing and I think I can find you better fits. Quick question — what's been the main issue with the candidates so far?",
    userOptions: [
      "Skills aren't right",
      "Wrong seniority level",
      "Not enough context on them",
      "Just want more options",
    ],
  },

  // Step m2 — Steven confirms he understood and gives the user a beat
  // to acknowledge before he delivers. Chips keep the flow moving.
  {
    id: "m2",
    matcherText:
      "Got it. I know exactly what to look for. I'm going to go through my network right now and pull the people I'd personally put in front of you.",
    userOptions: ["Sounds good", "Take your time"],
  },

  // Step m3 — Payoff: Steven delivers his handpicked candidates.
  // talentsSnippet renders a matcher-pick batch after Steven's message.
  // Steven leaves the conversation automatically after this step.
  {
    id: "m3",
    matcherText:
      "Here are my picks. These are people I'd vouch for — I've matched similar profiles before and I'm confident they're worth your time. Have a look.",
    talentsSnippet: true,
    userOptions: ["Thanks, Steven!", "These look promising"],
  },
];
