"use client";

import { usePhase } from "@/context/PhaseContext";

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
