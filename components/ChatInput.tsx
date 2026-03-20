export default function ChatInput() {
  return (
    <div
      className="rounded-2xl px-4 py-3 flex flex-col gap-3"
      style={{ border: "1.5px solid #EBECED", background: "#fff", minHeight: 80, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
    >
      <span className="text-[14px]" style={{ color: "#9EA8B3" }}>
        Write anything...
      </span>
      <div className="flex items-center gap-2">
        {/* Voice mode button */}
        <button
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold text-white"
          style={{ background: "#204ECF" }}
        >
          {/* Waveform icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="5" width="2" height="6" rx="1" fill="white" />
            <rect x="4" y="3" width="2" height="10" rx="1" fill="white" />
            <rect x="7" y="1" width="2" height="14" rx="1" fill="white" />
            <rect x="10" y="3" width="2" height="10" rx="1" fill="white" />
            <rect x="13" y="5" width="2" height="6" rx="1" fill="white" />
          </svg>
          Use voice mode
        </button>
        {/* Keyboard shortcut hints */}
        <span
          className="text-[11px] px-1.5 py-0.5 rounded"
          style={{ background: "#F0F2F5", color: "#9EA8B3", fontFamily: "monospace" }}
        >
          ⌘⏎
        </span>
        <span
          className="text-[11px] px-1.5 py-0.5 rounded"
          style={{ background: "#F0F2F5", color: "#9EA8B3" }}
        >
          ◎
        </span>
        <span
          className="text-[11px] px-1.5 py-0.5 rounded"
          style={{ background: "#F0F2F5", color: "#9EA8B3" }}
        >
          /
        </span>
      </div>
    </div>
  );
}
