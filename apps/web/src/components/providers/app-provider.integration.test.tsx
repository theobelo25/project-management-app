import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppProvider } from './app-provider';

const useMeQueryMock = vi.fn();

vi.mock('@web/lib/api/queries', () => ({
  useMeQuery: (): { data: null } => {
    useMeQueryMock();
    return { data: null };
  },
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useTheme: () => ({ theme: 'light' as const }),
}));

describe('AppProvider (integration)', () => {
  it('does not call auth/me query when used for public routes', () => {
    render(
      <AppProvider>
        <div>public-content</div>
      </AppProvider>,
    );

    expect(screen.getByText('public-content')).toBeInTheDocument();
    expect(useMeQueryMock).not.toHaveBeenCalled();
  });
});
