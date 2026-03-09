"use client";

import { MdEmail, MdLock } from "react-icons/md";
import { auth } from "@/app/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useEffect } from "react";
import { useState } from "react";
import z, { ZodError } from "zod";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useAuth } from "@/app/src/context/useAuthContext";
import { useRouter } from "next/navigation";
import { translateFirebaseAuthError } from "@/app/utils/firebaseAuthErrors.ts";

const loginSchema = z.object({
  email: z.string().email("Formato de email incorreto"),
  password: z.string().min(4, "Senha Incorreta"),
});

export function LoginForm() {
 const {isAuthenticated} = useAuth()
 const router = useRouter()
 
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<{ email?: string[]; password?: string[] }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    setError({
        ...error,
        [e.target.name]: ''
    })
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = loginSchema.safeParse(user);

    if (error) {
      Object.values(error.flatten().fieldErrors).forEach(error => toast.error(error))
      setLoading(false);
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    } catch (error: unknown) {
      setLoading(false);
      const err =
      error instanceof FirebaseError ? error : new Error("Erro desconhecido");
      // console.log(err)
      return toast.error(translateFirebaseAuthError(err));
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    if(isAuthenticated) {
        router.push('/app/feed')
    }
  }, [isAuthenticated])

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1">
        <label
          className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          htmlFor="email"
        >
          E-mail ou nome de usuário
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <MdEmail size={20} />
          </span>
          <input
            onChange={handleChange}
            autoComplete="email"
            className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="email"
            name="email"
            placeholder="nome@empresa.com"
            required
            type="email"
          />
        </div>
        {error.email && (
          <span className="text-red-600 text-xs">{error.email}</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
            htmlFor="password"
          >
            Senha
          </label>
          <a
            className="text-sm font-bold text-green-600 hover:text-green-500 hover:underline"
            href="#"
          >
            Esqueceu a senha?
          </a>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <MdLock size={20} />
          </span>
          <input
            onChange={handleChange}
            autoComplete="current-password"
            className="block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </div>
        {error.password && (
          <span className="text-red-600 text-xs">{error.password}</span>
        )}
      </div>

      <div className="flex items-center">
        <input
          className="h-4 w-4 rounded border-neutral-300 text-green-500 focus:ring-green-500 bg-white dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer"
          id="remember-me"
          name="remember-me"
          type="checkbox"
        />
        <label
          className="ml-2 block text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none"
          htmlFor="remember-me"
        >
          Lembrar por 30 dias
        </label>
      </div>

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
            Aguarde...
          </>
        ) : (
          "Entrar"
        )}
      </button>
    </form>
  );
}
