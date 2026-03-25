// =============================================================================
// PRE-MATCHING SCENARIO — AI Matching Workspace Conversation Script
// =============================================================================
//
// WHAT THIS FILE IS
// -----------------
// This file defines the scripted conversation for the pre-matching flow.
// It covers the full journey from entry through to interview scheduling,
// following the 13-stage Pre-Matching plan.
//
// The engine in `components/MatchingWorkspace.tsx` reads this array in order,
// one step at a time, and plays each step back when the user responds.
//
// =============================================================================
// TYPE REFERENCE
// =============================================================================
//
// See scenario.ts for full type documentation.
//
// =============================================================================

export type SnippetItem =
  | { type: "StepsSnippet"; activeStage: number }
  | {
      type: "RequirementSnippet";
      state: "draft" | "draft-updated" | "validation" | "validated" | "updated";
    }
  | {
      type: "TalentsSnippet";
      source?: "auto-matched" | "matcher-suggested";
      view_mode?: "history" | "shortlist-only" | "interviewed";
    };

export type ScenarioItem =
  | { kind: "message"; text: string; style?: "heading" | "text" }
  | { kind: "snippet"; snippet: SnippetItem }
  | { kind: "responses"; options: string[] }
  | {
      kind: "tooltip";
      content: string;
      primaryLabel: string;
      secondaryLabel: string;
    };

export type ScenarioStep = {
  id: string;
  items: ScenarioItem[];
};

export const SCENARIO: ScenarioStep[] = [
  // -------------------------------------------------------------------------
  // Stage 1 — Entry via AI Assistant
  // -------------------------------------------------------------------------

  // Step 1.1 — Welcome & Entry Point
  // The opening message. Uses "heading" style for the title, then a prose
  // message inviting the user to describe their role. Single chip to start.
  {
    id: "1.1",
    items: [
      { kind: "message", style: "heading", text: "Welcome to your Matching Workspace." },
      {
        kind: "message",
        text: "This is your space to find the right person for your team. Describe the role you're looking for in a few words, paste an existing job description, or just share the problem you're trying to solve — everything starts from here.",
      },
      { kind: "responses", options: ["Describe role"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 2 — Initial Requirements Formation
  // -------------------------------------------------------------------------

  // Step 2.1 — Acknowledge input, show draft requirements
  // Thanks the user, shows the stage progress bar at stage 2, presents the
  // first draft of the requirements, and sets up clarifying questions.
  {
    id: "2.1",
    items: [
      {
        kind: "message",
        text: "Thanks for sharing that — great starting point. Let's check where we are in the process.",
      },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 2 } },
      {
        kind: "message",
        text: "Based on what was provided, here is the first draft of your requirements — have a look.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "draft" } },
      {
        kind: "message",
        text: "Before moving forward, there are a few quick questions that will help sharpen this up.",
      },
      { kind: "responses", options: ["Let's go through them"] },
    ],
  },

  // Step 2.2 — Clarifying Question 1: Timezone
  {
    id: "2.2",
    items: [
      {
        kind: "message",
        text: "Does timezone overlap matter for this role, or is async work fine?",
      },
      { kind: "responses", options: ["US timezones", "European timezones", "Async is fine"] },
    ],
  },

  // Step 2.3 — Clarifying Question 2: Hands-on vs Leadership
  {
    id: "2.3",
    items: [
      {
        kind: "message",
        text: "Got it. Will this person be hands-on building, or more focused on leading a team?",
      },
      { kind: "responses", options: ["Hands-on", "Leading a team", "Both"] },
    ],
  },

  // Step 2.4 — Clarifying Question 3: Duration
  {
    id: "2.4",
    items: [
      {
        kind: "message",
        text: "Good to know. How long is this engagement expected to last?",
      },
      { kind: "responses", options: ["Long-term", "3–6 months", "Not sure yet"] },
    ],
  },

  // Step 2.5 — Draft updated, invite review
  // Shows the updated requirements after clarifying questions and invites
  // the user to review and adjust, leading into Stage 3.
  {
    id: "2.5",
    items: [
      {
        kind: "message",
        text: "That helps — the draft has been updated with these details.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "draft-updated" } },
      {
        kind: "message",
        text: "Take a moment to review the updated requirements. Does everything look right, or is there anything you'd like to adjust?",
      },
      { kind: "responses", options: ["I'd like to change something"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 3 — Requirements Refinement Loop
  // -------------------------------------------------------------------------

  // Step 3.1 — Stage transition to Validate, encourage edits
  // Advances the progress bar to stage 3 and opens the floor for the user
  // to make changes. Empty chips — free text input.
  {
    id: "3.1",
    items: [
      {
        kind: "message",
        text: "Great, let's move to the next phase.",
      },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 3 } },
      {
        kind: "message",
        text: "This is the time to make the requirements truly yours. Feel free to add anything that's missing, change what doesn't feel right, or clarify any details — every adjustment helps find a better match.",
      },
      { kind: "responses", options: ["Client provides details"] },
    ],
  },

  // Step 3.2 — Acknowledge edit, show updated requirements
  // After the user types their change, confirms the update and offers
  // two paths: move forward or involve the matcher.
  {
    id: "3.2",
    items: [
      {
        kind: "message",
        text: "Good input — the requirements have been updated to reflect that.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "validated" } },
      {
        kind: "message",
        text: "Have another look. Anything else to adjust, or does this feel ready to move forward?",
      },
      { kind: "responses", options: ["Looks good, let's move on", "I need a matcher"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 4 — First Portfolio Reveal
  // -------------------------------------------------------------------------

  // Step 4.1 — Stage transition to Matching, reveal first candidates
  // Advances the progress bar to stage 4 and shows the first batch of
  // auto-matched candidates. Empty chips — free text input.
  {
    id: "4.1",
    items: [
      {
        kind: "message",
        text: "Great — the requirements are locked in. Let's see what's out there.",
      },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 4 } },
      {
        kind: "message",
        text: "Here are the first three candidates matched against your requirements. Take your time reviewing them and mark each one as Interested or Not a fit.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", source: "auto-matched" } },
      { kind: "responses", options: [] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 5 — Candidate Review & Feedback
  // -------------------------------------------------------------------------

  // Step 5.1 — React to feedback, suggest adjusting requirements
  // Acknowledges the user's candidate feedback and suggests refining
  // requirements based on what they've seen.
  {
    id: "5.1",
    items: [
      {
        kind: "message",
        text: "Thanks for the feedback — that's really helpful. It helps refine what to look for in the next round of candidates.",
      },
      {
        kind: "message",
        text: "Based on what you've seen so far, would you like to adjust anything in the requirements? Sometimes reviewing real candidates helps clarify what matters most.",
      },
      { kind: "responses", options: ["Client provides updates"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 6 — Iterative Refinement
  // -------------------------------------------------------------------------

  // Step 6.1 — Update requirements, show refined candidates
  // Applies the user's refinement and shows a new batch of candidates
  // that better match the updated requirements.
  {
    id: "6.1",
    items: [
      {
        kind: "message",
        text: "Got it — updating the requirements now.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "validated" } },
      {
        kind: "message",
        text: "Based on the updated requirements and the feedback shared about the first set of candidates, here are another three talents that should be a closer fit.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", source: "auto-matched" } },
      { kind: "responses", options: [] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 7 — Shortlisting
  // -------------------------------------------------------------------------

  // Step 7.1 — Shortlist saved, ask to show
  // Confirms the shortlist is saved and asks if the user wants to see it.
  {
    id: "7.1",
    items: [
      {
        kind: "message",
        text: "Nice — a few strong profiles have been marked as Interested. The shortlist is being saved and availability is being confirmed in the background.",
      },
      {
        kind: "message",
        text: "Would you like to see the shortlisted candidates?",
      },
      { kind: "responses", options: ["Yes, show me"] },
    ],
  },

  // Step 7.2 — Show shortlist
  // Displays only the candidates marked as Interested.
  {
    id: "7.2",
    items: [
      {
        kind: "message",
        text: "Here's the current shortlist. Take a final look before moving to the next stage.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", view_mode: "shortlist-only" } },
      { kind: "responses", options: ["Looks good"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 13 — Final Decision (Interview Scheduling)
  // -------------------------------------------------------------------------
  // Stages 8–12 are handled by the matcher scenario files and system triggers.

  // Step 7.3 — Invite to schedule interviews
  // Wraps up the pre-matching flow by guiding the user toward booking
  // interviews with their shortlisted candidates.
  {
    id: "7.3",
    items: [
      {
        kind: "message",
        text: "The shortlist looks solid. The next step is to set up interviews with the selected candidates.",
      },
      {
        kind: "message",
        text: "There are two ways to move forward — pick available time slots using the scheduling cards, or share your availability and the interviews will be booked automatically.",
      },
      { kind: "responses", options: ["Here's my availability"] },
    ],
  },
];
