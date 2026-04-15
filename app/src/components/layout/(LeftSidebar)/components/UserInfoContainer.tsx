"use client";

import { auth } from "@/app/config/firebase";
import { useAuth } from "@/app/src/context/useAuthContext";
import { useProfileContext } from "@/app/src/context/userProfileContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UserInfoContainer() {
  const {user} = useAuth()
  const { profile } = useProfileContext();
  const path = usePathname();
  
//   if (!profile) {
//   return <div className="p-8 text-center">Carregando...</div>;
// }

  return (
    <>
      {user ? (
        <Link href={`/app/profile/${profile?.slug}`}>
          <div
            className={`flex items-center gap-3 p-3 rounded-xl ${
              path === "/app/profile"
                ? "bg-white border border-neutral-200 font-bold"
                : "hover:bg-neutral-100 cursor-pointer"
            }`}
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
              <Image
                src={profile?.photoURL || "/place.webp"}
                alt="profile image"
                fill
                className="object-cover"
              />
            </div>

            {/* Textos */}
            <div>
              <p className="font-bold text-sm capitalize">
                {profile?.name.split(/\s+/)[0]}
              </p>
              <p className="text-xs text-neutral-500">
                Procurando terrenos acima de 5 acres
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <Link href="/auth/login" className="hidden">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-500 font-bold text-lg">?</span>
            </div>

            <div>
              <p className="font-bold text-sm">Entrar ou criar conta</p>
              <p className="text-xs text-neutral-500">
                Faça login para acessar seu perfil
              </p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
