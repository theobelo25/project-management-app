'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';

import { Button } from '@web/components/ui/button';
import { useMeQuery } from '@web/lib/api/queries';
import { useDebouncedPreferenceUpdate } from '@web/lib/api/mutations/use-debounced-preference-update';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@web/components/ui/dropdown-menu';
import {
  applyColorScheme,
  COLOR_SCHEME_STORAGE_KEY,
  type ColorScheme,
  isColorScheme,
} from '@web/lib/theme-preferences';

const colorSchemes: Array<{ value: ColorScheme; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'pastel-warm', label: 'Pastel Warm' },
  { value: 'pastel-cool', label: 'Pastel Cool' },
];

export function ColorSchemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [scheme, setScheme] = React.useState<ColorScheme>('default');
  const { data: me } = useMeQuery();
  const { queuePreferenceUpdate } = useDebouncedPreferenceUpdate();

  React.useEffect(() => {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (isColorScheme(stored)) {
      setScheme(stored);
      applyColorScheme(stored);
    } else {
      applyColorScheme('default');
    }
    setMounted(true);
  }, []);

  const currentValue = mounted ? scheme : 'default';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Color scheme"
        >
          <Palette className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={(value) => {
            const next = value as ColorScheme;
            setScheme(next);
            localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
            applyColorScheme(next);
            if (me) {
              queuePreferenceUpdate({ colorScheme: next });
            }
          }}
        >
          {colorSchemes.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
