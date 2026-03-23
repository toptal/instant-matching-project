"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePhase } from "@/context/PhaseContext";
import type { Decision } from "@/data/candidates";
import CandidateModal from "./CandidateModal";

type FilterOption = "all" | "interested" | "not-a-fit" | "not-reviewed";

const FILTER_LABELS: Record<FilterOption, string> = {
  all: "All Candidates",
  interested: "Interested",
  "not-a-fit": "Not a Fit",
  "not-reviewed": "Not Reviewed",
};

interface Props {
  onBack: () => void;
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8l4 4" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M5 6.5L8 4l3 2.5M5 9.5L8 12l3-2.5" stroke="#455065" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2.5 7l3 3 6-6" stroke="#204ECF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterDropdown({ value, onChange }: { value: FilterOption; onChange: (v: FilterOption) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-1 rounded text-left"
        style={{
          background: "white",
          border: `1px solid ${open ? "#204ECF" : "#D8D9DC"}`,
          boxShadow: open ? "0 0 0 2px rgba(32,78,207,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          height: 32,
        }}
      >
        <span className="flex-1 text-[14px] leading-[22px] text-black truncate">
          {FILTER_LABELS[value]}
        </span>
        <ChevronsIcon />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg z-50 overflow-hidden"
          style={{
            border: "1px solid #EBECED",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          {(Object.keys(FILTER_LABELS) as FilterOption[]).map((opt) => (
            <button
              key={opt}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
              style={{
                borderBottom: opt !== "not-reviewed" ? "1px solid #F3F4F6" : "none",
              }}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span
                className="text-[14px] leading-[22px]"
                style={{ color: value === opt ? "#204ECF" : "#1a1a2e", fontWeight: value === opt ? 600 : 400 }}
              >
                {FILTER_LABELS[opt]}
              </span>
              {value === opt && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DecisionBadge({ decision }: { decision: Decision }) {
  if (!decision) return null;
  const interested = decision === "interested";
  return (
    <div
      className="absolute left-0 flex items-center px-3 py-0.5"
      style={{
        top: 10,
        background: interested ? "#03B080" : "#E53935",
        borderRadius: "0 20px 20px 0",
        boxShadow: "0 0 8px rgba(0,0,0,0.08)",
        zIndex: 1,
      }}
    >
      <span className="text-[12px] font-semibold leading-[18px] text-white whitespace-nowrap">
        {interested ? "Interested" : "Not a fit"}
      </span>
    </div>
  );
}

export default function CandidatesPanel({ onBack }: Props) {
  const { candidateDecisions, setCandidateDecision, interestedCount, candidatesRevealed, revealedCandidates } = usePhase();
  const [filter, setFilter] = useState<FilterOption>("interested");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filtered = revealedCandidates.filter((c) => {
    const d = candidateDecisions[c.id] ?? null;
    switch (filter) {
      case "all":          return true;
      case "interested":   return d === "interested";
      case "not-a-fit":    return d === "not-a-fit";
      case "not-reviewed": return d === null;
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center">
            <BackIcon />
          </button>
          <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
            Candidates
          </span>
        </div>
        {interestedCount > 0 && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ background: "#E6F9F2", color: "#03B080" }}
          >
            {interestedCount} shortlisted
          </span>
        )}
      </div>

      <div style={{ height: 1, background: "#EBECED" }} />

      {!candidatesRevealed ? (
        /* Empty state */
        <div className="flex flex-col items-center text-center gap-2 px-5 pt-8" style={{ color: "#6B7585" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="12" cy="10" r="4" stroke="#9EA8B3" strokeWidth="1.5" />
            <circle cx="22" cy="10" r="4" stroke="#9EA8B3" strokeWidth="1.5" />
            <path d="M4 26c0-4 3.6-7 8-7s8 3 8 7" stroke="#9EA8B3" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M22 19c2.8.5 5 2.8 5 7" stroke="#9EA8B3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[13px] leading-[20px]">No candidates yet.</p>
          <p className="text-[12px] leading-[18px]" style={{ color: "#8A94A6" }}>
            Complete the requirements step to see matched candidates.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
          {/* Filter dropdown */}
          <FilterDropdown value={filter} onChange={setFilter} />

          {/* 2-column card grid */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {filtered.length === 0 ? (
              <p
                className="col-span-2 text-center text-[13px] leading-[20px] py-6"
                style={{ color: "#8A94A6" }}
              >
                No candidates match this filter.
              </p>
            ) : (
              filtered.map((c, i) => {
                const decision = candidateDecisions[c.id] ?? null;
                return (
                  <button
                    key={c.id}
                    className="relative flex flex-col gap-3 p-3 rounded-lg text-left w-full"
                    style={{ background: "#F3F4F6", cursor: "pointer" }}
                    onClick={() => setModalIndex(i)}
                  >
                    {/* Decision badge — left-edge pill */}
                    <DecisionBadge decision={decision} />

                    {/* Photo */}
                    <div
                      className="w-full rounded"
                      style={{
                        aspectRatio: "1",
                        background:
                          "radial-gradient(ellipse at 50% 25%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
                      }}
                    />

                    {/* Name + role */}
                    <div>
                      <p className="text-[13px] font-semibold leading-[20px] text-black truncate">
                        {c.name}
                      </p>
                      <p className="text-[12px] leading-[18px] truncate" style={{ color: "#455065" }}>
                        {c.role}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal — portalled to document.body so it overlays the full viewport */}
      {modalIndex !== null && filtered.length > 0 && createPortal(
        <CandidateModal
          candidates={filtered}
          currentIndex={modalIndex}
          decisions={filtered.map((c) => candidateDecisions[c.id] ?? null)}
          onClose={() => setModalIndex(null)}
          onDecide={(localIndex, decision) => {
            setCandidateDecision(filtered[localIndex].id, decision);
          }}
          onNavigate={(i) => setModalIndex(i)}
        />,
        document.body
      )}
    </div>
  );
}
