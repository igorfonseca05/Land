import Image from "next/image";

export function Logo({writing}: {writing?: boolean}) {
  return (
    <>
      {writing ? (
        <div className="flex items-center gap-2 font-bold text-lg">
          <Image src={"/logo.svg"} width={38} height={38} alt="logo"></Image>
          Reno
        </div>
      ) : (
       <Image src={"/logo.svg"} width={38} height={38} alt="logo"></Image>
      )}
    </>
  );
}
