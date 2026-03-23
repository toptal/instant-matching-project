"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { Candidate, Decision } from "@/data/candidates";
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

export type JdHistoryEntry = { variant: "initial" | "refined"; versionLabel: string };

interface PhaseContextValue {
  activePhase: number;
  phaseLabel: string;
  setActivePhase: (n: number) => void;
  tooltipTriggerCount: number;
  triggerMatcherTooltip: () => void;
  // Job Details — live state synced from thread snippets
  jdVariant: "initial" | "refined" | null;
  jdVersionLabel: string | null;
  jdHistory: JdHistoryEntry[];
  jobDetailsUpdated: boolean;
  updateJobDetails: (variant: "initial" | "refined", versionLabel: string) => void;
  markJobDetailsViewed: () => void;
  // Candidates — hidden until revealed in thread
  candidatesRevealed: boolean;
  candidatesNew: boolean;
  markCandidatesViewed: () => void;
  // Candidate pool — grows as batches are revealed in the thread
  revealedCandidates: Candidate[];
  revealNextBatch: (count: number) => Candidate[];
  // Decisions keyed by candidate id
  candidateDecisions: Record<string, Decision>;
  setCandidateDecision: (id: string, decision: Decision) => void;
  interestedCount: number;
  // Status history per candidate id
  statusHistory: Record<string, StatusHistoryEntry[]>;
}

const PhaseContext = createContext<PhaseContextValue>({
  activePhase: 1,
  phaseLabel: "Draft Requirements",
  setActivePhase: () => {},
  tooltipTriggerCount: 0,
  triggerMatcherTooltip: () => {},
  jdVariant: null,
  jdVersionLabel: null,
  jdHistory: [],
  jobDetailsUpdated: false,
  updateJobDetails: () => {},
  markJobDetailsViewed: () => {},
  candidatesRevealed: false,
  candidatesNew: false,
  markCandidatesViewed: () => {},
  revealedCandidates: [],
  revealNextBatch: () => [],
  candidateDecisions: {},
  setCandidateDecision: () => {},
  interestedCount: 0,
  statusHistory: {},
});

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhase] = useState(1);
  const [tooltipTriggerCount, setTooltipTriggerCount] = useState(0);
  const [jdVariant, setJdVariant] = useState<"initial" | "refined" | null>(null);
  const [jdVersionLabel, setJdVersionLabel] = useState<string | null>(null);
  const [jdHistory, setJdHistory] = useState<JdHistoryEntry[]>([]);
  const [jobDetailsUpdated, setJobDetailsUpdated] = useState(false);
  const [candidatesRevealed, setCandidatesRevealed] = useState(false);
  const [candidatesNew, setCandidatesNew] = useState(false);
  const [revealedCandidates, setRevealedCandidates] = useState<Candidate[]>([]);
  const [candidateDecisions, setCandidateDecisions] = useState<Record<string, Decision>>({});
  const [statusHistory, setStatusHistory] = useState<Record<string, StatusHistoryEntry[]>>({});

  // Mutable pointer — not state — so revealNextBatch reads current value synchronously.
  const nextCandidateIndex = useRef(0);

  function triggerMatcherTooltip() {
    setTooltipTriggerCount((n) => n + 1);
  }

  function updateJobDetails(variant: "initial" | "refined", versionLabel: string) {
    setJdVariant(variant);
    setJdVersionLabel(versionLabel);
    setJdHistory((prev) => [...prev, { variant, versionLabel }]);
    setJobDetailsUpdated(true);
  }

  function markJobDetailsViewed() {
    setJobDetailsUpdated(false);
  }

  /** Pull the next `count` candidates from the global pool, add them to the
   *  revealed list, and return them so the caller can embed them in a snippet. */
  function revealNextBatch(count: number): Candidate[] {
    const start = nextCandidateIndex.current;
    const batch = CANDIDATES.slice(start, start + count);
    nextCandidateIndex.current += count;
    if (batch.length > 0) {
      setRevealedCandidates((prev) => [...prev, ...batch]);
      setCandidatesRevealed(true);
      setCandidatesNew(true);
    }
    return batch;
  }

  function markCandidatesViewed() {
    setCandidatesNew(false);
  }

  function setCandidateDecision(id: string, decision: Decision) {
    setCandidateDecisions((prev) => ({ ...prev, [id]: decision }));
    setStatusHistory((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), { decision, timestamp: new Date() }],
    }));
  }

  const interestedCount = Object.values(candidateDecisions).filter((d) => d === "interested").length;

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
        jdHistory,
        jobDetailsUpdated,
        updateJobDetails,
        markJobDetailsViewed,
        candidatesRevealed,
        candidatesNew,
        markCandidatesViewed,
        revealedCandidates,
        revealNextBatch,
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
