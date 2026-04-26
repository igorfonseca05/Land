'use client'

import { auth } from "@/app/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";


export function LogoutButton() {

    const router = useRouter()

  return (
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
  );
}
