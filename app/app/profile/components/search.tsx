'use client'
import { useProfileContext } from "@/app/src/context/userProfileContext";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";

const UserListings = () => {

  const {profile} = useProfileContext()

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Menu de abas + botão */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm ">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2 rounded-lg bg-white shadow-sm text-sm font-bold text-gray-900 transition-all">
            Meus Anuncios
          </button>
          <button className="flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
            Salvos
          </button>
          <button className="flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
            Rascunhos <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] ml-1">2</span>
          </button>
        </div>
        <Link href={`/app/profile/${profile?.slug}/criar-anuncio`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md transform active:scale-95">
          <MdAddCircle size={20} />
          Adicionar anúncio
        </Link>
      </div>

      {/* Cards de propriedades */}
    
      
    </div>
  );
};

export default UserListings;
