import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import SignUpForm from '@web/components/auth/signup-form';

const push = vi.fn();
const useSearchParamsMock = vi.fn(() => new URLSearchParams());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, prefetch: vi.fn() }),
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@web/lib/api/public-api-url', () => ({
  getPublicApiBaseUrl: () => 'http://127.0.0.1:9999',
  apiUrl: (p: string) =>
    `http://127.0.0.1:9999${p.startsWith('/') ? p : `/${p}`}`,
}));

const server = setupServer(
  http.post('http://127.0.0.1:9999/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      name: string;
      password: string;
      confirmPassword: string;
    };

    return HttpResponse.json({
      id: 'user-1',
      orgId: 'org-1',
      organizationName: 'Test Org',
      email: body.email,
      name: body.name,
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    });
  }),
);

describe('SignUpForm (integration)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    push.mockClear();
    useSearchParamsMock.mockReset();
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
  });

  afterAll(() => {
    server.close();
  });

  it('ignores external callbackUrl values and falls back to projects', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams('callbackUrl=https://evil.example'),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <SignUpForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText('Name'), 'Dev User');
    await user.type(screen.getByLabelText('Email'), 'dev@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'Password123!');
    await user.type(screen.getByLabelText('Confirm password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/projects');
    });
  });
});
