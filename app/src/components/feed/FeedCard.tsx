import {
  MdCheckCircle,
  MdMoreHoriz,
  MdSearch,
  MdSell,
  MdShare,
} from "react-icons/md";
import { Avatar } from "../ui/Avatar";
import { formatFirebaseTime, getUpperCaseLatter } from "@/app/utils/functions";
import { FieldValue, Timestamp } from "firebase/firestore";
import { FaMoneyBill } from "react-icons/fa6";
import { BiSolidArea } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.css";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { PostSchemaType } from "@/app/utils/zod";
import { PostActions } from "./PostActions";
import { useProfileContext } from "../../context/userProfileContext";
import { useAuth } from "../../context/useAuthContext";
export type PostProps = PostSchemaType;

// export function FeedCard({ ...props }: PostProps) {
//   const postHasImages = Array.isArray(props.images) && props.images.length > 1;
//   const postHasOneImage = props.images?.length === 1;

//   const isDesabled = props.type === "search";

//   return (
//     <Link
//       href={isDesabled ? "#" : `${`/app/ads/${`${props.title}-${props.id}`}`}`}
//     >
//       <div className="p-4 md:p-6 ">
//         {/* Header */}
//         <div className="flex justify-between pb-3 ">
//           <div className="flex gap-3">
//             <Avatar src={props.img} fallback={props.author.split(/\s+/)[0]} />
//             <div>
//               <p className="font-bold text-sm capitalize">
//                 {props.author.split(/\s+/)[0]}
//               </p>
//               <p className="text-[clamp(10px,1vw,18px)] text-neutral-500 ">
//                 {/* <span className="capitalize">{location ? location : ""}</span> •{" "} */}
//                 Postado {formatFirebaseTime(props.createdAt)}
//               </p>
//             </div>
//           </div>

//           {/* Indicador tipo do anuncio */}
//           <div className="flex gap-4 items-center">
//             {props.type === "search" ? (
//               <>
//                 <span
//                   className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm
//                   font-semibold bg-green-50 text-green-800"
//                 >
//                   <MdSearch />
//                   <span className="hidden sm:block">Busca</span>
//                 </span>
//               </>
//             ) : (
//               <>
//                 <span
//                   className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm
//                   font-semibold bg-yellow-100 text-yellow-600"
//                 >
//                   <MdSell />
//                   <span className="hidden sm:block">Venda</span>
//                 </span>
//               </>
//             )}
//             <MdMoreHoriz></MdMoreHoriz>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="space-y-4">
//           <p
//             className={`${
//               props.title && props.type === "search"
//                 ? "font-h2 text-xl mb-md"
//                 : "text-md  font-semibold"
//             }`}
//           >
//             {getUpperCaseLatter(props.title)}
//           </p>

//           <p className="text-[clamp(14px,1.2vw,18px)] text-neutral-600 leading-relaxed ">
//             {props.description}
//           </p>

//           {props.type === "search" && (
//             <>
//               {/* <p className="text-neutral-700 text-sm font-semibold py-2">
//                 Requisitos
//               </p> */}
//               <div className="flex flex-wrap gap-4 text-neutral-900">
//                 {props.features.map((item, i) => (
//                   <div className="flex items-center gap-0" key={i}>
//                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
//                       <MdCheckCircle className="text-green-500" />
//                       <span className="text-[clamp(12px,1vw,18px)] font-label-md text-secondary">
//                         {item}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="relative w-full">
//         {postHasImages ? (
//           <Swiper
//             modules={[Navigation]}
//             navigation
//             loop
//             slidesPerView={1}
//             spaceBetween={20}
//             className="select-none"
//           >
//             {props.images?.map((url, i) => (
//               <SwiperSlide key={i}>
//                 <div className="relative w-full aspect-video">
//                   <Image src={url} alt="Slide" fill className="object-cover" />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : postHasOneImage ? (
//           <div className="relative w-full aspect-video">
//             <Image
//               src={`${props.images ?? [0]}`}
//               alt="Slide"
//               fill
//               sizes="(max-width: 768px) 100vw, 50vw"
//               className="object-cover"
//             />
//           </div>
//         ) : (
//           <></>
//         )}

//         {/* Badges */}
//         {props.type === "sale" && (
//           <div className="absolute bottom-16 left-3 flex gap-2 z-1">
//             <span className="bg-black/70 font-bold flex items-center gap-x-1 text-white text-sm px-3 py-1 rounded-lg">
//               <FaMoneyBill className="text-green-400" size={18} />
//               {props.details?.price &&
//                 props.details?.price.toLocaleString("pt-BR", {
//                   style: "currency",
//                   currency: "BRL",
//                   minimumFractionDigits: 0,
//                 })}
//             </span>

//             <span className="bg-black/70 font-bold flex items-center text-white text-sm px-3 py-1 rounded-lg">
//               <BiSolidArea className="text-green-400" size={18} />
//               {props.details?.unit === "ha" &&
//                 props.details.landSize === 1 &&
//                 "1 hectare"}
//               {props.details?.unit === "ha" &&
//                 props.details.landSize > 1 &&
//                 `${props.details.landSize} hectares`}
//               {props.details?.unit === "acre" &&
//                 props.details.landSize === 1 &&
//                 "1 acre"}
//               {props.details?.unit === "sqm" && `${props.details.landSize}m²`}
//             </span>
//           </div>
//         )}
//         <PostActions id={props.id} likesCount={props.likesCount} />
//       </div>
//     </Link>
//   );
// }

export function FeedCard({ ...props }: PostProps) {
  const {profile} = useProfileContext()
  const {user} = useAuth()
  const postHasImages = Array.isArray(props.images) && props.images.length > 1;
  const postHasOneImage = props.images?.length === 1;

  const isDesabled = props.type === "search";

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 md:p-5">
        {/* HEADER */}
        <Link href={`#`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={props.userSnapShot.photoURL && props.userSnapShot.photoURL}
              fallback={props.userSnapShot.displayName.split(/\s+/)[0]}
            />

            <div>
              <p className="text-sm font-semibold capitalize">
                {props.userSnapShot.displayName.split(/\s+/)[0]}
              </p>
              <p className="text-xs text-gray-400">
                Postado {formatFirebaseTime(props.createdAt)}
              </p>
            </div>
          </div>

          <MdMoreHoriz className="text-gray-400 text-xl" />
        </div>
        </Link>

        <Link
          href={isDesabled ? "#" : `/app/ads/${props.title}-${props.id}`}
          className="block"
        >
          <>
            {/* TITLE */}
            <h2
              className={`${
                props.type === "search"
                  ? "text-lg font-semibold mb-3"
                  : "text-base font-semibold mb-2"
              }`}
            >
              {getUpperCaseLatter(props.title)}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {props.description}
            </p>

            {/* FEATURES (search only) */}
            {props.type === "search" && (
              <div className="flex flex-wrap gap-2 mb-4">
                {props.features.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
                  >
                    <MdCheckCircle className="text-green-500 text-sm" />
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* IMAGE */}
            {(postHasImages || postHasOneImage) && (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-100 mb-4 relative">
                {postHasImages ? (
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    loop
                    slidesPerView={1}
                  >
                    {props.images?.map((url, i) => (
                      <SwiperSlide key={i}>
                        <div className="relative w-full h-84">
                          <Image
                            src={url}
                            alt="Slide"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Image
                    src={`${props.images?.[0]}`}
                    alt="Imagem"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}

                {/* BADGES */}
                {props.type === "sale" && (
                  <div className="absolute bottom-3 left-3 flex gap-2 z-2">
                    {props.details?.price && (
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                        <FaMoneyBill className="text-green-400" />
                        {props.details.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    )}

                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <BiSolidArea className="text-green-400" />
                      {props.details?.unit === "ha" &&
                        (props.details.landSize === 1
                          ? "1 hectare"
                          : `${props.details.landSize} hectares`)}

                      {props.details?.unit === "acre" &&
                        (props.details.landSize === 1
                          ? "1 acre"
                          : `${props.details.landSize} acres`)}

                      {props.details?.unit === "sqm" &&
                        `${props.details.landSize}m²`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        </Link>
        {/* DIVIDER */}
        <hr className="border-gray-100 mb-2" />

        {/* ACTIONS */}
        <div className="flex h-6 flex-1 tems-center justify-between">
          <PostActions id={props.id} likesCount={props.likesCount} />
        </div>
      </div>
    </article>
  );
}
