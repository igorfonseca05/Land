"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MdClose, MdEmail, MdLock } from "react-icons/md";
import { auth } from "@/app/config/firebase";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { Logo } from "../ui/Logo";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import z from "zod";
import { useAuth } from "../../context/useAuthContext";
import { useRouter } from "next/navigation";

type ModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  // children: ReactNode
};

type ErrorProps = {
  email?: string[];
  password?: string[];
};

const loginSchema = z.object({
  email: z.string().email("Formato de email incorreto"),
  password: z.string().min(4, "Senha Incorreta"),
});

const formInitialState = {
  email: "",
  password: "",
};

export function Modal({ isOpen, onClose }: ModalProps) {
  const {user} = useAuth()
  const path = usePathname();
  const [open, setIsOpen] = useState<boolean | undefined>(false);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(formInitialState);
  const [error, setError] = useState<ErrorProps>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });

    setError({
      ...error,
      [e.target.name]: "",
    });
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = loginSchema.safeParse(user);

    if (error) {
      setError(error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: unknown) {
      setLoading(false);
      setLoading(false);
      const err =
        error instanceof FirebaseError ? error : new Error("Erro desconhecido");
      return toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/app/feed");
      setIsOpen(false);
    }
  }, [user]);

  useEffect(() => {
    if (path === "/app/feed" && !user) {
      return setIsOpen(true);
    }

    setIsOpen(isOpen);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed h-full inset-0 z-60 bg-black/40 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-61 flex items-center justify-center top-8 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="
                w-full max-w-md rounded-2xl
                bg-white dark:bg-neutral-900
                p-10 shadow-xl
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end ">
                <div className="hover:bg-gray-100 p-2 rounded-lg">
                  <MdClose
                    className="hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
              </div>
              <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <Logo writing={true} />
                  <p className="text-md text-neutral-600 font-medium dark:text-neutral-400 mt-2">
                    Faça login para visualizar anúncios, salvar terrenos e
                    interagir no feed.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      E-mail
                    </label>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <MdEmail />
                      </span>

                      <input
                        onChange={handleChange}
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="nome@empresa.com"
                        className=" block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        Senha
                      </label>

                      <button
                        type="button"
                        className="text-sm font-bold text-green-600 hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <MdLock />
                      </span>

                      <input
                        onChange={handleChange}
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className=" block w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={` flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-green-500 py-3 px-4 text-sm font-bold text-white shadow-sm transition-all transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-400"}`}>
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

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                  <span className="text-xs text-neutral-500">ou</span>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <FcGoogle />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Google
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <BsApple />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Apple
                    </span>
                  </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                  Ainda não tem conta?{" "}
                  <button className="font-bold text-green-600 hover:underline">
                    Criar conta
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
