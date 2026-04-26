"use client";

import { auth, db } from "@/app/config/firebase";
import { FeedCard, PostProps } from "@/app/src/components/feed/FeedCard";
import { LikeButton } from "@/app/src/components/feed/LikeButton";
// import { SavedPostCard } from "@/app/src/components/feed/savedPostCard";
import { SavePost } from "@/app/src/components/feed/savePost";
import { SearchCard } from "@/app/src/components/feed/SearchCard";
import { SearchPostCard } from "@/app/src/components/feed/SearchPost";
import { GlobalSpinner } from "@/app/src/components/globalSpinner/GlobalSpinner";
import { Avatar } from "@/app/src/components/ui/Avatar";
import { useAuth } from "@/app/src/context/useAuthContext";
import { formatFirebaseTime } from "@/app/utils/functions";
import { PostSchema, PostSchemaType, Profile } from "@/app/utils/zod";
import {
  collection,
  doc,
  DocumentData,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

export default function Page() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<DocumentData[] | PostSchemaType[]>([]);
  // const [users, setUser] = useState<{ [key: string]: DocumentData }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSavedDocs() {
      if (!user?.uid) return;

      // setLoading(true);

      const savedPosts = collection(db, "users", user.uid, "saved");
      const saved = await getDocs(savedPosts);

      const posts = saved.docs.map(async (item) => {
        const posts = doc(db, "ads", item.data().id);
        return await getDoc(posts);
      });

      const adsSnapshots = await Promise.all(
        posts.map((p) => p.catch(() => null)),
      );

      const ads = adsSnapshots
        .filter((doc) => doc && doc.exists())
        .map((doc) => ({
          id: doc && doc.id,
          ...(doc && (doc.data() as Omit<PostSchemaType, "id">)),
        }));

      const users = [...new Set(ads.map((post) => post.userId))];

      if (!Array.isArray(users) || users.length === 0) {
        setLoading(false);
        return;
      }

      // setUser(usersPersonalInfo);
      setSaved(ads);
      setLoading(false);
    }

    getSavedDocs();
  }, [user]);

  console.log(saved)

  return (
    <div className="space-y-4">
      {/* <h1 className="bg-white border border-neutral-200 rounded-2xl text-3xl text-neutral-500">Salvos</h1> */}
      {loading && (
        <div className="flex flex-col gap-y-4 items-center justify-center h-50">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          <p>Buscando salvos</p>
        </div>
      )}

      <div className="space-y-3">
        {Array.isArray(saved) &&
          saved.length !== 0 &&
          saved.map((doc, i) => {
            return (
              <article
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden space-y-4"
                key={i}
              >
                <FeedCard
                  id={doc.id}
                  userId={doc.userId}
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
                  userSnapShot={doc.userSnapShot}
                />
              </article>
            );
          })}

        {!saved.length && !loading && (
          <>
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-lg h-[50vh]">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
                <MdSearch className="text-neutral-500 text-2xl" />
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold text-neutral-900">
                  Nenhum post salvo ainda
                </p>
                <p className="text-sm text-neutral-500 max-w-sm">
                  Quando você encontrar algo interessante no feed, clique no
                  ícone de salvar para guardar o post aqui e acessar depois.
                </p>
              </div>

              <Link
                href={"/app/feed"}
                className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
              >
                Explorar posts
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
