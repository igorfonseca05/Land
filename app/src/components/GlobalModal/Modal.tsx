"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MdClose, MdEmail, MdLock } from "react-icons/md";
import { auth } from "@/app/config/firebase";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { Logo } from "../ui/Logo";
// import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import z from "zod";
import { useAuth } from "../../context/useAuthContext";
import { useRouter } from "next/navigation";

type ModalProps = {
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode,
  style?: string
  // closeOnClickOut: boolean
};


export function Modal({ isOpen, setIsOpen, children, style }: ModalProps) {

  useEffect(() => {
    if(isOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
    

  }, [isOpen])

  return (
   <AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 z-60 bg-black/30 flex items-center h-full justify-center px-4"
      onClick={()=> setIsOpen(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-2xl bg-white p-5 shadow-xl ${style}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  );
}
