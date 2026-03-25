/**
 * Fast mode skips all text animations for quick testing.
 * Controlled via the "Skip animations" toggle in Settings.
 */
export function isFastMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("im_settings");
    if (raw) {
      return JSON.parse(raw)?.skipAnimations === true;
    }
  } catch {
    // ignore
  }
  return false;
}

/** Returns 0 in fast mode, the original delay otherwise. */
export function fd(ms: number): number {
  return isFastMode() ? 0 : ms;
}
