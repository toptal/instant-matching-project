"use client";

import { useState, useRef, useEffect } from "react";
import ToptalLogo from "./ToptalLogo";
import IndicatorContainer from "./IndicatorContainer";
import VideoSnippet from "./VideoSnippet";
import ChatInput from "./ChatInput";
import SidePanel from "./SidePanel";
import AISnippetSteps from "./AISnippetSteps";
import AISnippetRequirements from "./AISnippetRequirements";
import AISnippetTalents from "./AISnippetTalents";
import { PhaseProvider, usePhase } from "@/context/PhaseContext";

const TOOLTIP_KEYWORDS = ["requirements", "matcher", "help", "adjust", "refine", "struggling", "not sure", "unsure", "change"];

type ConversationStage = "intro" | "await-jd" | "await-q1" | "await-q2" | "candidates" | "open";

type Message =
  | { id: string; type: "ai-heading"; content: string }
  | { id: string; type: "ai-text"; content: React.ReactNode }
  | { id: string; type: "user-text"; content: string }
  | { id: string; type: "snippet-video" }
  | { id: string; type: "snippet-steps" }
  | { id: string; type: "snippet-requirements"; variant?: "initial" | "refined"; versionLabel?: string }
  | { id: string; type: "snippet-talents" }
  | { id: string; type: "interaction-options"; options: string[]; action: string };

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    type: "ai-heading",
    content: "Welcome to your Matching Workspace.",
  },
  {
    id: "2",
    type: "ai-text",
    content:
      "In this short video we are explaining your next steps and the purpose of this workspace. Please watch the video to continue.",
  },
  { id: "3", type: "snippet-video" },
  {
    id: "5",
    type: "ai-text",
    content: (
      <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
        <p>Thank you for watching the video.</p>
        <p>Here&apos;s what&apos;s coming next.</p>
      </div>
    ),
  },
  { id: "6", type: "snippet-steps" },
  {
    id: "7",
    type: "ai-text",
    content: "Can we jump to your requirements?",
  },
];

// Character-by-character typewriter for dynamically-appended AI messages
function TypewriterText({
  text,
  threadRef,
}: {
  text: string;
  threadRef: React.RefObject<HTMLDivElement | null>;
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

  return (
    <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
      {text.slice(0, count)}
      {count < text.length && (
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
      )}
    </p>
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

// Inner component so it can access PhaseContext
function WorkspaceInner() {
  const { setActivePhase, triggerMatcherTooltip, updateJobDetails, revealCandidates } = usePhase();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOptions, setActiveOptions] = useState<string[] | null>([
    "Yes, let's use the voice mode",
    "Yes, let's chat",
  ]);
  const [pinnedInteraction, setPinnedInteraction] = useState<{ options: string[]; action: string } | null>(null);
  const [conversationStage, setConversationStage] = useState<ConversationStage>("intro");
  const threadRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const pendingTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const passCountRef = useRef(0);
  const jdVersion = useRef(0);
  // IDs of AI messages that should animate (dynamically appended, not initial)
  const animatedIds = useRef(new Set<string>());

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  function schedule(fn: () => void, delay: number) {
    const t = setTimeout(() => {
      fn();
    }, delay);
    pendingTimeouts.current.push(t);
  }

  function cancelAll() {
    pendingTimeouts.current.forEach((t) => clearTimeout(t));
    pendingTimeouts.current = [];
    setIsLoading(false);
  }

  function scheduleSequence(steps: Array<{ delay: number; fn: () => void }>) {
    let accumulated = 0;
    steps.forEach(({ delay, fn }) => {
      accumulated += delay;
      schedule(fn, accumulated);
    });
  }

  // Append an animated AI text string (typewriter effect)
  function appendAIText(text: string) {
    const id = uid();
    animatedIds.current.add(id);
    setMessages((prev) => [...prev, { id, type: "ai-text", content: text }]);
  }

  function appendAI(content: React.ReactNode, delay = 700) {
    schedule(() => {
      if (typeof content === "string") {
        appendAIText(content);
      } else {
        setMessages((prev) => [...prev, { id: uid(), type: "ai-text", content }]);
      }
      setIsLoading(false);
    }, delay);
  }

  // Pinned bottom pills (mode selection)
  function handleOptionSelect(option: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), type: "user-text", content: option },
    ]);
    setActiveOptions(null);
    setActivePhase(2); // advance: Intro → Validate Requirements
    setIsLoading(true);
    setConversationStage("await-jd");
    schedule(() => {
      appendAIText("Great! Describe the role you're looking to fill, or paste a job description. I'll structure it for you.");
      setIsLoading(false);
    }, 700);
  }

  // Handle a pinned (above-input) interaction option
  function handlePinnedInteraction(option: string, action: string) {
    setPinnedInteraction(null);
    setMessages((prev) => [...prev, { id: uid(), type: "user-text", content: option }]);
    setIsLoading(true);
    runInteractionAction(option, action);
  }

  // Shared action logic (used by both pinned and legacy thread options)
  function runInteractionAction(option: string, action: string) {
    if (action === "jd-confirm") {
      if (option === "Yes, looks good") {
        setActivePhase(3); // advance to Matching Candidates

        const bulletsContent = (
          <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
            <p className="mb-1">Please review the three automatically matched candidates:</p>
            <ul className="list-disc pl-5 flex flex-col gap-0.5">
              <li>Mark each profile as Interested or Not a fit</li>
              <li>You may already find the right match here</li>
              <li>If not, your feedback helps us improve future recommendations or involve a matcher for a more curated selection</li>
            </ul>
          </div>
        );

        scheduleSequence([
          {
            delay: 800,
            fn: () => {
              appendAIText("Requirements locked in. Let me pull up your matched candidates.");
            },
          },
          {
            delay: 400,
            fn: () => {
              setMessages((prev) => [
                ...prev,
                { id: uid(), type: "ai-text", content: bulletsContent },
              ]);
            },
          },
          {
            delay: 300,
            fn: () => {
              setMessages((prev) => [...prev, { id: uid(), type: "snippet-talents" }]);
              revealCandidates();
              setIsLoading(false);
              setConversationStage("candidates");
            },
          },
        ]);
      } else {
        // "I'd like to adjust this"
        setConversationStage("await-jd");
        schedule(() => {
          appendAIText("Of course! What would you like to change about the job description?");
          setIsLoading(false);
        }, 700);
      }
    } else if (action === "refine-confirm") {
      if (option === "Yes, let's refine") {
        setConversationStage("await-jd");
        schedule(() => {
          appendAIText("What would you like to change? Describe the adjustment and I'll update the requirements.");
          setIsLoading(false);
        }, 700);
      } else {
        // "No, these are fine"
        schedule(() => {
          appendAIText("No problem. You can continue reviewing the current candidates or reach out if you need adjustments later.");
          setIsLoading(false);
        }, 700);
      }
    }
  }

  function handlePass(candidateName: string) {
    passCountRef.current += 1;
    setIsLoading(true);

    if (passCountRef.current >= 2) {
      scheduleSequence([
        {
          delay: 700,
          fn: () => {
            appendAIText(`Thanks for the feedback on ${candidateName}. Based on your responses, it looks like we may need to refine the requirements for better matches.`);
          },
        },
        {
          delay: 600,
          fn: () => {
            setPinnedInteraction({ options: ["Yes, let's refine", "No, these are fine"], action: "refine-confirm" });
            setIsLoading(false);
          },
        },
      ]);
    } else {
      schedule(() => {
        appendAIText(`Thanks for the feedback on ${candidateName}. I'll factor this into future recommendations.`);
        setIsLoading(false);
      }, 700);
    }
  }

  function handleJDInput(text: string) {
    if (jdVersion.current === 0) {
      const label = "v1.0";
      // Full Q&A flow
      scheduleSequence([
        {
          delay: 1400,
          fn: () => {
            appendAIText("Got it. Here's an initial draft based on what you've shared:");
          },
        },
        {
          delay: 100,
          fn: () => {
            setMessages((prev) => [
              ...prev,
              { id: uid(), type: "snippet-requirements", variant: "initial", versionLabel: label },
            ]);
            updateJobDetails("initial", label);
          },
        },
        {
          delay: 900,
          fn: () => {
            appendAIText("A couple of quick questions to sharpen this. First — will this person be working closely with a team or more independently?");
            setIsLoading(false);
            setConversationStage("await-q1");
          },
        },
      ]);
    } else {
      const nextVersion = jdVersion.current + 1;
      const label = `v1.${nextVersion}`;
      jdVersion.current = nextVersion;
      // Skip Q&A — show updated JD + confirmation
      scheduleSequence([
        {
          delay: 1000,
          fn: () => {
            appendAIText("Got it. Here's the updated job description:");
          },
        },
        {
          delay: 100,
          fn: () => {
            setMessages((prev) => [
              ...prev,
              { id: uid(), type: "snippet-requirements", variant: "refined", versionLabel: label },
            ]);
            updateJobDetails("refined", label);
          },
        },
        {
          delay: 700,
          fn: () => {
            appendAIText("Does this look right? Let me know if you'd like to adjust anything.");
          },
        },
        {
          delay: 300,
          fn: () => {
            setPinnedInteraction({ options: ["Yes, looks good", "I'd like to adjust this"], action: "jd-confirm" });
            setIsLoading(false);
            setConversationStage("open");
          },
        },
      ]);
    }
  }

  function handleQ1Answer(_text: string) {
    scheduleSequence([
      {
        delay: 900,
        fn: () => {
          appendAIText("Good to know. One more — do you have any timezone preferences for collaboration?");
          setIsLoading(false);
          setConversationStage("await-q2");
        },
      },
    ]);
  }

  function handleQ2Answer(_text: string) {
    jdVersion.current = 1;
    const label = "v1.1";
    scheduleSequence([
      {
        delay: 1000,
        fn: () => {
          appendAIText("Perfect. I've refined the job description with your answers:");
        },
      },
      {
        delay: 100,
        fn: () => {
          setMessages((prev) => [
            ...prev,
            { id: uid(), type: "snippet-requirements", variant: "refined", versionLabel: label },
          ]);
          updateJobDetails("refined", label);
        },
      },
      {
        delay: 700,
        fn: () => {
          appendAIText("Does this look right? Let me know if you'd like to adjust anything.");
        },
      },
      {
        delay: 300,
        fn: () => {
          setPinnedInteraction({ options: ["Yes, looks good", "I'd like to adjust this"], action: "jd-confirm" });
          setIsLoading(false);
          setConversationStage("open");
        },
      },
    ]);
  }

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), type: "user-text", content: text },
    ]);
    setIsLoading(true);

    // Keyword detection for matcher tooltip (US-029)
    const lower = text.toLowerCase();
    if (TOOLTIP_KEYWORDS.some((kw) => lower.includes(kw))) {
      triggerMatcherTooltip();
    }

    switch (conversationStage) {
      case "await-jd":
        handleJDInput(text);
        break;
      case "await-q1":
        handleQ1Answer(text);
        break;
      case "await-q2":
        handleQ2Answer(text);
        break;
      default:
        appendAI("Got it — I'll take note of that.");
        break;
    }
  }

  function renderMessage(msg: Message) {
    switch (msg.type) {
      case "ai-heading":
        return (
          <p className="font-semibold text-[20px] leading-[30px]" style={{ color: "#455065" }}>
            {msg.content}
          </p>
        );
      case "ai-text": {
        const animate = animatedIds.current.has(msg.id) && typeof msg.content === "string";
        if (animate) {
          return <TypewriterText text={msg.content as string} threadRef={threadRef} />;
        }
        return typeof msg.content === "string" ? (
          <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
            {msg.content}
          </p>
        ) : (
          <>{msg.content}</>
        );
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
                onClick={() => handlePinnedInteraction(opt, msg.action)}
                className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case "snippet-video":
        return <VideoSnippet />;
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

            {/* Pinned bottom area: action buttons + input */}
            <div
              className="shrink-0 pt-3 flex flex-col gap-2"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 24%)",
              }}
            >
              {(activeOptions || pinnedInteraction) && (
                <div className="flex gap-2 flex-wrap">
                  {activeOptions
                    ? activeOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(opt)}
                          className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                          style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
                        >
                          {opt}
                        </button>
                      ))
                    : pinnedInteraction!.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handlePinnedInteraction(opt, pinnedInteraction!.action)}
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

export default function MatchingWorkspace() {
  return (
    <PhaseProvider>
      <WorkspaceInner />
    </PhaseProvider>
  );
}
