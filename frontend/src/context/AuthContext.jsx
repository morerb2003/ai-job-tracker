import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/authApi";
import {
  clearAccessToken,
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
} from "../api/authSession";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(getAccessToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncToken = (event) => {
      setAccessTokenState(event.detail ?? getAccessToken());
    };

    const clearSession = () => {
      clearAccessToken();
      setAccessTokenState(null);
      setUser(null);
    };

    const initializeSession = async () => {
      // Remove tokens saved by the previous localStorage-based auth implementation.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      try {
        const session = await refreshAccessToken();
        if (!isMounted) return;

        setAccessTokenState(session.accessToken);
        const profile = await getCurrentUser();
        if (isMounted) setUser(profile);
      } catch {
        if (isMounted) {
          clearAccessToken();
          setAccessTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    window.addEventListener("auth:token-changed", syncToken);
    window.addEventListener("auth:session-expired", clearSession);
    initializeSession();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:token-changed", syncToken);
      window.removeEventListener("auth:session-expired", clearSession);
    };
  }, []);

  const handleAuthSuccess = (data) => {
    if (!data.accessToken) {
      throw new Error("Authentication response did not include an access token.");
    }
    setAccessToken(data.accessToken);
    setAccessTokenState(data.accessToken);

    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    return data;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    return handleAuthSuccess(data);
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    return handleAuthSuccess(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Always clear the local session, even when the API cannot be reached.
    } finally {
      clearAccessToken();
      setAccessTokenState(null);
      setUser(null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    isLoading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
