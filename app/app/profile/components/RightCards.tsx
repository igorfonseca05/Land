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
  const { user } = useAuth();
  const { profile } = useProfileContext();
  const [isOpen, setIsOpen] = useState(false);

  const hasActivities = null;

  const itensToVerify = [
    {
      id: 1,
      message: "Foto de perfil",
      condition: profile?.photoURL || user?.photoURL || '',
      icon: MdCheckCircle,
    },
    {
      id: 2,
      message: "Endereço de email verificado",
      condition: user?.emailVerified || "",
      icon: MdCheckCircle,
    },
    {
      id: 3,
      message: "Adicionar número para contato",
      condition: profile?.phone || user?.phoneNumber || '',
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
          </div>

          <button
            className="w-full mt-5 py-2 text-sm text-gray-900 bg-gray-100 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            Complete Profile
          </button>
        </div>

        {/* Card 2: Atividade recente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </h3>

          {hasActivities ? (
            <div className="flex flex-col gap-4">
              {/* {activities.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))} */}
            </div>
          ) : (
            // 🔻 EMPTY STATE
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <MdVisibility size={20} className="text-gray-400" />
              </div>

              <p className="text-sm font-medium text-gray-700">
                Nenhuma atividade recente
              </p>

              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
               Quando pessoas interagirem com seus posts, elas aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RightSideCards;
