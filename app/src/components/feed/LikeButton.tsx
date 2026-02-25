"use client";

import { useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";
import { updateDoc, increment, doc, runTransaction } from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";

export function LikeButton({ postId }: { postId: string }) {
  const [clicked, setClicked] = useState<string>("");
  const [likes, setLikes] = useState(0);
  const [operation, setOperation] = useState("add");

  async function likePost(postId: string, userId: string) {
    const postRef = doc(db, "ads", postId);
    const likeRef = doc(db, "ads", postId, "likes", userId);

    await runTransaction(db, async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (likeDoc.exists()) {
        throw new Error("Usuário já curtiu");
      }

      transaction.set(likeRef, {
        createdAt: new Date(),
      });

      transaction.update(postRef, {
        likesCount: increment(1),
      });
    });
  }

  async function unlikePost(postId: string, userId: string) {
    const postRef = doc(db, "posts", postId);
    const likeRef = doc(db, "posts", postId, "likes", userId);

    await runTransaction(db, async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (!likeDoc.exists()) {
        throw new Error("Usuário ainda não curtiu");
      }

      transaction.delete(likeRef);

      transaction.update(postRef, {
        likesCount: increment(-1),
      });
    });
  }

  async function incrementLike() {
    setClicked((prev) => {
      if (prev !== "") {
        return "";
      }
      return postId;
    });

    setLikes((prev) => {
      if (!auth.currentUser?.uid) return 0;

      if (operation === "remove") {
        unlikePost(clicked, auth.currentUser?.uid);
        setOperation("add");
        return prev - 1;
      }

      likePost(clicked, auth.currentUser?.uid);
      setOperation("remove");
      return prev + 1;
    });
  }

  return (
    <div className="inline-flex items-center gap-1 select-none">
      <MdFavorite
        onClick={incrementLike}
        className={`${postId === clicked && "text-red-500"}`}
      />
      <span className="text-sm">{likes}</span>
    </div>
  );
}
