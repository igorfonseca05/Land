import { NextRequest, NextResponse } from "next/server";
import crypto, { createHash } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { uid: string } },
) {
  // uid para adicionar imagens na pasta com id do usuário
  const { uid } = await params;
  const MAX_SIZE = 1 * 1024 * 1024; // 5MB

  if (!/^[a-zA-Z0-9_-]+$/.test(uid)) {
    return NextResponse.json({ message: "UID inválido" }, { status: 400 });
  }

  /**O formData é o objetoq que encapsula o arquivo enviado pelo frontend */
  const formData = await req.formData();
  /** aqui removo o 'file' de dentro do {formData}*/
  const profile = formData.get("profile") as File | null;

  if (!profile) {
    return NextResponse.json(
      { message: "Arquivo não enviado" },
      { status: 400 },
    );
  }

  if (profile.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "Imagem muito grande (máx 5MB)" },
      { status: 400 },
    );
  }

  if (!profile?.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Apenas imagens são permitidas" },
      { status: 400 },
    );
  }

  // Converter para binário(Cloudinary só aceita URL, Base64, Buffer(binário))
  const profileBytes = await profile.arrayBuffer();
  const bufferProfile = Buffer.from(profileBytes);

  //   // Obter timestamp(obrigátorio para o cloudinary)
  const timestamp = Math.floor(Date.now() / 1000);

  const folder = `profiles/${uid}`;
  const publicProfileid = `profiles/${uid}/profile`;

  //   // String para assinar o upload, OBRIGÁTORIO!
  const stringToSignProfile = `folder=${folder}&invalidate=true&overwrite=true&public_id=${publicProfileid}&timestamp=${timestamp}`;

  //   // Gerando assinatura(prova que backend é confiavel)
  const signatureProfile = crypto
    .createHash("sha1")
    .update(stringToSignProfile + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex");

  //   // Montando arquivo FormData do cloudinary(vamos simular o formHTML)
  const cloudinaryForm = new FormData();

  //   Blob recria o arquivo
  //  files.type preserva MIME
  //  files.name mantém o nome
  cloudinaryForm.append(
    "file",
    new Blob([bufferProfile], { type: profile.type }),
    profile.name,
  );
  cloudinaryForm.append("api_key", process.env.CLOUDINARY_API_KEY!);
  cloudinaryForm.append("folder", folder);
  cloudinaryForm.append("overwrite", "true");
  cloudinaryForm.append("invalidate", "true");
  cloudinaryForm.append("timestamp", timestamp.toString());
  cloudinaryForm.append("public_id", publicProfileid);
  cloudinaryForm.append("signature", signatureProfile);

  //   //  Enviando para o Cloudinary
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: cloudinaryForm,
    },
  );

  if (!res.ok) {
    const error = await res.json();
    // console.log(error);
    return NextResponse.json(
      { message: error.error?.message || "Erro no upload" },
      { status: 500 },
    );
  }

  const data = await res.json();

  return NextResponse.json({
    url: data.secure_url,
    public_id: data.public_id,
    place: 'profile'
  });
}
