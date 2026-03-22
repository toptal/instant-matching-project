import { CANDIDATES } from "@/data/candidates";

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
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button onClick={onBack} className="flex items-center justify-center">
          <BackIcon />
        </button>
        <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
          Candidates
        </span>
      </div>

      <Separator />

      {/* Candidate list */}
      <div className="flex-1 overflow-y-auto">
        {CANDIDATES.map((c, i) => (
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
            </div>
            {i < CANDIDATES.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
