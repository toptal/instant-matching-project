"use client";

interface Props {
  onDismiss: () => void;
  onAccept: () => void;
}

export default function MatcherTooltip({ onDismiss, onAccept }: Props) {
  return (
    <div className="flex items-start gap-0">
      {/* Tooltip card */}
      <div
        className="rounded-xl flex flex-col gap-3"
        style={{
          width: 301,
          background: "#fff",
          border: "1px solid #EBECED",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          padding: 16,
        }}
      >
        <p className="text-[13px] leading-[20px]" style={{ color: "#1a1a2e" }}>
          Are you ok with your requirements? If you need another pair of eyes
          and my expertise knowledge I can join and help you with requirements.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="flex-1 text-[13px] font-semibold py-1.5 rounded-lg"
            style={{ border: "1.5px solid #EBECED", color: "#455065", background: "#fff" }}
          >
            Not now
          </button>
          <button
            onClick={onAccept}
            className="flex-1 text-[13px] font-semibold py-1.5 rounded-lg text-white"
            style={{ background: "#204ECF" }}
          >
            Yes, join in
          </button>
        </div>
      </div>

      {/* Arrow pointing right toward sidebar */}
      <div className="flex flex-col items-center" style={{ marginTop: 12 }}>
        <svg width="8" height="48" viewBox="0 0 8 48" fill="none">
          <path d="M8 24 L0 16 L0 32 Z" fill="#EBECED" />
          <path d="M7 24 L1 17 L1 31 Z" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}
