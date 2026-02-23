"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "@/app/config/firebase";
import { GlobalSpinner } from "../components/globalSpinner/GlobalSpinner";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type AuthContextData = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const path = usePathname()

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicRoutes = ['/login', '/signup', '/feed', '/como-funciona']
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if(!firebaseUser && !publicRoutes.find(route => path.includes(route))) {
        router.replace('/auth/login')
        return setLoading(false);
      }
      
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {loading === true ? <GlobalSpinner /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
