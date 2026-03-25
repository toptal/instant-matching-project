"use client";

interface Props {
  content: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export default function MatcherTooltip({ content, primaryLabel, secondaryLabel, onPrimary, onSecondary }: Props) {
  return (
    // drop-shadow on the wrapper so the shadow follows the card + arrow as one shape.
    // transform-origin is set to the arrow tip (right edge + 9px, ~36px from top) so
    // the tooltip appears to pop out of the green dot on the matcher card.
    <div style={{
      position: "relative",
      width: 301,
      filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.12))",
      transformOrigin: "calc(100% + 9px) 36px",
      animation: "tooltip-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
    }}>
      {/* Card */}
      <div
        className="rounded-xl flex flex-col gap-3"
        style={{
          background: "#fff",
          border: "1px solid #EBECED",
          padding: 16,
        }}
      >
        <p className="text-[13px] leading-[20px]" style={{ color: "#1a1a2e" }}>
          {content}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onSecondary}
            className="flex-1 text-[13px] font-semibold py-1.5 rounded-lg"
            style={{ border: "1.5px solid #EBECED", color: "#455065", background: "#fff" }}
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary}
            className="flex-1 text-[13px] font-semibold py-1.5 rounded-lg text-white"
            style={{ background: "#204ECF" }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>

      {/* Arrow — border layer: base flush with card outer edge */}
      <div style={{
        position: "absolute",
        right: -9,
        top: 32,
        width: 0,
        height: 0,
        borderTop: "9px solid transparent",
        borderBottom: "9px solid transparent",
        borderLeft: "9px solid #EBECED",
      }} />
      {/* Arrow — fill layer: base 1px inside card, covers the border pixel */}
      <div style={{
        position: "absolute",
        right: -7,
        top: 33,
        width: 0,
        height: 0,
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
        borderLeft: "8px solid #fff",
      }} />
    </div>
  );
}
