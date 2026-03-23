"use client";

import { useState } from "react";
import CandidateModal from "./CandidateModal";
import { CANDIDATES } from "@/data/candidates";
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
  onPass?: (candidateName: string) => void;
}

export default function AISnippetTalents({ onPass }: Props) {
  const { candidateDecisions, setCandidateDecision } = usePhase();
  const decisions = candidateDecisions;
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [frontIndex, setFrontIndex] = useState(0);

  function handleDecide(index: number, decision: import("@/data/candidates").Decision) {
    const next = [...decisions];
    next[index] = decision;
    setCandidateDecision(index, decision);

    // Fire pass callback on first "not-a-fit" decision
    if (decision === "not-a-fit" && decisions[index] === null) {
      onPass?.(CANDIDATES[index].name);
    }

    // Advance front card if we just decided the current front
    if (index === frontIndex && frontIndex < CANDIDATES.length - 1) {
      setTimeout(() => setFrontIndex((f) => f + 1), 250);
    }

    // Auto-advance modal to next undecided candidate, or close on last
    const nextUndecided = CANDIDATES.findIndex((_, i) => i !== index && next[i] === null);
    if (nextUndecided !== -1) {
      setModalIndex(nextUndecided);
    } else {
      setModalIndex(null);
    }
  }

  const allDecided = decisions.every((d) => d !== null);

  // Keep an "Interested" candidate upfront if any; otherwise use frontIndex
  const interestedIndex = decisions.findIndex((d) => d === "interested");
  const displayIndex = interestedIndex !== -1 ? interestedIndex : frontIndex;

  const stackCards = [displayIndex + 2, displayIndex + 1, displayIndex].filter((i) => i < CANDIDATES.length);
  const c = CANDIDATES[displayIndex];
  const decision = decisions[displayIndex];

  return (
    <>
      <div className="relative w-full">
        {/* Ghost cards — absolutely positioned, extend 8px per step below the front card */}
        {stackCards.slice(0, -1).map((idx, pos) => {
          const ghostCards = stackCards.slice(0, -1);
          const step = 8;
          const stepsBack = ghostCards.length - pos;
          return (
            <div
              key={idx}
              className="absolute rounded-sm"
              style={{
                top: 0,
                left: stepsBack * 16,
                right: stepsBack * 16,
                bottom: -stepsBack * step,
                border: "1px solid #EBECED",
                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                background: "white url('/card-bg.png') center/cover no-repeat",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}

        {/* Front card */}
        {frontIndex < CANDIDATES.length && (
          <div
            className="relative flex gap-6 rounded-sm"
            style={{
              border: `1.5px solid ${decision === "interested" ? "#03B080" : "#EBECED"}`,
              boxShadow: "0 0 8px rgba(0,0,0,0.08)",
              background: "url('/card-bg.png') center/cover no-repeat",
              padding: 24,
              transition: "border-color 0.2s ease",
            }}
          >
            {/* Decision label — top-left of card */}
            {decision && (
              <div
                className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[12px] font-semibold text-white z-10"
                style={{ background: decision === "interested" ? "#03B080" : "#E53935" }}
              >
                {decision === "interested" ? "Interested" : "Not a fit"}
              </div>
            )}

            {/* Left */}
            <div className="flex flex-col gap-3 shrink-0" style={{ width: 150 }}>
              {/* Photo */}
              <div className="rounded-sm overflow-hidden" style={{ width: 150, height: 150, background: "radial-gradient(ellipse at 50% 30%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)" }} />
              <div>
                <p className="font-semibold text-[16px] leading-[24px] text-black">{c.name}</p>
                <p className="text-[14px] leading-[22px] text-black">{c.role}</p>
              </div>
              {decision ? (
                <button
                  className="w-full py-2 rounded text-[13px] font-semibold"
                  style={{ border: "1px solid #EBECED", color: "#455065", background: "white" }}
                  onClick={() => setModalIndex(displayIndex)}
                >
                  More Details
                </button>
              ) : (
                <button
                  className="w-full py-2 rounded text-[13px] font-semibold text-white"
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
                  className="px-2 py-0.5 rounded-lg text-[12px] font-semibold leading-[18px]"
                  style={
                    c.source === "matcher"
                      ? { border: "1px solid #03B080", color: "#03B080" }
                      : { border: "1px solid #6727CF", color: "#6727CF" }
                  }
                >
                  {c.source === "matcher" ? `Suggested by ${c.matcherName}` : c.badge}
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

        {allDecided && (
          <p className="text-[13px] text-center w-full mt-3" style={{ color: "#455065" }}>
            All candidates reviewed. Your feedback has been sent.
          </p>
        )}
      </div>

      {/* Modal */}
      {modalIndex !== null && (
        <CandidateModal
          candidates={CANDIDATES}
          currentIndex={modalIndex}
          decisions={decisions}
          onClose={() => setModalIndex(null)}
          onDecide={handleDecide}
          onNavigate={setModalIndex}
        />
      )}
    </>
  );
}
