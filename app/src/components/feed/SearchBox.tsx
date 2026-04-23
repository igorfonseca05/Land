"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  MdAccountCircle,
  MdClose,
  MdExpandMore,
  MdImage,
  MdMap,
  MdSearch,
  MdSell,
} from "react-icons/md";
import { Modal } from "../GlobalModal/Modal";
import Image from "next/image";
import { useProfileContext } from "../../context/userProfileContext";
import { z, ZodFlattenedError } from "zod";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";
import { toast } from "sonner";
import { useSearchPost } from "../../context/usePostContext";
import { PostSchema, Profile, propertySchema } from "@/app/utils/zod";
import { details, pre } from "framer-motion/client";
import { getAuth, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { SearchPostCard } from "./SearchPost";
import { useAuth } from "../../context/useAuthContext";
import Link from "next/link";
import { CommunityBanner } from "./Banner";
import { createPublicId } from "@/app/utils/functions";

type Post = {
  title: string;
  description: string;
  features: string[];
};

type featuresList =
  | "Energia elétrica disponível"
  | "Abastecimento de água"
  | "Acesso asfaltado"
  | "Documentação regularizada"
  | "Próximo ao centro urbano"
  | "Área arborizada"
  | "Cercado"
  | "Sem taxa de condomínio"
  | "Ideal para plantio"
  | "Ideal para construção"
  // "Fonte de água (rio | nascente ou poço)" |
  | "Acesso para caminhão"
  | "Solo fértil"
  | "Topografia plana ou levemente inclinada"
  | "Área produtiva"
  | "Sem restrições ambientais";

export function HeroSearch() {
  const { user } = useAuth();
  const { profile } = useProfileContext();
  const { setSearchPost } = useSearchPost();
  const [isOpen, setIsOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<User | Profile | null>(null)

  const [post, setPost] = useState<z.infer<typeof PostSchema>>({
    title: "",
    description: "",
    features: [],
    images: [],
    type: "search",
    details: null,
    location: null,
    status: "active",
    userId: user?.uid ? user.uid : "",
    likesCount: 0,
    userSnapShot: {
      name: 'oi',
      avatar:  profile ? profile.photoURL : ( user ? user?.photoURL! : ''),
      userId: profile ? profile.uid : ( user ? user.uid : ''),
      publicId: profile ? profile.publicId : '',
      slug: profile ? profile.slug : '',
      profileVerified: profile?.profileVerified ? profile.profileVerified : false,
      profession: profile?.profession ? profile.profession : '',
    },
  });

  const [charactereCount, setCharacterCount] = useState(2000);
  const [error, setError] = useState<
    ZodFlattenedError<Post>["fieldErrors"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = user;

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setPost((prev) => {
      return {
        ...prev,
        title: e.target.value,
      };
    });
  }

  function handlePostBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPost((prev) => {
      return {
        ...prev,
        description: e.target.value,
      };
    });
  }

  function handleFeatures(e: React.MouseEvent<HTMLLabelElement>) {
    const selectedItem = e.currentTarget.innerText as featuresList;

    setPost((prev) => {
      const includeItem = post.features.includes(selectedItem);

      if (includeItem) {
        return {
          ...prev,
          features: post.features.filter((item) => item !== selectedItem),
        };
      }

      return {
        ...prev,
        features: [...prev.features, selectedItem],
      };
    });
  }

  async function handlePostForm(e: FormEvent) {
    e.preventDefault();

    // console.log(post)


    const isValidPost = PostSchema.safeParse(post);

    console.log(isValidPost)

    if (!isValidPost.success) {
      return setError(isValidPost.error.flatten().fieldErrors);
    }

    try {
      setLoading(true);
      setError(null);

      if (!user?.uid) return;

      const newPost = {
        ...isValidPost.data,
        userId: user?.uid,
        type: "search",
        status: "active",
        createdAt: serverTimestamp(),
        likesCount: 0,
      };

      await addDoc(collection(db, "ads"), newPost);
      setSearchPost(newPost);
      setLoading(false);
      setIsOpen(false);
      toast.success("Publicado.");
    } catch (error: unknown) {
      const err =
        error instanceof FirebaseError
          ? error
          : new Error("Error ao publicar seu post");
      setLoading(false);
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPost({
        title: "",
        description: "",
        features: [],
        images: [],
        type: "search",
        details: null,
        location: null,
        status: "active",
        userId: user?.uid ? user.uid : "",
        likesCount: 0,
        userSnapShot: {
          name: "",
          avatar: "",
          userId: user?.uid ? user.uid : "",
          publicId: "",
          slug: "",
          profileVerified: false,
          profession: "",
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {

    if(profile) {
      return setUserProfile(profile)
    }

    if(user) {
      return setUserProfile(user)
    }

  }, [profile, user])

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        style={`${isLoggedIn ? `sm:w-[70%]` : "sm:w-[40%]"}`}
      >
        {isLoggedIn ? (
          <>
            <div className="flex justify-end">
              <div
                className="hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <MdClose className="hover:bg-gray-100" />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 p-2 pt-0">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Image
                  src={user?.photoURL || profile?.photoURL || "/place.webp"}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm capitalize font-semibold text-neutral-900 dark:text-white">
                    {profile?.name.split(/\s+/)[0] ||
                      user?.displayName?.split(/\s+/)[0]}
                  </span>
                  <span className="text-xs capitalize text-neutral-400 dark:text-white">
                    {profile?.location}
                  </span>
                  {/* <span className="text-xs text-neutral-500">Público</span> */}
                </div>
              </div>

              {/* Textarea */}
              <form
                id="postForm"
                className="w-full space-y-2"
                onSubmit={handlePostForm}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    Título da busca
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Ex: Procuro terreno plano com acesso asfaltado"
                    minLength={2}
                    maxLength={70}
                    className="
                 border-gray-200 p-2 border-2 rounded-lg text-base bg-transparent outline-none placeholder:text-neutral-400 dark:text-white w-f borde dark:border-neutral-7 dark:bg-neutral-900 px-4 py text-neutral-8 focus:outline-none transition-all duration-200"
                    onChange={handleTitle}
                  />
                </div>
                <div className="relative">
                  <textarea
                    name="description"
                    rows={4}
                    maxLength={charactereCount}
                    onChange={handlePostBody}
                    placeholder="Descreva o terreno que você está buscando"
                    className="w-full h-25 resize-none border-2 border-gray-200 p-2 rounded-lg text-base bg-transparent outline-none placeholder:text-neutral-400 dark:text-white"
                  />
                  {error?.description && (
                    <span className="mt-1 block text-xs text-red-500">
                      {error.description}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-4 text-xs text-neutral-500 block text-end mb-2">
                    {post.description.length} / {charactereCount} caracteres
                    restantes
                  </span>
                </div>

                <div>
                  <h3 className="text-md font-bold text-neutral-900 dark:text-white mb-3">
                    O que o terreno precisa ter?
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Energia elétrica disponível" },
                      { name: "Abastecimento de água" },
                      { name: "Acesso asfaltado" },
                      { name: "Documentação regularizada" },
                      { name: "Próximo ao centro urbano" },
                      { name: "Área arborizada" },
                      { name: "Cercado" },
                      { name: "Sem taxa de condomínio" },
                      { name: "Ideal para plantio" },
                      { name: "Acesso para caminhão" },
                      { name: "Topografia plana ou levemente inclinada" },
                      { name: "Sem restrições ambientais" },
                    ].map((item, i) => {
                      return (
                        <label
                          key={item.name}
                          onClick={handleFeatures}
                          className={`flex items-center justify-start gap-2 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer select-none transition-all duration-200 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 
                      ${post.features.includes(item.name as featuresList) && "bg-green-500 text-white"}`}
                        >
                          {item.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center gap-2 justify-end">
                <button className="w-full py-2 text-sm hover:bg-neutral-100 rounded-lg md:max-w-50 text-nowrap  text-gray-600 font-semibold transition">
                  Salvar como Rascunho
                </button>
                <button
                  type="submit"
                  form="postForm"
                  className="w-full py-2 rounded-lg md:max-w-40 bg-green-500 text-white font-semibold hover:bg-green-700 transition"
                >
                  Publicar
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-end">
              <div
                className="hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <MdClose />
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-4 pt-0">
              {/* Avatar */}
              <img
                src="/place.webp"
                alt="User avatar"
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Text */}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Faça login para publicar
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                  Para publicar uma busca de terreno e interagir com outros
                  usuários, você precisa estar conectado à sua conta.
                </p>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <span>✔ Publicar buscas de terrenos</span>
                <span>✔ Salvar anúncios</span>
                <span>✔ Conversar com proprietários</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  // onClick={handleLogin}
                  className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-700 transition"
                >
                  Entrar na minha conta
                </button>

                <button
                  // onClick={handleRegister}
                  className="w-full py-2 rounded-lg border border-neutral-300 text-neutral-700 dark:text-white font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  Criar conta
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {user ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="flex gap-3 mb-4">
            <Image
              src={profile?.photoURL || user?.photoURL || "/place.webp"}
              alt="User avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />

            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm text-neutral-500"
            >
              Está buscando uma nova terra?
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-200 pt-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-neutral-100">
              <MdImage className="text-blue-500" />
              <span className="text-xs font-semibold text-neutral-600">
                Photo/Video
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-neutral-100">
              <MdMap className="text-green-600" />
              <span className="text-xs font-semibold text-neutral-600">
                Add Map
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-neutral-100">
              <MdSell className="text-orange-500" />
              <span className="text-xs font-semibold text-neutral-600">
                Sale/Lease
              </span>
            </button>
          </div>
        </div>
      ) : (
        <CommunityBanner />
      )}
    </>
  );
}
