export const ROUTES = {
  home: "/",
  signin: "/signin",
  signup: "/signup",
  projects: "/projects",
  board: "/board",
  dashboard: "/dashboard",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
