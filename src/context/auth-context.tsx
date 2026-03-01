"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setAccessToken, attemptRefresh } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface User {
  id: string;
  full_name: string;
  email: string;
  intent: string;
  created_at: string;
}

interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    intent: string;
    consent: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- restore session on mount ---------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ok = await attemptRefresh();
        if (!ok || cancelled) {
          setIsLoading(false);
          return;
        }

        const me = await api<User>("/api/auth/me");
        if (!cancelled) setUser(me);
      } catch {
        // no valid session — that's fine
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- login ---------- */
  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      const data = await api<AuthTokenResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password, remember },
      });

      setAccessToken(data.access_token);
      const me = await api<User>("/api/auth/me");
      setUser(me);
    },
    [],
  );

  /* ---------- register ---------- */
  const register = useCallback(
    async (payload: {
      full_name: string;
      email: string;
      password: string;
      confirm_password: string;
      intent: string;
      consent: boolean;
    }) => {
      const data = await api<AuthTokenResponse>("/api/auth/register", {
        method: "POST",
        body: payload,
      });

      setAccessToken(data.access_token);
      const me = await api<User>("/api/auth/me");
      setUser(me);
    },
    [],
  );

  /* ---------- logout ---------- */
  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST", raw: true });
    } catch {
      // swallow — we're logging out regardless
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  /* ---------- value ---------- */
  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
