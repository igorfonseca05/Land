import Link from "next/link";
import { Form } from "./components/Form";
import { Header } from "@/app/src/components/layout/(Header)/Header";
import Image from "next/image";
import bg from "@/public/signupBg.png";
import { Logo } from "@/app/src/components/ui/Logo";

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative flex flex-col bg-white text-gray-900">
      {/* <Header /> */}

      <main className="flex flex-1 flex-col md:flex-row">
        {/* LEFT SIDE (Imagem) */}
        <section className="relative hidden md:flex md:w-1/2 lg:w-1/2 items-end p-12 overflow-hidden">
        <Link
          href={"/app/feed"}
          className="flex items-center z-10 absolute top-12 gap-2 text-white"
        >
          <Logo />
          <h2 className="text-2xl font-bold tracking-tight">Reno</h2>
        </Link>
          <div className="absolute inset-0">
            <Image src={bg} alt="" className="w-full h-full object-cover" />
            {/* <img
              src="https://res.cloudinary.com/igorfonseca/image/upload/v1776297959/signup_vmicbx.png"
              className="w-full h-full object-cover"
              alt="Landscape"
            /> */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/70" />
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Comece sua jornada na terra dos seus sonhos
            </h1>
            <p className="text-white/80 text-base">
              O mercado de terras mais transparente e eficiente do Brasil.
              Encontre, negocie e invista com segurança.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE (Formulário) */}
        <section className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gray-50">
          <div className="w-full max-w-md ">
            {/* HEADER */}
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Criar conta</h2>
              <p className="text-sm text-gray-500">
                Insira seus dados para começar a explorar propriedades.
              </p>
            </div>

            {/* FORM (sua lógica intacta) */}
            <Form />

            {/* FOOTER */}
            <div className="mt-1  text-center">
              <p className="text-sm text-gray-500">
                Já possui uma conta?
                <Link
                  href="/auth/login"
                  className="ml-2 font-semibold text-gray-900 hover:text-green-600 transition"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
