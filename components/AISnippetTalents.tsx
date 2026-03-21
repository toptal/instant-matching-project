"use client";

import { useState } from "react";
import CandidateModal from "./CandidateModal";

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

type Decision = "interested" | "not-a-fit" | null;

const candidates = [
  {
    name: "Kimberly Saxton",
    role: "Frontend Developer",
    badge: "Auto-matched",
    reasons: [
      { bold: "8 years", post: " building financial platforms at scale" },
      { bold: "Led migration to microservices", post: " at previous role" },
      { pre: "Strong track record with ", bold: "real-time data systems" },
    ],
    skills: ["React | 4 years", "CSS | 4 years", "HTML | 4 years"],
    canStart: "Immediately",
    availability: "Part Time (20 hours/week)",
    localTime: "2:55 PM Local Time",
    about: "Kimberly is a deeply experienced strategy and operations executive. She is a consumer-first leader who crafts brand, marketing, and digital strategies to drive growth, launch products, and turnaround brands. Most recently, Kimberly shaped a DTC strategy that enabled a consumer goods company to create direct, rich relationships with consumers and crafted a hero product strategy to leverage marketing spend efficiently while driving trial and repeat.",
    experience: [
      {
        title: "Vice President | Brand Operations and Strategy",
        company: "CitiBank",
        years: "2018 - 2021",
        bullets: [
          "Defined the concept-to-market process, delineating interdependencies and the critical path between marketing, supply chain, and creative. Developed an integrated timeline to create milestone transparency. Reduced time to market by over 15%.",
          "Led cross-functional team of 12 to deliver $40M product launch on time and under budget.",
        ],
      },
      {
        title: "Senior Product Manager",
        company: "Estée Lauder",
        years: "2015 - 2018",
        bullets: [
          "Managed portfolio of 8 beauty product lines generating $200M+ in annual revenue.",
          "Drove 22% YoY growth through strategic repositioning and new channel development.",
        ],
      },
    ],
  },
  {
    name: "Marcus Chen",
    role: "Full-Stack Developer",
    badge: "Auto-matched",
    reasons: [
      { bold: "6 years", post: " in Node.js and React ecosystems" },
      { bold: "Built scalable APIs", post: " serving 1M+ users" },
      { pre: "Expert in ", bold: "TypeScript and GraphQL" },
    ],
    skills: ["Node.js | 6 years", "React | 5 years", "GraphQL | 3 years"],
    canStart: "In 2 weeks",
    availability: "Full Time",
    localTime: "10:30 AM Local Time",
    about: "Marcus is a full-stack engineer with deep expertise in building high-throughput distributed systems. He specialises in API architecture, real-time features, and cloud infrastructure. Known for clean code and strong technical mentorship.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Stripe",
        years: "2020 - 2024",
        bullets: [
          "Architected and maintained GraphQL gateway handling 50M+ daily requests.",
          "Led migration from monolith to microservices, reducing deployment time by 60%.",
        ],
      },
    ],
  },
  {
    name: "Priya Sharma",
    role: "Backend Developer",
    badge: "Auto-matched",
    reasons: [
      { bold: "5 years", post: " in cloud-native backend development" },
      { bold: "Microservices specialist", post: " with AWS expertise" },
      { pre: "Strong in ", bold: "system design and architecture" },
    ],
    skills: ["AWS | 5 years", "Python | 5 years", "Docker | 4 years"],
    canStart: "Immediately",
    availability: "Part Time (30 hours/week)",
    localTime: "3:15 PM Local Time",
    about: "Priya is a backend engineer with a strong foundation in cloud infrastructure and distributed systems. She has led architecture reviews, designed event-driven systems, and mentored junior engineers across multiple teams.",
    experience: [
      {
        title: "Backend Engineer",
        company: "Amazon",
        years: "2019 - 2024",
        bullets: [
          "Designed and deployed serverless data pipelines processing 10TB+ daily.",
          "Reduced infrastructure costs by 35% through architectural optimisations.",
        ],
      },
    ],
  },
];

export default function AISnippetTalents() {
  const [decisions, setDecisions] = useState<Decision[]>([null, null, null]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [frontIndex, setFrontIndex] = useState(0);

  function handleDecide(index: number, decision: Decision) {
    const next = [...decisions];
    next[index] = decision;
    setDecisions(next);

    // Advance front card if we just decided the current front
    if (index === frontIndex && frontIndex < candidates.length - 1) {
      setTimeout(() => setFrontIndex((f) => f + 1), 250);
    }

    // Auto-advance modal to next undecided candidate, or close on last
    const nextUndecided = candidates.findIndex((_, i) => i !== index && next[i] === null);
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

  const stackCards = [displayIndex + 2, displayIndex + 1, displayIndex].filter((i) => i < candidates.length);
  const c = candidates[displayIndex];
  const decision = decisions[displayIndex];

  return (
    <>
      <div className="relative w-full" style={{ height: 395 }}>
        {/* Ghost cards */}
        {stackCards.slice(0, -1).map((idx, pos) => {
          const isMiddle = pos === stackCards.length - 2;
          return (
            <div
              key={idx}
              className="absolute rounded-sm"
              style={{
                left: isMiddle ? 33 : 61,
                top: isMiddle ? 53 : 99,
                width: isMiddle ? "calc(100% - 66px)" : "calc(100% - 122px)",
                height: isMiddle ? 296 : 265,
                border: "1px solid #EBECED",
                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                background: "white",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}

        {/* Front card */}
        {frontIndex < candidates.length && (
          <div
            className="absolute flex gap-6 rounded-sm"
            style={{
              left: 0, top: 0, width: "100%",
              border: `1.5px solid ${decision === "interested" ? "#03B080" : "#EBECED"}`,
              boxShadow: "0 0 8px rgba(0,0,0,0.08)",
              background: "white",
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
                <div className="px-2 py-0.5 rounded-lg text-[12px] font-semibold leading-[18px]" style={{ border: "1px solid #6727CF", color: "#6727CF" }}>
                  {c.badge}
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
          <p className="absolute text-[13px] text-center w-full" style={{ top: 375, color: "#455065" }}>
            All candidates reviewed. Your feedback has been sent.
          </p>
        )}
      </div>

      {/* Modal */}
      {modalIndex !== null && (
        <CandidateModal
          candidates={candidates}
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
