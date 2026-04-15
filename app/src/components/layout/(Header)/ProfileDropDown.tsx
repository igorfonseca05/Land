"use client";

import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdLogout, MdAccountCircle } from "react-icons/md";
import { Avatar } from "../../ui/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import { useProfileContext } from "../../../context/userProfileContext";
import { NotificationContainer } from "./NotificationContainer";
import { useAuth } from "@/app/src/context/useAuthContext";

export function UserMenu() {
  const {user} = useAuth()
  const { profile } = useProfileContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Adicione isso
  const ref = useRef<HTMLDivElement>(null);

   const [notificationIsOpen, setNotificationIsOpen] = useState(false)

   console.log(profile)

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
  // if (!user || !mounted || !profile) {
  //   return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  // }


  return (
    <div ref={ref} className="relative flex items-center gap-3">
      <MdNotifications onClick={() => setNotificationIsOpen(true)} className="text-neutral-800 text-[20px] cursor-pointer" />
      <NotificationContainer isOpen={notificationIsOpen} setIsOpen={setNotificationIsOpen}/>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-gray-100"
      >
        {/* Verifique se profile.profile é uma STRING (URL). Se for objeto, o erro 310 ocorre aqui */}
        {profile !== null ? (
          <Avatar src={typeof profile.photoURL === 'string' ? profile.photoURL : ""} fallback="U" />
        ) : (
          <Avatar src={typeof user?.photoURL === 'string' ? user?.photoURL : ""} fallback="U" />
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-12 w-48 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
          <button
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            onClick={() => {
              router.push(`/app/profile/${profile?.slug || user?.email}`);
              setOpen(false);
            }}
          >
            <MdAccountCircle className="text-[18px]" />
            Meu Perfil
          </button>
          <button
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            onClick={async () => {
              await signOut(auth);
              router.replace("/auth/login");
            }}
          >
            <MdLogout className="text-[18px]" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}