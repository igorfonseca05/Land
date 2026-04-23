"use client";
import { formatFirebaseTime, getUpperCaseLatter } from "@/app/utils/functions";
// import { PostModel } from "../../context/usePostContext";
import { Avatar } from "../ui/Avatar";
import { MdCheckCircle, MdMoreHoriz } from "react-icons/md";
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
              Postado há {formatFirebaseTime(post.createdAt)}
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
      <div className="flex flex-wrap gap-2 mb-4">
        {post.features.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
          >
            <MdCheckCircle className="text-green-500 text-sm" />
            <span className="text-xs text-gray-600">{item}</span>
          </div>
        ))}
      </div>

    
    </div>
  );
}
