"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import ToptalLogo from "@/components/ToptalLogo";
import {
  parseScenarioTS,
  addScenario,
  removeScenario,
  loadScenarios,
  setActiveScenarioId,
  clearActiveScenario,
  getActiveScenarioId,
} from "@/utils/scenarioStorage";
import type { StoredScenario } from "@/utils/scenarioStorage";

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
  const [scenarios, setScenarios] = useState<StoredScenario[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  useEffect(() => {
    setScenarios(loadScenarios());
    setActiveId(getActiveScenarioId());
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadedName(null);

    // Derive a display name from the filename (strip extension)
    const name = file.name.replace(/\.[^.]+$/, "");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const steps = parseScenarioTS(content);
        const entry = addScenario(name, steps);
        setScenarios(loadScenarios());
        setUploadedName(name);
        // Auto-activate the newly uploaded scenario
        setActiveScenarioId(entry.id);
        setActiveId(entry.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleActivate(id: string) {
    setActiveScenarioId(id);
    setActiveId(id);
    setUploadedName(null);
  }

  function handleDelete(id: string) {
    removeScenario(id);
    const updated = loadScenarios();
    setScenarios(updated);
    if (activeId === id) {
      setActiveId(null);
    }
  }

  function handleUseDefault() {
    clearActiveScenario();
    setActiveId(null);
    setUploadedName(null);
  }

  return (
    <Card>
      <SectionHeader>Scenario</SectionHeader>

      <div className="py-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
              Custom scenarios
            </span>
            <span style={{ fontSize: 13, color: "#84888e", lineHeight: "18px" }}>
              {scenarios.length === 0
                ? "No scenarios uploaded. Using the built-in default."
                : activeId
                ? "Reload the workspace to apply changes."
                : "No custom scenario active — using built-in default."}
            </span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg px-3 py-1.5 text-[13px] font-semibold cursor-pointer shrink-0"
            style={{ background: "#204ECF", color: "#fff" }}
          >
            Upload scenario
          </button>
        </div>

        {/* Feedback messages */}
        {uploadedName && (
          <p style={{ fontSize: 13, color: "#03B080", margin: 0 }}>
            &ldquo;{uploadedName}&rdquo; uploaded and activated. Reload the workspace to apply it.
          </p>
        )}
        {error && (
          <p style={{ fontSize: 13, color: "#E53935", margin: 0 }}>
            {error}
          </p>
        )}

        {/* Scenario list */}
        {scenarios.length > 0 && (
          <div className="flex flex-col" style={{ border: "1px solid #EBECED", borderRadius: 8, overflow: "hidden" }}>
            {/* Default row */}
            <div
              className="flex items-center justify-between gap-3 px-3 py-2.5"
              style={{ borderBottom: scenarios.length > 0 ? "1px solid #EBECED" : undefined, background: !activeId ? "#F3F4F6" : "#fff" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {!activeId && (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: "#204ECF", color: "#fff" }}
                  >
                    Active
                  </span>
                )}
                <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: !activeId ? 600 : 400 }}>
                  Default
                </span>
              </div>
              {activeId && (
                <button
                  onClick={handleUseDefault}
                  className="shrink-0 rounded-md px-2 py-1 text-[12px] font-medium cursor-pointer"
                  style={{ background: "#EBECED", color: "#455065" }}
                >
                  Use
                </button>
              )}
            </div>

            {/* Uploaded scenarios */}
            {scenarios.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
                style={{
                  borderBottom: idx < scenarios.length - 1 ? "1px solid #EBECED" : undefined,
                  background: activeId === s.id ? "#F3F4F6" : "#fff",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {activeId === s.id && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: "#204ECF", color: "#fff" }}
                    >
                      Active
                    </span>
                  )}
                  <span
                    className="truncate"
                    style={{ fontSize: 13, color: "#1a1a2e", fontWeight: activeId === s.id ? 600 : 400 }}
                    title={s.name}
                  >
                    {s.name}
                  </span>
                  <span style={{ fontSize: 12, color: "#9EA8B3", whiteSpace: "nowrap" }}>
                    {s.steps.length} step{s.steps.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {activeId !== s.id && (
                    <button
                      onClick={() => handleActivate(s.id)}
                      className="rounded-md px-2 py-1 text-[12px] font-medium cursor-pointer"
                      style={{ background: "#EBECED", color: "#455065" }}
                    >
                      Use
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="rounded-md px-2 py-1 text-[12px] font-medium cursor-pointer"
                    style={{ background: "#FEE2E2", color: "#E53935" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Format hint */}
        <p style={{ fontSize: 12, color: "#9EA8B3", margin: 0, lineHeight: "18px" }}>
          Upload any <code style={{ fontFamily: "monospace" }}>.ts</code> file
          that exports a <code style={{ fontFamily: "monospace" }}>const</code> array
          of scenario steps. The filename is used as the scenario name.
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
