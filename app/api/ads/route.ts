import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.get("file") as File | null;

  if (!files) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  //   Vamos converter o arquivo em Buffer
  const bytes = await files.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Math.floor(Date.now() / 1000);

  const folder = "ads";

  // 🔑 STRING DE ASSINATURA CORRETA
  const stringToSign = `folder=${folder}&timestamp=${timestamp}`;

  // assinatura Cloudinary (SIGNED UPLOAD)
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex");

  // monta formData pra Cloudinary
  const cloudinaryForm = new FormData();
  cloudinaryForm.append(
    "file",
    new Blob([buffer], { type: files.type }),
    files.name
  );
  cloudinaryForm.append("api_key", process.env.CLOUDINARY_API_KEY!);
  cloudinaryForm.append("timestamp", timestamp.toString());
  cloudinaryForm.append("signature", signature);
  cloudinaryForm.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: cloudinaryForm,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      { error: error.error?.message || "Erro no upload" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    url: data.secure_url,
    public_id: data.public_id,
  });
}
