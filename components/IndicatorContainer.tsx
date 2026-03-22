"use client";

import { usePhase } from "@/context/PhaseContext";

type DotState = "done" | "active" | "pending";

const phases = [
  "Intro",
  "Draft Requirements",
  "Validate Requirements",
  "Matching Candidates",
  "Interviewing",
  "Hire",
];

export default function IndicatorContainer() {
  const { activePhase, phaseLabel } = usePhase();
  return (
    <div className="flex items-center gap-0">
      <div className="flex items-center gap-2">
        {phases.map((_, i) => {
          const state: DotState = i < activePhase ? "done" : i === activePhase ? "active" : "pending";
          return (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  state === "done"
                    ? "#03B080"
                    : state === "active"
                    ? "#204ECF"
                    : "transparent",
                border:
                  state === "pending" ? "1.5px solid #BBBFC6" : "none",
              }}
            />
          );
        })}
        <span
          className="ml-1 text-[12px] font-semibold"
          style={{ color: "#455065", fontFamily: "inherit" }}
        >
          {phaseLabel}
        </span>
      </div>
    </div>
  );
}
