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
}
