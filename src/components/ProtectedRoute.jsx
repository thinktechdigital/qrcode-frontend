import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

const parseUser = (rawUser) => {
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const getStoredAuth = () => {
  const localToken = window.localStorage.getItem("access_token");
  if (localToken) {
    return {
      token: localToken,
      user: parseUser(window.localStorage.getItem("user")),
      storage: window.localStorage,
    };
  }

  const sessionToken = window.sessionStorage.getItem("access_token");
  if (sessionToken) {
    return {
      token: sessionToken,
      user: parseUser(window.sessionStorage.getItem("user")),
      storage: window.sessionStorage,
    };
  }

  return { token: "", user: null, storage: null };
};

const clearAuth = () => {
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("token_type");
  window.localStorage.removeItem("user");
  window.sessionStorage.removeItem("access_token");
  window.sessionStorage.removeItem("token_type");
  window.sessionStorage.removeItem("user");
};

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/" }) => {
  const [status, setStatus] = useState("checking");
  const [validatedUser, setValidatedUser] = useState(null);
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""), []);
  const auth = useMemo(() => getStoredAuth(), []);

  useEffect(() => {
    const validate = async () => {
      if (!auth.token || !apiBaseUrl) {
        setStatus("unauthorized");
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        if (!response.ok) {
          clearAuth();
          setStatus("unauthorized");
          return;
        }

        const me = await response.json();
        auth.storage?.setItem("user", JSON.stringify(me));
        setValidatedUser(me);
        setStatus("authorized");
      } catch {
        clearAuth();
        setStatus("unauthorized");
      }
    };

    validate();
  }, [apiBaseUrl, auth.storage, auth.token]);

  if (status === "checking") return null;
  if (status !== "authorized") return <Navigate to="/" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(validatedUser?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
