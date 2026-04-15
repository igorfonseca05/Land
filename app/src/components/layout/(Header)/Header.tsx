'use client'

import {
  MdExplore,
  MdGroup,
  MdHome,
  MdMenu,
  MdStorefront,
} from "react-icons/md";
import Image from "next/image";
import { UserMenu } from "./ProfileDropDown";
import Link from "next/link";
import { useAuth } from "@/app/src/context/useAuthContext";
import { MobileMenu } from "./MobileSideMenu";
import { useState } from "react";

export function Header() {

  const {user} = useAuth()

  const [isOpen, setIsOpen] = useState(false)

  console.log(user)

  return (
    <header className="fixed top-0 w-full bg-white border-b border-neutral-200 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1 flex flex-row items-center justify-between max-w-45">
          <Link href={'/app/feed'} className="flex items-center gap-2 font-bold text-lg order-2">
          <Image src={"/logo.svg"} width={38} height={38} alt="logo"></Image>
          <span className="hidden md:block">Reno</span>
        </Link>
        <MdMenu onClick={() => setIsOpen(true)} className="md:hidden order-1" size={24}/>
        <MobileMenu isOpen={isOpen} onClose={setIsOpen}/>
        </div>

        {/* <nav className="hidden lg:flex gap-8">
          <Link href={'/app/feed'} className="p-2 rounded-full cursor-pointer transition hover:bg-neutral-200">
            <MdHome className="text-neutral-800 text-[20px]" />
          </Link>

          <div className="p-2 rounded-full cursor-pointer transition hover:bg-neutral-200">
            <MdExplore className="text-neutral-800 text-[20px]" />
          </div>

          <div className="p-2 rounded-full cursor-pointer transition hover:bg-neutral-200">
            <MdStorefront className="text-neutral-800 text-[20px]" />
          </div>

          <div className="p-2 rounded-full cursor-pointer transition hover:bg-neutral-200">
            <MdGroup className="text-neutral-800 text-[20px]" />
          </div>
        </nav> */}

        {user ? (
          <UserMenu/>
        ) : (
          <div className="space-x-2">
            <Link href={'/auth/login'} className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 transition">
            Entrar
           </Link>
           {/* <button className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 transition">
              Criar conta
            </button> */}
          </div>
        )}
       
      </div>
    </header>
  );
}
