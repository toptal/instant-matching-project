"use client";

import { useState, useRef, useEffect } from "react";
import ToptalLogo from "./ToptalLogo";
import IndicatorContainer from "./IndicatorContainer";
import ChatInput from "./ChatInput";
import SidePanel from "./SidePanel";
import AISnippetSteps from "./AISnippetSteps";
import AISnippetRequirements from "./AISnippetRequirements";
import AISnippetTalents from "./AISnippetTalents";
import { PhaseProvider, usePhase } from "@/context/PhaseContext";
import { SCENARIO } from "@/data/scenario";
import type { SnippetItem } from "@/data/scenario";

const TOOLTIP_KEYWORDS = [
  "requirements",
  "matcher",
  "help",
  "adjust",
  "refine",
  "struggling",
  "not sure",
  "unsure",
  "change",
];

type Message =
  | { id: string; type: "ai-heading"; content: string }
  | { id: string; type: "ai-text"; content: React.ReactNode }
  | { id: string; type: "user-text"; content: string }
  | { id: string; type: "snippet-steps" }
  | { id: string; type: "snippet-requirements"; variant?: "initial" | "refined"; versionLabel?: string }
  | { id: string; type: "snippet-talents" }
  | { id: string; type: "interaction-options"; options: string[]; action: string };

// Character-by-character typewriter for dynamically-appended AI messages
function TypewriterText({
  text,
  threadRef,
  className = "text-[14px] leading-[22px]",
  style = { color: "#455065" },
}: {
  text: string;
  threadRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= text.length) return;
    const t = setTimeout(() => {
      setCount((c) => c + 1);
      if (threadRef.current) {
        threadRef.current.scrollTop = threadRef.current.scrollHeight;
      }
    }, 15);
    return () => clearTimeout(t);
  }, [count, text, threadRef]);

  const visible = text.slice(0, count);
  const paras = visible.split("\n\n");
  const cursor = count < text.length ? (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "0.85em",
        background: "#9EA8B3",
        marginLeft: 1,
        verticalAlign: "text-bottom",
        animation: "cursor-blink 0.6s steps(1) infinite",
      }}
    />
  ) : null;

  if (paras.length === 1) {
    return (
      <p className={className} style={style}>
        {visible}{cursor}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {paras.map((para, i) => (
        <p key={i} className={className} style={style}>
          {para}{i === paras.length - 1 ? cursor : null}
        </p>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center" style={{ padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#9EA8B3",
            animation: "typing-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

let _uidCounter = 0;
function uid() {
  return `msg-${Date.now()}-${++_uidCounter}`;
}

// Must match the setTimeout delay inside TypewriterText
const TYPEWRITER_CHAR_MS = 15;

// How long the thinking dots show before a snippet card appears
const SNIPPET_THINK_MS = 1400;

// Inner component so it can access PhaseContext
function WorkspaceInner({ initialMessage }: { initialMessage?: string }) {
  const { setActivePhase, triggerMatcherTooltip, updateJobDetails, revealCandidates } = usePhase();

  // When arriving from the welcome screen, pre-populate step 0 messages as static
  // (non-animated) so the thread shows the welcome content without re-typing it.
  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessage) return [];
    return SCENARIO[0].items
      .filter((item): item is Extract<typeof item, { kind: "message" }> => item.kind === "message")
      .map((item) => ({
        id: uid(),
        type: item.style === "heading" ? ("ai-heading" as const) : ("ai-text" as const),
        content: item.text,
      }));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeOptions, setActiveOptions] = useState<string[] | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const pendingTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const passCountRef = useRef(0);
  // IDs of AI messages that should animate (dynamically appended)
  const animatedIds = useRef(new Set<string>());
  // Current position in the scenario script
  const currentStepRef = useRef(-1);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  function schedule(fn: () => void, delay: number) {
    const t = setTimeout(fn, delay);
    pendingTimeouts.current.push(t);
  }

  function cancelAll() {
    pendingTimeouts.current.forEach((t) => clearTimeout(t));
    pendingTimeouts.current = [];
    setIsLoading(false);
  }

  // Append an animated AI text string (typewriter effect)
  function appendAIText(text: string) {
    const id = uid();
    animatedIds.current.add(id);
    setMessages((prev) => [...prev, { id, type: "ai-text", content: text }]);
  }

  // Append a bold heading
  function appendAIHeading(text: string) {
    const id = uid();
    animatedIds.current.add(id);
    setMessages((prev) => [...prev, { id, type: "ai-heading", content: text }]);
  }

  // Map RequirementSnippet state → variant + version label
  function requirementVariant(state: string): { variant: "initial" | "refined"; versionLabel: string } {
    switch (state) {
      case "draft":         return { variant: "initial",  versionLabel: "v1.0" };
      case "draft-updated": return { variant: "refined",  versionLabel: "v1.1" };
      case "validation":    return { variant: "initial",  versionLabel: "v1.1" };
      case "validated":     return { variant: "refined",  versionLabel: "v1.2" };
      case "updated":       return { variant: "refined",  versionLabel: "v1.3" };
      default:              return { variant: "initial",  versionLabel: "v1.0" };
    }
  }

  // Inject a snippet into the thread + drive side-effects (phase, job details, candidates)
  function addSnippetToThread(snippet: SnippetItem) {
    switch (snippet.type) {
      case "StepsSnippet":
        setMessages((prev) => [...prev, { id: uid(), type: "snippet-steps" }]);
        setActivePhase(snippet.activeStage - 1);
        break;

      case "RequirementSnippet": {
        const { variant, versionLabel } = requirementVariant(snippet.state);
        setMessages((prev) => [
          ...prev,
          { id: uid(), type: "snippet-requirements", variant, versionLabel },
        ]);
        updateJobDetails(variant, versionLabel);
        break;
      }

      case "TalentsSnippet":
        setMessages((prev) => [...prev, { id: uid(), type: "snippet-talents" }]);
        if (snippet.source === "auto-matched") revealCandidates();
        break;
    }
  }

  // Play a scenario step: schedule all messages, snippets, and response chips
  function playScenarioStep(stepIndex: number) {
    if (stepIndex >= SCENARIO.length) return;
    const step = SCENARIO[stepIndex];
    currentStepRef.current = stepIndex;

    setActiveOptions(null);

    // Keep loading on while the step plays out; it turns off only after the last item
    let delay = 0;
    let lastResponseOptions: string[] | null = null;
    let hasContent = false;

    for (const item of step.items) {
      if (item.kind === "message") {
        hasContent = true;
        delay += 900;
        const d = delay;
        const isHeading = item.style === "heading";
        schedule(() => (isHeading ? appendAIHeading(item.text) : appendAIText(item.text)), d);
        // Hold subsequent items until this message's typewriter finishes
        delay += item.text.length * TYPEWRITER_CHAR_MS;
      } else if (item.kind === "snippet") {
        hasContent = true;
        delay += SNIPPET_THINK_MS;
        const d = delay;
        const s = item.snippet;
        schedule(() => addSnippetToThread(s), d);
      } else if (item.kind === "responses") {
        lastResponseOptions = item.options;
      }
    }

    if (hasContent) setIsLoading(true);

    // After all items: stop loading and reveal response chips
    const opts = lastResponseOptions;
    schedule(() => {
      setIsLoading(false);
      if (opts) setActiveOptions(opts);
    }, delay + 400);
  }

  // Advance to the next scenario step, optionally posting a user message first
  function advanceScenario(userText?: string) {
    cancelAll();

    if (userText) {
      setMessages((prev) => [...prev, { id: uid(), type: "user-text", content: userText }]);
      const lower = userText.toLowerCase();
      if (TOOLTIP_KEYWORDS.some((kw) => lower.includes(kw))) triggerMatcherTooltip();
    }

    playScenarioStep(currentStepRef.current + 1);
  }

  // Start the scenario on mount.
  // If an initialMessage was provided from the welcome screen, the step 0 messages
  // have already been pre-populated as static text above. Skip replaying them and
  // instead post the user's message then advance directly to step 1.
  useEffect(() => {
    if (initialMessage) {
      currentStepRef.current = 0; // skip step 0 (welcome)
      advanceScenario(initialMessage);
    } else {
      playScenarioStep(0);
    }
    // Cancel any pending timeouts on unmount (also prevents StrictMode
    // double-invocation from firing two sets of scheduled messages).
    return cancelAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Callback from AISnippetTalents when user passes on a candidate
  function handlePass(candidateName: string) {
    passCountRef.current += 1;
    setIsLoading(true);
    schedule(() => {
      if (passCountRef.current >= 2) {
        appendAIText(
          `Thanks for the feedback on ${candidateName}. I can see a pattern — let me factor that into the next set of results.`
        );
      } else {
        appendAIText(
          `Thanks for the feedback on ${candidateName}. I'll factor this into future recommendations.`
        );
      }
      setIsLoading(false);
    }, 700);
  }

  // User sends a free-form message → advance scenario
  function handleSend(text: string) {
    advanceScenario(text);
  }

  // User clicks a quick-reply chip → post it as user message and advance scenario
  function handleOptionSelect(option: string) {
    advanceScenario(option);
  }

  function renderMessage(msg: Message) {
    switch (msg.type) {
      case "ai-heading": {
        const animate = animatedIds.current.has(msg.id);
        if (animate) {
          return (
            <TypewriterText
              text={msg.content}
              threadRef={threadRef}
              className="font-semibold text-[20px] leading-[30px]"
              style={{ color: "#455065" }}
            />
          );
        }
        return (
          <p className="font-semibold text-[20px] leading-[30px]" style={{ color: "#455065" }}>
            {msg.content}
          </p>
        );
      }
      case "ai-text": {
        const animate = animatedIds.current.has(msg.id) && typeof msg.content === "string";
        if (animate) {
          return <TypewriterText text={msg.content as string} threadRef={threadRef} />;
        }
        if (typeof msg.content === "string") {
          const paras = msg.content.split("\n\n");
          return (
            <div className="flex flex-col gap-3">
              {paras.map((para, i) => (
                <p key={i} className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  {para}
                </p>
              ))}
            </div>
          );
        }
        return <>{msg.content}</>;
      }
      case "user-text":
        return (
          <div className="flex justify-end">
            <div
              className="text-[14px] leading-[22px] px-4 py-2 rounded-2xl max-w-[80%]"
              style={{ background: "#F3F4F6", color: "#1a1a2e" }}
            >
              {msg.content}
            </div>
          </div>
        );
      case "interaction-options":
        return (
          <div className="flex gap-2 flex-wrap">
            {msg.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case "snippet-steps":
        return <AISnippetSteps />;
      case "snippet-requirements":
        return <AISnippetRequirements variant={msg.variant} versionLabel={msg.versionLabel} />;
      case "snippet-talents":
        return <AISnippetTalents onPass={handlePass} />;
    }
  }

  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F0F2F5" }}>

      {/* Logo — top-left of page */}
      <div className="absolute top-6 left-6 z-10">
        <ToptalLogo />
      </div>

      <div className="flex justify-center items-start" style={{ minHeight: "100vh", padding: "16px 0" }}>
        <div
          className="bg-white rounded-2xl"
          style={{
            width: 1024,
            height: "calc(100vh - 32px)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
            display: "flex",
            flexDirection: "row",
            padding: 24,
            gap: 16,
          }}
        >
          {/* Left — 600px */}
          <div
            style={{
              flex: "0 0 600px",
              width: 600,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Heading */}
            <div className="shrink-0 pb-4" style={{ position: "sticky", top: 0, background: "white", zIndex: 10 }}>
              <h1
                className="font-bold leading-tight mb-2"
                style={{ fontSize: 26, color: "#1a1a2e", letterSpacing: "-0.3px" }}
              >
                Java Script Back-end Developer
              </h1>
              <IndicatorContainer />
            </div>

            {/* Scrollable thread */}
            <div ref={threadRef} className="flex-1 overflow-y-auto overflow-x-hidden pr-4">
              <div className="flex flex-col gap-4 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id}>{renderMessage(msg)}</div>
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            </div>

            {/* Pinned bottom area: quick-reply chips + input */}
            <div
              className="shrink-0 pt-3 flex flex-col gap-2"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 24%)",
              }}
            >
              {activeOptions && (
                <div className="flex gap-2 flex-wrap">
                  {activeOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                      style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <ChatInput onSend={handleSend} isLoading={isLoading} onStop={cancelAll} />
            </div>
          </div>

          {/* Right — 360px */}
          <div style={{ flex: "0 0 360px", width: 360 }}>
            <SidePanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchingWorkspace({ initialMessage }: { initialMessage?: string }) {
  return (
    <PhaseProvider>
      <WorkspaceInner initialMessage={initialMessage} />
    </PhaseProvider>
  );
}
