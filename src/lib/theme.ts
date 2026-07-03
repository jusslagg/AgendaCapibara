export type AppTheme = "capybara" | "resident-evil";

export const THEME_STORAGE_KEY = "capiagenda-theme";

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "capybara" || value === "resident-evil";
}

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "resident-evil" ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const resident = theme === "resident-evil";
  const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (manifest) manifest.href = resident ? "/manifest-resident.json" : "/manifest.json";

  document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((icon) => {
    icon.href = resident ? "/resident-icon-192.png" : "/icon-192.png";
  });

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = resident ? "#8F252D" : "#4B2E1F";
}
