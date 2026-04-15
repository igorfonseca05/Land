'use client'

import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import { useProfileContext } from "@/app/src/context/userProfileContext";

const provider = new GoogleAuthProvider();

export function GoogleButtonLogin() {

    async function loginGoogle() {
        try {
            const res = await signInWithPopup(auth, provider)
        } catch (error) {
            console.log(error)
            useRouter().push('app/auth/login')
        }
    }

  return (
    <button onClick={loginGoogle} className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
      <FcGoogle />
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Google
      </span>
    </button>
  );
}
