"use client";

import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { NavBar } from "../(LeftSidebar)/components/NavBar";
type MobileMenuProps = {
  isOpen: boolean;
  onClose: (isOpen:boolean) => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
        className={`fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-white p-5 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ❌ BOTÃO FECHAR */}
        <div className="flex justify-end mb-8">
          <button  onClick={() => onClose(false)}>
            <MdClose size={28} />
          </button>
        </div>

        {/* 📌 MENU */}
        <NavBar onClose={onClose}/>
      </div>
    </>
  );
}