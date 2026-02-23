"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  doc,
  FieldValue,
  getDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db, auth } from "@/app/config/firebase";
import { useAuth } from "./useAuthContext";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  imgs?: string[];
  role?: "user" | "admin";
  createdAt: Timestamp | FieldValue;
  slug: string;
  profession?: string;
  location?: string;
  description?: string;
  profile?: string,
  cover?: string
  phone?: string
  profileVerified?: boolean,
};

type ProfileContextType = {
  profile: UserProfile | null;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function ProfileProvider({ children }: Props) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile({
            uid: user.uid,
            ...(snapshot.data() as Omit<UserProfile, "uid">),
          });
        } else {
          setProfile(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Erro ao escutar perfil:", error);
        setProfile(null);
        setLoading(false);
      }
    );

    // 🔴 MUITO IMPORTANTE
    return () => unsubscribe();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("O Contexto deve ser usado dentro do ProfileProvider");
  }

  return context;
}
