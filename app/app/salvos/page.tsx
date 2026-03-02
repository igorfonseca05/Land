"use client";

import { auth, db } from "@/app/config/firebase";
import { PostProps } from "@/app/src/components/feed/FeedCard";
import { LikeButton } from "@/app/src/components/feed/LikeButton";
import { SavePost } from "@/app/src/components/feed/savePost";
import { Avatar } from "@/app/src/components/ui/Avatar";
import { formatFirebaseTime } from "@/app/utils/functions";
import { PostSchema } from "@/app/utils/zod";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSolidArea } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { MdCheckCircle, MdSearch } from "react-icons/md";

export default function Page() {
  const [saved, setSaved] = useState<DocumentData[] | PostProps[]>([]);

  useEffect(() => {
    async function getSavedDocs() {
      if (!auth.currentUser?.uid) return;
      const savedPosts = collection(db, "users", auth.currentUser.uid, "saved");

      const saved = await getDocs(savedPosts);

      const posts = saved.docs.map(async (item) => {
        const posts = doc(db, "ads", item.data().id);
        return await getDoc(posts);
      });

      const adsSnapshots = await Promise.all(posts);

      const ads = adsSnapshots
        .filter((doc) => doc.exists())
        .map((doc) => doc.data());

      console.log(ads);

      setSaved(ads);
    }

    getSavedDocs();
  }, []);

  return (
    <div>
      <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {saved.map((item) => (
          <div key={item.uid}>
            {item.type === "search" ? (
              <div className="p-2 md:p-6 space-y-2.5">
                <div className=" flex justify-between ">
                  <div className="flex gap-3">
                    {/* <Avatar src={item.img} fallback={item.author.split(/\s+/)[0]} /> */}
                    <div>
                      <p className="font-bold text-sm capitalize">
                        {/* {item.author.split(/\s+/)[0]} */}
                      </p>
                      <p className="text-xs text-neutral-500 ">
                        <span className="capitalize">
                          {item.location ? item.location : ""}
                        </span>{" "}
                        • Postado há {formatFirebaseTime(item.time)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm 
              font-semibold bg-green-50 text-green-800"
                  >
                    <MdSearch />
                    Busca
                  </span>
                </div>

                {item.title && (
                  <p className="text-xl font-semibold text-neutral-900">
                    {item.title}
                  </p>
                )}
                <p className="text-sm text-neutral-900 leading-relaxed ">
                  {item.description}
                </p>
                {/* <hr className="text-neutral-200"/> */}
                <p className="text-neutral-700 text-sm font-semibold">
                  Requisitos
                </p>
                <div className=" grid grid-cols-2 gap-4 text-sm text-neutral-900">
                  {Object.keys(item.features).map((item, i) => (
                    <div className="flex items-center gap-2" key={i}>
                      <MdCheckCircle className="text-green-500" />
                      <span className="inline-block">{item}</span>
                    </div>
                  ))}
                </div>
                <hr className="text-neutral-200" />
                <div className="flex justify-between items-center py-1">
                  <div className="flex gap-4 items-center">
                    {/* <LikeButton postId={postId} likesCount={likesCount}/> */}
                    {/* <MdShare /> */}
                  </div>
                  <SavePost postId={item.postId} />
                </div>
              </div>
            ) : (
              <Link href={`}`}>
                <div className="p-2 md:p-4 flex justify-between ">
                  <div className="flex gap-3">
                    {/* <Avatar src={item.img} fallback={item.author.split(/\s+/)[0]} /> */}
                    <div>
                      <p className="font-bold text-sm capitalize">
                        {/* {item.author.split(/\s+/)[0]} */}
                      </p>
                      <p className="text-xs text-neutral-500 ">
                        {/* <span className="capitalize">{location ? location : ""}</span> •{" "} */}
                        Postado há {formatFirebaseTime(item.time)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="px-2 md:px-4 pb-3 text-sm text-neutral-700">
                  {item.description}
                </p>

                <div className="relative max-w-155">
                  {/* <Swiper
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
            </Swiper> */}
                </div>
              </Link>
            )}
          </div>
        ))}
      </article>
    </div>
  );
}
