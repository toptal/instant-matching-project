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
            className="flex items-center gap-2 rounded-full pr-3"
            style={{ background: "#edf1fd" }}
          >
            {/* Icon circle */}
            <div
              className="rounded-full p-2 flex items-center justify-center"
              style={{ background: "#204ecf" }}
            >
              {/* Waveform bars */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="6" width="1" height="2" rx="0.5" fill="white" />
                <rect x="2.5" y="3" width="1" height="8" rx="0.5" fill="white" />
                <rect x="5" y="1" width="1" height="12" rx="0.5" fill="white" />
                <rect x="7.5" y="5" width="1" height="4" rx="0.5" fill="white" />
                <rect x="10" y="3" width="1" height="8" rx="0.5" fill="white" />
                <rect x="12.5" y="6" width="1" height="2" rx="0.5" fill="white" />
              </svg>
            </div>
            {/* Label */}
            <span
              className="text-[13px] font-semibold whitespace-nowrap"
              style={{ color: "#204ecf" }}
            >
              Use voice mode
            </span>
            {/* Keyboard shortcut badges */}
            <div className="flex items-center gap-1">
              <span
                className="px-1 rounded text-[12px] leading-5"
                style={{ background: "#d5defa", color: "#204ecf", fontFamily: "SF Compact Display, SF Pro Display, system-ui" }}
              >
                ⌘
              </span>
              <span
                className="px-1 rounded text-[12px] leading-5"
                style={{ background: "#d5defa", color: "#204ecf", fontFamily: "SF Compact Display, SF Pro Display, system-ui" }}
              >
                ⇧
              </span>
              <span
                className="px-1 rounded text-[12px] leading-5"
                style={{ background: "#d5defa", color: "#204ecf", fontFamily: "SF Compact Display, SF Pro Display, system-ui" }}
              >
                /
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
