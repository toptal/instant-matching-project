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
}

const PhaseContext = createContext<PhaseContextValue>({
  activePhase: 1,
  phaseLabel: "Draft Requirements",
  setActivePhase: () => {},
});

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhase] = useState(1);
  return (
    <PhaseContext.Provider
      value={{ activePhase, phaseLabel: PHASE_LABELS[activePhase], setActivePhase }}
    >
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  return useContext(PhaseContext);
}
