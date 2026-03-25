import { MATCHER_MATCHING_SCENARIO as DEFAULT_MATCHER_MATCHING_SCENARIO } from "@/data/matcherMatchingScenario";
import type { MatcherScenarioStep } from "@/data/matcherScenario";

const SCENARIOS_KEY = "im_matcher_matching_scenarios";
const ACTIVE_ID_KEY = "im_active_matcher_matching_scenario_id";

export interface StoredMatcherMatchingScenario {
  id: string;
  name: string;
  steps: MatcherScenarioStep[];
  uploadedAt: number;
}

/**
 * Parse a matcher matching scenario .ts file content and return the MatcherScenarioStep array.
 *
 * Same strategy as the main scenario parser: find the first
 * `export const <name> = [...]` declaration, strip any TypeScript type
 * annotation, then evaluate the plain JS array.
 */
export function parseMatcherMatchingScenarioTS(content: string): MatcherScenarioStep[] {
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
    throw new Error("The matcher matching scenario array is empty.");
  }

  return result as MatcherScenarioStep[];
}

// ── Multi-scenario storage ────────────────────────────────────────────────────

export function loadMatcherMatchingScenarios(): StoredMatcherMatchingScenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredMatcherMatchingScenario[];
  } catch {
    return [];
  }
}

function saveMatcherMatchingScenarios(scenarios: StoredMatcherMatchingScenario[]): void {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
}

export function addMatcherMatchingScenario(name: string, steps: MatcherScenarioStep[]): StoredMatcherMatchingScenario {
  const scenarios = loadMatcherMatchingScenarios();
  const id = `matcher_matching_scenario_${Date.now()}`;
  const entry: StoredMatcherMatchingScenario = { id, name, steps, uploadedAt: Date.now() };
  saveMatcherMatchingScenarios([...scenarios, entry]);
  return entry;
}

export function removeMatcherMatchingScenario(id: string): void {
  const scenarios = loadMatcherMatchingScenarios().filter((s) => s.id !== id);
  saveMatcherMatchingScenarios(scenarios);
  if (getActiveMatcherMatchingScenarioId() === id) {
    clearActiveMatcherMatchingScenario();
  }
}

export function setActiveMatcherMatchingScenarioId(id: string): void {
  localStorage.setItem(ACTIVE_ID_KEY, id);
}

export function getActiveMatcherMatchingScenarioId(): string | null {
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function clearActiveMatcherMatchingScenario(): void {
  localStorage.removeItem(ACTIVE_ID_KEY);
}

/** Returns the active matcher matching scenario steps if one is selected, otherwise the built-in default. */
export function getActiveMatcherMatchingScenario(): MatcherScenarioStep[] {
  if (typeof window === "undefined") return DEFAULT_MATCHER_MATCHING_SCENARIO;
  const activeId = getActiveMatcherMatchingScenarioId();
  if (!activeId) return DEFAULT_MATCHER_MATCHING_SCENARIO;
  const scenarios = loadMatcherMatchingScenarios();
  const active = scenarios.find((s) => s.id === activeId);
  return active?.steps ?? DEFAULT_MATCHER_MATCHING_SCENARIO;
}
