"use client";

import { useEffect, useRef, useState } from "react";

type Decision = "interested" | "not-a-fit" | null;

type Candidate = {
  name: string;
  photo?: string;
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
  scheduleEnabled?: boolean;
};

const NOT_A_FIT_REASONS = [
  "Not enough experience",
  "Wrong skill set",
  "Wrong domain",
  "Timezone mismatch",
  "Other",
];

export default function CandidateModal({ candidates, currentIndex, decisions, onClose, onDecide, onNavigate, scheduleEnabled }: Props) {
  const c = candidates[currentIndex];
  const decision = decisions[currentIndex];
  const [showReasons, setShowReasons] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [currentIndex]);

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

        {/* Scrollable zone — position:relative so the card can be absolute inside */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 relative">

          {/* Dark navy header — right padding reserves space for the floating card */}
          <div style={{ background: "#1B2D72", padding: "32px 330px 24px 32px" }}>
            <div className="flex flex-col gap-4" style={{ paddingTop: 8 }}>
              {/* Name + badge */}
              <div className="flex items-center gap-3">
                <h2 className="text-white font-bold text-[28px] leading-[42px]">{c.name}</h2>
                <div
                  className="px-2.5 py-0.5 rounded-lg text-[12px] font-semibold leading-[18px] text-white shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                >
                  {c.badge}
                </div>
              </div>

              {/* Separator */}
              <div style={{ width: 64, height: 1, background: "rgba(255,255,255,0.3)" }} />

              {/* Reasons */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] leading-[22px] text-white">
                  Why this might be a fit:
                </p>
                {c.reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="#03B080" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[16px] leading-[24px] text-white">
                      {r.full ? r.full : <>{r.pre}<span className="font-semibold">{r.bold}</span>{r.post}</>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div style={{ width: 64, height: 1, background: "rgba(255,255,255,0.3)" }} />

              {/* Skills */}
              <div className="flex gap-2 flex-wrap">
                {c.skills.map((s) => (
                  <div key={s} className="px-3 py-1.5 rounded-xl text-[12px] font-semibold leading-[12px]" style={{ border: "1px solid #03B080", color: "#03B080" }}>
                    {s}
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div style={{ width: 64, height: 1, background: "rgba(255,255,255,0.3)" }} />

              {/* Availability */}
              <div className="flex items-center gap-2 text-[13px] leading-[20px] text-white">
                <span>Can start: {c.canStart}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} />
                <span>Availability: {c.availability.replace(/\s*\(.*\)/, "")}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} />
                <span>{c.localTime}</span>
              </div>
            </div>
          </div>

          {/* Photo card — absolutely positioned, straddles the blue/white boundary */}
          <div
            className="absolute flex flex-col gap-3 p-4 bg-white"
            style={{ top: 44, right: 32, width: 282, boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.08)" }}
          >
            {/* Decision badge — bleeds past the left edge of the card */}
            {decision && (
              <div
                className="absolute flex items-center px-4 text-[12px] font-semibold leading-[18px] text-white z-10"
                style={{
                  top: 10,
                  left: -0.5,
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
            {/* Photo — 250×250, sits inside 16 px padding */}
            {c.photo ? (
              <img
                src={c.photo}
                alt={c.name}
                className="w-full shrink-0 object-cover object-top"
                style={{ height: 250 }}
              />
            ) : (
              <div
                className="w-full shrink-0"
                style={{
                  height: 250,
                  background: "radial-gradient(ellipse at 50% 25%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
                }}
              />
            )}
            {/* Info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="font-semibold text-[20px] leading-[30px] text-black">{c.name}</p>
                <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>{c.role}</p>
              </div>
              {c.experience[0] && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <p className="text-[12px] font-semibold leading-[12px]" style={{ color: "#84888E", letterSpacing: "0.06em" }}>PREVIOUSLY AT</p>
                  <p className="text-[14px] font-semibold leading-[22px]" style={{ color: "#455065" }}>{c.experience[0].company}</p>
                </div>
              )}
            </div>
          </div>

          {/* White body — paddingTop accounts for the photo card overlapping from above */}
          <div className="px-8 flex flex-col gap-6" style={{ paddingTop: 85, paddingBottom: 24 }}>
            <div>
              <h2 className="font-bold text-[28px] leading-[42px] text-black mb-3">About</h2>
              <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>{c.about}</p>
            </div>
            <div>
              <h2 className="font-bold text-[28px] leading-[42px] text-black mb-4">Experience</h2>
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
                  className="w-full text-left px-4 py-3 text-[14px] leading-[22px] hover:bg-gray-50 transition-colors cursor-pointer"
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
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
              style={{ border: "1px solid #EBECED", color: currentIndex === 0 ? "#C4C6CA" : "#455065" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {decision === "interested" ? (
              <>
                {/* Not a fit */}
                <button
                  className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer"
                  style={{ border: "1px solid #EBECED", color: "#455065", background: showReasons ? "#F3F4F6" : "white" }}
                  onClick={handleNotAFit}
                >
                  Not a Fit
                </button>

                {/* Schedule Interview */}
                <div className="relative flex-1 group">
                  <button
                    disabled={!scheduleEnabled}
                    className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white"
                    style={{ background: "#204ECF", opacity: scheduleEnabled ? 1 : 0.5, cursor: scheduleEnabled ? "pointer" : "default" }}
                  >
                    Schedule Interview
                  </button>
                  {!scheduleEnabled && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[160px] px-2.5 py-1.5 rounded text-[12px] leading-[18px] text-white text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      style={{ background: "#1a1a2e" }}
                    >
                      We are confirming talent availability
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1a1a2e" }}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Not a fit */}
                <button
                  className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer"
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
                  className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-colors cursor-pointer"
                  style={{ background: "#03B080" }}
                  onClick={() => { setShowReasons(false); onDecide(currentIndex, "interested"); }}
                >
                  Interested
                </button>
              </>
            )}

            {/* Next */}
            <button
              onClick={() => { currentIndex < candidates.length - 1 && onNavigate(currentIndex + 1); setShowReasons(false); }}
              disabled={currentIndex === candidates.length - 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
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
