import {
  MdChatBubble,
  MdCurrencyExchange,
  MdDetails,
  MdFavorite,
  MdMoney,
  MdMoreHoriz,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatFirebaseTime } from "@/app/utils/functions";
import { FieldValue, Timestamp } from "firebase/firestore";
import { FaMoneyBill } from "react-icons/fa6";
import { BiSolidArea } from "react-icons/bi";
import { auth } from "@/app/config/firebase";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.css";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { UserProfile } from "firebase/auth";
import { PostActions } from "./PostActions";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

type Props = {
  author: string;
  location: string;
  time: Timestamp | FieldValue;
  description: string;
  images: string[];
  price: number;
  size: number;
  unit: string;
  img: string;
  type: string;
  uid: string | undefined;
  publicId: string | undefined;
  title: string;
  postId: string;
  features: object
};

export function FeedCard({
  uid,
  author,
  location,
  time,
  description,
  images,
  price,
  size,
  unit,
  img,
  type,
  publicId,
  title,
  postId,
  features
}: Props) {
  return (
    <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <Link href={`/app/feed/${`${title}-${postId}`}`}>
        <div className="p-2 md:p-4 flex justify-between ">
          <div className="flex gap-3">
            <Avatar src={img} fallback={author.split(/\s+/)[0]} />
            <div>
              <p className="font-bold text-sm capitalize">
                {author.split(/\s+/)[0]}
              </p>
              <p className="text-xs text-neutral-500 ">
                {/* <span className="capitalize">{location ? location : ""}</span> •{" "} */}
                Postado há {formatFirebaseTime(time)}
              </p>
            </div>
          </div>
          <MdMoreHoriz></MdMoreHoriz>
        </div>
        {title && (
          <p className="px-2 md:px-4 pb-3 text-xl text-neutral-900">{title}</p>
        )}
        <p className="px-2 md:px-4 pb-3 text-sm text-neutral-700">
          {description}
        </p>
        <p className="px-2 md:px-4 pb-3 text-sm text-neutral-700">
          {Object.keys(features).map((item, i) => (
            <span className="inline-block" key={i}>{item}</span>
          ))}
        </p>
        
        

        <div className="relative max-w-155">
          <Swiper
            modules={[Navigation]}
            navigation
            loop
            slidesPerView={1}
            spaceBetween={20}
            className="select-none"
          >
            {Array.isArray(images) &&
              images.map((url, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full aspect-video">
                    <Image
                      src={url}
                      alt="Slide"
                      fill
                      className="object-cover rounded-xl sm:rounded-sm"
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Badges */}
          {type === "sell" && (
            <div className="absolute bottom-3 left-3 flex gap-2 z-1">
              <span className="bg-black/70 font-bold flex items-center gap-x-1 text-white text-sm px-3 py-1 rounded-lg">
                <FaMoneyBill className="text-green-400" size={18} />
                {price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                })}
              </span>

              <span className="bg-black/70 font-bold flex items-center text-white text-sm px-3 py-1 rounded-lg">
                <BiSolidArea className="text-green-400" size={18} />
                {unit === "ha" && size === 1 && "1 hectare"}
                {unit === "ha" && size > 1 && `${size} hectares`}
                {unit === "acre" && size === 1 && "1 acre"}
                {unit === "sqm" && `${size}m²`}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
