import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
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

import SignInForm from '@web/components/auth/signin-form';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
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
  http.post('http://127.0.0.1:9999/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    return HttpResponse.json({
      id: 'user-1',
      orgId: 'org-1',
      organizationName: 'Test Org',
      email: body.email,
      name: 'Test User',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    });
  }),
);

describe('SignInForm (integration)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    push.mockClear();
  });

  afterAll(() => {
    server.close();
  });

  it('submits credentials and navigates on success', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SignInForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText('Email'), 'dev@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });
  });
});
