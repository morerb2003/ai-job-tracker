import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        try {
          const profile = await getCurrentUser();
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        } catch {
          // Token expired or invalid, let interceptor or logout handle it
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        await logoutUser(storedRefreshToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
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
