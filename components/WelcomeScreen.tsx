"use client";

import { useState, useEffect } from "react";
import ToptalLogo from "./ToptalLogo";

const HEADING = "Welcome to your Matching Workspace.";
const BODY =
  "This is your space to find the right hire — at your own pace, without the usual process overhead.\n\nHere you can draft and refine your requirements, explore matched candidates, and track everything in one place. A matching expert is always on standby if you need a human perspective — but there's no pressure to wait for anyone.\n\nWhat kind of role are you looking to fill? Describe it in a few words or paste a job description if you already have one.";

const CHAR_DELAY = 14;

const Cursor = () => (
  <span
    style={{
      display: "inline-block",
      width: 2,
      height: "0.85em",
      background: "#9EA8B3",
      marginLeft: 1,
      verticalAlign: "text-bottom",
      animation: "cursor-blink 0.6s steps(1) infinite",
    }}
  />
);

export default function WelcomeScreen({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [headingCount, setHeadingCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [value, setValue] = useState("");

  const headingDone = headingCount >= HEADING.length;
  const bodyDone = bodyCount >= BODY.length;

  // Type heading character by character
  useEffect(() => {
    if (headingDone) return;
    const t = setTimeout(() => setHeadingCount((c) => c + 1), CHAR_DELAY);
    return () => clearTimeout(t);
  }, [headingCount, headingDone]);

  // Start typing body once heading is done
  useEffect(() => {
    if (!headingDone || bodyDone) return;
    const t = setTimeout(() => setBodyCount((c) => c + 1), CHAR_DELAY);
    return () => clearTimeout(t);
  }, [headingDone, bodyDone, bodyCount]);

  // Reveal input shortly after body completes
  useEffect(() => {
    if (!bodyDone) return;
    const t = setTimeout(() => setInputVisible(true), 250);
    return () => clearTimeout(t);
  }, [bodyDone]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSubmit(trimmed);
    }
  }

  const visibleBody = BODY.slice(0, bodyCount);
  const bodyParas = visibleBody.split("\n\n");

  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F3F4F6" }}>
      <div className="absolute top-6 left-6 z-10">
        <ToptalLogo />
      </div>

      <div
        className="flex justify-center"
        style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24 }}
      >
        <div className="flex flex-col gap-4" style={{ width: 600 }}>
          {/* Heading — typewriter */}
          <p
            style={{
              fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "30px",
              color: "#455065",
              minHeight: "30px",
            }}
          >
            {HEADING.slice(0, headingCount)}
            {!headingDone && <Cursor />}
          </p>

          {/* Body text — starts once heading is done */}
          {headingDone && bodyCount > 0 && (
            <div
              style={{
                fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "22px",
                color: "#455065",
              }}
            >
              {bodyParas.map((para, i) => (
                <p key={i} style={{ margin: i > 0 ? "8px 0 0" : 0 }}>
                  {para}
                  {i === bodyParas.length - 1 && !bodyDone && <Cursor />}
                </p>
              ))}
            </div>
          )}

          {/* Input — revealed after text completes */}
          {inputVisible && (
            <div style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
              <div
                className="rounded-lg flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid #D8D9DC",
                  boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.08)",
                }}
              >
                <div className="px-4 pt-4">
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write anything..."
                    rows={1}
                    autoFocus
                    className="w-full resize-none bg-transparent outline-none border-none"
                    style={{
                      fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
                      fontSize: 14,
                      lineHeight: "22px",
                      color: "#455065",
                    }}
                  />
                </div>
                <div className="px-3 pb-3 pt-2">
                  <button
                    className="flex items-center gap-2 rounded-full pr-3 cursor-pointer"
                    style={{ background: "#edf1fd" }}
                  >
                    <div
                      className="rounded-full p-2 flex items-center justify-center"
                      style={{ background: "#204ecf" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="0" y="6" width="1" height="2" rx="0.5" fill="white" />
                        <rect x="2.5" y="3" width="1" height="8" rx="0.5" fill="white" />
                        <rect x="5" y="1" width="1" height="12" rx="0.5" fill="white" />
                        <rect x="7.5" y="5" width="1" height="4" rx="0.5" fill="white" />
                        <rect x="10" y="3" width="1" height="8" rx="0.5" fill="white" />
                        <rect x="12.5" y="6" width="1" height="2" rx="0.5" fill="white" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#204ecf",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Use voice mode
                    </span>
                    <div className="flex items-center gap-1">
                      {["⌘", "⇧", "/"].map((key) => (
                        <span
                          key={key}
                          className="px-1 rounded leading-5"
                          style={{
                            background: "#d5defa",
                            color: "#204ecf",
                            fontSize: 12,
                            fontFamily: "SF Compact Display, SF Pro Display, system-ui",
                          }}
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
