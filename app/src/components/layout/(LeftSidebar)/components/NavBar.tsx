"use client";

import { auth } from "@/app/config/firebase";
import { useAuth } from "@/app/src/context/useAuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MdFeed,
  MdBookmark,
  MdMap,
  MdHistory,
  MdSearch,
  MdInfoOutline,
} from "react-icons/md";

export function NavBar({onClose} : {onClose?: (isOpen: boolean) => void}) {
  const { user } = useAuth();
  const path = usePathname();

  const loggedMenu = [
    {
      id: 1,
      icon: MdFeed,
      label: "Últimos anúncios",
      href: "/app/feed",
    },
    {
      id: 2,
      icon: MdBookmark,
      label: "Terrenos salvos",
      href: "/app/salvos",
    },
    {
      id: 3,
      icon: MdMap,
      label: "Visualização no mapa",
      href: "/app/mapa",
    },
    {
      id: 4,
      icon: MdHistory,
      label: "Histórico de visualização",
      href: "/app/historico",
    },
  ];

  const publicMenu = [
    {
      id: 1,
      icon: MdFeed,
      label: "Últimos anúncios",
      href: "/app/feed",
    },
    {
      id: 2,
      icon: MdMap,
      label: "Explorar no mapa",
      href: "/app/mapa",
    },
    {
      id: 3,
      icon: MdSearch,
      label: "Buscar terrenos",
      href: "/busca",
    },
    {
      id: 4,
      icon: MdInfoOutline,
      label: "Quem somos",
      href: "/app/quem-somos",
    },
  ];

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {(user ? loggedMenu : publicMenu).map(
        ({ icon: Icon, label, id, href }, i) => {
          let active = path === href;

          return (
            <Link
            onClick={() => onClose && onClose(false)}
              key={i}
              href={`${href}`}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                active
                  ? "bg-white border border-neutral-200 font-bold"
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <Icon className="text-[20px]" />
              {label}
            </Link>
          );
        },
      )}
    </nav>
  );
}
