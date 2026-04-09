"use client";
import { formatFirebaseTime } from "@/app/utils/functions";
// import { PostModel } from "../../context/usePostContext";
import { Avatar } from "../ui/Avatar";
import { MdMoreHoriz } from "react-icons/md";
import { useProfileContext } from "../../context/userProfileContext";
import { PostActions } from "./PostActions";
import { PostSchema } from "@/app/utils/zod";

type SearchPostProps = {
  post: PostSchema;
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
  
  if (!profile) return null;

  return (
    <div
      className={`${isPosting ? "opacity-50" : "opacity-100"} w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900  flex flex-col gap-3`}
    >
      {/* Header */}
      <div className=" flex justify-between">
        <div className="flex gap-3">
          <Avatar fallback="igor" src={profile?.profile} />
          <div>
            <p className="font-bold text-sm capitalize">{"igor"}</p>
            <p className="text-xs text-neutral-500 ">
              <span className="capitalize">{profile?.location}</span> • Postado
              há {formatFirebaseTime(post.createdAt)}
            </p>
          </div>
        </div>
        <MdMoreHoriz />
      </div>
      {/* Conteúdo do post */}
      <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
        {post.title}
      </p>
      <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
        {post.description}
      </p>
  
    </div>
  );
}
