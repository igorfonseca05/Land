"use client";

import { MdEmail, MdLockReset, MdPassword, MdPerson } from "react-icons/md";
import { auth, db } from "@/app/config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { SetStateAction, useEffect, useState } from "react";
import z from "zod";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/app/src/context/useAuthContext";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/app/src/context/userProfileContext";
import firebase from "firebase/compat/app";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import { createPublicId, createSlug } from "@/app/utils/functions";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Seu nome deve conter no minimo 2 caracteres")
      .trim()
      .toLowerCase(),
    email: z
      .email({ message: "Email com formato inválido" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(4, "Sua senha deve ter no minimo 4 caracteres")
      .trim()
      .toLowerCase(),
    confirm_password: z
      .string()
      .min(4, "Confirme sua senha")
      .trim()
      .toLowerCase(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });

type SignupErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
  confirm_password?: string[];
};

export function Form() {
  const { user: isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError({
      ...error,
      [e.target.name]: "",
    });
  }

  

  async function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        result.data.email,
        result.data.password
      );

      await updateProfile(user, {
        displayName: result.data.name,
      });

      await setDoc(doc(db, 'users', user.uid), {
        slug: createSlug(result.data.name),
        publicId: createPublicId(result.data.name)
      })

      toast.success("Conta criada!");

      saveUserProfile(user);
    } catch (error: unknown) {
      const err =
        error instanceof FirebaseError ? error : new Error("Erro desconhecido");

      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveUserProfile(user: User) {
    const userData = {
      uid: user.uid,
      name: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      role: "user",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData, {
      merge: true,
    });
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/app/feed");
    }
  }, [isAuthenticated]);

  return (
    <form onSubmit={handleForm} action="#" className="space-y-3 overflow-y-auto p-2" method="POST">
      <div>
        <label
          className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          htmlFor="name"
        >
          Nome completo
        </label>
        <div className="mt-1 relative">
          <input
            onChange={(e) => handleChange(e)}
            autoComplete="name"
          className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="name"
            name="name"
            placeholder="Marcelo Antunes"
            required
            type="text"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdPerson className="text-neutral-400 text-[20px]" />
          </div>
        </div>
        {error?.name && (
          <p className="text-xs pt-1 text-red-700">{error.name}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          htmlFor="email"
        >
          Email
        </label>
        <div className="mt-1 relative">
          <input
            onChange={(e) => handleChange(e)}
            autoComplete="email"
           className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="email"
            name="email"
            placeholder="alex@example.com"
            required
            type="email"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdEmail className="text-neutral-400 text-[20px]" />
          </div>
        </div>
        {error?.email && (
          <p className="text-xs pt-2 text-red-700">{error.email}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          htmlFor="password"
        >
          Senha
        </label>
        <div className="mt-1 relative">
          <input
            onChange={(e) => handleChange(e)}
            autoComplete="new-password"
           className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
              <MdPassword className="text-neutral-400 text-[20px]" />
            </span>
          </div>
        </div>
        {error?.password && (
          <p className="text-xs pt-2 text-red-700">{error.password}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          htmlFor="confirm_password"
        >
          Confirmar senha
        </label>
        <div className="mt-1 relative">
          <input
            onChange={(e) => handleChange(e)}
            autoComplete="new-password"
           className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="confirm_password"
            name="confirm_password"
            placeholder="••••••••"
            required
            type="password"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdLockReset className="text-neutral-400 text-[20px]" />
          </div>
        </div>
        {error?.confirm_password && (
          <p className="text-xs pt-2 text-red-700">{error.confirm_password}</p>
        )}
      </div>

      <div className="flex items-center pt-2">
        <input
          onChange={(e) => handleChange(e)}
          className="h-4 w-4 rounded border-neutral-300 text-green-500 focus:ring-green-500 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-600"
          id="terms"
          name="terms"
          type="checkbox"
        />
        <label
          className="ml-2 block text-sm text-neutral-600 dark:text-neutral-400"
          htmlFor="terms"
        >
          Eu concordo com os{" "}
          <a
            className="font-medium text-neutral-900 dark:text-neutral-200 hover:text-green-500 underline decoration-neutral-300 underline-offset-2"
            href="#"
          >
            Termos de serviço
          </a>{" "}
          &{" "}
          <a
            className="font-medium text-neutral-900 dark:text-neutral-200 hover:text-green-500 underline decoration-neutral-300 underline-offset-2"
            href="#"
          >
            Politicas de Privacidade
          </a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`
    flex w-full items-center justify-center gap-2 rounded-xl
    border border-transparent bg-green-500 py-3 px-4
    text-sm font-bold text-white shadow-sm
    transition-all transform active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-400"}
  `}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Cadastrando...
            </>
          ) : (
            "Cadastrar"
          )}
        </button>
      </div>
    </form>
  );
}
