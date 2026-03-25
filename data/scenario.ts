// =============================================================================
// MAIN SCENARIO — AI Matching Workspace Conversation Script
// =============================================================================
//
// WHAT THIS FILE IS
// -----------------
// This file defines the full scripted conversation that plays out in the
// matching workspace chat thread. It is the single source of truth for what
// the AI assistant says, what UI components it injects, and what quick-reply
// options the user sees at each point in the flow.
//
// The engine in `components/MatchingWorkspace.tsx` reads this array in order,
// one step at a time, and plays each step back when the user responds.
//
// HOW TO CUSTOMISE
// ----------------
// To create a custom scenario, download this file from Settings → Main Scenario
// → "Download default", edit it, then upload it back. The uploaded file must:
//   - Be a .ts file
//   - Export a single `const` array (the name does not matter)
//   - Each element must be a valid ScenarioStep (see type definitions below)
//
// HOW STEPS WORK
// --------------
// The scenario is an array of ScenarioStep objects. Each step plays in full
// before waiting for the user to respond. Steps advance sequentially — step N
// plays after the user sends any message while step N-1 is active.
//
// Within a step, `items` are rendered top-to-bottom in the chat thread:
//   1. All messages and snippets appear automatically (with typing animation).
//   2. The last `responses` item (if present) pins quick-reply chips above
//      the input box. Clicking a chip sends that text as a user message.
//   3. If there is no `responses` item, the free-text input is available.
//
// =============================================================================
// TYPE REFERENCE
// =============================================================================
//
// ── ScenarioStep ──────────────────────────────────────────────────────────────
//
//   { id: string; items: ScenarioItem[] }
//
//   id    — Unique identifier for this step (e.g. "1.1", "2.3"). Used only for
//           readability; the engine plays steps by array position, not by id.
//   items — Ordered list of things to show when this step plays. Can mix
//           messages, snippets, and responses in any order, but only one
//           `responses` item per step is meaningful (the last one wins).
//
// ── ScenarioItem ──────────────────────────────────────────────────────────────
//
//   Three kinds, each with a different `kind` discriminant:
//
//   1. { kind: "message"; text: string; style?: "heading" | "text" }
//      Renders a chat bubble from the AI assistant.
//      - text    — The message body. Supports \n for line breaks.
//      - style   — Optional visual style:
//                    "heading" → larger, bolder text (use for titles/openers)
//                    "text"    → default prose style (also the default if omitted)
//
//   2. { kind: "snippet"; snippet: SnippetItem }
//      Injects an interactive UI card into the chat thread.
//      See SnippetItem below for the available card types.
//
//   3. { kind: "responses"; options: string[] }
//      Pins quick-reply chips above the input box.
//      - options — Array of strings shown as clickable chips. Clicking one
//                  sends that text as the user's message and advances the step.
//                  Use an empty array [] to show no chips (free text only).
//
// ── SnippetItem ───────────────────────────────────────────────────────────────
//
//   Three card types, each with a different `type` discriminant:
//
//   1. { type: "StepsSnippet"; activeStage: number }
//      Renders the stage progress bar (the horizontal stepper UI).
//      - activeStage — Which stage to highlight as current (1–6).
//                      Stage labels: 1=Intro, 2=Draft, 3=Validate,
//                      4=Matching, 5=Interviewing, 6=Hire.
//      TIP: Place one of these at the start of each new stage to orient
//      the user about where they are in the process.
//
//   2. { type: "RequirementSnippet"; state: "draft" | "draft-updated" | "validation" | "validated" | "updated" }
//      Renders the job requirements card (the structured job brief panel).
//      - state — Controls which version/visual state of the requirements to show:
//                  "draft"         → First rough draft, shown early in stage 2
//                  "draft-updated" → Draft refined after clarifying questions
//                  "validation"    → Presented for user sign-off in stage 3
//                  "validated"     → After user approves / makes changes
//                  "updated"       → Post-matcher revision (used in stage 4+)
//      TIP: Showing the same requirement card multiple times with different
//      states communicates progression — the brief is getting sharper.
//
//   3. { type: "TalentsSnippet"; source?: "auto-matched" | "matcher-suggested"; view_mode?: "history" | "shortlist-only" | "interviewed" }
//      Renders the candidate list card with swipeable candidate profiles.
//      - source      — Optionally tags who surfaced these candidates:
//                        "auto-matched"       → System-matched (default look)
//                        "matcher-suggested"  → Flagged by Steven (shown with
//                                               green "Matcher pick" badge)
//                        omit                 → No source tag
//      - view_mode   — Controls which candidates are shown:
//                        "history"         → All revealed candidates so far
//                        "shortlist-only"  → Only candidates marked Interested
//                        "interviewed"     → Only candidates who were invited
//                        omit              → Shows the latest batch revealed
//      TIP: Use "shortlist-only" in the interview stage so the user sees
//      only the people they actually want to meet.
//
// =============================================================================
// STAGE OVERVIEW
// =============================================================================
//
//  Stage 1 — Intro          Welcome, explain the workspace, get role input
//  Stage 2 — Draft          Turn role input into a structured job brief
//  Stage 3 — Validate       User reviews and signs off on the brief
//  Stage 4 — Matching       Surface and react to matched candidates
//  Stage 5 — Interviewing   Schedule interviews with shortlisted candidates
//  Stage 6 — Hire           Final decision and closing
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
  // The opening message. Uses "heading" style for the title, then a longer
  // prose message explaining the workspace. Chips give the user three ways
  // to start describing the role they need to fill.
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
  // Acknowledges the user's role description, shows the stage progress bar
  // at stage 2, then shows the first draft of the job requirements card.
  // Ends without chips so the AI can ask the first clarifying question next.
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
  // Short question with three option chips. Each chip sends a user message
  // that advances to the next step. The actual chip text is not acted on
  // by the engine — all responses advance equally.
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
  // Shows the updated requirements card (state: "draft-updated") after the
  // clarifying questions. Offers chips to either proceed or keep refining.
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
  // Advances the stage indicator to 3 and presents the requirements card in
  // "validation" state (final review). Chips let the user approve, edit, or
  // ask for the matcher's input.
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
  // Plays after the user says something needs changing. Shows the "validated"
  // requirements state (edits applied) and asks if they're ready to match.
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
  // An optional branch that surfaces the human matcher (Steven) as an option
  // before starting the automated matching. Both chips advance the scenario —
  // "Loop in Steven" triggers the matcher chat flow via a separate mechanism.
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
  // Advances stage indicator to 4 and shows the first batch of auto-matched
  // candidates (source: "auto-matched"). Chips let the user ask for more,
  // refine before seeing more, or bring in the matcher.
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
  // A short acknowledgement step that plays after the user reacts to the
  // first batch of candidates. No snippet or chips — just a bridging message.
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
  // Steven (the human matcher) surfaces additional candidates he handpicked.
  // These are shown with source: "matcher-suggested" which renders them with
  // a green "Matcher pick" badge so they stand out visually.
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
  // Plays after the user has marked some candidates as Interested. Confirms
  // the shortlist is being saved and availability is being checked, then
  // offers to move to interviews or keep browsing.
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
  // Advances stage indicator to 5 and shows only the shortlisted candidates
  // (view_mode: "shortlist-only") so the user can choose who to invite.
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
  // Confirms invitations have been dispatched and offers preparation options
  // while the user waits for candidates to respond.
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
  // Final stage. Shows stage indicator at 6 and the "interviewed" view of
  // candidates (only those who were invited to interview) for the hire decision.
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
  // The final message. No chips — the scenario ends here. The emoji is
  // intentional; this is a celebratory closing moment.
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
