import Link from "next/link";
import React from "react";
import { Logo } from "@/app/src/components/ui/Logo";
import { Form } from "./components/Form";
import { Header } from "@/app/src/components/layout/(Header)/Header";

export default function RegisterPage() {
  return (
    <div className="bg-slate-50 dark:bg-black text-neutral-900 dark:text-white antialiased min-h-screen flex flex-col">
      {/* Navigation */}
      <Header/>
      {/* <nav className="fixed w-full z-50 top-0 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={"/feed"} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-neutral-900">
                <Logo />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Reno
              </h2>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Já é membro?
              </span>
              <Link
                href={"/auth/login"}
                className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 transition"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col justify-center sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/igorfonseca/image/upload/v1776297959/signup_vmicbx.png')",
        }}
      >
        {/* Background Blobs */}
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        </div> */}

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-5">
          <div className="bg-white py-8 px-4 sm:px-10 mt-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Criar sua conta
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Junte-se ao mercado imobiliário de terrenos que mais cresce.
              </p>
            </div>

            <Form />

            <div className="mt-8 text-center border-t border-neutral-100 space-x-1 dark:border-neutral-800 pt-6">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Já possui uma conta?
                <Link
                  href={"/auth/login"}
                  className="font-bold text-neutral-900 dark:text-white pl-2 hover:text-green-500 transition-colors hover:underline"
                >
                  Acessar minha conta
                </Link>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="mt-10 text-center relative z-10">
          <p className="text-xs text-neutral-400">
            © 2024 LandMarket. All rights reserved.
          </p>
        </div> */}
      </main>
    </div>
  );
}
