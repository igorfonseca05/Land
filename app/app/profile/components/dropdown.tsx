"use client";

import { Modal } from "@/app/src/components/GlobalModal/Modal";
import { useProfileContext } from "@/app/src/context/userProfileContext";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  MdMoreHoriz,
  MdEdit,
  MdDelete,
  MdFlag,
  MdShare,
  MdClose,
  MdMap,
  MdSell,
} from "react-icons/md";
import { PostSchema, PostSchemaType, PostSearchSchema } from "@/app/utils/zod";
import z, { ZodFlattenedError } from "zod";
import { serverTimestamp } from "firebase/firestore";
import Image from "next/image";

type Post = z.infer<typeof PostSearchSchema>;

export function EditPostModal({ infos }: { infos: PostSchemaType }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { profile } = useProfileContext();
  
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState("");
  const charactereCount = 2000;
  const [error, setError] = useState<
  ZodFlattenedError<Post>["fieldErrors"] | null
  >(null);
  
  function handleEditForm(e: FormEvent) {
    e.preventDefault();

    const isValidPost = PostSearchSchema.safeParse({ post });
    
    if (!isValidPost.success) {
      return setError(isValidPost.error.flatten().fieldErrors);
    }
    
    const { description } = isValidPost.data;

    const postInfos = {
      description,
      updatedAt: serverTimestamp(),
    } as const;
  }

    // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPost(infos.description);
  }, [infos]);

  if (!profile) return <p>Not authenticated</p>;

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} style="sm:w-[70%]">
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
              src={profile?.profile || "/place.webp"}
              alt="User avatar"
              width={40}
              height={40}
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
          <form id="postForm" className="w-full" onSubmit={handleEditForm}>
            <span className="text-xs text-neutral-500 block text-end mb-2">
              {charactereCount - post.length} caracteres restantes
            </span>
            <textarea
              rows={4}
              maxLength={charactereCount}
              onChange={(e) => setPost(e.target.value)}
              placeholder="O que você está buscando?"
              className="w-full h-45 resize-none border-2 border-gray-200 p-2 rounded-lg text-base bg-transparent outline-none placeholder:text-neutral-400 dark:text-white"
              value={post}
            />
            {error?.description && (
              <span className="mt-1 block text-xs text-red-500">
                {error.description}
              </span>
            )}
          </form>

          {/* Divider */}
          {/* <div className="h-px bg-neutral-200 dark:bg-neutral-700" /> */}

          {/* Actions row */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Adicione informações ao anúncio
            </span>

            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <MdMap className="text-green-500" />
              </button>

              <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <MdSell className="text-orange-500"></MdSell>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 justify-end">
            <button className="w-full py-2 text-sm hover:bg-neutral-100 rounded-lg md:max-w-50 text-nowrap  text-gray-600 font-semibold transition">
              <span className="hidden md:block">Salvar como</span>Rascunho
            </button>
            <button
              type="submit"
              form="postForm"
              className="w-full py-2 rounded-lg md:max-w-40 bg-green-500 text-white font-semibold hover:bg-green-700 transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
      
      <div className="flex justify-between relative">
        {/* Actions */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className=""
          >
            <MdMoreHoriz size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <MdEdit size={16} />
                Editar post
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <MdShare size={16} />
                Compartilhar
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <MdFlag size={16} />
                Denunciar
              </button>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-1" />

              <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <MdDelete size={16} />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
