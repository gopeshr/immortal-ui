export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://immortal-api-production.up.railway.app";

/* ------------------------------------------------------------------ */
/*  Token store (kept in memory — never touches localStorage)          */
/* ------------------------------------------------------------------ */

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/* ------------------------------------------------------------------ */
/*  Generic fetch wrapper                                              */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail: string }).detail)
        : `Request failed with status ${status}`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  raw?: boolean; // skip JSON parsing (e.g. for 204 No Content)
}

async function rawFetch(path: string, options: ApiOptions = {}) {
  const { body, ...rest } = options;

  const headers: Record<string, string> = {
    ...(rest.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData — the browser sets multipart boundary
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    credentials: "include", // sends HttpOnly refresh cookie
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });

  return response;
}

interface ValidationItem {
  loc?: Array<string | number>;
  msg?: string;
}

export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (
    typeof error.body === "object" &&
    error.body !== null &&
    "detail" in error.body
  ) {
    const detail = (error.body as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const first = detail[0] as ValidationItem | undefined;
      if (first?.msg) return first.msg;
    }
  }

  return error.message || fallback;
}

/**
 * Main API helper.
 *
 * On a 401 it will try to refresh the access token once and retry.
 */
export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  let response = await rawFetch(path, options);

  // Attempt a silent refresh on 401
  if (response.status === 401 && !path.includes("/auth/refresh")) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      response = await rawFetch(path, options);
    }
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = { detail: response.statusText };
    }
    throw new ApiError(response.status, body);
  }

  if (options.raw || response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Refresh helper                                                     */
/* ------------------------------------------------------------------ */

let refreshPromise: Promise<boolean> | null = null;

export async function attemptRefresh(): Promise<boolean> {
  // Coalesce concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return false;

      const data = (await res.json()) as { access_token: string };
      setAccessToken(data.access_token);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
