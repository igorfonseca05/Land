"use client";

import RightSideCards from "@/app/app/profile/components/RightCards";
import { usePathname } from "next/navigation";
import { MdTrendingUp } from "react-icons/md";
import { FeedRightSide } from "./feedRightSide";

export function RightSidebar() {
  const path = usePathname();

  const hiddingRightSide = ["feed/", "/criar-anuncio"].find((item) =>
    path.includes(item),
  );
  const showRightSide = ["/feed"].find((item) => path.includes(item));

  return (
    <>
      {hiddingRightSide ? (
        <></>
      ) : (
        <aside className="hidden lg:block w-80 shrink-0 sticky top-24 space-y-6">
          {showRightSide && <FeedRightSide />}
          {path.includes("/profile") && <RightSideCards />}
        </aside>
      )}
    </>
  );
}
