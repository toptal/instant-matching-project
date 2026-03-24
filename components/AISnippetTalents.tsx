"use client";

import { useState } from "react";
import CandidateModal from "./CandidateModal";
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

interface Props {
  /** The specific batch of candidates to display. Empty when viewMode is set. */
  candidates: Candidate[];
  /** When true, all candidates in this snippet were suggested by the matcher. */
  matcherPick?: boolean;
  /** When set, derives candidates from the revealed pool instead of the prop. */
  viewMode?: string;
  onPass?: (candidateName: string) => void;
}

export default function AISnippetTalents({ candidates: candidatesProp, viewMode, matcherPick, onPass }: Props) {
  const { candidateDecisions, setCandidateDecision, revealedCandidates, matcherRevealedIds } = usePhase();
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [frontIndex, setFrontIndex] = useState(0);

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

    // Advance front card if we just decided the current front
    if (localIndex === frontIndex && frontIndex < candidates.length - 1) {
      setTimeout(() => setFrontIndex((f) => f + 1), 250);
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
  }

  const allDecided = candidates.length > 0 && candidates.every((c) => (candidateDecisions[c.id] ?? null) !== null);

  // Keep an "Interested" candidate upfront if any; otherwise use frontIndex
  const interestedIndex = candidates.findIndex((c) => (candidateDecisions[c.id] ?? null) === "interested");
  const displayIndex = interestedIndex !== -1 ? interestedIndex : frontIndex;

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
        {frontIndex < candidates.length && c && (
          <div
            className="relative flex items-center gap-6 rounded-sm"
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
                  {/* Disabled primary button with hover tooltip */}
                  <div className="relative group">
                    <button
                      disabled
                      className="w-full py-2 rounded text-[13px] font-semibold text-white"
                      style={{ background: "#204ECF", opacity: 0.5, cursor: "default" }}
                    >
                      Schedule Interview
                    </button>
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
                  </div>
                  {/* Secondary button */}
                  <button
                    className="w-full py-2 rounded text-[13px] font-semibold cursor-pointer"
                    style={{ border: "1px solid #EBECED", color: "#455065", background: "white" }}
                    onClick={() => setModalIndex(displayIndex)}
                  >
                    More Details
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

      {allDecided && (
        <p className="text-[13px] text-center w-full mt-3" style={{ color: "#455065" }}>
          All candidates reviewed. Your feedback has been sent.
        </p>
      )}

      {/* Modal */}
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
        />
      )}
    </>
  );
}
