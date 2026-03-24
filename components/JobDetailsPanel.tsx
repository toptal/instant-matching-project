"use client";

import { useRef, useState, useEffect } from "react";
import { usePhase } from "@/context/PhaseContext";
import type { JdHistoryEntry } from "@/context/PhaseContext";

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

function ChevronsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M5 6.5L8 4l3 2.5M5 9.5L8 12l3-2.5" stroke="#455065" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2.5 7l3 3 6-6" stroke="#204ECF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function versionLabel(entry: JdHistoryEntry, isLatest: boolean): string {
  return isLatest ? `Latest version (${entry.versionLabel})` : entry.versionLabel;
}

function VersionDropdown({
  history,
  selectedIndex,
  onChange,
}: {
  history: JdHistoryEntry[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const latestIndex = history.length - 1;
  const selectedEntry = history[selectedIndex];

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-1 rounded text-left"
        style={{
          background: "white",
          border: `1px solid ${open ? "#204ECF" : "#D8D9DC"}`,
          boxShadow: open ? "0 0 0 2px rgba(32,78,207,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          height: 32,
        }}
      >
        <span className="flex-1 text-[14px] leading-[22px] text-black truncate">
          {versionLabel(selectedEntry, selectedIndex === latestIndex)}
        </span>
        <ChevronsIcon />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg z-50 overflow-hidden"
          style={{
            border: "1px solid #EBECED",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          {/* Show latest first, then older versions */}
          {[...history].reverse().map((entry, reversedIdx) => {
            const originalIndex = history.length - 1 - reversedIdx;
            const isLatest = originalIndex === latestIndex;
            const isSelected = originalIndex === selectedIndex;
            const isLast = reversedIdx === history.length - 1;
            return (
              <button
                key={originalIndex}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                style={{
                  borderBottom: !isLast ? "1px solid #F3F4F6" : "none",
                }}
                onClick={() => { onChange(originalIndex); setOpen(false); }}
              >
                <span
                  className="text-[14px] leading-[22px]"
                  style={{ color: isSelected ? "#204ECF" : "#1a1a2e", fontWeight: isSelected ? 600 : 400 }}
                >
                  {versionLabel(entry, isLatest)}
                </span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const initialKeyRequirements = [
  "5+ years of backend development experience with strong proficiency in Node.js or Python.",
  "Hands-on AWS expertise (EC2, Lambda, RDS, S3, CloudWatch).",
  "Experience building secure, high-throughput APIs for financial or regulated industries.",
  "Familiarity with microservices architecture and event-driven systems.",
  "Track record of maintaining production systems with high availability requirements.",
];

const refinedKeyRequirements = [
  "5+ years of backend development experience with strong proficiency in Node.js or Python.",
  "Hands-on AWS expertise (EC2, Lambda, RDS, S3, CloudWatch).",
  "Experience building secure, high-throughput APIs for financial or regulated industries.",
  "Comfortable working closely within a cross-functional engineering team (team of 3).",
  "US timezone availability for real-time collaboration (EST–PST overlap).",
];

const niceToHave = [
  "Experience with fintech compliance standards (PCI-DSS, SOC 2).",
  "Familiarity with data pipeline tooling (Kafka, Kinesis, or similar).",
  "Background in TypeScript or Go as a secondary language.",
];

function JobDetailsContent({ variant }: { variant: "initial" | "refined" }) {
  const aboutText =
    variant === "refined"
      ? "We are looking for a Senior Backend Engineer to help build and scale the infrastructure powering a fintech product. You'll work closely with a team of 3 engineers on high-throughput financial systems. AWS expertise and US timezone alignment are required for effective collaboration."
      : "We are looking for a Senior Backend Engineer to help build and scale the infrastructure powering a fintech product. The ideal candidate brings deep AWS expertise and a track record of delivering secure, high-performance backend systems in regulated industries.";

  const keyRequirements = variant === "refined" ? refinedKeyRequirements : initialKeyRequirements;

  return (
    <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
      <p className="font-semibold mb-1">Senior Backend Engineer — Fintech</p>

      <p className="font-semibold mb-1 mt-4">About the job</p>
      <p className="mb-4">{aboutText}</p>

      <p className="font-semibold mb-1">Key Requirements</p>
      <ul className="flex flex-col gap-1 mb-4">
        {keyRequirements.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      <p className="font-semibold mb-1">Nice to Have</p>
      <ul className="flex flex-col gap-1">
        {niceToHave.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function JobDetailsPanel({ onBack }: Props) {
  const { jdVariant, jdHistory } = usePhase();
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);

  // Keep selectedVersionIndex pointing at the latest whenever a new version arrives
  useEffect(() => {
    if (jdHistory.length > 0) {
      setSelectedVersionIndex(jdHistory.length - 1);
    }
  }, [jdHistory.length]);

  const hasHistory = jdHistory.length > 0;
  const displayEntry =
    selectedVersionIndex !== null && hasHistory
      ? jdHistory[selectedVersionIndex]
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button onClick={onBack} className="flex items-center justify-center cursor-pointer">
          <BackIcon />
        </button>
        <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
          Job Details
        </span>
      </div>

      <Separator />

      {/* Version dropdown */}
      {hasHistory && selectedVersionIndex !== null && (
        <div className="px-5 pt-4 shrink-0">
          <VersionDropdown
            history={jdHistory}
            selectedIndex={selectedVersionIndex}
            onChange={setSelectedVersionIndex}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {displayEntry ? (
          <JobDetailsContent variant={displayEntry.variant} />
        ) : jdVariant === null ? (
          <div
            className="flex flex-col items-center text-center gap-2 pt-8"
            style={{ color: "#6B7585" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="4" width="20" height="24" rx="2" stroke="#9EA8B3" strokeWidth="1.5" />
              <path d="M10 10h12M10 15h12M10 20h8" stroke="#9EA8B3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[13px] leading-[20px]">
              No job details yet.
            </p>
            <p className="text-[12px] leading-[18px]" style={{ color: "#8A94A6" }}>
              They&apos;ll appear here once you describe the role in the chat.
            </p>
          </div>
        ) : (
          <JobDetailsContent variant={jdVariant} />
        )}
      </div>
    </div>
  );
}
