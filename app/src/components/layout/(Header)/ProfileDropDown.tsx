"use client";

import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdLogout, MdAccountCircle } from "react-icons/md";
import { Avatar } from "../../ui/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { redirect, useRouter } from "next/navigation";
import { useProfileContext } from "../../../context/userProfileContext";

export function UserMenu() {
  const { profile } = useProfileContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  
  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if(!profile) return null;
  
  return (
    <div ref={ref} className="relative flex items-center gap-3">
      <MdNotifications className="text-neutral-800 text-[20px] cursor-pointer" />

      {/* Avatar */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-2  rounded-lg hover:bg-gray-100"
      >
        {/* <span className="capitalize">{profile?.name.split(/\s+/)[0]}</span> */}
        <Avatar src={profile?.profile} fallback="IG" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-40 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
          <button
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            onClick={async () => {
              router.replace(`/app/profile/${profile?.slug}`);
              setOpen(false);
            }}
          >
            <MdAccountCircle className="text-[18px]" />
            Meu Perfil
          </button>
          <button
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
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
