'use client';

import { RealtimeSetup } from './realtime-setup';
import { SessionExpiredHandlerSetup } from './session-expired-handler-setup';
import { ThemePreferenceSyncSetup } from './theme-preference-sync-setup';

export function AuthenticatedAppSetups() {
  return (
    <>
      <SessionExpiredHandlerSetup />
      <ThemePreferenceSyncSetup />
      <RealtimeSetup />
    </>
  );
}
