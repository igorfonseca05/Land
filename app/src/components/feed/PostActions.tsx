"use client";

import { doc, runTransaction, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { MdChatBubble, MdFavorite, MdShare } from "react-icons/md";
import { auth, db } from "@/app/config/firebase";
import { LikeButton } from "./LikeButton";
import { SavePost } from "./savePost";
import { getAuth } from "firebase/auth";
import { PostProps } from "./FeedCard";
import { PostSchemaType } from "@/app/utils/zod";
import { useAuth } from "../../context/useAuthContext";

export function PostActions({ ...props }: {id: string, likesCount: number | undefined } ) {
    const {user} = useAuth()
  return (
    <>
        <>
          <hr className="text-neutral-100"  />
          <div className={`${user? `flex justify-between items-center p-4 md:p-4`: `flex justify-between items-center p-4 md:p-4 opacity-50 pointer-events-none`}`}>
            <div className="flex gap-4 items-center text-lg">
              <LikeButton postId={props.id} likesCount={props.likesCount} />
              <MdShare />
            </div>
            <SavePost postId={props.id} />
          </div>
        </>
    </>
  );
}
