"use client";

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
import { Logo } from "../../ui/Logo";

export function Header() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // console.log(user)s

  return (
    <header className="fixed top-0 w-full bg-white border-b border-neutral-200 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1 flex flex-row items-center justify-between max-w-45">
          <MdMenu
            onClick={() => setIsOpen(true)}
            className="md:hidden order-0"
            size={24}
          />
          <MobileMenu isOpen={isOpen} onClose={setIsOpen} />
          <Logo />
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

        {user && <UserMenu />}
      </div>
    </header>
  );
}
