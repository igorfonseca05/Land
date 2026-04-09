"use client";

import {
  MdAspectRatio,
  MdCampaign,
  MdChatBubble,
  MdDelete,
  MdEdit,
  MdMoreHoriz,
  MdMoreVert,
} from "react-icons/md";
import { formatFirebaseTime } from "@/app/utils/functions";
import { useProfileContext } from "@/app/src/context/userProfileContext";
import Image from "next/image";
import { EditPostModal } from "./dropdown";
import { PostSchemaType } from "@/app/utils/zod";
import { PostActions } from "@/app/src/components/feed/PostActions";

export function Cards({ infos }: { infos: PostSchemaType }) {
  const { profile } = useProfileContext();

  if (!profile) return null;

  return (
    <article className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 ">
      {/* Header */}
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={profile?.profile || "/place.webp"}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover bg-neutral-200"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 capitalize dark:text-white">
              {profile?.name.trim().split(/\s+/)[0]}
            </span>
            <span className="text-xs text-neutral-500">
              {infos.createdAt && formatFirebaseTime(infos.createdAt)} ·{" "}
              <span className="capitalize">{infos.location?.city ?? ""}</span>,{" "}
              {infos.location?.state ?? ""}
            </span>
          </div>
        </div>

        {/* Actions */}
        {/* <button className="flex h-full">
          <MdMoreHoriz size={18} />
        </button> */}
        <EditPostModal infos={infos} />
      </div>
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {infos.description}
        </p>
      </div>
      {/* Image */}
      {Array.isArray(infos.images) && infos.type === "sale" && (
        <div className="w-full bg-neutral-100 relative dark:bg-neutral-800">
          <Image
            src={infos.images[0] ?? ""}
            alt="Post image"
            width={1200}
            height={400}
            className="w-full max-h-95 object-cover"
          />
          {/* Extra Info (price / details – preparado) */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {" "}
            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              R$ {infos.details?.price.toLocaleString("pt-BR")}{" "}
            </div>{" "}
            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
              <MdAspectRatio className="text-green-400" />{" "}
              {infos.details?.landSize} {infos.details?.unit}{" "}
            </div>{" "}
          </div>
        </div>
      )}
      <PostActions
        id={infos.id}
        likesCount={infos.likesCount}
      />
    </article>
  );
  //   <div className="flex flex-col gap-4">
  //     {/* Exemplo de card */}
  //     <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:border-green-400 transition-colors">
  //       <div className="p-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
  //         <div className="flex items-center gap-2">
  //           <span className={`w-2 h-2 rounded-full ${infos.status === 'active'? 'bg-green-500' : 'bg-red-500'}`}></span>
  //           <span className={`text-xs font-bold  uppercase tracking-wider ${infos.status === 'active'? 'text-green-500' : 'text-red-500'}`}>
  //             {infos.status === 'active'? 'Ativo' : 'Desativado'}
  //           </span>
  //           <span className="text-gray-300">•</span>
  //           <span className="text-xs text-gray-500">
  //             {formatFirebaseTime(infos.createdAt)}
  //           </span>
  //         </div>
  //         <div className="flex items-center gap-1">
  //           {/* <span className="text-xs text-gray-400 font-mono">ID: {infos.id}</span> */}
  //           <button className="text-gray-400 hover:text-gray-900 p-1 rounded-full">
  //             <MdMoreVert />
  //           </button>
  //         </div>
  //       </div>

  //       <div className="flex flex-col sm:flex-row">
  //         <div className="sm:w-2/5 relative cursor-pointer overflow-hidden">
  //           {infos?.imgs?.length > 0 && (
  //             <img
  //               src={infos.imgs[0]}
  //               alt="Land Preview"
  //               className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
  //             />
  //           )}
  //           <div className="absolute bottom-2 left-2 flex gap-1">
  //             <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
  //               R$ {infos.details.price}
  //             </div>
  //             <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
  //               <MdAspectRatio /> {infos.details.landSize} {infos.details.unit}
  //             </div>
  //           </div>
  //         </div>

  //         <div className="p-4 flex-1 flex flex-col justify-between">
  //           <div>
  //             <h3 className="font-bold text-lg text-gray-900 mb-1">
  //               {infos.details.title.slice(0, 1).toUpperCase() +
  //                 infos.details.title.slice(1)}
  //             </h3>
  //             <p className="text-xs text-gray-500 mb-2">
  //               {infos.location.city}, {infos.location.state}{" "}
  //               {infos.details.type}
  //             </p>
  //             <p className="text-sm text-gray-600 line-clamp-2 mb-4">
  //               {infos.description}
  //             </p>
  //             {/* <div className="flex gap-4 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
  //               <div className="flex flex-col items-center flex-1 border-r border-gray-200">
  //                 <span className="text-xs text-gray-400 uppercase font-bold">
  //                   Views
  //                 </span>
  //                 <span className="text-sm font-bold text-gray-900">1,240</span>
  //               </div>
  //               <div className="flex flex-col items-center flex-1 border-r border-gray-200">
  //                 <span className="text-xs text-gray-400 uppercase font-bold">
  //                   Saves
  //                 </span>
  //                 <span className="text-sm font-bold text-gray-900">42</span>
  //               </div>
  //               <div className="flex flex-col items-center flex-1">
  //                 <span className="text-xs text-gray-400 uppercase font-bold">
  //                   Leads
  //                 </span>
  //                 <span className="text-sm font-bold text-green-500">5</span>
  //               </div>
  //             </div> */}
  //           </div>

  //           <div className="flex gap-2 mt-auto">
  //             <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors shadow-sm">
  //               <MdEdit /> Edit
  //             </button>
  //             {/* <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors shadow-sm">
  //               <MdCampaign /> Boost
  //             </button> */}
  //             <button
  //               className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-400 transition-colors"
  //               title="Delete Listing"
  //             >
  //               <MdDelete />
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </article>
  //   </div>
  // );
}
