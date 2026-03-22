"use client";

import { createContext, useContext, useState } from "react";
import type { Decision } from "@/data/candidates";

const PHASE_LABELS = [
  "Intro",
  "Draft Requirements",
  "Validate Requirements",
  "Matching Candidates",
  "Interviewing",
  "Hire",
];

export type StatusHistoryEntry = { decision: Decision; timestamp: Date };

interface PhaseContextValue {
  activePhase: number;
  phaseLabel: string;
  setActivePhase: (n: number) => void;
  tooltipTriggerCount: number;
  triggerMatcherTooltip: () => void;
  // US-027: badge tracking
  jobDetailsUpdated: boolean;
  markJobDetailsUpdated: () => void;
  markJobDetailsViewed: () => void;
  // US-027 + US-039: shared candidate decisions
  candidateDecisions: Decision[];
  setCandidateDecision: (index: number, decision: Decision) => void;
  interestedCount: number;
  // US-039: status history per candidate
  statusHistory: StatusHistoryEntry[][];
}

const PhaseContext = createContext<PhaseContextValue>({
  activePhase: 1,
  phaseLabel: "Draft Requirements",
  setActivePhase: () => {},
  tooltipTriggerCount: 0,
  triggerMatcherTooltip: () => {},
  jobDetailsUpdated: false,
  markJobDetailsUpdated: () => {},
  markJobDetailsViewed: () => {},
  candidateDecisions: [null, null, null],
  setCandidateDecision: () => {},
  interestedCount: 0,
  statusHistory: [[], [], []],
});

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhase] = useState(1);
  const [tooltipTriggerCount, setTooltipTriggerCount] = useState(0);
  const [jobDetailsUpdated, setJobDetailsUpdated] = useState(false);
  const [candidateDecisions, setCandidateDecisions] = useState<Decision[]>([null, null, null]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[][]>([[], [], []]);

  function triggerMatcherTooltip() {
    setTooltipTriggerCount((n) => n + 1);
  }

  function markJobDetailsUpdated() {
    setJobDetailsUpdated(true);
  }

  function markJobDetailsViewed() {
    setJobDetailsUpdated(false);
  }

  function setCandidateDecision(index: number, decision: Decision) {
    setCandidateDecisions((prev) => {
      const next = [...prev];
      next[index] = decision;
      return next;
    });
    setStatusHistory((prev) => {
      const next = prev.map((h) => [...h]);
      next[index] = [...next[index], { decision, timestamp: new Date() }];
      return next;
    });
  }

  const interestedCount = candidateDecisions.filter((d) => d === "interested").length;

  return (
    <PhaseContext.Provider
      value={{
        activePhase,
        phaseLabel: PHASE_LABELS[activePhase],
        setActivePhase,
        tooltipTriggerCount,
        triggerMatcherTooltip,
        jobDetailsUpdated,
        markJobDetailsUpdated,
        markJobDetailsViewed,
        candidateDecisions,
        setCandidateDecision,
        interestedCount,
        statusHistory,
      }}
    >
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  return useContext(PhaseContext);
}
