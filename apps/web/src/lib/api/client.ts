import {
  SignupRequestDto,
  LoginRequestDto,
  UserView,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
} from "@repo/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type SessionExpiredHandler = () => void;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler) {
  sessionExpiredHandler = handler;
}

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function isRefreshUrl(url: string): boolean {
  return url.includes("/auth/refresh");
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof Request
        ? input.url
        : String(input);

  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401 && !isRefreshUrl(url)) {
    const refreshed = await doRefresh();
    if (refreshed) {
      res = await fetch(input, {
        ...init,
        credentials: "include",
      });
    } else {
      sessionExpiredHandler?.();
      throw new Error("Session expired");
    }
  }

  return res;
}

// PUBLIC ROUTES
export async function signup(dto: SignupRequestDto): Promise<UserView | null> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Failed to sign up");
  }

  return res.json();
}

export async function signin(dto: LoginRequestDto): Promise<UserView | null> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Failed to sign up");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Failed to sign up");
  }

  return res.json();
}

// PROTECTED ROUTES
export async function fetchMe(): Promise<UserView | null> {
  const res = await fetchWithAuth(`${API_BASE}/api/auth/me`, {
    credentials: "include",
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}

export async function fetchProjects(
  query: GetProjectsQueryDto,
): Promise<PaginatedProjectsListView> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  if (query.includeArchived !== undefined)
    params.set("includeArchived", String(query.includeArchived));
  if (query.search) params.set("search", query.search);
  if (query.filter) params.set("filter", query.filter);
  if (query.sort) params.set("sort", query.sort);

  const res = await fetchWithAuth(
    `${API_BASE}/api/projects?${params.toString()}`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}
