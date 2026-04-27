"use client";

import { useAuth } from "@/app/src/context/useAuthContext";
import { listenNotifications, NotificationFirebaseProps } from "@/app/utils/functions";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

interface NotificationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function NotificationContainer({
  isOpen,
  setIsOpen,
}: NotificationProps) {
  const {user} = useAuth()

  const [notifications, setNotifications] = useState<NotificationFirebaseProps[]>([])

  useEffect(() => {

    if (!user?.uid) return;
    const unsubscribe = listenNotifications(user?.uid, setNotifications)

    return () => unsubscribe();
  }, [user?.uid])

  console.log(notifications)


  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 📱 MENU */}
      <div
        className={`fixed top-0 right-0 flex flex-col justify-between z-50 h-full w-[70%] max-w-sm bg-white p-4 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* ❌ BOTÃO FECHAR */}
          <div
            onClick={() => setIsOpen(false)}
            className="flex justify-start mb-4"
          >
            <div className="flex justify-between flex-1 items-start">
              <div>
                <h2 className="font-h2 text-xl font-bold text-gray-900 dark:text-white">
                  Notificações
                </h2>
                <p className="text-xs text-gray-500 font-manrope">
                  Mantenha-se atualizado sobre oportunidades de terrenos
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MdClose size={28} />
              </button>
            </div>
          </div>
          <button className="w-full text-center py-2 text-sm font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            Marcar todas como lidas
          </button>
        </div>
      </div>
    </>
  );
}
