export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'pastel-warm' | 'pastel-cool';

export const THEME_MODE_STORAGE_KEY = 'theme';
export const COLOR_SCHEME_STORAGE_KEY = 'color-scheme';

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function isColorScheme(value: unknown): value is ColorScheme {
  return (
    value === 'default' || value === 'pastel-warm' || value === 'pastel-cool'
  );
}

export function applyColorScheme(scheme: ColorScheme) {
  document.documentElement.dataset.palette = scheme;
}
