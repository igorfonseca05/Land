"use client";

import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdLogout, MdAccountCircle } from "react-icons/md";
import { Avatar } from "../../ui/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import { useProfileContext } from "../../../context/userProfileContext";

export function UserMenu() {
  const { profile } = useProfileContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Adicione isso
  const ref = useRef<HTMLDivElement>(null);

  // 1. Garante que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Se não estiver montado ou o perfil não existir, renderiza um placeholder neutro
  // Isso evita que o servidor e o cliente briguem por conteúdos diferentes
  if (!mounted || !profile) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <></>
    // <div ref={ref} className="relative flex items-center gap-3">
    //   <MdNotifications className="text-neutral-800 text-[20px] cursor-pointer" />

    //   <div
    //     onClick={() => setOpen((prev) => !prev)}
    //     className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-gray-100"
    //   >
    //     {/* Verifique se profile.profile é uma STRING (URL). Se for objeto, o erro 310 ocorre aqui */}
    //     <Avatar src={typeof profile.profile === 'string' ? profile.profile : ""} fallback="U" />
    //   </div>

    //   {open && (
    //     <div className="absolute right-0 top-12 w-48 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
    //       <button
    //         className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
    //         onClick={() => {
    //           router.push(`/app/profile/${profile?.slug}`);
    //           setOpen(false);
    //         }}
    //       >
    //         <MdAccountCircle className="text-[18px]" />
    //         Meu Perfil
    //       </button>
    //       <button
    //         className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
    //         onClick={async () => {
    //           await signOut(auth);
    //           router.replace("/auth/login");
    //         }}
    //       >
    //         <MdLogout className="text-[18px]" />
    //         Sair
    //       </button>
    //     </div>
    //   )}
    // </div>
  );
}