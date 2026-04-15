"use client";

import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { NavBar } from "../(LeftSidebar)/components/NavBar";
import { useAuth } from "@/app/src/context/useAuthContext";
import { useProfileContext } from "@/app/src/context/userProfileContext";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { profile } = useProfileContext();
  // 🔒 trava scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* 🌑 BACKDROP */}
      <div
        onClick={() => onClose(true)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 📱 MENU */}
      <div
        className={`fixed top-0 left-0 flex flex-col justify-between z-50 h-full w-[70%] max-w-sm bg-white p-4 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* ❌ BOTÃO FECHAR */}
          <div className="flex justify-end mb-0">
            <button onClick={() => onClose(false)}>
              <MdClose size={28} />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 mb-6">
            <img
              src={profile?.photoURL || "/default-avatar.png"}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-sm">
                {profile?.name.split(/\s+/)[0] || "Usuário"}
              </p>
              <p className="text-xs text-neutral-500">{profile?.profession}</p>
            </div>
            {/* 📊 STATS */}
          </div>
            <div className="flex justify-between my-4 px-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">
                  { 0}
                </span>
                <span className="text-xs text-neutral-500">Posts</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">
                  { 0}
                </span>
                <span className="text-xs text-neutral-500">Seguindo</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">
                  { 0}
                </span>
                <span className="text-xs text-neutral-500">Seguidores</span>
              </div>
            </div>

          {/* 📌 MENU */}
          <NavBar onClose={onClose} />
        </div>
        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={() => {
              onClose(false);
              // 👉 coloca seu logout aqui
              // signOut(auth)
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
