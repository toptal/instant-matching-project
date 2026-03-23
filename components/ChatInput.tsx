"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export default function ChatInput({ onSend, isLoading = false, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend(value.trim());
        setValue("");
      }
    }
  }

  return (
    <div
      className="rounded-2xl px-4 py-3 flex flex-col gap-3"
      style={{ border: "1.5px solid #EBECED", background: "#fff", minHeight: 80, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write anything..."
        rows={1}
        className="text-[14px] w-full resize-none bg-transparent outline-none border-none placeholder:text-[#9EA8B3]"
        style={{ color: "#455065", lineHeight: "22px" }}
      />
      <div className="flex items-center gap-2">
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={{ background: "#455065", color: "white" }}
          >
            {/* square stop icon */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="2" fill="white" />
            </svg>
            Stop
          </button>
        ) : (
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
        )}
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
