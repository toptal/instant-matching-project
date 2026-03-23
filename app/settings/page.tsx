"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import ToptalLogo from "@/components/ToptalLogo";

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
      className="relative shrink-0 cursor-pointer rounded-full transition-colors"
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
        <span
          style={{
            fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#1a1a2e",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            color: "#84888e",
            lineHeight: "18px",
          }}
        >
          {description}
        </span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { settings, update, loaded } = useSettings();

  if (!loaded) return null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#F3F4F6" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid #EBECED", background: "#F3F4F6" }}
      >
        <ToptalLogo />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] font-semibold rounded-lg px-3 py-1.5 transition-colors"
          style={{
            fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
            color: "#455065",
            background: "#EBECED",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
      </div>

      {/* Content */}
      <div
        className="mx-auto"
        style={{ maxWidth: 600, padding: "48px 24px" }}
      >
        <h1
          style={{
            fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#1a1a2e",
            marginBottom: 4,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#84888e",
            marginBottom: 32,
          }}
        >
          Configure how the matching workspace behaves.
        </p>

        <div
          className="rounded-xl"
          style={{
            background: "#fff",
            border: "1px solid #EBECED",
            padding: "0 20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="py-3"
            style={{
              borderBottom: "1px solid #EBECED",
              fontFamily: "'Proxima Nova', 'Inter', Arial, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#9EA8B3",
            }}
          >
            Onboarding
          </div>

          <SettingRow
            label="Welcome screen"
            description="Show a full-page welcome screen with a typewriter intro before the workspace loads. When off, the workspace opens directly and the welcome message appears inside the chat thread."
            checked={settings.showWelcomeScreen}
            onChange={(v) => update({ showWelcomeScreen: v })}
          />
        </div>
      </div>
    </div>
  );
}
