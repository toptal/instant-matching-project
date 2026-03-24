"use client";

import { useState } from "react";
import type { Candidate, Decision } from "@/data/candidates";

type Props = {
  candidates: Candidate[];
  decisions: Decision[];
  matcherRevealedIds: string[];
  onClose: () => void;
  onDecide: (id: string, decision: Decision) => void;
};

const NOT_A_FIT_REASONS = [
  "Not enough experience",
  "Wrong skill set",
  "Wrong domain",
  "Timezone mismatch",
  "Other",
];

function CandidateColumn({
  candidate,
  decision,
  isMatcherPick,
  isLast,
  onDecide,
}: {
  candidate: Candidate;
  decision: Decision;
  isMatcherPick: boolean;
  isLast: boolean;
  onDecide: (decision: Decision) => void;
}) {
  const [showReasons, setShowReasons] = useState(false);

  function handleNotAFit() {
    if (decision === "not-a-fit") return;
    setShowReasons((v) => !v);
  }

  function selectReason() {
    setShowReasons(false);
    onDecide("not-a-fit");
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: 320,
        flexShrink: 0,
        borderRight: isLast ? "none" : "1px solid #EBECED",
      }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Navy header */}
        <div style={{ background: "#1B2D72", padding: "24px 20px 20px" }}>
          {/* Photo */}
          <div className="relative mb-4">
            {candidate.photo ? (
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-full object-cover object-top rounded"
                style={{ height: 180 }}
              />
            ) : (
              <div
                className="w-full rounded"
                style={{
                  height: 180,
                  background:
                    "radial-gradient(ellipse at 50% 25%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
                }}
              />
            )}
            {decision && (
              <div
                className="absolute flex items-center px-3 text-[12px] font-semibold leading-[18px] text-white"
                style={{
                  top: 10,
                  left: 0,
                  paddingTop: 2,
                  paddingBottom: 2,
                  background: decision === "interested" ? "#03B080" : "#E53935",
                  borderRadius: "0 20px 20px 0",
                }}
              >
                {decision === "interested" ? "Interested" : "Not a fit"}
              </div>
            )}
          </div>

          {/* Name + badge */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-white font-bold text-[18px] leading-[28px] flex-1">
              {candidate.name}
            </h3>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold leading-[18px] text-white shrink-0 mt-1"
              style={{ border: "1px solid rgba(255,255,255,0.5)" }}
            >
              {isMatcherPick ? "Matcher pick" : "Auto-matched"}
            </span>
          </div>
          <p
            className="text-[13px] leading-[20px] mb-3"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {candidate.role}
          </p>

          <div style={{ height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 12 }} />

          {/* Reasons */}
          <div className="flex flex-col gap-2 mb-3">
            {candidate.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="#03B080"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] leading-[20px] text-white">
                  {r.full ? (
                    r.full
                  ) : (
                    <>
                      {r.pre}
                      <span className="font-semibold">{r.bold}</span>
                      {r.post}
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 12 }} />

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {candidate.skills.map((s) => (
              <span
                key={s}
                className="px-2 py-1 rounded text-[11px] font-semibold"
                style={{ border: "1px solid #03B080", color: "#03B080" }}
              >
                {s}
              </span>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 12 }} />

          {/* Availability */}
          <div
            className="flex flex-col gap-1 text-[12px] leading-[18px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <span>
              Can start:{" "}
              <span className="text-white font-medium">{candidate.canStart}</span>
            </span>
            <span>
              Availability:{" "}
              <span className="text-white font-medium">
                {candidate.availability.replace(/\s*\(.*\)/, "")}
              </span>
            </span>
            <span>{candidate.localTime}</span>
          </div>
        </div>

        {/* White body */}
        <div className="px-5 py-5 flex flex-col gap-5">
          <div>
            <h4 className="font-bold text-[15px] leading-[22px] text-black mb-2">About</h4>
            <p className="text-[13px] leading-[20px]" style={{ color: "#455065" }}>
              {candidate.about}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[15px] leading-[22px] text-black mb-3">Experience</h4>
            <div className="flex flex-col gap-4">
              {candidate.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between mb-0.5">
                    <p className="font-semibold text-[13px] leading-[20px] text-black">
                      {exp.title}
                    </p>
                    <p
                      className="text-[12px] leading-[18px] shrink-0 ml-2"
                      style={{ color: "#8A9099" }}
                    >
                      {exp.years}
                    </p>
                  </div>
                  <p className="text-[13px] font-semibold mb-1.5" style={{ color: "#204ECF" }}>
                    {exp.company}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {exp.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[13px] leading-[20px]"
                        style={{ color: "#455065" }}
                      >
                        <span
                          className="mt-[8px] w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "#8A9099" }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {i < candidate.experience.length - 1 && (
                    <div className="mt-4" style={{ height: 1, background: "#EBECED" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="shrink-0 relative px-4 py-3"
        style={{ borderTop: "1px solid #EBECED" }}
      >
        {showReasons && (
          <div
            className="absolute bottom-full left-4 mb-2 bg-white rounded-xl overflow-hidden"
            style={{
              width: 240,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              border: "1px solid #EBECED",
            }}
          >
            {NOT_A_FIT_REASONS.map((reason, i) => (
              <button
                key={reason}
                className="w-full text-left px-4 py-3 text-[13px] leading-[20px] hover:bg-gray-50 transition-colors"
                style={{
                  color: "#1a1a2e",
                  borderBottom:
                    i < NOT_A_FIT_REASONS.length - 1 ? "1px solid #F3F4F6" : "none",
                }}
                onClick={selectReason}
              >
                {reason}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={{
              border: "1px solid #EBECED",
              color: decision === "not-a-fit" ? "#8A9099" : "#455065",
              background:
                decision === "not-a-fit" ? "#F3F4F6" : showReasons ? "#F3F4F6" : "white",
            }}
            onClick={handleNotAFit}
          >
            {decision === "not-a-fit" ? "✗ Not a Fit" : "Not a Fit"}
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-[13px] font-semibold text-white transition-colors"
            style={{ background: decision === "interested" ? "#027a56" : "#03B080" }}
            onClick={() => {
              setShowReasons(false);
              onDecide("interested");
            }}
          >
            {decision === "interested" ? "✓ Interested" : "Interested"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CandidateCompareModal({
  candidates,
  decisions,
  matcherRevealedIds,
  onClose,
  onDecide,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="relative bg-white flex flex-col rounded-xl overflow-hidden"
        style={{ margin: 16, flex: 1, boxShadow: "0 24px 64px rgba(0,0,0,0.24)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #EBECED" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[20px] leading-[30px] text-black">
              Compare Candidates
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold leading-[18px]"
              style={{ background: "#F3F4F6", color: "#455065" }}
            >
              {candidates.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-50"
            style={{ border: "1px solid #EBECED" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="#455065"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Columns — horizontally scrollable */}
        <div className="flex-1 overflow-x-auto min-h-0">
          <div className="flex h-full" style={{ minWidth: "max-content" }}>
            {candidates.map((c, i) => (
              <CandidateColumn
                key={c.id}
                candidate={c}
                decision={decisions[i]}
                isMatcherPick={matcherRevealedIds.includes(c.id)}
                isLast={i === candidates.length - 1}
                onDecide={(decision) => onDecide(c.id, decision)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
