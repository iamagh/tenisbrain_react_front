import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import {
  verifyToken
} from "services/auth";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (response: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token = localStorage.getItem("access-token");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = useCallback((response: any) => {
    const { access, refresh } = response;
    setIsAuthenticated(true);
    localStorage.setItem("access-token", access);
    localStorage.setItem("refresh-token", refresh);
    if (response.role) {
      const { user, user_info, role, player_coach } = response;
      localStorage.setItem("user", user);
      localStorage.setItem("player-coach", player_coach);
      localStorage.setItem("user-role", role);
      localStorage.setItem("user-info", JSON.stringify(user_info));
      localStorage.setItem("signup_process", user_info.signup_process);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    localStorage.removeItem("player-coach");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-info");
    localStorage.removeItem("signup_process");
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // Make an API call to validate the token
      const response = await verifyToken({ token });
      console.log(response, '----> response')
      if (response.status === 200) {
        response['access'] = token;
        response['refresh'] = token;
        login(response);
      } else {
        console.log(response, '---> logout')
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
