'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@web/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@web/components/ui/dropdown-menu';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  let triggerIcon: React.ReactNode;
  if (!mounted) {
    triggerIcon = <Sun className="size-4 opacity-50" aria-hidden />;
  } else if (theme === 'dark') {
    triggerIcon = <Moon className="size-4" aria-hidden />;
  } else if (theme === 'light') {
    triggerIcon = <Sun className="size-4" aria-hidden />;
  } else {
    triggerIcon = <Monitor className="size-4" aria-hidden />;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Color theme"
        >
          {triggerIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup
          value={mounted ? (theme ?? 'system') : 'system'}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem value="light">
            <Sun className="size-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="size-4" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="size-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
