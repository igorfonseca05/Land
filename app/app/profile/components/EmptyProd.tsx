"use client"

import { useProfileContext } from "@/app/src/context/userProfileContext";
import Link from "next/link";
import React from "react";
import { MdAddBusiness, MdAddCircle, MdInventory } from "react-icons/md";

interface NoProductsProps {
  onAddProduct?: () => void;
}

const NoProducts: React.FC<NoProductsProps> = ({ onAddProduct }) => {

  const {profile} = useProfileContext()

  
  if (!profile) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl shadow border-gray-200">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <MdAddBusiness size={24}/>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Nenhum item adicionado ainda
      </h3>

      <p className="text-gray-500 mb-8 text-center max-w-sm">
        Você ainda não adicionou nenhum item. Comece agora criando o seu
        primeiro.
      </p>

      <Link href={`/app/profile/${profile?.slug}/criar-anuncio`} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl transition-colors">
        <MdAddCircle/>
        Adicionar primeiro item
      </Link>
    </div>
  );
};

export default NoProducts;
