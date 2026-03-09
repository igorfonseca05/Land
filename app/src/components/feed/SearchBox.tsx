"use client";

import { FormEvent, useEffect, useState } from "react";
import {
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
import { PostSchema, propertySchema } from "@/app/utils/zod";
import { details, pre } from "framer-motion/client";
import { getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { SearchPostCard } from "./SearchPost";

type Post = {
  title: string;
  description: string;
  features: Record<string, string>;
};

export function HeroSearch() {
  const { profile } = useProfileContext();
  const { setSearchPost } = useSearchPost();
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState<Post>({
    title: "",
    description: "",
    features: {},
  });
  const [charactereCount, setCharacterCount] = useState(2000);
  const [error, setError] = useState<
    ZodFlattenedError<Post>["fieldErrors"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = getAuth().currentUser

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPost((prev) => {
      const isNotTitleAndDescription =
        e.target.name !== "title" && e.target.name !== "description";
      const itemAdded = Object.keys(prev.features);

      if (itemAdded.includes(e.target.name)) {
        const item = e.target.name;

        const { [`${item}`]: _, ...dados } = prev.features;

        return {
          ...prev,
          features: {
            ...dados,
          },
        };
      }

      if (isNotTitleAndDescription) {
        return {
          ...prev,
          features: {
            ...prev.features,
            [e.target.name]: e.target.value,
          },
        };
      } else {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      }
    });
  }

  async function handlePostForm(e: FormEvent) {
    e.preventDefault();

    const isValidPost = propertySchema.safeParse(post);

    if (!isValidPost.success) {
      return setError(isValidPost.error.flatten().fieldErrors);
    }

    try {
      setLoading(true);
      setError(null);

      if (!auth.currentUser?.uid) return;

      const newPost = {
        ...isValidPost.data,
        userId: auth.currentUser?.uid,
        type: "search",
        status: "active",
        createdAt: serverTimestamp(),
        likeCount: 0,
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
        features: {},
      });
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} style={`${isLoggedIn ? `sm:w-[70%]` : 'sm:w-[40%]'}`}>
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
                <img
                  src={`${profile?.profile}` || "/place.webp"}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-sm capitalize font-semibold text-neutral-900 dark:text-white">
                    {profile?.name.split(/\s+/)[0]}
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
                    onChange={handleInput}
                  />
                </div>
                <div className="relative">
                  <textarea
                    name="description"
                    rows={4}
                    maxLength={charactereCount}
                    onChange={handleInput}
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
                      // { name: "Boa incidência solar" },
                      { name: "Área arborizada" },
                      { name: "Cercado" },
                      { name: "Sem taxa de condomínio" },
                      { name: "Ideal para plantio" },
                      // { name: "Ideal para construção" },
                      // { name: "Fonte de água (rio, nascente ou poço)" },
                      { name: "Acesso para caminhão" },
                      // { name: "Solo fértil" },
                      { name: "Topografia plana ou levemente inclinada" },
                      // { name: "Área produtiva" },
                      { name: "Sem restrições ambientais" },
                    ].map((item, i) => {
                      return (
                        <label
                          key={item.name}
                          className={`flex items-center justify-start gap-2 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer select-none transition-all duration-200 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300hover:bg-neutral-100 dark:hover:bg-neutral-800 
                      ${Object.hasOwn(post.features, item.name) && "bg-green-500 text-white"}`}
                        >
                          <input
                            type="checkbox"
                            name={item.name}
                            className="hidden peer"
                            checked={!!post.features[item.name]}
                            onChange={handleInput}
                          />
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

      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <div className="flex gap-3 mb-4">
          <Image
            src={profile?.profile || "/place.webp"}
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
    </>
  );
}
