import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { bshengine } from "@/lib/bshengine";
import type { BshUser } from "@bshsolutions/sdk/types";

interface AuthContextType {
  user: BshUser | undefined;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<BshUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const currentUser = await bshengine.user.me({
      onError: (error) => {
        console.error(error);
      }
    });
    setUser(currentUser?.data[0]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await bshengine.auth.login({
      payload: {email: email,password: password}
    });
    if (response && response.data[0]) {
      localStorage.setItem('access_token', response.data[0].access);
      localStorage.setItem('refresh_token', response.data[0].refresh);
      fetchCurrentUser();
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(undefined);
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

