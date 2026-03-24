import { SCENARIO as DEFAULT_SCENARIO } from "@/data/scenario";
import type { ScenarioStep } from "@/data/scenario";

const SCENARIOS_KEY = "im_scenarios";
const ACTIVE_ID_KEY = "im_active_scenario_id";

export interface StoredScenario {
  id: string;
  name: string;
  steps: ScenarioStep[];
  uploadedAt: number;
}

/**
 * Parse a scenario .ts file content and return the ScenarioStep array.
 *
 * Strategy: find the first `export const <name> = [...]` declaration,
 * strip any TypeScript type annotation, then evaluate the plain JS array.
 * This works for any filename — the export name does not need to be SCENARIO.
 */
export function parseScenarioTS(content: string): ScenarioStep[] {
  // Match: export const <anyName><optional : Type> = [<rest>
  const match = content.match(
    /export\s+const\s+\w+\s*(?::\s*[\w\s\[\]<>,|{}'"]+?)?\s*=\s*(\[[\s\S]+)/
  );
  if (!match) {
    throw new Error(
      "Could not find an exported const array in the uploaded file."
    );
  }

  let arraySource = match[1].trimStart();

  // Remove trailing semicolon (and any trailing whitespace/comments after it)
  arraySource = arraySource.replace(/;\s*$/, "").trimEnd();

  // Evaluate as a JS expression in a sandboxed Function scope
  // eslint-disable-next-line no-new-func
  const result: unknown = new Function(`"use strict"; return (${arraySource});`)();

  if (!Array.isArray(result)) {
    throw new Error("The exported value must be an array.");
  }
  if (result.length === 0) {
    throw new Error("The scenario array is empty.");
  }

  return result as ScenarioStep[];
}

// ── Multi-scenario storage ────────────────────────────────────────────────────

export function loadScenarios(): StoredScenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredScenario[];
  } catch {
    return [];
  }
}

function saveScenarios(scenarios: StoredScenario[]): void {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
}

export function addScenario(name: string, steps: ScenarioStep[]): StoredScenario {
  const scenarios = loadScenarios();
  const id = `scenario_${Date.now()}`;
  const entry: StoredScenario = { id, name, steps, uploadedAt: Date.now() };
  saveScenarios([...scenarios, entry]);
  return entry;
}

export function removeScenario(id: string): void {
  const scenarios = loadScenarios().filter((s) => s.id !== id);
  saveScenarios(scenarios);
  // If we just removed the active one, clear active selection
  if (getActiveScenarioId() === id) {
    clearActiveScenario();
  }
}

export function setActiveScenarioId(id: string): void {
  localStorage.setItem(ACTIVE_ID_KEY, id);
}

export function getActiveScenarioId(): string | null {
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function clearActiveScenario(): void {
  localStorage.removeItem(ACTIVE_ID_KEY);
}

export function hasCustomScenario(): boolean {
  if (typeof window === "undefined") return false;
  const activeId = localStorage.getItem(ACTIVE_ID_KEY);
  if (!activeId) return false;
  const scenarios = loadScenarios();
  return scenarios.some((s) => s.id === activeId);
}

/** Returns the active scenario steps if one is selected, otherwise the built-in default. */
export function getActiveScenario(): ScenarioStep[] {
  if (typeof window === "undefined") return DEFAULT_SCENARIO;
  const activeId = getActiveScenarioId();
  if (!activeId) return DEFAULT_SCENARIO;
  const scenarios = loadScenarios();
  const active = scenarios.find((s) => s.id === activeId);
  return active?.steps ?? DEFAULT_SCENARIO;
}

// ── Legacy compat (kept for any external callers) ─────────────────────────────

/** @deprecated Use addScenario + setActiveScenarioId instead */
export function saveCustomScenario(steps: ScenarioStep[]): void {
  const entry = addScenario("Custom scenario", steps);
  setActiveScenarioId(entry.id);
}

/** @deprecated Use loadScenarios instead */
export function loadCustomScenario(): ScenarioStep[] | null {
  const active = getActiveScenario();
  return active === DEFAULT_SCENARIO ? null : active;
}

/** @deprecated Use clearActiveScenario instead */
export function clearCustomScenario(): void {
  clearActiveScenario();
}
