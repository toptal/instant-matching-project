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
//                         TIP: A step with no chips (like a "processing" step)
//                         feels natural when Steven is doing something and the
//                         user doesn't need to respond yet — but note the scenario
//                         will still wait for any user input before advancing.
//
//   requirementSnippet  — Optional. If set, renders the job requirements card
//                         immediately after Steven's message, in the specified
//                         state. Use this when Steven updates or revisits the brief.
//                         Available states:
//                           "draft"         → Initial rough draft
//                           "draft-updated" → After clarifying questions
//                           "validation"    → Ready for user sign-off
//                           "validated"     → User-approved version
//                           "updated"       → Post-matcher revision (most common
//                                             for the matcher scenario — shows
//                                             that Steven has improved the brief)
//
//   talentsSnippet      — Optional. Set to `true` to render a candidate list card
//                         immediately after Steven's message (and after the
//                         requirement snippet if both are set). The candidates
//                         shown are the latest matcher-suggested batch that Steven
//                         has surfaced. Use this on the final step where Steven
//                         delivers his recommended candidates.
//
// =============================================================================
// CONVERSATION DESIGN TIPS
// =============================================================================
//
// - Keep Steven's voice human: opinionated, concise, occasionally informal.
//   He is an expert who has "done this hundreds of times" — not a chatbot.
//
// - A typical arc: open → 2–3 clarifying questions → acknowledgement →
//   deliver results (requirementSnippet + talentsSnippet). 5 steps is a
//   natural length; avoid going beyond 7 or the flow feels slow.
//
// - The last step should always include `talentsSnippet: true` and/or
//   `requirementSnippet: "updated"` so Steven's contribution is tangible.
//
// - `userOptions` on the final step should be positive closers like
//   "Thanks, Steven!" or "Looks good" — they signal the user is done.
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
  // Always the opening step. Short and friendly — gives the user an easy
  // out ("I'm good for now") so they don't feel forced into the conversation.
  {
    id: "m1",
    matcherText:
      "Hey! This is Steven. I've been keeping an eye on your progress here and I think I can help you get a bit more precise about what you need. Want to run through a few quick questions?",
    userOptions: ["Sure, let's do it", "I'm good for now, thanks"],
  },

  // Step m2 — First clarifying question: runtime/technology specifics.
  // Steven digs into technical nuance the AI might have glossed over.
  // Three chips cover the main answers without being exhaustive.
  {
    id: "m2",
    matcherText:
      "Great. When you say JavaScript back-end developer — are you thinking Node.js specifically, or are you open to similar runtimes like Bun or Deno? It changes the talent pool quite a bit.",
    userOptions: ["Node.js specifically", "Open to other runtimes", "Not sure yet"],
  },

  // Step m3 — Second clarifying question: project context.
  // This shapes whether Steven prioritises legacy-code experience or
  // startup/greenfield candidates. No snippet yet — Steven is still gathering.
  {
    id: "m3",
    matcherText:
      "Got it. And is this for an existing codebase or a greenfield project? That'll help me figure out whether to prioritise people with strong legacy experience or those who thrive in early-stage environments.",
    userOptions: ["Existing codebase", "Greenfield project", "Mix of both"],
  },

  // Step m4 — Steven acknowledges and says he'll go refine the requirements.
  // No chips (empty userOptions) — this is a "hold on while I work" moment.
  // The user must type any message to advance, but in practice Steven moves
  // quickly so the next step (m5) plays almost immediately after.
  {
    id: "m4",
    matcherText:
      "Perfect — really helpful context. I'll refine your requirements based on this. Give me a moment.",
    userOptions: [],
  },

  // Step m5 — Steven delivers the updated requirements card only.
  // No candidates here — this scenario is purely about sharpening the brief.
  // Chips are positive closers — the conversation wraps up after this step
  // and Steven leaves the conversation automatically.
  {
    id: "m5",
    matcherText:
      "Done. I've tightened up the requirements based on what you told me — have a look. Once you're happy with it, the AI will use this to find you much better matches.",
    requirementSnippet: "updated",
    userOptions: ["Thanks, Steven!", "Looks good"],
  },
];
