import { Logo } from "@/app/src/components/ui/Logo";
import Link from "next/link";
import { BsApple } from "react-icons/bs";
import { LoginForm } from "./components/LoginForm";
import { GoogleButtonLogin } from "./components/GoogleButtonLogin";
import Image from "next/image";
import reno from "@/public/reno.png";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-black font-sans antialiased">
      {/* Lado esquerdo: Imagem e marca (oculto no mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <Image
              src={reno}
              alt="Imagem de fundo de terreno"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover opacity-60 grayscale-10 object-[90%]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <Link href={"/app/feed"} className="flex items-center gap-2">
            <Logo />
            <h2 className="text-2xl font-bold tracking-tight">Reno</h2>
          </Link>

          <div className="space-y-6 max-w-lg mb-10">
            <h1 className="text-5xl font-bold leading-tight">
              Encontre seu terreno.
              <br />
              Construa seu legado.
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Junte-se ao marketplace de terrenos. Descubra milhares de anúncios
              fora do mercado, conecte-se com vendedores verificados e garanta
              seu futuro hoje.
            </p>

            {/* <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img alt="Usuário" className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgxl69GjLIY51P25EWbajk7tP0rwiwhT2IkRTQZ9zzI8VPCQJDMEELkXAg4ehyZB759HBPFIUsc3XP6j5iipnhSz47sqqmRykHeyaoc_tGR236FQ7Zx37z1nYrCuj7MsUiBopNNI1vO4xn-mKcS78lJcFf7av0hXBzYMc2wJ9WbuElqQz8_FRS23cHHjflmgwZDzLJmDOrcO4IQK318ijmB4yDlp1gFXKLQMIKiXw3MyNveivdH2MN0Qk0B2nQ_H2_yu0Nhj-YmtQ"/>
                <img alt="Usuário" className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiYr144yLCHk1a9t6uX7irWD-3HPz55tpTZmRNLM01SmAkc5nmTBedzup_nwpsYftOM_wn0escLrCDTvWrKu8-gRHxGLPmfcTUZ_oNTV6fYnU6rkwnG2nvmKNIVcTQwPG9yT3zcB7JOzFaG69AuLKuW5KbTqlXyfqSLj0QGC2dhOy_IhAAv9RvPws2qzQHQP0quBq8HopZyJyhL--AeC0k1LTB0LjW_9BN6jGugqtgE5M70W9Fo_afx2w0go6O-Mtn181yp5xiJBs"/>
                <div className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-xs font-bold text-white">
                  2k+
                </div>
              </div>
              <div className="text-sm font-medium text-neutral-300">
                <span className="text-green-500 font-bold">4,9/5</span> avaliação de compradores ativos
              </div>
            </div> */}
          </div>

          <div className="text-xs text-neutral-500">
            © 2024 LandMarket Inc. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Lado direito: Formulário de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-neutral-900 p-6 sm:p-12 relative">
        {/* Logo mobile */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <Link href={"/app/feed"} className="flex items-center gap-2">
            <Logo />
            <h2 className="text-2xl font-bold tracking-tight">Reno</h2>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Informe seus dados para acessar sua conta.
            </p>
          </div>

          <LoginForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                ou continuar com
              </span>
            </div>
          </div>

          <div className="flex-1">
            <GoogleButtonLogin />
            {/* <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
              <BsApple />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Apple
              </span>
            </button> */}
          </div>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 pt-4">
            Não tem uma conta?
            <Link
              href={"/auth/signup"}
              className="font-bold text-green-600 hover:text-green-500 hover:underline transition-colors"
            >
              {" "}
              Cadastre-se aqui
            </Link>
          </p>
        </div>

        <div className="absolute bottom-6 w-full text-center lg:text-left lg:px-12">
          <div className="flex justify-center lg:justify-start gap-4 text-xs text-neutral-400">
            <a
              className="hover:text-neutral-600 dark:hover:text-neutral-300"
              href="#"
            >
              Política de Privacidade
            </a>
            <a
              className="hover:text-neutral-600 dark:hover:text-neutral-300"
              href="#"
            >
              Termos de Serviço
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
