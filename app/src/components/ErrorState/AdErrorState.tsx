"use client";

import Image from "next/image";
import Link from "next/link";

export function AdErrorState() {
  return (
    <div className="flex bg-white rounded-lg flex-col items-center justify-center text-center h-[calc(100vh-90px)] py-20 px-4">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo.svg" // coloque seu logo em /public
          alt="Reno Logo"
          width={80}
          height={80}
          priority
        />
      </div>

      {/* Título */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Não foi possível obter dados do anúncio
      </h1>

      {/* Descrição */}
      <p className="text-gray-500 max-w-md mb-6">
        O anúncio que você está tentando acessar pode ter sido removido,
        ou o link pode estar incorreto.
      </p>

      {/* Botão */}
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 border bg-green-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-400 transition"
      >
        Tentar novamente
      </button>

      {/* Link secundário */}
      <Link
        href={'/app/feed'}
        className="mt-4 text-sm text-gray-500 hover:underline"
      >
        Voltar para os últimos anúncios
      </Link>
    </div>
  );
}