"use client";

import { createContext, useContext, useState } from "react";
import type { Decision } from "@/data/candidates";
import { CANDIDATES } from "@/data/candidates";

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
  // Job Details — live state synced from thread snippets
  jdVariant: "initial" | "refined" | null;
  jdVersionLabel: string | null;
  jobDetailsUpdated: boolean;
  updateJobDetails: (variant: "initial" | "refined", versionLabel: string) => void;
  markJobDetailsViewed: () => void;
  // Candidates — hidden until revealed in thread
  candidatesRevealed: boolean;
  revealedCount: number;
  candidatesNew: boolean;
  revealCandidates: () => void;
  markCandidatesViewed: () => void;
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
  jdVariant: null,
  jdVersionLabel: null,
  jobDetailsUpdated: false,
  updateJobDetails: () => {},
  markJobDetailsViewed: () => {},
  candidatesRevealed: false,
  revealedCount: 0,
  candidatesNew: false,
  revealCandidates: () => {},
  markCandidatesViewed: () => {},
  candidateDecisions: [null, null, null],
  setCandidateDecision: () => {},
  interestedCount: 0,
  statusHistory: [[], [], []],
});

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhase] = useState(1);
  const [tooltipTriggerCount, setTooltipTriggerCount] = useState(0);
  const [jdVariant, setJdVariant] = useState<"initial" | "refined" | null>(null);
  const [jdVersionLabel, setJdVersionLabel] = useState<string | null>(null);
  const [jobDetailsUpdated, setJobDetailsUpdated] = useState(false);
  const [candidatesRevealed, setCandidatesRevealed] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [candidatesNew, setCandidatesNew] = useState(false);
  const [candidateDecisions, setCandidateDecisions] = useState<Decision[]>([null, null, null]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[][]>([[], [], []]);

  function triggerMatcherTooltip() {
    setTooltipTriggerCount((n) => n + 1);
  }

  function updateJobDetails(variant: "initial" | "refined", versionLabel: string) {
    setJdVariant(variant);
    setJdVersionLabel(versionLabel);
    setJobDetailsUpdated(true);
  }

  function markJobDetailsViewed() {
    setJobDetailsUpdated(false);
  }

  function revealCandidates() {
    setCandidatesRevealed(true);
    setRevealedCount(CANDIDATES.length);
    setCandidatesNew(true);
  }

  function markCandidatesViewed() {
    setCandidatesNew(false);
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
        jdVariant,
        jdVersionLabel,
        jobDetailsUpdated,
        updateJobDetails,
        markJobDetailsViewed,
        candidatesRevealed,
        revealedCount,
        candidatesNew,
        revealCandidates,
        markCandidatesViewed,
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
