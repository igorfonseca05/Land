type Props = {
  src?: string | null;
  fallback: string;
};

export function Avatar({ src, fallback }: Props) {
  return (
    <img
      src={src || "/place.webp"}
      className="h-10 w-10 rounded-full object-cover border border-neutral-200"
    />
  );

  // return (
  //   <div className="h-10 w-10 capitalize rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700">
  //     {fallback.slice(0,1)}
  //   </div>
  // )
}
