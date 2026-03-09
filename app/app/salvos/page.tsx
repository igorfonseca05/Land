"use client";

import { auth, db } from "@/app/config/firebase";
import { PostProps } from "@/app/src/components/feed/FeedCard";
import { LikeButton } from "@/app/src/components/feed/LikeButton";
import { SavePost } from "@/app/src/components/feed/savePost";
import { SearchCard } from "@/app/src/components/feed/SearchCard";
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

      setSaved(ads);
    }

    getSavedDocs();
  }, []);

  return (
    <div>
      <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {saved.map((item, i) => (
          <div key={i}>
            {item.type === "search" ? (
              <SearchCard  props={item}/>
            ) : (
              <p>oi</p>
            )}
          </div>
        ))}
      </article>
    </div>
  );
}
