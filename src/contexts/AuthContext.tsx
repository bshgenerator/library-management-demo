import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/services/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = await authAPI.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      authAPI.setCurrentUser(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    authAPI.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

