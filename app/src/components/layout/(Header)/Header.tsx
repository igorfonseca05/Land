'use client'

import {
  MdExplore,
  MdGroup,
  MdHome,
  MdStorefront,
} from "react-icons/md";
import Image from "next/image";
import { UserMenu } from "./ProfileDropDown";
import Link from "next/link";
import { useAuth } from "@/app/src/context/useAuthContext";

export function Header() {

  const {user} = useAuth()

  return (
    <header className="fixed top-0 w-full bg-white border-b border-neutral-200 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Image src={"/logo.svg"} width={38} height={38} alt="logo"></Image>
          Reno
        </div>

        <nav className="hidden lg:flex gap-8">
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
        </nav>

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
