"use client";

import { useState, useEffect, useRef } from "react";
import CandidateModal from "./CandidateModal";
import CandidateCompareModal from "./CandidateCompareModal";
import type { Candidate } from "@/data/candidates";
import { usePhase } from "@/context/PhaseContext";

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="#455065" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#EBECED", width: 64 }} />;
}

function SkillPill({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 rounded-xl text-[12px] font-semibold leading-[12px] bg-white" style={{ border: "1px solid #03B080", color: "#03B080" }}>
      {label}
    </div>
  );
}

function NavButton({ direction, label, disabled, onClick }: { direction: "prev" | "next"; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.25 : 1,
        transition: "opacity 0.15s",
        color: "#455065",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {direction === "prev" && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="#455065" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
      {direction === "next" && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="#455065" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

interface Props {
  /** The specific batch of candidates to display. Empty when viewMode is set. */
  candidates: Candidate[];
  /** When true, all candidates in this snippet were suggested by the matcher. */
  matcherPick?: boolean;
  /** When set, derives candidates from the revealed pool instead of the prop. */
  viewMode?: string;
  onPass?: (candidateName: string) => void;
  /** Called when the review modal is dismissed (closed by user or after all candidates decided). */
  onDismiss?: () => void;
}

export default function AISnippetTalents({ candidates: candidatesProp, viewMode, matcherPick, onPass, onDismiss }: Props) {
  const { candidateDecisions, setCandidateDecision, revealedCandidates, matcherRevealedIds, scheduleInterviewEnabled } = usePhase();
  const scheduleEnabled = scheduleInterviewEnabled;
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [navIndex, setNavIndex] = useState(0);
  const prevModalIndex = useRef<number | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareList, setCompareList] = useState<Candidate[]>([]);

  useEffect(() => {
    if (prevModalIndex.current !== null && modalIndex === null) {
      onDismiss?.();
    }
    prevModalIndex.current = modalIndex;
  }, [modalIndex, onDismiss]);

  // For view_mode snippets (shortlist / interviewed), show the revealed pool filtered
  // to interested candidates; fall back to the full revealed list if none decided yet.
  const candidates: Candidate[] = (() => {
    if (!viewMode) return candidatesProp;
    const interested = revealedCandidates.filter((c) => candidateDecisions[c.id] === "interested");
    return interested.length > 0 ? interested : revealedCandidates;
  })();

  // Derive a positional Decision[] for the current batch so CandidateModal's
  // simple index-based API keeps working unchanged.
  const batchDecisions = candidates.map((c) => candidateDecisions[c.id] ?? null);

  function handleDecide(localIndex: number, decision: import("@/data/candidates").Decision) {
    const c = candidates[localIndex];
    if (!c) return;
    const prevDecision = candidateDecisions[c.id] ?? null;
    setCandidateDecision(c.id, decision);

    // Fire pass callback on first "not-a-fit" decision
    if (decision === "not-a-fit" && prevDecision === null) {
      onPass?.(c.name);
    }

    // Auto-advance modal to next undecided candidate in this batch, or close
    const nextUndecided = candidates.findIndex(
      (_, i) => i !== localIndex && (candidateDecisions[candidates[i].id] ?? null) === null
    );
    if (nextUndecided !== -1) {
      setModalIndex(nextUndecided);
    } else {
      setModalIndex(null);
    }

    // Advance nav to next undecided card after a decision
    const nextNav = candidates.findIndex(
      (_, i) => i > localIndex && (candidateDecisions[candidates[i].id] ?? null) === null
    );
    if (nextNav !== -1) {
      setTimeout(() => setNavIndex(nextNav), 250);
    } else if (localIndex < candidates.length - 1) {
      setTimeout(() => setNavIndex(localIndex + 1), 250);
    }
  }

  const allDecided = candidates.length > 0 && candidates.every((c) => (candidateDecisions[c.id] ?? null) !== null);

  const displayIndex = Math.min(navIndex, candidates.length - 1);

  // Ghost card count is fixed to the batch size so the deck never shrinks as
  // candidates are reviewed. Max 2 ghost cards for visual purposes.
  const ghostCount = Math.min(candidates.length - 1, 2);
  const c = candidates[displayIndex];
  const decision = c ? (candidateDecisions[c.id] ?? null) : null;

  if (candidates.length === 0) {
    return (
      <p className="text-[13px] text-center w-full py-4" style={{ color: "#455065" }}>
        No candidates to show yet.
      </p>
    );
  }

  return (
    <>
      {/* Outer wrapper — card is full thread width; nav buttons overflow the deck into the thread margin */}
      <div className="relative w-full" style={{ marginBottom: 12 }}>

      {/* Nav bar — prev/next + dot indicators above the deck */}
      {candidates.length > 1 && (
        <div className="flex items-center justify-between mb-3">
          <NavButton direction="prev" label="Previous" disabled={displayIndex === 0} onClick={() => setNavIndex((i) => Math.max(0, i - 1))} />
          <div className="flex items-center gap-1.5">
            {candidates.map((_, i) => {
              const dec = candidateDecisions[candidates[i].id] ?? null;
              const isActive = i === displayIndex;
              return (
                <button
                  key={i}
                  onClick={() => setNavIndex(i)}
                  style={{
                    width: isActive ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: dec === "interested"
                      ? "#03B080"
                      : dec === "not-a-fit"
                      ? "#E53935"
                      : isActive
                      ? "#204ECF"
                      : "#EBECED",
                  }}
                />
              );
            })}
          </div>
          <NavButton direction="next" label="Next" disabled={displayIndex === candidates.length - 1} onClick={() => setNavIndex((i) => Math.min(candidates.length - 1, i + 1))} />
        </div>
      )}


      {/* Deck with ghost cards and front card */}
      <div className="relative w-full" style={{ paddingBottom: ghostCount * 8 }}>
        {/* Ghost cards — fixed count matches batch size so deck never shrinks */}
        {Array.from({ length: ghostCount }, (_, pos) => {
          const step = 8;
          const stepsBack = ghostCount - pos;
          return (
            <div
              key={pos}
              className="absolute rounded-sm"
              style={{
                top: 0,
                left: stepsBack * 16,
                right: stepsBack * 16,
                bottom: (ghostCount - stepsBack) * step,
                border: "1px solid #EBECED",
                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                background: "white url('/card-bg.png') center/cover no-repeat",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}

        {/* Front card */}
        {displayIndex < candidates.length && c && (
          <div
            className="relative flex items-start gap-6 rounded-sm"
            style={{
              border: "1.5px solid #EBECED",
              boxShadow: "0 0 8px rgba(0,0,0,0.08)",
              background: "url('/card-bg.png') center/cover no-repeat",
              padding: 24,
            }}
          >
            {/* Decision badge — left-edge pill */}
            {decision && (
              <div
                className="absolute flex items-center px-4 text-[12px] font-semibold leading-[18px] text-white z-10"
                style={{
                  top: 10,
                  left: 0,
                  paddingTop: 2,
                  paddingBottom: 2,
                  background: decision === "interested" ? "#03B080" : "#E53935",
                  borderRadius: "0 20px 20px 0",
                  boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                }}
              >
                {decision === "interested" ? "Interested" : "Not a fit"}
              </div>
            )}

            {/* Left — white box */}
            <div
              className="flex flex-col gap-3 shrink-0"
              style={{ background: "white", padding: 16, width: 182 }}
            >
              {/* Photo */}
              {c.photo ? (
                <img
                  src={c.photo}
                  alt={c.name}
                  className="rounded-sm object-cover object-top"
                  style={{ width: 150, height: 150 }}
                />
              ) : (
                <div className="rounded-sm overflow-hidden" style={{ width: 150, height: 150, background: "radial-gradient(ellipse at 50% 30%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)" }} />
              )}
              <div>
                <p className="font-semibold text-[16px] leading-[24px] text-black">{c.name}</p>
                <p className="text-[14px] leading-[22px] text-black">{c.role}</p>
              </div>
              {decision ? (
                <div className="flex flex-col gap-2">
                  {/* Disabled primary button with hover tooltip — only for interested */}
                  {decision === "interested" && (
                    <div className="relative group">
                      <button
                        disabled={!scheduleEnabled}
                        className="w-full py-2 rounded text-[13px] font-semibold text-white"
                        style={{ background: "#204ECF", opacity: scheduleEnabled ? 1 : 0.5, cursor: scheduleEnabled ? "pointer" : "default" }}
                      >
                        Schedule Interview
                      </button>
                      {!scheduleEnabled && (
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[160px] px-2.5 py-1.5 rounded text-[12px] leading-[18px] text-white text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          style={{ background: "#1a1a2e" }}
                        >
                          We are confirming talent availability
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2"
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderTop: "5px solid #1a1a2e",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {/* Secondary button */}
                  <button
                    className="w-full py-2 rounded text-[13px] font-semibold cursor-pointer"
                    style={{ border: "1px solid #EBECED", color: "#455065", background: "white" }}
                    onClick={() => {
                      if (viewMode) {
                        setCompareList(candidates);
                        setShowCompare(true);
                      } else {
                        setModalIndex(displayIndex);
                      }
                    }}
                  >
                    {viewMode ? "Compare Talents" : "More Details"}
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-2 rounded text-[13px] font-semibold text-white cursor-pointer"
                  style={{ background: "#204ECF" }}
                  onClick={() => setModalIndex(displayIndex)}
                >
                  Review Candidate
                </button>
              )}
            </div>

            {/* Right */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[13px] leading-[20px] text-black">Why this might be a fit:</span>
                <div
                  className="px-2 py-0.5 rounded text-[12px] font-semibold leading-[18px]"
                  style={
                    matcherPick
                      ? { border: "1px solid #03B080", color: "#03B080" }
                      : { border: "1px solid #6727CF", color: "#6727CF" }
                  }
                >
                  {matcherPick ? "Matcher pick" : "Auto-matched"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {c.reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ArrowRightIcon />
                    <span className="text-[14px] leading-[22px] text-black">
                      {r.pre}<span className="font-semibold">{r.bold}</span>{r.post}
                    </span>
                  </div>
                ))}
              </div>
              <Divider />
              <div className="flex flex-col gap-2 text-[13px] leading-[20px]" style={{ color: "#455065" }}>
                <span>Can start: {c.canStart}</span>
                <span>Availability: {c.availability}</span>
                <span>{c.localTime}</span>
              </div>
              <Divider />
              <div className="flex gap-2 flex-wrap">
                {c.skills.map((s) => <SkillPill key={s} label={s} />)}
              </div>
            </div>
          </div>
        )}

      </div>

      </div>

      {/* Detail modal */}
      {modalIndex !== null && (
        <CandidateModal
          candidates={candidates.map(c => ({
            ...c,
            badge: matcherRevealedIds.includes(c.id) ? "Matcher pick" : "Auto-matched",
          }))}
          currentIndex={modalIndex}
          decisions={batchDecisions}
          onClose={() => setModalIndex(null)}
          onDecide={handleDecide}
          onNavigate={setModalIndex}
          scheduleEnabled={scheduleEnabled}
        />
      )}

      {/* Compare modal — viewMode shortlist */}
      {showCompare && (
        <CandidateCompareModal
          candidates={compareList}
          decisions={compareList.map((c) => candidateDecisions[c.id] ?? null)}
          matcherRevealedIds={matcherRevealedIds}
          onClose={() => setShowCompare(false)}
          onDecide={(id, decision) => setCandidateDecision(id, decision)}
          onRemove={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))}
        />
      )}
    </>
  );
}
