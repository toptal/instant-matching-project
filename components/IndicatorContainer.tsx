type DotState = "done" | "active" | "pending";

const phases = [
  "Intro",
  "Draft Requirements",
  "Validate Requirements",
  "Matching Candidates",
  "Interviewing",
  "Hire",
];

interface Props {
  activePhase?: number; // 0-indexed
  label?: string;
}

export default function IndicatorContainer({ activePhase = 1, label = "Draft Requirements" }: Props) {
  return (
    <div className="flex items-center gap-0">
      <div className="flex items-center gap-2">
        {phases.map((_, i) => {
          const state: DotState = i < activePhase ? "done" : i === activePhase ? "active" : "pending";
          return (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  state === "done"
                    ? "#03B080"
                    : state === "active"
                    ? "#204ECF"
                    : "transparent",
                border:
                  state === "pending" ? "1.5px solid #BBBFC6" : "none",
              }}
            />
          );
        })}
        <span
          className="ml-1 text-[12px] font-semibold"
          style={{ color: "#455065", fontFamily: "inherit" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
