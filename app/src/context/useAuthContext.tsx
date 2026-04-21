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
import { mockUser } from "./mockuser";

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
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const publicRoutes = [
  //     "/login",
  //     "/signup",
  //     "/feed",
  //     "/como-funciona",
  //     "/mapa",
  //     "/ads",
  //   ];

  //   const isPublicRoute = publicRoutes.some((route) => path.includes(route));

  //   if (!loading && !user && !isPublicRoute) {
  //     router.replace("/auth/login");
  //   }
  // }, [user, loading, path, router]);

  // useEffect(() => {
  //   const publicRoutes = [
  //     "/login",
  //     "/signup",
  //     "/feed",
  //     "/como-funciona",
  //     "/mapa",
  //     "/ads",
  //   ];

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     const isPublicRoute = publicRoutes.some((route) => path.includes(route));

  //     if (!user && !isPublicRoute && path !== "/auth/login") {
  //       router.replace("/auth/login");
  //     }

  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [router, path]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
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
