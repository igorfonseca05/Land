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


export function SavePost({ postId }: { postId: string }) {
  const [postMarker, setPostMarker] = useState(false);

  useEffect(() => {
    async function getSavedDocs() {
      if (!auth.currentUser?.uid) return;
      const postRef = doc(db, "users", auth.currentUser.uid, "saved", postId);

      const isSaved = await getDoc(postRef);

      if (isSaved.exists()) {
        setPostMarker(true);
      }
    }

    getSavedDocs()
  }, []);

  async function handleSavePost() {
    if (!auth.currentUser?.uid) return;
    const postRef = doc(db, "users", auth.currentUser.uid, "saved", postId);

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

  return (
    <div>
      <MdBookmark
        onClick={handleSavePost}
        className={`${postMarker ? "text-yellow-500" : ""}`}
      />
    </div>
  );
}
