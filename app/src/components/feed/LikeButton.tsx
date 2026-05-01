"use client";

import { useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";
import {
  doc,
  runTransaction,
  getDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";
import { useAuth } from "../../context/useAuthContext";
import { createNotification, getFirstName, getUpperCaseLatter } from "@/app/utils/functions";

export function LikeButton({
  postId,
  likesCount = 0,
  userId,
}: {
  postId: string;
  likesCount?: number;
  userId: string;
}) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(likesCount);
  const [hasLiked, setHasLiked] = useState(false);

  // console.log(postId)

  useEffect(() => {
    if (!user) return;

    async function checkIfLiked() {
      const likeRef = doc(db, "ads", postId, "likes", user?.uid!);
      const snap = await getDoc(likeRef);
      setHasLiked(snap.exists());
    }

    checkIfLiked();
  }, [postId, user]);

  async function handleLike() {
    if (!user) return;

    const postRef = doc(db, "ads", postId);
    const likeRef = doc(db, "ads", postId, "likes", user.uid);

    await runTransaction(db, async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (likeDoc.exists()) {
        // unlike
        transaction.delete(likeRef);
        transaction.update(postRef, {
          likesCount: increment(-1),
        });

        setLikes((prev) => prev - 1);
        setHasLiked(false);
      } else {
        // like
        transaction.set(likeRef, {
          userId,
          createdAt: serverTimestamp(),
        });

        transaction.update(postRef, {
          likesCount: increment(1),
        });

        setLikes((prev) => prev + 1);
        setHasLiked(true);

        createNotification({
          fromUserId: user.uid,
          toUserId: userId,
          message: `${getUpperCaseLatter(getFirstName(user.displayName))} curtiu seu anúncio`,
          type: "like",
          postId
        });
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-1 select-none">
      <MdFavorite
        onClick={handleLike}
        className={`cursor-pointer ${
          hasLiked ? "text-red-500" : "text-gray-400"
        }`}
      />
      <span className="text-sm">{likes}</span>
    </div>
  );
}
