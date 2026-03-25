import { MATCHER_SCENARIO as DEFAULT_MATCHER_SCENARIO } from "@/data/matcherScenario";
import type { MatcherScenarioStep } from "@/data/matcherScenario";

const SCENARIOS_KEY = "im_matcher_scenarios";
const ACTIVE_ID_KEY = "im_active_matcher_scenario_id";

export interface StoredMatcherScenario {
  id: string;
  name: string;
  steps: MatcherScenarioStep[];
  uploadedAt: number;
}

/**
 * Parse a matcher scenario .ts file content and return the MatcherScenarioStep array.
 *
 * Same strategy as the main scenario parser: find the first
 * `export const <name> = [...]` declaration, strip any TypeScript type
 * annotation, then evaluate the plain JS array.
 */
export function parseMatcherScenarioTS(content: string): MatcherScenarioStep[] {
  const match = content.match(
    /export\s+const\s+\w+\s*(?::\s*[\w\s\[\]<>,|{}'"]+?)?\s*=\s*(\[[\s\S]+)/
  );
  if (!match) {
    throw new Error(
      "Could not find an exported const array in the uploaded file."
    );
  }

  let arraySource = match[1].trimStart();
  arraySource = arraySource.replace(/;\s*$/, "").trimEnd();

  // eslint-disable-next-line no-new-func
  const result: unknown = new Function(`"use strict"; return (${arraySource});`)();

  if (!Array.isArray(result)) {
    throw new Error("The exported value must be an array.");
  }
  if (result.length === 0) {
    throw new Error("The matcher scenario array is empty.");
  }

  return result as MatcherScenarioStep[];
}

// ── Multi-scenario storage ────────────────────────────────────────────────────

export function loadMatcherScenarios(): StoredMatcherScenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredMatcherScenario[];
  } catch {
    return [];
  }
}

function saveMatcherScenarios(scenarios: StoredMatcherScenario[]): void {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
}

export function addMatcherScenario(name: string, steps: MatcherScenarioStep[]): StoredMatcherScenario {
  const scenarios = loadMatcherScenarios();
  const id = `matcher_scenario_${Date.now()}`;
  const entry: StoredMatcherScenario = { id, name, steps, uploadedAt: Date.now() };
  saveMatcherScenarios([...scenarios, entry]);
  return entry;
}

export function removeMatcherScenario(id: string): void {
  const scenarios = loadMatcherScenarios().filter((s) => s.id !== id);
  saveMatcherScenarios(scenarios);
  if (getActiveMatcherScenarioId() === id) {
    clearActiveMatcherScenario();
  }
}

export function setActiveMatcherScenarioId(id: string): void {
  localStorage.setItem(ACTIVE_ID_KEY, id);
}

export function getActiveMatcherScenarioId(): string | null {
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function clearActiveMatcherScenario(): void {
  localStorage.removeItem(ACTIVE_ID_KEY);
}

/** Returns the active matcher scenario steps if one is selected, otherwise the built-in default. */
export function getActiveMatcherScenario(): MatcherScenarioStep[] {
  if (typeof window === "undefined") return DEFAULT_MATCHER_SCENARIO;
  const activeId = getActiveMatcherScenarioId();
  if (!activeId) return DEFAULT_MATCHER_SCENARIO;
  const scenarios = loadMatcherScenarios();
  const active = scenarios.find((s) => s.id === activeId);
  return active?.steps ?? DEFAULT_MATCHER_SCENARIO;
}
