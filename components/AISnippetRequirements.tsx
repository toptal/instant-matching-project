function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="9" rx="1" stroke="#84888e" strokeWidth="1.2" />
      <path d="M3 11V3a1 1 0 011-1h6" stroke="#84888e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface AISnippetRequirementsProps {
  variant?: "initial" | "refined";
  versionLabel?: string;
}

export default function AISnippetRequirements({ variant = "initial", versionLabel }: AISnippetRequirementsProps) {
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

  const aboutText =
    variant === "refined"
      ? "We are looking for a Senior Backend Engineer to help build and scale the infrastructure powering a fintech product. You'll work closely with a team of 3 engineers on high-throughput financial systems. AWS expertise and US timezone alignment are required for effective collaboration."
      : "We are looking for a Senior Backend Engineer to help build and scale the infrastructure powering a fintech product. The ideal candidate brings deep AWS expertise and a track record of delivering secure, high-performance backend systems in regulated industries.";

  const keyRequirements =
    variant === "refined" ? refinedKeyRequirements : initialKeyRequirements;

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden w-full"
      style={{
        background: "#F3F4F6",
        border: "1px solid #EBECED",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <span className="text-[13px] leading-[20px]" style={{ color: "#84888e" }}>
          {versionLabel ? `Job Details — ${versionLabel}` : "Job Details"}
        </span>
        <CopyIcon />
      </div>

      {/* Content — fixed height, scrollable */}
      <div
        className="overflow-y-auto text-[14px] leading-[22px] px-4 pb-4"
        style={{ height: 320, color: "#455065" }}
      >
        <p className="font-semibold mb-1">Senior Backend Engineer — Fintech</p>

        <p className="font-semibold mb-1 mt-3">About the job</p>
        <p className="mb-3">{aboutText}</p>

        <p className="font-semibold mb-1">Key Requirements:</p>
        <ul className="list-none flex flex-col gap-0.5 mb-3">
          {keyRequirements.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <p className="font-semibold mb-1">Nice to Have:</p>
        <ul className="list-none flex flex-col gap-0.5 mb-3">
          {niceToHave.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
