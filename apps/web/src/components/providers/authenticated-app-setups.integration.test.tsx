import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthenticatedAppSetups } from './authenticated-app-setups';

vi.mock('./session-expired-handler-setup', () => ({
  SessionExpiredHandlerSetup: () => <div>session-expired-setup</div>,
}));

vi.mock('./theme-preference-sync-setup', () => ({
  ThemePreferenceSyncSetup: () => <div>theme-preference-setup</div>,
}));

vi.mock('./realtime-setup', () => ({
  RealtimeSetup: () => <div>realtime-setup</div>,
}));

describe('AuthenticatedAppSetups (integration)', () => {
  it('renders protected-route setup components', () => {
    render(<AuthenticatedAppSetups />);

    expect(screen.getByText('session-expired-setup')).toBeInTheDocument();
    expect(screen.getByText('theme-preference-setup')).toBeInTheDocument();
    expect(screen.getByText('realtime-setup')).toBeInTheDocument();
  });
});
