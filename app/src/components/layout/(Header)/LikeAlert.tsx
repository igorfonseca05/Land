import { formatFirebaseTime } from "@/app/utils/functions";
import { FieldValue, Timestamp } from "firebase/firestore";
import { MdFavorite, MdSettings } from "react-icons/md";

type LikeProps = {
  message: string;
  createdAt: Timestamp | FieldValue;
  type: "like" | "comment" | "system";
};

export function LikeAlert({ message, createdAt, type }: LikeProps) {
  return (
    <div className="max-h-60 overflow-y-auto">
      {type === "like" ? (
        <div className="p-4 mt-2 bg-red-50/30 dark:bg-red-900/10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer group">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center shrink-0">
              <MdFavorite className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                {message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFirebaseTime(createdAt)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 mt-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer group">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <MdSettings className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                System update: New filters available for your search
              </p>
              <p className="text-xs text-gray-500 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
