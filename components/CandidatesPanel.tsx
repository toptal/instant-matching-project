"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePhase } from "@/context/PhaseContext";
import type { Decision } from "@/data/candidates";
import CandidateModal from "./CandidateModal";
import CandidateCompareModal from "./CandidateCompareModal";

type FilterOption = "all" | "interested-not-reviewed" | "not-a-fit";

const FILTER_LABELS: Record<FilterOption, string> = {
  "all": "All candidates",
  "interested-not-reviewed": "Interested or Not Reviewed",
  "not-a-fit": "Not a fit",
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
                borderBottom: opt !== "not-a-fit" ? "1px solid #F3F4F6" : undefined,
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

function SelectionCheckbox({ selected }: { selected: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: selected ? "#204ECF" : "white",
        border: selected ? "none" : "1.5px solid #C4C6CA",
        boxShadow: selected ? "0 1px 4px rgba(32,78,207,0.25)" : "none",
      }}
    >
      {selected && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5l2.5 2.5 3.5-4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="8" r="6.5" stroke="#84888e" strokeWidth="1.2" />
      <rect x="7.3" y="7" width="1.4" height="4.5" rx="0.7" fill="#84888e" />
      <circle cx="8" cy="4.75" r="0.85" fill="#84888e" />
    </svg>
  );
}

function AvailabilityRow() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[12px] leading-[18px]"
        style={{ color: "#84888e" }}
      >
        Confirming Availability...
      </span>
      <div
        className="relative flex items-center cursor-default"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <InfoIcon />
        {tooltipVisible && (
          <div
            className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1.5 rounded text-[11px] leading-[16px] text-white whitespace-nowrap z-50"
            style={{
              background: "#1a1a2e",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              transform: "translateX(-50%)",
            }}
          >
            We&apos;re confirming this talent&apos;s availability
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
    </div>
  );
}

interface CandidateCardProps {
  candidate: { id: string; name: string; photo?: string; role: string };
  decision: Decision;
  isSelected: boolean;
  isMatcher: boolean;
  onOpenModal: () => void;
  onToggleSelect: (e: React.MouseEvent) => void;
}

function CandidateCard({
  candidate,
  decision,
  isSelected,
  isMatcher,
  onOpenModal,
  onToggleSelect,
}: CandidateCardProps) {
  return (
    <div
      className="relative flex flex-col gap-3 p-4 rounded-lg cursor-pointer"
      style={{
        background: isSelected ? "#EEF2FC" : "#F3F4F6",
        outline: isSelected ? "2px solid #204ECF" : "none",
        outlineOffset: -2,
      }}
      onClick={onOpenModal}
    >
      <DecisionBadge decision={decision} />

      {/* Selection checkbox */}
      <div
        className="absolute top-2 right-2 z-10"
        onClick={onToggleSelect}
      >
        <SelectionCheckbox selected={isSelected} />
      </div>

      {/* Top row: photo + info */}
      <div className="flex gap-3 items-start">
        {/* Photo */}
        <div
          className="shrink-0 rounded overflow-hidden"
          style={{ width: 120, height: 120 }}
        >
          {candidate.photo ? (
            <img
              src={candidate.photo}
              alt={candidate.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
              }}
            />
          )}
        </div>

        {/* Name / role / badge / availability */}
        <div className="flex flex-col gap-1 pt-0.5 min-w-0 min-h-[120px]">
          <p className="text-[14px] font-semibold leading-[22px] text-black truncate pr-6">
            {candidate.name}
          </p>
          <p
            className="text-[13px] leading-[20px] truncate"
            style={{ color: "#455065" }}
          >
            {candidate.role}
          </p>
          <span
            className="self-start px-2 py-0.5 rounded text-[12px] font-semibold leading-[18px] whitespace-nowrap"
            style={
              isMatcher
                ? { border: "1px solid #03B080", color: "#03B080" }
                : { border: "1px solid #6727CF", color: "#6727CF" }
            }
          >
            {isMatcher ? "Matcher pick" : "Auto-matched"}
          </span>
          {decision === "interested" && (
            <div className="mt-auto">
              <AvailabilityRow />
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex gap-3 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {decision === "not-a-fit" ? (
          <button
            className="flex-1 flex items-center justify-center px-2 py-2 rounded text-[13px] font-semibold leading-[16px] text-black cursor-pointer whitespace-nowrap"
            style={{
              background: "white",
              border: "1px solid #D8D9DC",
            }}
            onClick={onOpenModal}
          >
            More Details
          </button>
        ) : decision === "interested" ? (
          <>
            <button
              className="flex-1 flex items-center justify-center px-2 py-2 rounded text-[13px] font-semibold leading-[16px] text-black cursor-pointer whitespace-nowrap"
              style={{
                background: "white",
                border: "1px solid #D8D9DC",
              }}
              onClick={onOpenModal}
            >
              More Details
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center px-2 py-2 rounded text-[13px] font-semibold leading-[16px] whitespace-nowrap"
              style={{
                background: "#F3F4F6",
                border: "1px solid #D8D9DC",
                color: "#9EA8B3",
                cursor: "default",
              }}
            >
              Schedule Interview
            </button>
          </>
        ) : (
          <button
            className="flex-1 flex items-center justify-center px-2 py-2 rounded text-[13px] font-semibold leading-[16px] text-white cursor-pointer whitespace-nowrap"
            style={{ background: "#204ECF" }}
            onClick={onOpenModal}
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
}

export default function CandidatesPanel({ onBack }: Props) {
  const { candidateDecisions, setCandidateDecision, candidatesRevealed, revealedCandidates, matcherRevealedIds } = usePhase();
  const [filter, setFilter] = useState<FilterOption>("interested-not-reviewed");
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const filtered = revealedCandidates.filter((c) => {
    if (filter === "all") return true;
    const d = candidateDecisions[c.id] ?? null;
    if (filter === "interested-not-reviewed") return d === "interested" || d === null;
    return d === "not-a-fit";
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center cursor-pointer">
            <BackIcon />
          </button>
          <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
            Candidates
          </span>
        </div>
        <button
          onClick={() => selectedIds.length >= 2 && setCompareOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-semibold transition-colors"
          style={{
            background: selectedIds.length >= 2 ? "#204ECF" : "#F3F4F6",
            color: selectedIds.length >= 2 ? "white" : "#9EA8B3",
            cursor: selectedIds.length >= 2 ? "pointer" : "default",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Compare{selectedIds.length >= 2 ? ` (${selectedIds.length})` : ""}
        </button>
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

          {/* Card list */}
          <div className="mt-4 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p
                className="text-center text-[13px] leading-[20px] py-6"
                style={{ color: "#8A94A6" }}
              >
                No candidates match this filter.
              </p>
            ) : (
              filtered.map((c, i) => {
                const decision = candidateDecisions[c.id] ?? null;
                const isSelected = selectedIds.includes(c.id);
                return (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    decision={decision}
                    isSelected={isSelected}
                    isMatcher={matcherRevealedIds.includes(c.id)}
                    onOpenModal={() => setModalIndex(i)}
                    onToggleSelect={(e) => toggleSelect(c.id, e)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Individual candidate modal */}
      {modalIndex !== null && filtered.length > 0 && createPortal(
        <CandidateModal
          candidates={filtered.map(c => ({
            ...c,
            badge: matcherRevealedIds.includes(c.id) ? "Matcher pick" : "Auto-matched",
          }))}
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

      {/* Compare modal */}
      {compareOpen && (() => {
        const compareCandidates = revealedCandidates.filter((c) => selectedIds.includes(c.id));
        if (compareCandidates.length < 2) return null;
        return createPortal(
          <CandidateCompareModal
            candidates={compareCandidates}
            decisions={compareCandidates.map((c) => candidateDecisions[c.id] ?? null)}
            matcherRevealedIds={matcherRevealedIds}
            onClose={() => setCompareOpen(false)}
            onDecide={(id, decision) => setCandidateDecision(id, decision)}
            onRemove={(id) => {
              setSelectedIds((prev) => {
                const next = prev.filter((sid) => sid !== id);
                if (next.length < 2) setCompareOpen(false);
                return next;
              });
            }}
          />,
          document.body
        );
      })()}
    </div>
  );
}
