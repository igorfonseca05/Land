'use client'

import { doc, runTransaction, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { MdChatBubble, MdFavorite } from "react-icons/md";
import { auth, db } from "@/app/config/firebase";

export function PostActions({uid}: {uid?: string | undefined}) {

    const [likes, setLikes] = useState(2)

    async function handleLike() {
        if(!uid) return

        await runTransaction(db, async (transation) => {
            const docAds = doc(db, 'ads', uid)
            const feedDoc = doc(db, 'feeds', uid)
        })

    }   


  return (
    <div className="flex gap-2 text-neutral-500">
      <button className="flex items-center gap-1">
        <MdFavorite />
        {likes}
      </button>
      <button className="flex items-center gap-1">
        <MdChatBubble />5
      </button>
    </div>
  );
}
