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
import { LikeButton } from "./LikeButton";
import { SavePost } from "./savePost";
import { getAuth } from "firebase/auth";
import { SearchCard } from "./SearchCard";
import { PostSchemaType } from "@/app/utils/zod";
import { PostActions } from "./PostActions";
export type PostProps = PostSchemaType & {
  author: string;
  img: string;
  userId: string;
  publicId: string;
};

export function FeedCard({ ...props }: PostProps) {
  const postHasImages = Array.isArray(props.images) && props.images.length > 1;
  const postHasOneImage = props.images?.length === 1;

  const isDesabled = props.type === 'search'

  console.log(props)

  return (
    <Link href={isDesabled? '#' : `${`/app/ads/${`${props.title}-${props.id}`}`}`}>
      <div className="p-2 md:p-4 ">
        {/* Header */}
        <div className="flex justify-between pb-3 ">
          <div className="flex gap-3">
            <Avatar src={props.img} fallback={props.author.split(/\s+/)[0]} />
            <div>
              <p className="font-bold text-sm capitalize">
                {props.author.split(/\s+/)[0]}
              </p>
              <p className="text-xs text-neutral-500 ">
                {/* <span className="capitalize">{location ? location : ""}</span> •{" "} */}
                Postado há {formatFirebaseTime(props.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {props.type === "search" ? (
              <>
                <span
                  className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm 
                  font-semibold bg-green-50 text-green-800"
                >
                  <MdSearch />
                  Busca
                </span>
              </>
            ) : (
              <>
                <span
                  className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm 
                  font-semibold bg-yellow-100 text-yellow-600"
                >
                  <MdSell />
                  Venda
                </span>
              </>
            )}
            <MdMoreHoriz></MdMoreHoriz>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-1">
          <p
            className={`${
              props.title && props.type === "search"
                ? "text-xl font-semibold text-neutral-900"
                : "text-md text-neutral-900 font-semibold"
            }`}
          >
            {getUpperCaseLatter(props.title)}
          </p>

          <p className="text-sm text-neutral-900 leading-relaxed pt-3 ">
            {props.description}
          </p>

          {props.type === "search" && (
            <>
              <p className="text-neutral-700 text-sm font-semibold pt-3">
                Requisitos
              </p>
              <div className=" grid grid-cols-2 gap-4 text-sm text-neutral-900">
                {props.features.map((item, i) => (
                  <div className="flex items-center gap-2" key={i}>
                    <MdCheckCircle className="text-green-500" />
                    <span className="inline-block">{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full">
        {postHasImages ? (
          <Swiper
            modules={[Navigation]}
            navigation
            loop
            slidesPerView={1}
            spaceBetween={20}
            className="select-none"
          >
            {props.images?.map((url, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full aspect-video">
                  <Image src={url} alt="Slide" fill className="object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : postHasOneImage ? (
          <div className="relative w-full aspect-video">
            <Image
              src={`${props.images ?? [0]}`}
              alt="Slide"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <></>
        )}

        {/* Badges */}
        {props.type === "sale" && (
          <div className="absolute bottom-16 left-3 flex gap-2 z-1">
            <span className="bg-black/70 font-bold flex items-center gap-x-1 text-white text-sm px-3 py-1 rounded-lg">
              <FaMoneyBill className="text-green-400" size={18} />
              {props.details?.price &&
                props.details?.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                })}
            </span>

            <span className="bg-black/70 font-bold flex items-center text-white text-sm px-3 py-1 rounded-lg">
              <BiSolidArea className="text-green-400" size={18} />
              {props.details?.unit === "ha" &&
                props.details.landSize === 1 &&
                "1 hectare"}
              {props.details?.unit === "ha" &&
                props.details.landSize > 1 &&
                `${props.details.landSize} hectares`}
              {props.details?.unit === "acre" &&
                props.details.landSize === 1 &&
                "1 acre"}
              {props.details?.unit === "sqm" && `${props.details.landSize}m²`}
            </span>
          </div>
        )}
        <PostActions
               id={props.id}
               likesCount={props.likesCount}
             />
      </div>
    </Link>
  );
}
