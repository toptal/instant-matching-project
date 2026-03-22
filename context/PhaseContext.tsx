"use client";

import { createContext, useContext, useState } from "react";

const PHASE_LABELS = [
  "Intro",
  "Draft Requirements",
  "Validate Requirements",
  "Matching Candidates",
  "Interviewing",
  "Hire",
];

interface PhaseContextValue {
  activePhase: number;
  phaseLabel: string;
  setActivePhase: (n: number) => void;
  tooltipTriggerCount: number;
  triggerMatcherTooltip: () => void;
}

const PhaseContext = createContext<PhaseContextValue>({
  activePhase: 1,
  phaseLabel: "Draft Requirements",
  setActivePhase: () => {},
  tooltipTriggerCount: 0,
  triggerMatcherTooltip: () => {},
});

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhase] = useState(1);
  const [tooltipTriggerCount, setTooltipTriggerCount] = useState(0);

  function triggerMatcherTooltip() {
    setTooltipTriggerCount((n) => n + 1);
  }

  return (
    <PhaseContext.Provider
      value={{
        activePhase,
        phaseLabel: PHASE_LABELS[activePhase],
        setActivePhase,
        tooltipTriggerCount,
        triggerMatcherTooltip,
      }}
    >
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  return useContext(PhaseContext);
}
