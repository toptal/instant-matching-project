"use client";

import { useState } from "react";

type Decision = "interested" | "not-a-fit" | null;

type Candidate = {
  name: string;
  role: string;
  badge: string;
  reasons: { bold?: string; pre?: string; post?: string; full?: string }[];
  skills: string[];
  canStart: string;
  availability: string;
  localTime: string;
  about: string;
  experience: {
    title: string;
    company: string;
    years: string;
    bullets: string[];
  }[];
};

type Props = {
  candidates: Candidate[];
  currentIndex: number;
  decisions: Decision[];
  onClose: () => void;
  onDecide: (index: number, decision: Decision) => void;
  onNavigate: (index: number) => void;
};

const NOT_A_FIT_REASONS = [
  "Not enough experience",
  "Wrong skill set",
  "Wrong domain",
  "Timezone mismatch",
  "Other",
];

export default function CandidateModal({ candidates, currentIndex, decisions, onClose, onDecide, onNavigate }: Props) {
  const c = candidates[currentIndex];
  const decision = decisions[currentIndex];
  const [showReasons, setShowReasons] = useState(false);

  function handleNotAFit() {
    if (decision === "not-a-fit") return;
    setShowReasons((v) => !v);
  }

  function selectReason(reason: string) {
    void reason;
    setShowReasons(false);
    onDecide(currentIndex, "not-a-fit");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) { onClose(); setShowReasons(false); }
      }}
    >
      {/* Modal shell — fixed height so it never jumps between candidates */}
      <div
        className="relative bg-white rounded-xl overflow-hidden flex flex-col"
        style={{ width: 860, height: "90vh", boxShadow: "0 24px 64px rgba(0,0,0,0.24)" }}
      >
        {/* Close — absolutely positioned so it stays visible while content scrolls */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#455065" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Scrollable zone — header + body scroll together as one unit */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Dark navy header */}
          <div className="relative flex gap-8" style={{ background: "#1B2D72", padding: "32px 32px 24px 32px" }}>
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-bold text-[22px] leading-[28px]">{c.name}</h2>
                <div
                  className="px-2.5 py-0.5 rounded-lg text-[12px] font-semibold leading-[18px] text-white shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                >
                  {c.badge}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[12px] leading-[18px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Why this might be a fit:
                </p>
                {c.reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="#03B080" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] leading-[22px] text-white">
                      {r.full ? r.full : <>{r.pre}<span className="font-semibold">{r.bold}</span>{r.post}</>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {c.skills.map((s) => (
                  <div key={s} className="px-3 py-1 rounded-xl text-[12px] font-semibold leading-[18px]" style={{ border: "1px solid #03B080", color: "#03B080" }}>
                    {s}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[13px] leading-[20px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span>Can start: {c.canStart}</span>
                <span>•</span>
                <span>Availability: {c.availability}</span>
                <span>•</span>
                <span>{c.localTime}</span>
              </div>
            </div>

            {/* Photo card */}
            <div className="relative shrink-0 bg-white rounded-xl overflow-hidden flex flex-col" style={{ width: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", alignSelf: "flex-start" }}>
              {/* Decision badge on photo card */}
              {decision && (
                <div
                  className="absolute flex items-center px-3 text-[12px] font-semibold leading-[18px] text-white z-10"
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
              <div className="w-full" style={{ height: 160, background: "radial-gradient(ellipse at 50% 25%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)" }} />
              <div className="p-3 flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-black">{c.name}</p>
                <p className="text-[12px] leading-[18px]" style={{ color: "#455065" }}>{c.role}</p>
                {c.experience[0] && (
                  <>
                    <p className="text-[10px] font-semibold tracking-widest mt-1" style={{ color: "#8A9099", textTransform: "uppercase" }}>Previously at</p>
                    <p className="text-[13px] font-semibold" style={{ color: "#455065" }}>{c.experience[0].company}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* White body — About + Experience */}
          <div className="px-8 py-6 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-[18px] leading-[26px] text-black mb-3">About</h3>
              <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>{c.about}</p>
            </div>
            <div>
              <h3 className="font-bold text-[18px] leading-[26px] text-black mb-4">Experience</h3>
              <div className="flex flex-col gap-6">
                {c.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-[15px] leading-[22px] text-black">{exp.title}</p>
                      <p className="text-[13px] leading-[20px] shrink-0 ml-4" style={{ color: "#8A9099" }}>{exp.years}</p>
                    </div>
                    <p className="text-[14px] font-semibold mb-2" style={{ color: "#204ECF" }}>{exp.company}</p>
                    <ul className="flex flex-col gap-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                          <span className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#8A9099" }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {i < c.experience.length - 1 && <div className="mt-6" style={{ height: 1, background: "#EBECED" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar — fixed at bottom, never scrolls */}
        <div className="shrink-0 relative px-6 py-4 bg-white" style={{ borderTop: "1px solid #EBECED" }}>
          {/* Not a fit reason popover */}
          {showReasons && (
            <div
              className="absolute bottom-full left-6 mb-2 bg-white rounded-xl overflow-hidden"
              style={{
                width: 280,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                border: "1px solid #EBECED",
              }}
            >
              {NOT_A_FIT_REASONS.map((reason, i) => (
                <button
                  key={reason}
                  className="w-full text-left px-4 py-3 text-[14px] leading-[22px] hover:bg-gray-50 transition-colors"
                  style={{
                    color: "#1a1a2e",
                    borderBottom: i < NOT_A_FIT_REASONS.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}
                  onClick={() => selectReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Prev */}
            <button
              onClick={() => { currentIndex > 0 && onNavigate(currentIndex - 1); setShowReasons(false); }}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ border: "1px solid #EBECED", color: currentIndex === 0 ? "#C4C6CA" : "#455065" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Not a fit */}
            <button
              className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold transition-colors"
              style={{
                border: "1px solid #EBECED",
                color: decision === "not-a-fit" ? "#8A9099" : "#455065",
                background: decision === "not-a-fit" ? "#F3F4F6" : showReasons ? "#F3F4F6" : "white",
              }}
              onClick={handleNotAFit}
            >
              {decision === "not-a-fit" ? "✗ Not a Fit" : "Not a Fit"}
            </button>

            {/* Interested */}
            <button
              className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-colors"
              style={{ background: decision === "interested" ? "#027a56" : "#03B080" }}
              onClick={() => { setShowReasons(false); onDecide(currentIndex, "interested"); }}
            >
              {decision === "interested" ? "✓ Interested" : "Interested"}
            </button>

            {/* Next */}
            <button
              onClick={() => { currentIndex < candidates.length - 1 && onNavigate(currentIndex + 1); setShowReasons(false); }}
              disabled={currentIndex === candidates.length - 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ border: "1px solid #EBECED", color: currentIndex === candidates.length - 1 ? "#C4C6CA" : "#455065" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
