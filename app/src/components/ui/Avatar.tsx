type Props = {
  src?: string | null;
  fallback: string;
};

export function Avatar({ src, fallback }: Props) {
  // Garante que o src seja uma string válida ou o placeholder
  // Isso evita passar objetos acidentalmente para a tag <img>
  const validSrc = typeof src === "string" && src.trim() !== "" 
    ? src 
    : "/place.webp";

  return (
    <div className="relative h-11 w-11 shrink-0">
      <img
        src={validSrc}
        alt="avatar"
        className="h-full w-full rounded-full object-cover border border-neutral-200"
        // Caso a URL exista mas a imagem dê erro 404, ele troca para o placeholder
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/place.webp";
        }}
      />
    </div>
  );
}