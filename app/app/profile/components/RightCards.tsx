"use client";

import { useAuth } from "@/app/src/context/useAuthContext";
import { useProfileContext } from "@/app/src/context/userProfileContext";
import React, { useState } from "react";
import {
  MdAttachMoney,
  MdCheckCircle,
  MdFavorite,
  MdVisibility,
} from "react-icons/md";

const profileLevels = {
  veryWeak: {
    label: "Muito fraco",
    text: "text-red-700",
    bg: "bg-red-100",
    marker: "0%",
  },
  weak: {
    label: "Fraco",
    text: "text-orange-700",
    bg: "bg-orange-100",
    marker: "25%",
  },
  regular: {
    label: "Regular",
    text: "text-yellow-700",
    bg: "bg-yellow-100",
    marker: "50%",
  },
  good: {
    label: "Bom",
    text: "text-green-700",
    bg: "bg-green-100",
    marker: "75%",
  },
  excellent: {
    label: "Excelente",
    text: "text-emerald-700",
    bg: "bg-emerald-100",
    marker: "100%",
  },
};

const RightSideCards = () => {
  const {user} = useAuth()
  const { profile } = useProfileContext();
  const [isOpen, setIsOpen] = useState(false);

  const itensToVerify = [
    {
      id: 1,
      message: "Foto de perfil",
      condition: profile?.profile || '',
      icon: MdCheckCircle,
    },
    {
      id: 2,
      message: "Endereço de email verificado",
      condition: user?.emailVerified || '',
      icon: MdCheckCircle,
    },
    {
      id: 3,
      message: "Adicionar número para contato",
      condition: profile?.phone || "",
      icon: MdCheckCircle,
    },
    {
      id: 4,
      message: "Adicionar localização",
      condition: profile?.location || "",
      icon: MdCheckCircle,
    },
    {
      id: 5,
      message: "Adicionar bios",
      condition: profile?.description || "",
      icon: MdCheckCircle,
    },
    {
      id: 6,
      message: "Conta Verificada",
      condition: profile?.profileVerified || "",
      icon: MdCheckCircle,
    },
  ];

  const conditions = itensToVerify.map((item) => item.condition);

  const marker = Math.floor(
    (conditions.filter(Boolean).length / conditions.length) * 100,
  );

  let level;
  if (marker < 20) level = profileLevels.veryWeak;
  else if (marker < 40) level = profileLevels.weak;
  else if (marker < 60) level = profileLevels.regular;
  else if (marker < 84) level = profileLevels.good;
  else level = profileLevels.excellent;


  return (
    <>
     {!profile ? null : (
       <div className="flex flex-col gap-6 w-full sticky -top-57">
        {/* Card 1: Profile Strength */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Força do Perfil</h3>

            <span
              className={`text-xs font-bold px-2 py-1 rounded ${level.text} ${level.bg}`}
            >
              {level.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ease-out bg-green-500`}
              style={{ width: `${marker}%` }}
            />
          </div>

          <div className="space-y-3">
            {itensToVerify.map(({ condition, message, icon: Icon, id }) => (
              <div
                key={id}
                className={`flex items-center gap-3 text-sm ${condition && "line-through text-gray-500 decoration-gray-400"}`}
              >
                {condition ? (
                  <Icon className="text-green-500 text-[18px]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                )}
                {message}
              </div>
            ))}
            {/* <div
              className={`${user?.emailVerified && "line-through text-gray-500 decoration-gray-400"} flex items-center gap-3 text-sm `}
            >
              {user?.emailVerified ? (
                <MdCheckCircle className="text-green-500 text-[18px]" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
              )}
              Endereço de email verificado
            </div> */}
            {/* <div
              className={`${user?.photoURL && "line-through text-gray-500 decoration-gray-400"} flex items-center gap-3 text-sm `}
            >
              {user?.photoURL ? (
                <MdCheckCircle className="text-green-500 text-[18px]" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
              )}
              Adicionar foto de perfil
            </div> */}
            {/* <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
              <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
              Adicionar numero para contato
            </div> */}
            {/* <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
              <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
              Conta verificada
            </div> */}
          </div>
          <button
            className="w-full mt-5 py-2 text-sm text-gray-900 bg-gray-100 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            Complete Profile
          </button>
        </div>

        {/* Card 2: Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MdVisibility size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-bold">John D.</span> viewed your listing
                  in Park County.
                </p>
                <p className="text-xs text-gray-500 mt-1">10 mins ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                <MdFavorite size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  Your listing is trending in Colorado!
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <MdAttachMoney size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  New offer received for Lake Lot.
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default RightSideCards;
