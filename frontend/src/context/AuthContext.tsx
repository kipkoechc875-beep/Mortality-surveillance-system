import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

interface User {
  id: number;
  username: string;
  role: "user" | "admin";
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredUser(): User | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const logoutTimer = useRef<number | null>(null);

  useEffect(() => {
    // If token exists, validate with server and schedule auto-logout based on token exp
    const init = async () => {
      const t = localStorage.getItem("token");
      if (!t) return;

      try {
        const resp = await fetch("/api/auth/me", { headers: { Authorization: t, "Content-Type": "application/json" } });
        if (!resp.ok) {
          logout();
          return;
        }
        const me = await resp.json();
        setUser({ id: me.id, username: me.username, role: me.role });
        setToken(t);

        // schedule auto logout using exp from token
        const parts = t.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));
            if (payload && payload.exp) {
              const expiresAt = payload.exp * 1000;
              const now = Date.now();
              const ms = expiresAt - now;
              if (ms <= 0) {
                logout();
              } else {
                if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
                logoutTimer.current = window.setTimeout(() => logout(), ms) as unknown as number;
              }
            }
          } catch (e) {
            // ignore decode errors
          }
        }
      } catch (e) {
        logout();
      }
    };

    init();

    return () => {
      if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      const loggedUser = {
        id: data.id ?? 0,
        username,
        role: data.role as "user" | "admin",
      };
      setUser(loggedUser);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // schedule auto-logout based on token exp
      try {
        const parts = data.token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload && payload.exp) {
            const expiresAt = payload.exp * 1000;
            const ms = expiresAt - Date.now();
            if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
            logoutTimer.current = window.setTimeout(() => logout(), ms) as unknown as number;
          }
        }
      } catch (e) {
        // ignore
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: "Unable to reach the authentication server." };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }

      // New registrations require admin verification. Do not auto-login.
      return { success: true, message: data.message || "Registered. Awaiting admin verification." };
    } catch (error) {
      return { success: false, message: "Unable to reach the authentication server." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        login,
        register,
        logout,
        user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
