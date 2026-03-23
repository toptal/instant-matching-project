"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import ToptalLogo from "@/components/ToptalLogo";
import {
  parseScenarioTS,
  saveCustomScenario,
  clearCustomScenario,
  hasCustomScenario,
  loadCustomScenario,
} from "@/utils/scenarioStorage";
import type { ScenarioStep } from "@/data/scenario";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 cursor-pointer rounded-full"
      style={{
        width: 44,
        height: 24,
        background: checked ? "#204ECF" : "#D8D9DC",
        transition: "background 0.2s ease",
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow"
        style={{
          width: 18,
          height: 18,
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-6 py-4"
      style={{ borderBottom: "1px solid #EBECED" }}
    >
      <div className="flex flex-col gap-0.5">
        <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
          {label}
        </span>
        <span style={{ fontWeight: 400, fontSize: 13, color: "#84888e", lineHeight: "18px" }}>
          {description}
        </span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="py-3"
      style={{
        borderBottom: "1px solid #EBECED",
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        color: "#9EA8B3",
      }}
    >
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl"
      style={{
        background: "#fff",
        border: "1px solid #EBECED",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

// ── Scenario upload section ───────────────────────────────────────────────────

function ScenarioSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [custom, setCustom] = useState<ScenarioStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (hasCustomScenario()) setCustom(loadCustomScenario());
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsed = parseScenarioTS(content);
        saveCustomScenario(parsed);
        setCustom(parsed);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file.");
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-uploaded if needed
    e.target.value = "";
  }

  function handleReset() {
    clearCustomScenario();
    setCustom(null);
    setError(null);
    setSuccess(false);
  }

  return (
    <Card>
      <SectionHeader>Scenario</SectionHeader>

      <div className="py-4 flex flex-col gap-3">
        {/* Status row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
              Custom scenario
            </span>
            <span style={{ fontSize: 13, color: "#84888e", lineHeight: "18px" }}>
              {custom
                ? `Active — ${custom.length} step${custom.length !== 1 ? "s" : ""} loaded`
                : "Using the built-in default scenario."}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {custom && (
              <button
                onClick={handleReset}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold cursor-pointer"
                style={{ background: "#EBECED", color: "#455065" }}
              >
                Reset to default
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold cursor-pointer"
              style={{ background: "#204ECF", color: "#fff" }}
            >
              Upload scenario.ts
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {success && (
          <p style={{ fontSize: 13, color: "#03B080", margin: 0 }}>
            Scenario loaded successfully. Reload the workspace to apply it.
          </p>
        )}
        {error && (
          <p style={{ fontSize: 13, color: "#E53935", margin: 0 }}>
            {error}
          </p>
        )}

        {/* Format hint */}
        <p style={{ fontSize: 12, color: "#9EA8B3", margin: 0, lineHeight: "18px" }}>
          Upload a <code style={{ fontFamily: "monospace" }}>.ts</code> file that
          follows the same format as{" "}
          <code style={{ fontFamily: "monospace" }}>data/scenario.ts</code> —
          i.e. it must export a{" "}
          <code style={{ fontFamily: "monospace" }}>const SCENARIO: ScenarioStep[]</code> array.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".ts"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { settings, update, loaded } = useSettings();

  if (!loaded) return null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#F3F4F6", fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid #EBECED", background: "#F3F4F6" }}
      >
        <ToptalLogo />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] font-semibold rounded-lg px-3 py-1.5"
          style={{ color: "#455065", background: "#EBECED", textDecoration: "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto flex flex-col gap-6" style={{ maxWidth: 600, padding: "48px 24px" }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 22, color: "#1a1a2e", marginBottom: 4 }}>
            Settings
          </h1>
          <p style={{ fontWeight: 400, fontSize: 14, color: "#84888e" }}>
            Configure how the matching workspace behaves.
          </p>
        </div>

        {/* Onboarding card */}
        <Card>
          <SectionHeader>Onboarding</SectionHeader>
          <SettingRow
            label="Welcome screen"
            description="Show a full-page welcome screen with a typewriter intro before the workspace loads. When off, the workspace opens directly and the welcome message appears inside the chat thread."
            checked={settings.showWelcomeScreen}
            onChange={(v) => update({ showWelcomeScreen: v })}
          />
        </Card>

        {/* Scenario card */}
        <ScenarioSection />
      </div>
    </div>
  );
}
