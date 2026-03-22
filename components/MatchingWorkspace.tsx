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

type Message =
  | { id: string; type: "ai-heading"; content: string }
  | { id: string; type: "ai-text"; content: React.ReactNode }
  | { id: string; type: "user-text"; content: string }
  | { id: string; type: "snippet-video" }
  | { id: string; type: "snippet-steps" }
  | { id: string; type: "snippet-requirements" }
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
    id: "4",
    type: "ai-text",
    content: (
      <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
        <p className="mb-1">Here&apos;s what you&apos;ll learn from this video:</p>
        <ul className="list-disc pl-5 flex flex-col gap-0.5">
          <li>How to collaborate with us on defining your requirements</li>
          <li>How we suggest initial candidate matches based on your needs</li>
          <li>How your feedback improves future recommendations</li>
          <li>How to communicate via text or use voice mode to discuss the details more naturally</li>
          <li>How and when a matcher can step in for additional support</li>
        </ul>
      </div>
    ),
  },
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
  {
    id: "8",
    type: "user-text",
    content: "Yes, let's use the voice mode",
  },
  {
    id: "9",
    type: "ai-text",
    content: "Here's what we understand about your role so far.",
  },
  { id: "10", type: "snippet-requirements" },
  {
    id: "10a",
    type: "ai-text",
    content: "Does this look right? Let me know if you'd like to adjust anything.",
  },
  {
    id: "10b",
    type: "interaction-options",
    options: ["Yes, looks good", "I'd like to adjust this"],
    action: "jd-confirm",
  },
  {
    id: "11",
    type: "ai-text",
    content: (
      <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
        <p className="mb-1">Please review the three automatically matched candidates:</p>
        <ul className="list-disc pl-5 flex flex-col gap-0.5">
          <li>Mark each profile as Interested or Not a fit</li>
          <li>You may already find the right match here</li>
          <li>If not, your feedback helps us improve future recommendations or involve a matcher for a more curated selection</li>
        </ul>
      </div>
    ),
  },
  { id: "12", type: "snippet-talents" },
];

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

// Inner component so it can access PhaseContext
function WorkspaceInner() {
  const { setActivePhase, triggerMatcherTooltip } = usePhase();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOptions, setActiveOptions] = useState<string[] | null>([
    "Yes, let's use the voice mode",
    "Yes, let's chat",
  ]);
  const threadRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  function appendAI(content: string, delay = 700) {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "ai-text", content },
      ]);
      setIsLoading(false);
    }, delay);
  }

  // Pinned bottom pills (mode selection)
  function handleOptionSelect(option: string) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user-text", content: option },
    ]);
    setActiveOptions(null);
    setActivePhase(2); // advance: Intro → Validate Requirements
  }

  // Inline thread interaction-options
  function handleThreadOption(msgId: string, option: string, action: string) {
    // Remove the pills message, post user reply
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== msgId),
      { id: Date.now().toString(), type: "user-text", content: option },
    ]);
    setIsLoading(true);

    if (action === "jd-confirm") {
      if (option === "Yes, looks good") {
        setActivePhase(3); // advance to Matching Candidates
        appendAI("Requirements locked in. Your matched candidates are ready to review.");
      } else {
        appendAI("Of course! What would you like to change about the job description?");
      }
    }
  }

  function handlePass(candidateName: string) {
    setIsLoading(true);
    appendAI(`Thanks for the feedback on ${candidateName}. I'll factor this into future recommendations.`);
  }

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user-text", content: text },
    ]);
    setIsLoading(true);
    appendAI("Got it — I'll take note of that.");

    // Keyword detection for matcher tooltip (US-029)
    const lower = text.toLowerCase();
    if (TOOLTIP_KEYWORDS.some((kw) => lower.includes(kw))) {
      triggerMatcherTooltip();
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
      case "ai-text":
        return typeof msg.content === "string" ? (
          <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
            {msg.content}
          </p>
        ) : (
          <>{msg.content}</>
        );
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
                onClick={() => handleThreadOption(msg.id, opt, msg.action)}
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
        return <AISnippetRequirements />;
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
            <div className="shrink-0 pb-4">
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
              {activeOptions && (
                <div className="flex gap-2">
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
              <ChatInput onSend={handleSend} isLoading={isLoading} />
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
