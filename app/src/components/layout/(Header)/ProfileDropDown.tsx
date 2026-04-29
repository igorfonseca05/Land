"use client";

import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdLogout, MdAccountCircle } from "react-icons/md";
import { Avatar } from "../../ui/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import { useProfileContext } from "../../../context/userProfileContext";
import { NotificationContainer } from "./NotificationContainer";
import { useAuth } from "@/app/src/context/useAuthContext";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import {
  listenNotifications,
  NotificationFirebaseProps,
} from "@/app/utils/functions";

export function UserMenu() {
  const { user } = useAuth();
  const { profile } = useProfileContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Adicione isso
  const ref = useRef<HTMLDivElement>(null);

  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    NotificationFirebaseProps[]
  >([]);

  const [markedAsSeen, setMarkedAsSeen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = listenNotifications(user?.uid, setNotifications);

    setMarkedAsSeen(false)

    return () => unsubscribe();
  }, [user?.uid]);

  // 1. Garante que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (notificationIsOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    setMarkedAsSeen(true);
  }, [notificationIsOpen]);

  return (
    <div ref={ref} className="relative flex items-center gap-3">
      <div
        className="relative w-fit cursor-pointer"
        onClick={() => setNotificationIsOpen(true)}
      >
        <MdNotifications
          // onClick={() => setNotificationIsOpen(true)}
          className="text-neutral-800 text-[20px] cursor-pointer"
        />
        {notifications.map((notification) => {
          const wasRead = notification.read;

          if (!wasRead && !markedAsSeen) {
            return (
              <span
                key={notification.id}
                className="w-3 h-3 absolute right-0 top-0 rounded-full bg-red-500"
              ></span>
            );
          }
        })}
      </div>
      <NotificationContainer
        isOpen={notificationIsOpen}
        setIsOpen={setNotificationIsOpen}
        notifications={notifications}
      />
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-gray-100"
      >
        {/* Verifique se profile.profile é uma STRING (URL). Se for objeto, o erro 310 ocorre aqui */}
        {profile !== null ? (
          <Avatar
            src={typeof profile.photoURL === "string" ? profile.photoURL : ""}
            fallback="U"
          />
        ) : (
          <Avatar
            src={typeof user?.photoURL === "string" ? user?.photoURL : ""}
            fallback="U"
          />
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-12 w-48 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
          <Link
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            href={`/app/profile/${profile?.slug || user?.email}`}
            onClick={() => setOpen(false)}
          >
            <MdAccountCircle className="text-[18px]" />
            Meu Perfil
          </Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
