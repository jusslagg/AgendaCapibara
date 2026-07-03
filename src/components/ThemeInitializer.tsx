"use client";

import { useEffect } from "react";
import { applyTheme, isAppTheme, THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeInitializer() {
  useEffect(() => {
    const requestedTheme = new URLSearchParams(window.location.search).get("theme");
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(isAppTheme(requestedTheme) ? requestedTheme : isAppTheme(storedTheme) ? storedTheme : "capybara");
  }, []);

  return null;
}
