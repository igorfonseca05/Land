"use client";
import { formatFirebaseTime, getUpperCaseLatter } from "@/app/utils/functions";
// import { PostModel } from "../../context/usePostContext";
import { Avatar } from "../ui/Avatar";
import { MdMoreHoriz } from "react-icons/md";
import { useProfileContext } from "../../context/userProfileContext";
import { PostActions } from "./PostActions";
import { PostSearchSchemaType } from "@/app/utils/zod";

type SearchPostProps = {
  post: PostSearchSchemaType;
  userName: string | null | undefined;
  userLocation?: string;
  isPosting: boolean;
};

export function SearchPostCard({
  post,
  userName,
  userLocation,
  isPosting,
}: SearchPostProps) {

  const { profile } = useProfileContext();
  
  if (!profile) {
  return <div className="p-8 text-center">Carregando...</div>;
}

  return (
    <div
      className={`${isPosting ? "opacity-50" : "opacity-100"} w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900  flex flex-col gap-3`}
    >
      {/* Header */}
      <div className=" flex justify-between">
        <div className="flex gap-3">
          <Avatar fallback="igor" src={profile?.photoURL} />
          <div>
            <p className="font-bold text-sm capitalize">{"igor"}</p>
            <p className="text-xs text-neutral-500 ">
               Postado
              há {formatFirebaseTime(post.createdAt)}
            </p>
          </div>
        </div>
        <MdMoreHoriz />
      </div>
      {/* Conteúdo do post */}
       <h2
                  className={`${
                    post.type === "search"
                      ? "text-lg font-semibold mb-3"
                      : "text-base font-semibold mb-2"
                  }`}
                >
                  {getUpperCaseLatter(post.title)}
                </h2>
      <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
        {post.description}
      </p>

       {/* DIVIDER */}
          <hr className="border-gray-100 mb-2" />

          {/* ACTIONS */}
          {/* <div className="flex h-6 flex-1 tems-center justify-between">
            <PostActions id={post.id} likesCount={post.likesCount} />
          </div> */}
  
    </div>
  );
}
