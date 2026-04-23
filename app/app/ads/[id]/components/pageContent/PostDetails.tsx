"use client";

import { getDoc, doc } from "firebase/firestore";
import { db } from "@/app/config/firebase";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import {
  MdAspectRatio,
  MdCheckCircle,
  MdEmail,
  MdFavorite,
  MdLocationOn,
  MdShare,
  MdLandscape,
  MdWavingHand,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { NormalizedAd, PostSchemaType } from "@/app/utils/zod";
import { FirebaseError } from "firebase/app";
import { AdErrorState } from "@/app/src/components/ErrorState/AdErrorState";

type Unit = "ha" | "acre" | "sqm";

export function PostDetails({ uid }: { uid: string }) {
  const [post, setPost] = useState<PostSchemaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatSize(size: number, unit: Unit): string {
    if (unit === "ha") return `${size} hectare${size > 1 ? "s" : ""}`;
    if (unit === "acre") return `${size} acre${size > 1 ? "s" : ""}`;
    return `${size} m²`;
  }

  function upper(text?: string) {
    if (!text) return "";
    return text[0].toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    async function getDocument() {
      try {
        const docRef = doc(db, "ads", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data() as PostSchemaType);
        }
      } catch (error: unknown) {
        const err =
          error instanceof FirebaseError
            ? error
            : new Error("Erro desconhecido");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getDocument();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-500" />
        <span className="font-semibold text-gray-600">Buscando anúncio...</span>
      </div>
    );
  }

  if (error || !post) {
    return <AdErrorState />;
  }

  console.log(post)

  return (
    <main className="max-w-5xl mx-auto px-4 space-y-4">
      {/* HERO */}
      <div className="relative rounded-2xl overflow-hidden">
        {post.images && post.images.length > 1 ? (
          <Swiper modules={[Navigation]} navigation loop>
            {post.images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-100">
                  <Image src={img} alt="image" fill className="object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative w-full h-90">
            {post.images && (
              <Image
                src={post.images[0]}
                alt="image"
                fill
                className="object-cover"
              />
            )}
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow">
          ✔ Verificado
        </div>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-4">
          {/* TITLE */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{upper(post.title)}</h1>

            <div className="flex justify-between flex-wrap gap-4">
              {post.location && (
                <p className="flex items-center gap-1 text-gray-500">
                  <MdLocationOn />
                  {upper(post.location.city)}, {post.location.state}
                </p>
              )}

              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <MdShare />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <MdFavorite />
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-600">{upper(post.description)}</p>
          </div>

          {/* FEATURES */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Características</h3>

            <div className="grid gap-2">
              {post.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <MdCheckCircle className="text-green-500" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INFO CARDS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl flex gap-3 shadow-sm">
              <MdAspectRatio className="text-green-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Tamanho</p>
                {post.details && (
                  <p className="font-bold">
                    {formatSize(post.details.landSize, post.details.unit)}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl flex gap-3 shadow-sm">
              <MdLandscape className="text-blue-400 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Zona</p>
                <p className="font-bold">
                  {post.details && upper(post.details.type)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold">
                R$ {post.details && post.details.price.toLocaleString("pt-BR")}
              </h2>

              <div className="mt-4 space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <MdEmail />
                  Contatar
                </button>

                <button className="w-full border py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <MdWavingHand />
                  Interesse
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Sem compromisso. Tire suas dúvidas diretamente.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shrink-0">
                RP
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                    Rocky Mtn Properties
                  </h3>
                  <span
                    className="material-symbols-outlined text-[16px] text-blue-500"
                    title="Verified Seller"
                  >
                    verified
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-2">
                  Member since 2021 • 42 Listings
                </p>
                <a
                  className="text-xs font-bold text-green-600 hover:underline"
                  href="#"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
