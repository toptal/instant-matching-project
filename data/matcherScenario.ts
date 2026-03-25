// =============================================================================
// MATCHER SCENARIO — Steven Kovacel (Human Matcher) Conversation Script
// =============================================================================
//
// WHAT THIS FILE IS
// -----------------
// This file defines the scripted conversation that plays when Steven Kovacel,
// the human matching expert, joins the chat. It is separate from the main
// scenario (data/scenario.ts) and runs as an overlay on top of the main flow.
//
// The engine in `components/MatchingWorkspace.tsx` reads this array in order,
// one step at a time, advancing when the user responds.
//
// WHEN THE MATCHER SCENARIO TRIGGERS
// ------------------------------------
// Steven's conversation can be activated in two ways:
//   1. The user clicks the "Chat" button on Steven's profile card in the sidebar.
//   2. The user types a message containing trigger keywords such as "matcher",
//      "help", "requirements", "adjust", "refine", etc. — a tooltip appears
//      offering to bring Steven in, and if accepted, this scenario starts.
//
// Steven's messages appear in GREEN chat bubbles (vs. grey for the AI).
// A "Steven Kovacel joined the conversation" separator is shown when he enters,
// and a "Steven Kovacel left the conversation" separator appears when the
// scenario ends (after the last step).
//
// HOW TO CUSTOMISE
// ----------------
// Download this file from Settings → Matcher Scenario → "Download default",
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
//                         immediately after Steven's message.
//
// =============================================================================

export type MatcherScenarioStep = {
  id: string;
  matcherText: string;
  userOptions: string[];
  requirementSnippet?: "draft" | "draft-updated" | "validation" | "validated" | "updated";
  talentsSnippet?: true;
};

export const MATCHER_SCENARIO: MatcherScenarioStep[] = [
  // Step m1 — Steven introduces himself and asks permission to help.
  {
    id: "m1",
    matcherText:
      "Hey! This is Steven. I've been keeping an eye on your progress here and I think I can help you get a bit more precise about what you need. Want to run through a few quick questions?",
    userOptions: ["Sure, let's do it"],
  },

  // Step m2 — First clarifying question: runtime/technology specifics.
  {
    id: "m2",
    matcherText:
      "Great. When you say JavaScript back-end developer — are you thinking Node.js specifically, or are you open to similar runtimes like Bun or Deno? It changes the talent pool quite a bit.",
    userOptions: ["Node.js specifically", "Open to other runtimes", "Not sure yet"],
  },

  // Step m3 — Second clarifying question: project context.
  {
    id: "m3",
    matcherText:
      "Got it. And is this for an existing codebase or a greenfield project? That'll help me figure out whether to prioritise people with strong legacy experience or those who thrive in early-stage environments.",
    userOptions: ["Existing codebase", "Greenfield project", "Mix of both"],
  },

  // Step m4 — Steven acknowledges and says he'll refine the requirements.
  {
    id: "m4",
    matcherText:
      "Perfect — really helpful context. I'll refine your requirements based on this. Give me a moment.",
    userOptions: [],
  },

  // Step m5 — Steven delivers the updated requirements card.
  {
    id: "m5",
    matcherText:
      "Done. I've tightened up the requirements based on what you told me — have a look. Once you're happy with it, this will be used to find you much better matches.",
    requirementSnippet: "updated",
    userOptions: [],
  },

  // Step m6 — Steven asks for confirmation.
  {
    id: "m6",
    matcherText:
      "What do you think — does that look closer to what you had in mind?",
    userOptions: ["Looks good"],
  },

  // Step m7 — Steven hands off and leaves.
  // Steven leaves the conversation automatically after this step.
  {
    id: "m7",
    matcherText:
      "Great, glad that helped. Everything is updated — let me switch you back to the next steps where you'll be able to see the first matches based on the refined requirements.",
    userOptions: [],
  },
];
