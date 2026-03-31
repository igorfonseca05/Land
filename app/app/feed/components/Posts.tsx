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
import { SearchCard } from "@/app/src/components/feed/SearchCard";
import { LoadingCards } from "./LoadingCards";

export function Posts() {
  // if(!auth.currentUser) return
  const { searchPost, postLoading } = useSearchPost();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [owner, setOwner] = useState<{ [key: string]: UserProfile }>({});
  const [inlinePost, setInlinePost] = useState<PostSchema | null>(null);
  const [loading, setLoading] = useState(false);
  
  const thereIsNoFeedItem = !inlinePost && posts.length === 0

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
        <LoadingCards />
      ) : thereIsNoFeedItem ? (
        <NoFeedItem />
      ) : (
        posts.map((doc, i) => {

          console.log(doc)

          return doc.type === "search" ? (
            <article  key={i} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <SearchCard
                key={i}
                postId={doc.id}
                uid={owner[doc.userId].uid as string}
                author={owner[doc.userId].name as string}
                img={owner[doc.userId].profile as string}
                publicId={owner[doc.userId].publicId as string}
                location={doc.location?.city ?? ""}
                createdAt={doc.createdAt}
                description={doc.description}
                images={doc.imgs}
                price={doc.details?.price ?? 0}
                size={doc.details?.landSize ?? 0}
                unit={doc.details?.unit ?? ""}
                type={doc.type}
                title={doc.title}
                features={doc.features}
                likesCount={doc.likesCount}
              />
            </article>
          ) : (
            <article
              key={i}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden"
            >
              <FeedCard
                postId={doc.id}
                uid={owner[doc.userId].uid as string}
                author={owner[doc.userId].name as string}
                img={owner[doc.userId].profile as string}
                publicId={owner[doc.userId].publicId as string}
                location={doc.location?.city ?? ""}
                createdAt={doc.createdAt}
                description={doc.description}
                images={doc.imgs}
                price={doc.details?.price}
                size={doc.details?.landSize ?? 0}
                unit={doc.details?.unit ?? ""}
                type={doc.type}
                title={doc.title}
                features={doc.features}
                likesCount={doc.likesCount}
              />
            </article>
          );
        })
      )}

      {/* <SponsoredCard /> */}
    </div>
  );
}
