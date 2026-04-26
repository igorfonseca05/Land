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
// import { Ad } from "../../profile/[slug]/page";
import { PostProps } from "../../profile/[slug]/criar-anuncio/components/Form";
import { UserProfile } from "firebase/auth";
import { useSearchPost } from "@/app/src/context/usePostContext";
import { SearchPostCard } from "@/app/src/components/feed/SearchPost";
import { NoFeedItem } from "./NoFeedItem";
import Link from "next/link";
import { PostSchema, PostSchemaType, PostSearchSchemaType } from "@/app/utils/zod";
import { SearchCard } from "@/app/src/components/feed/SearchCard";
import { LoadingCards } from "./LoadingCards";
import { useAuth } from "@/app/src/context/useAuthContext";
import { GlobalSpinner } from "@/app/src/components/globalSpinner/GlobalSpinner";

export function Posts() {
  const {user, loading: userLoading} = useAuth()
  const { searchPost, postLoading } = useSearchPost();
  const [posts, setPosts] = useState<PostSchemaType[]>([]);
  const [owner, setOwner] = useState<{ [key: string]: UserProfile }>({});
  const [inlinePost, setInlinePost] = useState<PostSearchSchemaType | null>(null);
  const [loading, setLoading] = useState(true);

  const thereIsNoFeedItem = !inlinePost && posts.length === 0;

  useEffect(() => {
    async function getPosts() {
      // setLoading(true);

      const q = query(
        collection(db, "ads"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      const allDocs = await getDocs(q);

      const posts = allDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PostSchemaType, "id">),
      }));

      // const userIds = [...new Set(posts.map((f) => f.userId))];

      // if (!Array.isArray(userIds) || userIds.length === 0) {
      //   setLoading(false);
      //   return;
      // }

      // const usersQuery = query(
      //   collection(db, "users"),
      //   where(documentId(), "in", userIds),
      // );

      // const usersSnap = await getDocs(usersQuery);

      // const usersMap = Object.fromEntries(
      //   usersSnap.docs.map((doc) => [doc.id, doc.data()]),
      // );
      setPosts(posts);
      // setOwner(usersMap);
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
          userName={user?.displayName}
          isPosting={postLoading} // vindo do contexto
        />
      )}

      {loading ? (
        <LoadingCards />
      ) : thereIsNoFeedItem ? (
        <NoFeedItem />
      ) : (
        posts.map((doc, i) => {
          // const userData = owner[doc.userId];
          return (
            <article
              key={doc.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden"
            >
              <FeedCard
                id={doc.id}
                userId={doc.userId}
                // author={userData?.name as string}
                // img={userData?.photoURL as string}
                // publicId={userData?.publicId as string}
                location={doc.location}
                createdAt={doc.createdAt}
                description={doc.description}
                images={doc.images}
                details={doc.details}
                type={doc.type}
                title={doc.title}
                features={doc.features}
                likesCount={doc.likesCount}
                status={doc.status}
                userSnapShot = {doc.userSnapShot}
              />
            </article>
          );
        })
      )}

      {/* <SponsoredCard /> */}
    </div>
  );
}
