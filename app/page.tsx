"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import MatchingWorkspace from "@/components/MatchingWorkspace";
import { useSettings } from "@/hooks/useSettings";

type Phase = "welcome" | "exiting" | "workspace";

export default function Home() {
  const { settings, loaded } = useSettings();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [initialMessage, setInitialMessage] = useState("");

  // Don't render until we know the stored settings to avoid a flash of wrong state
  if (!loaded) return null;

  function handleWelcomeSubmit(text: string) {
    setInitialMessage(text);
    setPhase("exiting");
    setTimeout(() => setPhase("workspace"), 450);
  }

  // ── No welcome screen: jump straight to the full workspace ──────────────
  if (!settings.showWelcomeScreen) {
    return <MatchingWorkspace />;
  }

  // ── Welcome screen flow ─────────────────────────────────────────────────
  if (phase === "workspace") {
    return (
      <div style={{ animation: "fadeIn 0.45s ease forwards" }}>
        <MatchingWorkspace initialMessage={initialMessage} />
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: phase === "exiting" ? 0 : 1,
        transform: phase === "exiting" ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <WelcomeScreen onSubmit={handleWelcomeSubmit} />
    </div>
  );
}
