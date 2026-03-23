"use client";

import { usePhase } from "@/context/PhaseContext";
import AISnippetRequirements from "./AISnippetRequirements";

interface Props {
  onBack: () => void;
}

const Separator = () => <div style={{ height: 1, background: "#EBECED" }} />;

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8l4 4" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function JobDetailsPanel({ onBack }: Props) {
  const { jdVariant, jdVersionLabel } = usePhase();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button onClick={onBack} className="flex items-center justify-center">
          <BackIcon />
        </button>
        <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
          {jdVersionLabel ? `Job Details — ${jdVersionLabel}` : "Job Details"}
        </span>
      </div>

      <Separator />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {jdVariant === null ? (
          <div
            className="flex flex-col items-center justify-center h-full text-center gap-2"
            style={{ color: "#9EA8B3" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="4" width="20" height="24" rx="2" stroke="#D8D9DC" strokeWidth="1.5" />
              <path d="M10 10h12M10 15h12M10 20h8" stroke="#D8D9DC" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[13px] leading-[20px]">
              No job details yet.
            </p>
            <p className="text-[12px] leading-[18px]" style={{ color: "#C4C9D0" }}>
              They&apos;ll appear here once you describe the role in the chat.
            </p>
          </div>
        ) : (
          <AISnippetRequirements variant={jdVariant} versionLabel={jdVersionLabel ?? undefined} />
        )}
      </div>
    </div>
  );
}
