// ---------------------------------------------------------------------------
// Matcher Scenario — Simulated Chat Between Steven Kovacel (Matcher) and User
//
// Each step has:
//   matcherText  — Steven's message shown in the thread on green background
//   userOptions  — Quick-reply chips the user can pick; empty = no chips
// ---------------------------------------------------------------------------

export type MatcherScenarioStep = {
  id: string;
  matcherText: string;
  userOptions: string[];
  requirementSnippet?: "draft" | "draft-updated" | "validation" | "validated" | "updated";
  talentsSnippet?: true;
};

export const MATCHER_SCENARIO: MatcherScenarioStep[] = [
  {
    id: "m1",
    matcherText:
      "Hey! This is Steven. I've been keeping an eye on your progress here and I think I can help you get a bit more precise about what you need. Want to run through a few quick questions?",
    userOptions: ["Sure, let's do it", "I'm good for now, thanks"],
  },
  {
    id: "m2",
    matcherText:
      "Great. When you say JavaScript back-end developer — are you thinking Node.js specifically, or are you open to similar runtimes like Bun or Deno? It changes the talent pool quite a bit.",
    userOptions: ["Node.js specifically", "Open to other runtimes", "Not sure yet"],
  },
  {
    id: "m3",
    matcherText:
      "Got it. And is this for an existing codebase or a greenfield project? That'll help me figure out whether to prioritise people with strong legacy experience or those who thrive in early-stage environments.",
    userOptions: ["Existing codebase", "Greenfield project", "Mix of both"],
  },
  {
    id: "m4",
    matcherText:
      "Perfect — really helpful context. I'll refine your requirements based on this and push a couple of additional candidates your way that I think will be a strong fit. Give me a little bit.",
    userOptions: [],
  },
  {
    id: "m5",
    matcherText:
      "Done. I've updated the requirements and added a few candidates I'm confident about — have a look below. Feel free to keep going on your end and I'll check back in if I spot anything else worth flagging.",
    requirementSnippet: "updated",
    talentsSnippet: true,
    userOptions: ["Thanks, Steven!", "Looks good"],
  },
];
