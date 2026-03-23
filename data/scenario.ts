// ---------------------------------------------------------------------------
// Scenario Script — Pre-Matching Simulation
//
// This file is the single source of truth for the conversation simulation.
// The engine in MatchingWorkspace reads these steps in order and plays them
// back using the existing UI mechanics (message thread, snippets, chips).
//
// Each step has `items` which are one of:
//   { kind: "message" }   — AI system message shown in the thread
//   { kind: "snippet" }   — UI component injected into the thread
//   { kind: "responses" } — Quick-reply chips pinned above the input
// ---------------------------------------------------------------------------

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
  | { kind: "responses"; options: string[] };

export type ScenarioStep = {
  id: string;
  items: ScenarioItem[];
};

export const SCENARIO: ScenarioStep[] = [
  // -------------------------------------------------------------------------
  // Stage 1 — Intro
  // -------------------------------------------------------------------------

  // Step 1.1 — Welcome
  {
    id: "1.1",
    items: [
      { kind: "message", style: "heading", text: "Welcome to your Matching Workspace." },
      {
        kind: "message",
        text: "This is your space to find the right hire — at your own pace, without the usual process overhead.\n\nHere you can draft and refine your requirements, explore matched candidates, and track everything in one place. A matching expert is always on standby if you need a human perspective — but there's no pressure to wait for anyone.\n\nWhat kind of role are you looking to fill? Type a few words, paste an existing job description, or use voice mode and talk it through — whatever works for you.",
      },
      { kind: "responses", options: ["Describe role", "Paste JD", "Not sure yet"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 2 — Draft Requirements
  // -------------------------------------------------------------------------

  // Step 2.1 — Stage Transition
  {
    id: "2.1",
    items: [
      {
        kind: "message",
        text: "Thanks for that — great starting point. Give me a moment, I'll turn that into a structured draft we can work from together.",
      },
      { kind: "message", text: "Alright, let's check where we are in the process." },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 2 } },
      {
        kind: "message",
        text: "We're now shaping your requirements. I've put together a first draft based on what you shared — take a look.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "draft" } },
      {
        kind: "message",
        text: "This is just a starting point. To make sure we find the right match, I have a few quick questions. Let's go through them one by one — it'll only take a minute.",
      },
    ],
  },

  // Step 2.2 — Clarifying Question: Timezone
  {
    id: "2.2",
    items: [
      {
        kind: "message",
        text: "First — does timezone matter for this role? Some clients need strong overlap, others are fully async.",
      },
      { kind: "responses", options: ["US timezones", "European timezones", "Async is fine"] },
    ],
  },

  // Step 2.3 — Clarifying Question: Duration
  {
    id: "2.3",
    items: [
      {
        kind: "message",
        text: "Got it. Next — how long do you expect to need this person? Short project or something ongoing?",
      },
      { kind: "responses", options: ["Long-term", "3–6 months", "Not sure"] },
    ],
  },

  // Step 2.4 — Clarifying Question: Team Context
  {
    id: "2.4",
    items: [
      {
        kind: "message",
        text: "Perfect. Last one — will this person be joining an existing team or working more independently?",
      },
      { kind: "responses", options: ["Joining a team", "Working solo", "Leading a team"] },
    ],
  },

  // Step 2.5 — Draft Updated
  {
    id: "2.5",
    items: [
      {
        kind: "message",
        text: "That's everything I needed — let me update the draft with what you've just told me.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "draft-updated" } },
      {
        kind: "message",
        text: "Looking better already. Want to keep refining, or does this feel ready to move forward?",
      },
      { kind: "responses", options: ["Looks good", "Edit something", "Add more detail"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 3 — Validate Requirements
  // -------------------------------------------------------------------------

  // Step 3.1 — Stage Transition
  {
    id: "3.1",
    items: [
      { kind: "message", text: "Nice — let's take stock of where we are." },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 3 } },
      {
        kind: "message",
        text: "We're now at the validation step — this is where we make sure the job description is solid before we start matching. No point finding great candidates against the wrong brief.\n\nHave a read and let me know if anything needs changing.",
      },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "validation" } },
      { kind: "responses", options: ["Looks good", "Change something", "Get matcher input"] },
    ],
  },

  // Step 3.2 — User Refines
  {
    id: "3.2",
    items: [
      { kind: "message", text: "On it — updating that now." },
      { kind: "snippet", snippet: { type: "RequirementSnippet", state: "validated" } },
      { kind: "message", text: "Done. Anything else, or are we good to start matching?" },
      { kind: "responses", options: ["Start matching", "One more thing", "Talk to matcher"] },
    ],
  },

  // Step 3.3 — Matcher Offer (Contextual)
  {
    id: "3.3",
    items: [
      {
        kind: "message",
        text: "Just so you know — if you're not 100% sure about the requirements, your matching expert Steven can step in and review them with you. He's done this hundreds of times and can spot gaps quickly.\n\nUp to you — we can go straight to matching or loop him in first.",
      },
      { kind: "responses", options: ["Start matching", "Loop in Steven"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 4 — Matching Candidates
  // -------------------------------------------------------------------------

  // Step 4.1 — Stage Transition
  {
    id: "4.1",
    items: [
      { kind: "message", text: "Great — let's see where we've landed." },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 4 } },
      {
        kind: "message",
        text: "Requirements are locked in — now the fun part. I'm pulling your first set of matches from Toptal's network right now.",
      },
      {
        kind: "message",
        text: "Here they are. Each candidate has been scored against your specific requirements. You'll see why each one might be a fit, their availability, and their key skills.\n\nMark anyone as Interested or Pass — your reactions help me get smarter about what you're looking for.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", source: "auto-matched" } },
      { kind: "responses", options: ["Show more", "Refine first", "Talk to Steven"] },
    ],
  },

  // Step 4.2 — System Reacts to Feedback
  {
    id: "4.2",
    items: [
      {
        kind: "message",
        text: "Thanks for that — I can see a pattern forming. Let me factor that into the next set of results.",
      },
    ],
  },

  // Step 4.4 — Matcher Adds Candidates
  {
    id: "4.4",
    items: [
      {
        kind: "message",
        text: "Steven has been following along and added a couple of candidates he thinks are worth your attention. You'll see them labeled as matcher picks — they come with his personal note on why he's flagging them.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", source: "matcher-suggested" } },
      { kind: "responses", options: ["Review them", "Skip for now", "Chat with Steven"] },
    ],
  },

  // Step 4.5 — Shortlist Confirmation
  {
    id: "4.5",
    items: [
      {
        kind: "message",
        text: "Nice — you've shortlisted a couple of strong profiles. I'm saving them and confirming their availability in the background.\n\nYou can keep browsing, or when you're ready we can move to interviews.",
      },
      { kind: "responses", options: ["Keep browsing", "Move to interviews", "See shortlist"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 5 — Interviewing
  // -------------------------------------------------------------------------

  // Step 5.1 — Stage Transition
  {
    id: "5.1",
    items: [
      { kind: "message", text: "Let's check in on the overall progress." },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 5 } },
      {
        kind: "message",
        text: "Great — you've got a solid shortlist and now it's time to meet the candidates. I can coordinate everything for you.\n\nHere's who you've shortlisted. Select who you'd like to invite — you can do all of them or just your top picks.",
      },
      { kind: "snippet", snippet: { type: "TalentsSnippet", view_mode: "shortlist-only" } },
      { kind: "responses", options: ["Invite all", "Top pick only", "Need more time"] },
    ],
  },

  // Step 5.2 — Invitations Sent
  {
    id: "5.2",
    items: [
      {
        kind: "message",
        text: "Done — invitations sent. I'll let you know as candidates confirm their availability.\n\nWhile you wait, Steven can help you prepare interview questions or think through how to evaluate each profile. Just say the word.",
      },
      { kind: "responses", options: ["Prep questions", "Chat with Steven", "I'll wait"] },
    ],
  },

  // -------------------------------------------------------------------------
  // Stage 6 — Hire
  // -------------------------------------------------------------------------

  // Step 6.1 — Stage Transition
  {
    id: "6.1",
    items: [
      { kind: "message", text: "Almost there — let's see the full picture." },
      { kind: "snippet", snippet: { type: "StepsSnippet", activeStage: 6 } },
      { kind: "message", text: "Interviews are done. This is the final step — who would you like to move forward with?" },
      { kind: "snippet", snippet: { type: "TalentsSnippet", view_mode: "interviewed" } },
      { kind: "responses", options: ["Hire them", "Compare again", "Ask Steven"] },
    ],
  },

  // Step 6.2 — Closing
  {
    id: "6.2",
    items: [
      {
        kind: "message",
        text: "Congratulations — you've made your pick! 🎉\n\nWe'll handle the next steps to get the engagement underway. Steven will reach out shortly to finalize the details.\n\nReally glad we could make this match happen. Welcome to the Toptal network.",
      },
    ],
  },
];
