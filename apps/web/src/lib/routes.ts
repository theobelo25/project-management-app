export const ROUTES = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  profile: '/profile',
  projects: '/projects',
  organizations: '/organizations',
  dashboard: '/dashboard',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
