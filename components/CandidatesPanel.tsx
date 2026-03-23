import { CANDIDATES } from "@/data/candidates";
import { usePhase } from "@/context/PhaseContext";

interface Props {
  onBack: () => void;
}

const Separator = () => <div style={{ height: 1, background: "#EBECED" }} />;

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8l4 4" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CandidatesPanel({ onBack }: Props) {
  const { candidateDecisions, interestedCount, candidatesRevealed } = usePhase();

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
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: "#E6F9F2", color: "#03B080" }}>
            {interestedCount} shortlisted
          </span>
        )}
      </div>

      <Separator />

      {/* Candidate list — empty until revealed in thread */}
      <div className="flex-1 overflow-y-auto">
        {!candidatesRevealed ? (
          <div
            className="flex flex-col items-center justify-center h-full text-center gap-2 px-5"
            style={{ color: "#9EA8B3" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="12" cy="10" r="4" stroke="#D8D9DC" strokeWidth="1.5" />
              <circle cx="22" cy="10" r="4" stroke="#D8D9DC" strokeWidth="1.5" />
              <path d="M4 26c0-4 3.6-7 8-7s8 3 8 7" stroke="#D8D9DC" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M22 19c2.8.5 5 2.8 5 7" stroke="#D8D9DC" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[13px] leading-[20px]">No candidates yet.</p>
            <p className="text-[12px] leading-[18px]" style={{ color: "#C4C9D0" }}>
              Complete the requirements step to see matched candidates.
            </p>
          </div>
        ) : CANDIDATES.map((c, i) => {
          const decision = candidateDecisions[i];
          return (
            <div key={c.name}>
              <div className="flex items-center gap-3 px-5 py-4">
                {/* Photo placeholder */}
                <div
                  className="rounded-full shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: "radial-gradient(ellipse at 50% 30%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold leading-[20px]" style={{ color: "#1a1a2e" }}>
                    {c.name}
                  </p>
                  <p className="text-[12px] leading-[18px]" style={{ color: "#455065" }}>
                    {c.role}
                  </p>
                </div>
                {decision && (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: decision === "interested" ? "#E6F9F2" : "#FEE2E2",
                      color: decision === "interested" ? "#03B080" : "#E53935",
                    }}
                  >
                    {decision === "interested" ? "Interested" : "Not a fit"}
                  </span>
                )}
              </div>
              {i < CANDIDATES.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
