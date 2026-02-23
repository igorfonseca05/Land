"use client"

import { useProfileContext } from "@/app/src/context/userProfileContext";
import Link from "next/link";
import React from "react";
import { MdAddBusiness, MdAddCircle, MdInventory, MdLandscape, MdSearch } from "react-icons/md";

interface NoFeedItem {
  onAddProduct?: () => void;
}

const NoFeedItem: React.FC<NoFeedItem> = ({ onAddProduct }) => {

  const {profile} = useProfileContext()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl shadow border-gray-200">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <MdLandscape size={24} className="text-green-500"/>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
         Seu feed está quieto
      </h3>

      <p className="text-gray-500 mb-8 text-center max-w-sm">
        Comece a seguir vendedores ou ajuste suas preferências para ver anúncios de terrenos aqui.
      </p>

      <Link href={`/app/profile/${profile?.slug}/criar-anuncio`} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl transition-colors">
        <MdAddCircle/>
        Criar primeiro anúncio
      </Link>
    </div>
  );
};

export default NoFeedItem;
