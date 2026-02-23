import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { uid: string } },
) {
  const { uid } = await params;
  const formData = await req.formData();
  const cover = formData.get("cover") as File | null;

  if (!cover) {
    return NextResponse.json(
      { message: "Arquivo não enviado" },
      { status: 400 },
    );
  }

  if (!cover.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Formato de arquivo inválido" },
      { status: 400 },
    );
  }

  //   Convertendo para bytes
  const coverBytes = await cover.arrayBuffer();
  const coverBuffer = Buffer.from(coverBytes);

  const timestamp = Math.floor(Date.now() / 1000);

  const folder = `profiles/${uid}`;
  const publicCoverid = `profiles/${uid}/cover`;

  const stringToSignature = `folder=${folder}&overwrite=true&public_id=${publicCoverid}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(stringToSignature + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex");

  const cloudinaryForm = new FormData();

  cloudinaryForm.append(
    "file",
    new Blob([coverBuffer], { type: cover.type }),
    cover.name,
  );
  cloudinaryForm.append("api_key", process.env.CLOUDINARY_API_KEY!);
  cloudinaryForm.append("timestamp", timestamp.toString());
  cloudinaryForm.append("signature", signature);
  cloudinaryForm.append("folder", folder);
  cloudinaryForm.append("public_id", publicCoverid);
  cloudinaryForm.append("overwrite", "true");
//   cloudinaryForm.append("invalidate", "true");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: cloudinaryForm,
    },
  );

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      { message: error.error?.message || "Erro no upload" },
      { status: 500 },
    );
  }

  const data = await res.json();

  return NextResponse.json({
    url: data.secure_url,
    public_id: data.public_id,
    place: 'cover'
  });

//   return NextResponse.json({message: 'oi'});
}
