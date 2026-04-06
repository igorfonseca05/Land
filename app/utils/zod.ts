import { FieldValue, Timestamp } from "firebase/firestore";
import { z } from "zod";

/* ========= Subschemas ========= */

const ImageSchema = z.object({
  name: z.string().min(1),
  size: z.coerce.number().positive(),
  type: z.string().min(1),
});

// co Unit = "ha" | "acre" | "sqm";

const DetailsSchema = z.object({
  price: z.coerce
    .number("Preço deve ser um número válido")
    .positive("Preço deve ser maior que zero"),

  landSize: z.coerce
    .number("Tamanho do terreno deve ser um número válido")
    .positive("Tamanho do terreno deve ser maior que zero"),

  unit: z
    .string()
    .transform((v) => v.toLowerCase())
    .pipe(z.enum(["ha", "acre", "sqm"])),

  type: z
    .string("Tipo do terreno é obrigatório")
    .transform((v) => v.toLowerCase()),

  landRegistryNumber: z
    .string("Número do registro deve ser texto")
    .trim()
    .optional(),
});

const LocationSchema = z.object({
  address: z.string("Endereço inválido").trim(),
  city: z
    .string()
    .min(2, "Nome da cidade deve conter no minimo 2 caracteres")
    .trim(),
  state: z.string().trim().toUpperCase().length(2),
  // observation: z.string().trim().optional(),
  coord: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

/* ========= Uso ========= */
// const normalized = NormalizedAdSchema.parse(rawData)

export const ProfileInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(60, "O nome pode ter no máximo 60 caracteres"),

  profession: z
    .string()
    .trim()
    .min(2, "A profissão deve ter pelo menos 2 caracteres")
    .max(60, "A profissão pode ter no máximo 60 caracteres")
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .min(2, "A localização deve ter pelo menos 2 caracteres")
    .max(80, "A localização pode ter no máximo 80 caracteres")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(300, "A descrição pode ter no máximo 300 caracteres")
    .optional(),

  phone: z
    .string()
    .trim()
    // aceita +55, espaços, parênteses e hífen
    .regex(
      /^(\+?\d{1,3})?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      "Número de telefone inválido",
    )
    .optional()
    .or(z.literal("")),
});

export type Profile = z.infer<typeof ProfileInfoSchema>;

export const featuresList = [
  "Energia elétrica disponível",
  "Abastecimento de água",
  "Acesso asfaltado",
  "Documentação regularizada",
  "Próximo ao centro urbano",
  "Área arborizada",
  "Cercado",
  "Sem taxa de condomínio",
  "Ideal para plantio",
  "Ideal para construção",
  // "Fonte de água (rio, nascente ou poço)",
  "Acesso para caminhão",
  "Solo fértil",
  "Topografia plana ou levemente inclinada",
  "Área produtiva",
  "Sem restrições ambientais",
] as const;

/* ========= Schema Normalizado ========= */

export const NormalizedAdSchema = z.object({
  images: z.array(ImageSchema).default([]).optional(),
  type: z.enum(["search", "sale"]),
  details: DetailsSchema.optional(),
  location: LocationSchema.optional(),
  title: z
    .string("Título é obrigatório")
    .trim()
    .min(1, "Título não pode ser vazio")
    .transform((v) => v.toLowerCase()),
  description: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, " ")),
  features: z.array(z.enum(featuresList)),
  userId: z.string().min(10),
  status: z.enum(["active", "inactive", "reserved", "sold"]),
});

export type NormalizedAd = z.infer<typeof NormalizedAdSchema>;


export const PostSchema = z.object({
  images: z.array(z.string()).nullable().default([]),
  type: z.enum(["search", "sale"]),
  details: DetailsSchema.nullable().default(null),
  location: LocationSchema.nullable().default(null),
  title: z
    .string("Título é obrigatório")
    .trim()
    .min(1, "Título não pode ser vazio")
    .transform((v) => v.toLowerCase()),
  description: z
    .string()
    .trim()
    .min(1, "Descrição é obrigatória")
    .transform((v) => v.replace(/\s+/g, " ")),
  features: z.array(z.enum(featuresList)),
  userId: z.string().min(10),
  status: z.enum(["active", "inactive", "reserved", "sold"]),
  likesCount: z.number().default(0).optional()
});

export type PostSchemaType = z.infer<typeof PostSchema> & {
  createdAt: Timestamp | FieldValue;
  id: string;
};


export const PostSearchSchema = z.object({
  title: z.string().trim().min(2, "Insira um titulo para o post"),
  description: z
    .string()
    .trim()
    .min(1, "O post não pode estar vazio")
    .max(2000, "O post pode ter no máximo 2000 caracteres"),
  features: z.array(z.enum(featuresList)),
  status: z.string(),
  createdAt: z.any().optional(),
  type: z.string().optional(),
  userId: z.string().optional(),
  likesCount: z.number().optional(),
});

export const propertySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  features: z.array(z.enum(featuresList)),
});

export type PostSchema = z.infer<typeof PostSearchSchema>;

// [2026-01-14T19:33:31.390Z]  @firebase/firestore: "Firestore (12.6.0): Could not reach Cloud Firestore backend. Connection failed 1 times. Most recent error: FirebaseError: [code=unknown]: Fetching auth token failed: Firebase: Error (auth/network-request-failed).\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend."

// Failed to get document because the client is offline.
