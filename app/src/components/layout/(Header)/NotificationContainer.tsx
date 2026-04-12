'use client'

import { useState } from "react"
import { MdClose } from "react-icons/md"

interface NotificationProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function NotificationContainer({isOpen, setIsOpen}: NotificationProps) {

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
              <div onClick={() => setIsOpen(false)} className="flex justify-start mb-8">
                <button >
                  <MdClose size={28} />
                </button>
              </div>
       
          </div>
          </div>
    </>
  )
}