"use client";

import { MdBookmark } from "react-icons/md";
import { db, auth } from "@/app/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuthContext";


export function SavePost({ postId }: { postId: string }) {
  const {user} = useAuth()
  const [postMarker, setPostMarker] = useState(false);

  async function handleSavePost() {
    if (!user?.uid) return;
    const postRef = doc(db, "users", user.uid, "saved", postId);

    const post = await getDoc(postRef);

    if (post.exists()) {
      await deleteDoc(postRef);
      setPostMarker(false);
    } else {
      await setDoc(postRef, {
        id: postId,
        createdAt: serverTimestamp(),
      });
      setPostMarker(true);
    }
  }

  useEffect(() => {
    async function getSavedDocs() {
      if (!user?.uid) return;
      const postRef = doc(db, "users", user.uid, "saved", postId);

      const isSaved = await getDoc(postRef);

      if (isSaved.exists()) {
        setPostMarker(true);
      }
    }

    getSavedDocs()
  }, []);


  return (
    <div>
      <MdBookmark
        onClick={handleSavePost}
        className={`${postMarker ? "text-yellow-500" : ""}`}
      />
    </div>
  );
}
