
import { HeroSearch } from "../../src/components/feed/SearchBox";
import { Posts } from "./components/Posts";
import { MdExpandMore, MdTune } from "react-icons/md";

export default function FeedPage() {
  return (
    <section className="space-y-4">
      <HeroSearch />
      {/* <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-neutral-300" />
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            Ordernado por
          </span>

          <button className="flex items-center gap-1 text-xs font-bold text-neutral-900 bg-white px-3 py-1 rounded-full border border-neutral-200">
            Recentes
            <MdExpandMore/>
          </button>
        </div>

        <button className="p-2 text-neutral-500 hover:text-neutral-900">
          <MdTune className="text-xl"/>
        </button>
      </div> */}
      <Posts />
    </section>
  );
}
