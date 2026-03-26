"use client";

import { useState, useEffect } from "react";

export type Settings = {
  showWelcomeScreen: boolean;
  skipAnimations: boolean;
};

const DEFAULTS: Settings = {
  showWelcomeScreen: true,
  skipAnimations: false,
};

const STORAGE_KEY = "im_settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function update(patch: Partial<Settings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  return { settings, update, loaded };
}
