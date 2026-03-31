'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useMeQuery } from '@web/lib/api/queries';
import {
  applyColorScheme,
  COLOR_SCHEME_STORAGE_KEY,
  isColorScheme,
  isThemeMode,
  THEME_MODE_STORAGE_KEY,
} from '@web/lib/theme-preferences';

export function ThemePreferenceSyncSetup() {
  const { data: me } = useMeQuery();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (isColorScheme(stored)) {
      applyColorScheme(stored);
    }
  }, []);

  React.useEffect(() => {
    if (!me) return;

    if (isThemeMode(me.themeMode)) {
      setTheme(me.themeMode);
      localStorage.setItem(THEME_MODE_STORAGE_KEY, me.themeMode);
    }

    if (isColorScheme(me.colorScheme)) {
      applyColorScheme(me.colorScheme);
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, me.colorScheme);
    }
  }, [me, setTheme]);

  return null;
}
