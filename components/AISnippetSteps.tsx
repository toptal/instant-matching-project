"use client";

import { usePhase } from "@/context/PhaseContext";

type StepStatus = "done" | "current" | "pending";

const STEP_LABELS = [
  "Intro",
  "Draft Requirements",
  "Validate Requirements",
  "Matching candidates",
  "Interviewing",
  "Hire",
];

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#03B080" />
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "current") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#204ECF" />
        <circle cx="8" cy="8" r="3" fill="white" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#D8D9DC" strokeWidth="1.5" />
    </svg>
  );
}

export default function AISnippetSteps() {
  const { activePhase } = usePhase();
  return (
    <div
      className="flex flex-col gap-4 rounded-lg w-full"
      style={{
        background: "#F3F4F6",
        border: "1px solid #EBECED",
        padding: "16px 24px",
      }}
    >
      <p className="font-semibold text-[16px] leading-[24px] text-black">Where we are now?</p>
      <div className="flex flex-col gap-2">
        {STEP_LABELS.map((label, i) => {
          const status: StepStatus = i < activePhase ? "done" : i === activePhase ? "current" : "pending";
          return (
            <div key={label} className="flex items-center gap-2">
              <StepIcon status={status} />
              <span
                className="text-[14px] leading-[22px]"
                style={{
                  color: status === "current" ? "#000000" : "#455065",
                  fontWeight: status === "current" ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
