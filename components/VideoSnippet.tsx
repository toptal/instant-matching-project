"use client";

import { useState, useEffect } from "react";

interface Props {
  onWatched?: () => void;
}

export default function VideoSnippet({ onWatched }: Props) {
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");
  const [count, setCount] = useState(0);

  const bullets = [
    "How to collaborate with us on defining your requirements",
    "How we suggest initial candidate matches based on your needs",
    "How your feedback improves future recommendations",
    "How to communicate via text or use voice mode to discuss the details more naturally",
    "How and when a matcher can step in for additional support",
  ];

  useEffect(() => {
    if (state !== "playing") return;
    const t = setInterval(() => {
      setCount((c) => {
        if (c >= 3) {
          clearInterval(t);
          setState("done");
          onWatched?.();
          return c;
        }
        return c + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state, onWatched]);

  function handlePlay() {
    setCount(0);
    setState("playing");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Video card */}
      <div
        className="rounded-xl overflow-hidden w-full"
        style={{ border: "1px solid #EBECED" }}
      >
        {/* Thumbnail / player area */}
        <div
          className="relative flex items-center justify-center w-full"
          style={{ height: 272 }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                state === "playing"
                  ? "#0f1f52"
                  : "linear-gradient(135deg, #d6cfc6 0%, #c4bab0 40%, #b8a898 100%)",
              transition: "background 0.4s ease",
            }}
          />

          {state !== "playing" && (
            /* Silhouette hint — only in idle/done */
            <div
              className="absolute"
              style={{
                width: 120,
                height: 180,
                borderRadius: "50% 50% 0 0",
                background: "rgba(180,165,150,0.45)",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          )}

          {state === "playing" ? (
            /* Playing state — counter + stop */
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-center rounded-full text-[13px] font-semibold"
                    style={{
                      width: 32,
                      height: 32,
                      background: count >= n ? "#204ECF" : "rgba(255,255,255,0.15)",
                      color: count >= n ? "white" : "rgba(255,255,255,0.4)",
                      border: `1.5px solid ${count >= n ? "#204ECF" : "rgba(255,255,255,0.25)"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <p className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Watching video…
              </p>
            </div>
          ) : state === "done" ? (
            /* Done state */
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 48, height: 48, background: "#03B080" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l5 5 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[13px] font-medium" style={{ color: "#455065" }}>
                Video watched
              </p>
            </div>
          ) : (
            /* Idle state — play button */
            <button
              onClick={handlePlay}
              className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full"
              style={{ background: "#204ECF", boxShadow: "0 4px 16px rgba(32,78,207,0.35)" }}
            >
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path d="M2 1.5L14.5 9L2 16.5V1.5Z" fill="white" />
              </svg>
            </button>
          )}
        </div>

        {/* Show transcription */}
        <div className="flex items-center justify-end px-4 py-2.5 bg-white">
          <button
            className="flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#204ECF" }}
          >
            Show transcription
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="#204ECF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bullet list */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[14px]" style={{ color: "#455065" }}>
          Here&apos;s what you&apos;ll learn from this video:
        </p>
        <ul className="flex flex-col gap-1">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.6]" style={{ color: "#455065" }}>
              <span className="mt-[9px] shrink-0 w-[5px] h-[5px] rounded-full" style={{ background: "#455065" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
