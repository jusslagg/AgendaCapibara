export type AppTheme = "capybara" | "resident-evil";

export const THEME_STORAGE_KEY = "capiagenda-theme";

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "capybara" || value === "resident-evil";
}

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "resident-evil" ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
