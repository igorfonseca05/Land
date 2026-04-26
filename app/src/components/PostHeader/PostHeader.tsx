import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { formatFirebaseTime, getFirstName } from "@/app/utils/functions";
import { MdMoreHoriz } from "react-icons/md";
import { FieldValue, Timestamp } from "firebase/firestore";
import { userSnapShot } from "@/app/utils/zod";

type PropsInfos = {
  user: userSnapShot;
  createdAt: Timestamp | FieldValue;
  avatarOnly?: boolean;
  points?: boolean
};

export function PostHeader({ user, createdAt, avatarOnly, points }: PropsInfos) {
  const userName = user.displayName;

  return (
    <div>
      {avatarOnly && user.photoURL ? (
        <Avatar src={user.photoURL} fallback="photo" />
      ) : (
        <Link href="#">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar src={user.photoURL} />

              <div>
                <p className="text-sm font-semibold capitalize">
                  {getFirstName(userName)}
                </p>
                <p className="text-xs text-gray-400">
                  Postado {formatFirebaseTime(createdAt)}
                </p>
              </div>
            </div>

            {points && <MdMoreHoriz className="text-gray-400 text-xl" />}
          </div>
        </Link>
      )}
    </div>
  );
}
