"use client";

import { auth, db } from "@/app/config/firebase";
import { FeedCard } from "@/app/src/components/feed/FeedCard";
import { SponsoredCard } from "@/app/src/components/feed/SponsoredCard";
import {
  collection,
  DocumentData,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Ad } from "../../profile/[slug]/page";
import { PostProps } from "../../profile/[slug]/criar-anuncio/components/Form";
import { UserProfile } from "firebase/auth";
import { useSearchPost } from "@/app/src/context/usePostContext";
import { SearchPostCard } from "@/app/src/components/feed/SearchPost";
import NoFeedItem from "./NoFeedItem";
import Link from "next/link";
import { PostSchema } from "@/app/utils/zod";

export function Posts() {
  // if(!auth.currentUser) return
  const { searchPost, postLoading } = useSearchPost();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [owner, setOwner] = useState<{ [key: string]: UserProfile }>({});
  const [inlinePost, setInlinePost] = useState<PostSchema | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);

      const q = query(
        collection(db, "ads"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      const allDocs = await getDocs(q);

      const posts = allDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PostProps, "id">),
      }));

      const userIds = [...new Set(posts.map((f) => f.userId))];

      if (!Array.isArray(userIds) || userIds.length === 0) {
        setLoading(false);
        return;
      }

      const usersQuery = query(
        collection(db, "users"),
        where(documentId(), "in", userIds),
      );

      const usersSnap = await getDocs(usersQuery);

      const usersMap = Object.fromEntries(
        usersSnap.docs.map((doc) => [doc.id, doc.data()]),
      );
      setPosts(posts);
      setOwner(usersMap);
      setLoading(false);
    }

    getPosts();
  }, []);

  useEffect(() => {
    setInlinePost(searchPost);
  }, [searchPost]);

  // console.log(postLoading)

  console.log(posts);

  return (
    <div className="space-y-4">
      {/* Arrows */}
      {inlinePost && (
        <SearchPostCard
          post={inlinePost}
          userName={auth.currentUser?.displayName}
          isPosting={postLoading} // vindo do contexto
        />
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <article
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="w-24 h-2 rounded bg-neutral-100 dark:bg-neutral-800" />
                </div>
              </div>

              {/* Text */}
              <div className="px-4 pb-3 space-y-2">
                <div className="w-full h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="w-5/6 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="w-2/3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>

              {/* Image */}
              <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800" />
            </article>
          ))}
        </div>
      ) : !inlinePost && posts.length === 0 ? (
        <NoFeedItem />
      ) : (
        posts.map((doc, i) => (
          <FeedCard
            key={i}
            postId={doc.id}
            // uid={owner[doc.userId].uid as string}
            author={owner[doc.userId].name as string}
            img={owner[doc.userId].profile as string}
            publicId={owner[doc.userId].publicId as string}
            location={doc.location?.city ?? ""}
            time={doc.createdAt}
            description={doc.description}
            images={doc.imgs}
            price={doc.details?.price ?? ""}
            size={doc.details?.landSize ?? ""}
            unit={doc.details?.unit ?? ""}
            type={doc.type}
            title={doc.title}
            features={doc.features}
            likesCount = {doc.likesCount}
          />
        ))
      )}

      {/* <SponsoredCard /> */}
    </div>
  );
}
