import Image from "next/image";
import Link from "next/link";

export function Logo({ writing }: { writing?: boolean }) {
  return (
    <>
      {writing ? (
        <Link href={"/app/feed"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} width={34} height={34} alt="logo"></Image>
          <h2 className="text-2xl font-bold tracking-tight">Reno</h2>
        </Link>
      ) : (
        <Link href={"/app/feed"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} width={34} height={34} alt="logo"></Image>
        </Link>
      )}
    </>
  );
}
