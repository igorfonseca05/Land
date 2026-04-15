"use client";

import RightSideCards from "@/app/app/profile/components/RightCards";
import { usePathname } from "next/navigation";
import { MdTrendingUp } from "react-icons/md";
import { FeedRightSide } from "./feedRightSide";
import { SavedItemsRightSide } from "./SavedItensRightSide";

export function RightSidebar() {
  const path = usePathname();

  const hiddingRightSide = ["ads/", "/criar-anuncio", '/mapa'].find((item) =>
    path.includes(item),
  );
  const showRightSide = ["/feed"].find((item) => path.includes(item));

  return (
    <>
      {hiddingRightSide ? ('') : (
        <aside className="hidden lg:block w-80 shrink-0 sticky top-24 space-y-6">
          {path.includes('/feed') && <FeedRightSide />}
          {path.includes('/salvos') && <SavedItemsRightSide />}
          {path.includes("/profile") && <RightSideCards />}
        </aside>
      )}
    </>
  );
}
