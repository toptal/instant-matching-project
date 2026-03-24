"use client";

import { useState } from "react";
import type { Candidate, Decision } from "@/data/candidates";

type Props = {
  candidates: Candidate[];
  decisions: Decision[];
  matcherRevealedIds: string[];
  onClose: () => void;
  onDecide: (id: string, decision: Decision) => void;
  onRemove: (id: string) => void;
};

const NOT_A_FIT_REASONS = [
  "Not enough experience",
  "Wrong skill set",
  "Wrong domain",
  "Timezone mismatch",
  "Other",
];

const COLUMN_WIDTH = 300;
const LABEL_WIDTH = 116;
const NAVY = "#1B2D72";

function CandidateActionBar({
  candidate,
  decision,
  isLast,
  onDecide,
}: {
  candidate: Candidate;
  decision: Decision;
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
      className="relative px-4 py-3 bg-white"
      style={{
        width: COLUMN_WIDTH,
        flexShrink: 0,
        borderRight: isLast ? "none" : "1px solid #EBECED",
      }}
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
  );
}

export default function CandidateCompareModal({
  candidates,
  decisions,
  matcherRevealedIds,
  onClose,
  onDecide,
  onRemove,
}: Props) {

  function LabelCell({
    label,
    background,
    paddingTop = 14,
  }: {
    label?: string;
    background: string;
    paddingTop?: number;
  }) {
    const isNavy = background === NAVY;
    return (
      <div
        style={{
          width: LABEL_WIDTH,
          minWidth: LABEL_WIDTH,
          position: "sticky",
          left: 0,
          zIndex: 10,
          background,
          borderRight: isNavy
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid #EBECED",
          padding: label ? `${paddingTop}px 12px 14px 16px` : 0,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {label && (
          <span
            style={{
              color: isNavy ? "rgba(255,255,255,0.45)" : "#8A9099",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              lineHeight: "16px",
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="relative bg-white flex flex-col rounded-xl overflow-hidden"
        style={{
          margin: "16px auto",
          width: LABEL_WIDTH + candidates.length * COLUMN_WIDTH + 17,
          maxWidth: "calc(100vw - 32px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.24)",
        }}
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

        {/* Single scroll container — overflow:auto handles both axes; sticky action bar stays visible */}
        <div className="flex-1 min-h-0 overflow-auto" style={{ scrollbarGutter: "stable" }}>
          <div style={{ minWidth: LABEL_WIDTH + candidates.length * COLUMN_WIDTH }}>

            {/* ── NAVY SECTION ── */}

            {/* Row: Photo + Name */}
            <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <LabelCell background={NAVY} />
              {candidates.map((c, i) => {
                const decision = decisions[i];
                const isLast = i === candidates.length - 1;
                const isMatcherPick = matcherRevealedIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      background: NAVY,
                      padding: "20px 20px 16px",
                      borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* Photo */}
                    <div className="relative mb-4">
                      {c.photo ? (
                        <img
                          src={c.photo}
                          alt={c.name}
                          className="w-full object-cover object-top rounded"
                          style={{ height: 160 }}
                        />
                      ) : (
                        <div
                          className="w-full rounded"
                          style={{
                            height: 160,
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
                      {candidates.length > 2 && <button
                        onClick={() => onRemove(c.id)}
                        className="absolute flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all"
                        style={{
                          top: 8,
                          right: 8,
                          color: "rgba(255,255,255,0.85)",
                          background: "rgba(0,0,0,0.32)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255,255,255,0.18)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.55)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.32)";
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Remove
                      </button>}
                    </div>
                    {/* Name + badge */}
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-white font-bold text-[17px] leading-[26px] flex-1">
                        {c.name}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-white shrink-0 mt-0.5"
                        style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                      >
                        {isMatcherPick ? "Matcher pick" : "Auto-matched"}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-[20px]"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {c.role}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Row: Why matched */}
            <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <LabelCell label="Why matched" background={NAVY} />
              {candidates.map((c, i) => {
                const isLast = i === candidates.length - 1;
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      background: NAVY,
                      padding: "14px 20px",
                      borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      {c.reasons.map((r, j) => (
                        <div key={j} className="flex items-start gap-2">
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
                  </div>
                );
              })}
            </div>

            {/* Row: Skills */}
            <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <LabelCell label="Skills" background={NAVY} />
              {candidates.map((c, i) => {
                const isLast = i === candidates.length - 1;
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      background: NAVY,
                      padding: "14px 20px",
                      borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1.5 rounded-xl text-[12px] font-semibold leading-[12px]"
                          style={{ border: "1px solid #03B080", color: "#03B080" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row: Availability */}
            <div className="flex">
              <LabelCell label="Availability" background={NAVY} />
              {candidates.map((c, i) => {
                const isLast = i === candidates.length - 1;
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      background: NAVY,
                      padding: "14px 20px 20px",
                      borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="flex flex-col gap-1 text-[12px] leading-[18px]"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <span>
                        Can start:{" "}
                        <span className="text-white font-medium">{c.canStart}</span>
                      </span>
                      <span>
                        Availability:{" "}
                        <span className="text-white font-medium">
                          {c.availability.replace(/\s*\(.*\)/, "")}
                        </span>
                      </span>
                      <span>{c.localTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── WHITE SECTION ── */}

            {/* Row: About */}
            <div className="flex" style={{ borderBottom: "1px solid #EBECED", borderTop: "1px solid #EBECED" }}>
              <LabelCell label="About" background="white" />
              {candidates.map((c, i) => {
                const isLast = i === candidates.length - 1;
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      padding: "14px 20px",
                      borderRight: isLast ? "none" : "1px solid #EBECED",
                    }}
                  >
                    <p className="text-[13px] leading-[20px]" style={{ color: "#455065" }}>
                      {c.about}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Row: Experience */}
            <div className="flex">
              <LabelCell label="Experience" background="white" />
              {candidates.map((c, i) => {
                const isLast = i === candidates.length - 1;
                return (
                  <div
                    key={c.id}
                    style={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      padding: "14px 20px 24px",
                      borderRight: isLast ? "none" : "1px solid #EBECED",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      {c.experience.map((exp, j) => (
                        <div key={j}>
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
                          <p
                            className="text-[13px] font-semibold mb-1.5"
                            style={{ color: "#204ECF" }}
                          >
                            {exp.company}
                          </p>
                          <ul className="flex flex-col gap-1">
                            {exp.bullets.map((b, k) => (
                              <li
                                key={k}
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
                          {j < c.experience.length - 1 && (
                            <div
                              className="mt-4"
                              style={{ height: 1, background: "#EBECED" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action bar — sticky to the bottom of the scroll viewport; scrollbar appears below it */}
            <div
              className="flex"
              style={{ position: "sticky", bottom: 0, zIndex: 20, borderTop: "1px solid #EBECED", background: "white" }}
            >
              <div style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH, background: "white", borderRight: "1px solid #EBECED" }} />
              {candidates.map((c, i) => (
                <CandidateActionBar
                  key={c.id}
                  candidate={c}
                  decision={decisions[i]}
                  isLast={i === candidates.length - 1}
                  onDecide={(decision) => onDecide(c.id, decision)}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
