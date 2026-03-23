import { SCENARIO as DEFAULT_SCENARIO } from "@/data/scenario";
import type { ScenarioStep } from "@/data/scenario";

const STORAGE_KEY = "im_custom_scenario";

/**
 * Parse a scenario.ts file content and return the SCENARIO array.
 *
 * Strategy: locate the `export const SCENARIO ... = [...]` declaration,
 * strip the TypeScript type annotation, then evaluate the plain JS array.
 * The array items themselves contain no TypeScript syntax, so this works
 * for any file that follows the same format as data/scenario.ts.
 */
export function parseScenarioTS(content: string): ScenarioStep[] {
  // Match: export const SCENARIO<optional : Type> = <rest of file>
  const match = content.match(
    /export\s+const\s+SCENARIO\s*(?::\s*[\w\s\[\]<>,|{}'"]+?)?\s*=\s*([\s\S]+)/
  );
  if (!match) {
    throw new Error(
      'Could not find "export const SCENARIO" in the uploaded file.'
    );
  }

  let arraySource = match[1].trimStart();

  // Remove trailing semicolon (and any trailing whitespace/comments after it)
  arraySource = arraySource.replace(/;\s*$/, "").trimEnd();

  // Evaluate as a JS expression in a sandboxed Function scope
  // eslint-disable-next-line no-new-func
  const result: unknown = new Function(`"use strict"; return (${arraySource});`)();

  if (!Array.isArray(result)) {
    throw new Error("SCENARIO must be an array.");
  }
  if (result.length === 0) {
    throw new Error("SCENARIO array is empty.");
  }

  return result as ScenarioStep[];
}

export function saveCustomScenario(scenario: ScenarioStep[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
}

export function loadCustomScenario(): ScenarioStep[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScenarioStep[];
  } catch {
    return null;
  }
}

export function clearCustomScenario(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasCustomScenario(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

/** Returns the custom scenario if one is saved, otherwise the built-in default. */
export function getActiveScenario(): ScenarioStep[] {
  if (typeof window === "undefined") return DEFAULT_SCENARIO;
  return loadCustomScenario() ?? DEFAULT_SCENARIO;
}
