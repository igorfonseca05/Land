import {
  MdBookmark,
  MdCheckCircle,
  MdMoreHoriz,
  MdSearch,
  MdShare,
} from "react-icons/md";
import { Avatar } from "../ui/Avatar";
import { formatFirebaseTime } from "@/app/utils/functions";
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

export type PostProps = {
  author: string;
  location: string;
  createdAt: Timestamp | FieldValue;
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
  features: object;
  likesCount?: number | undefined;
};

export function FeedCard({...props}: PostProps) {
  return (
    <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {props.type === "search" ? (
        <SearchCard props={props}/>
      ) : (
        <Link href={`/app/feed/${`${props.title}-${props.postId}`}`}>
          <div className="p-2 md:p-4 flex justify-between ">
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
            <MdMoreHoriz></MdMoreHoriz>
          </div>

          <p className="px-2 md:px-4 pb-3 text-sm text-neutral-700">
            {props.description}
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
              {Array.isArray(props.images) &&
                props.images.map((url, i) => (
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
            {props.type === "sell" && (
              <div className="absolute bottom-3 left-3 flex gap-2 z-1">
                <span className="bg-black/70 font-bold flex items-center gap-x-1 text-white text-sm px-3 py-1 rounded-lg">
                  <FaMoneyBill className="text-green-400" size={18} />
                  {props.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  })}
                </span>

                <span className="bg-black/70 font-bold flex items-center text-white text-sm px-3 py-1 rounded-lg">
                  <BiSolidArea className="text-green-400" size={18} />
                  {props.unit === "ha" && props.size === 1 && "1 hectare"}
                  {props.unit === "ha" && props.size > 1 && `${props.size} hectares`}
                  {props.unit === "acre" && props.size === 1 && "1 acre"}
                  {props.unit === "sqm" && `${props.size}m²`}
                </span>
              </div>
            )}
          </div>
        </Link>
      )}
    </article>
  );
}
