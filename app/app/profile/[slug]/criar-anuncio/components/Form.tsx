"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { useRef } from "react";
import { details, pre } from "framer-motion/client";
import { NormalizedAd, NormalizedAdSchema } from "@/app/utils/zod";
import { ZodFlattenedError } from "zod";
import { toast } from "sonner";
import {
  collection,
  doc,
  FieldValue,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";
import { useProfileContext } from "@/app/src/context/userProfileContext";
import { useRouter } from "next/navigation";
import { Auth } from "firebase/auth";

type ErrorField = "imgs" | "details" | "location" | "description" | "features";

const landDetailsInitialState = {
  title: "",
  price: "",
  landSize: "",
  unit: "ha",
  type: "",
  landRegistryNumber: "",
};

const locationInitialState = {
  address: "",
  city: "",
  state: "",
  observation: "",
};

const featuresInitialState = {
  electricityNearby: false,
  waterNearby: false,
  needsWell: false,
  dirtRoadAccess: false,
  pavedRoadAccess: false,
  woodedArea: false,
  flatLand: false,
  fencedLand: false,
  noHoaFee: false,
};

interface OwnerProps {
  author: string;
  email: string;
}

export interface PostProps {
  id: string
  uid?: string
  imgs: any[];
  userId: string;
  title: string;
  createdAt: FieldValue;
  details: {
    title: string;
    price: number;
    landSize: number;
    unit: string;
    type: string;
    landRegistryNumber?: string | undefined;
  };
  location: {
    address: string;
    city: string;
    state: string;
    observation?: string | undefined;
  };
  description: string;
  features: {
    electricityNearby: boolean;
    waterNearby: boolean;
    needsWell: boolean;
    dirtRoadAccess: boolean;
    pavedRoadAccess: boolean;
    woodedArea: boolean;
    flatLand: boolean;
    fencedLand: boolean;
    noHoaFee: boolean;
  };
  owner: OwnerProps;
  status: string;
  type: string
}

export function Form() {
  const { profile } = useProfileContext();
  const router = useRouter();

  const inputFile = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File[]>([]);
  const [landDetails, setLandDetails] = useState(landDetailsInitialState);
  const [location, setLocation] = useState(locationInitialState);
  const [description, setDescription] = useState("");
  const [features, setFeatures] =
    useState<Record<string, boolean>>(featuresInitialState);
  const [errors, setErrors] = useState<
    ZodFlattenedError<NormalizedAd>["fieldErrors"] | null
  >(null);
  const [urls, setURL] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  function hasError(field: ErrorField) {
    return Boolean(errors?.[field]?.length);
  }

  function handleLandDetails(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setLandDetails({
      ...landDetails,
      [e.target.name]: e.target.value.toLocaleLowerCase(),
    });

    setErrors({
      ...errors,
      [e.target.name]: [],
    });
  }

  function handleLocationDetails(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLocation({
      ...location,
      [e.target.name]: e.target.value.toLocaleLowerCase(),
    });
  }

  function handleFeatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    setFeatures((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  // ---- funções de DragAndDrop ----

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      const files = Array.from(dt.files ?? []);
      setFile((prev) => [...prev, ...files].slice(0, 5));
    }
  }

  async function handleForm(e: FormEvent) {
    e.preventDefault();

    if (file.length < 1) {
      toast.error("Insira pelo menos 1 imagem do terreno");
      return;
    }

    if (!auth.currentUser) {
      toast.error("Usuário não autenticado");
      return;
    }

    const rawData = {
      imgs: file,
      details: landDetails,
      location: { ...location },
      description,
      features: { ...features },
    };

    const parsed = NormalizedAdSchema.safeParse(rawData);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      // toast.loading("Publicando anúncio...");
      setLoading(true);

      // 1️⃣ Upload das imagens
      const uploads = await Promise.all(
        file.map(async (image) => {
          const fd = new FormData();
          fd.append("file", image);

          const res = await fetch("/api/ads", {
            method: "POST",
            body: fd,
          });

          if (!res.ok) {
            setLoading(false);
            throw new Error("Erro no upload");
          }

          return res.json();
        })
      );

      const imageUrls = uploads.map((img) => img.url);

      const postId = doc(collection(db, 'posts')).id

      // 2️⃣ Monta documento final
      const adData = {
        ...parsed.data,
        imgs: imageUrls,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: "active",
      };

      // 3️⃣ Firestore batch
      const batch = writeBatch(db);

      const userAdRef = doc(db, 'ads', postId);
      const feedRef = doc(db, 'feeds', postId);

      batch.set(userAdRef, adData);
      batch.set(feedRef, {
        ...adData,
        adId: userAdRef.id,
        status: "active",
      });

      await batch.commit();

      toast.dismiss();
      toast.success("Anúncio publicado com sucesso!");
      setLoading(false);

      // opcional: reset
      setFile([]);
      setDescription("");
      setErrors({});
      setFeatures({});
      router.push(`/app/profile/${profile?.slug}`);
    } catch (err) {
      setLoading(false);
      toast.dismiss();
      toast.error("Erro ao publicar anúncio");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!file.length) return;
    const fileUrl = file.map((item) => URL.createObjectURL(item));
    setURL(fileUrl);

    return () => {
      if (file) file.map((item) => URL.createObjectURL(item));
    };
  }, [file]);

  useEffect(() => {
    if (!file.length) return;

    const maxValue = 2;

    file.forEach((item) => {
      if (item.size > maxValue * 1024 * 1024) {
        setFile((prev) => prev.filter((file) => file.name !== item.name));
        return toast.error(`As imagens devem ter no máximo ${maxValue}MB`);
      }
    });
  }, [file]);


  return (
    <form onSubmit={handleForm} className="space-y-6">
      {/* Upload area */}
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Fotos da prop</h3>
          <span className="text-sm text-neutral-500">Máximo 5 fotos</span>
        </div>

        <input
          ref={inputFile}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files ?? []);
            setFile((prev) => [...prev, ...selectedFiles].slice(0, 5));
          }}
        />

        {/* Drag area */}
        <button
          type="button"
          onClick={() => inputFile.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
          w-full border-2 border-dashed rounded-xl p-10
          flex flex-col items-center justify-center text-center
          transition-colors
          ${
            isDragging
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-300 hover:bg-neutral-50"
          }
        `}
        >
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
            <MdAddAPhoto size={24} />
          </div>

          <p className="font-bold text-neutral-900 text-lg">
            {isDragging
              ? "Solte o arquivo"
              : "Clique para adicionar ou arraste e solte"}
          </p>
          <p className="text-sm text-neutral-500 mt-2">PNG, JPG ou WebP</p>
        </button>
        {/* Preview grid */}
        {file && file.length > 0 && (
          <div className="grid grid-cols-5 sm:grid-cols-4 gap-4 mt-6">
            {urls?.map((photo, index) => {
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100"
                >
                  <img
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      // console.log(index);
                      setFile((prev) => prev.filter((item, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                  >
                    <MdClose size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          Detalhes do Terreno
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Título do anúncio <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handleLandDetails}
              name="title"
              type="text"
              placeholder="Ex: Terreno de 5 hectares pronto para construir"
              className={` w-full pl-4 rounded-xl py-3 bg-neutral-50 dark:bg-neutral-800
        text-neutral-900 dark:text-white border transition-colors
        
        ${
          hasError("details")
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-neutral-200 dark:border-neutral-700 focus:ring-primary focus:border-primary"
        }`}
            />
            {errors?.details && (
              <p className="mt-1 text-sm text-red-500">{errors.details[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Preço (R$) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-500">R$</span>
              <input
                onChange={handleLandDetails}
                name="price"
                type="number"
                placeholder="250000"
                className={`
        w-full pl-10 rounded-xl py-3 bg-neutral-50 dark:bg-neutral-800
        text-neutral-900 dark:text-white border transition-colors
        ${
          hasError("details")
            ? "border-red-500 focus:ring-red-500"
            : "border-neutral-200 dark:border-neutral-700 focus:ring-primary"
        }
      `}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Tamanho do terreno <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleLandDetails}
                name="landSize"
                type="number"
                placeholder="5"
                className=" pl-2 w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3"
              />
              <select
                onChange={handleLandDetails}
                name="unit"
                className={`
    w-32 rounded-xl py-3 bg-neutral-50 dark:bg-neutral-800
    text-neutral-900 dark:text-white border transition-colors
    ${
      hasError("details")
        ? "border-red-500 focus:ring-red-500"
        : "border-neutral-200 dark:border-neutral-700 focus:ring-primary"
    }
  `}
              >
                <option value={"ha"}>Hectares</option>
                <option value={"acre"}>Acres</option>
                <option value={"sqm"}>m²</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Zoneamento
            </label>
            <select
              onChange={handleLandDetails}
              name="type"
              className="pl-2 w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3"
            >
              <option>Residencial</option>
              <option>Rural</option>
              <option>Comercial</option>
              <option>Agrícola</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Inscrição / Matrícula
            </label>
            <input
              onChange={handleLandDetails}
              name="landRegistryNumber"
              type="text"
              placeholder="Opcional"
              className=" pl-2 w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          Localização
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Endereço
            </label>
            <input
              name="address"
              onChange={handleLocationDetails}
              type="text"
              placeholder="Rua, estrada ou ponto de referência"
              className={` w-full pl-4 rounded-xl py-3 bg-neutral-50 dark:bg-neutral-800
        text-neutral-900 dark:text-white border transition-colors
                
                ${
                  hasError("location")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-200 dark:border-neutral-700 focus:ring-primary"
                }`}
            />
            {errors?.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Cidade
            </label>
            <input
              name="city"
              onChange={handleLocationDetails}
              type="text"
              className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Estado / Região
            </label>
            <input
              name="state"
              onChange={handleLocationDetails}
              type="text"
              className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Observações de localização
            </label>
            <textarea
              name="observation"
              onChange={handleLocationDetails}
              rows={4}
              placeholder="Ex: Acesso por estrada de terra, próximo a fazenda X"
              className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-primary focus:border-primary py-3 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Descrição do imóvel
        </h3>

        <p className="text-sm text-neutral-500 mb-6">
          Descreva o terreno, suas características, potencial de uso e pontos
          relevantes da região.
        </p>

        <div
          className={`
    border rounded-xl overflow-hidden transition-colors
    ${
      hasError("description")
        ? "border-red-500 focus-within:ring-red-500"
        : "border-neutral-200 dark:border-neutral-700 focus-within:ring-primary"
    }
  `}
        >
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Ex: Terreno plano, com acesso facilitado, ideal para sítio ou investimento..."
            className="
      w-full resize-none bg-transparent p-4
      text-neutral-900 dark:text-white
      focus:outline-none
    "
          />
        </div>
        {errors?.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description[0]}</p>
        )}
      </div>

      {/* Características & Comodidades */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-5">
          Características & comodidades
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: "electricityNearby", label: "Energia elétrica" },
            { name: "waterNearby", label: "Água próxima" },
            { name: "needsWell", label: "Necessita poço" },
            { name: "dirtRoadAccess", label: "Estrada de terra" },
            { name: "pavedRoadAccess", label: "Acesso asfaltado" },
            { name: "woodedArea", label: "Área arborizada" },
            { name: "flatLand", label: "Terreno plano" },
            { name: "fencedLand", label: "Terreno cercado" },
            { name: "noHoaFee", label: "Sem condomínio" },
          ].map((item, i) => {
            return (
              <label
                key={item.name}
                className={`flex truncate items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer select-none transition-a border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300
                  ${
                    features[item.name]
                      ? "bg-primary/10 border-primary font-semibold bg-green-400"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
              >
                <input
                  type="checkbox"
                  name={item.name}
                  onChange={handleFeatureChange}
                  className="hidden"
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex items-center justify-end gap-4 pt-4 pb-12">
        <button
          onClick={() => router.replace(`/app/profile/${profile?.slug}`)}
          type="button"
          className="px-6 py-3.5 rounded-xl font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`
    px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all
    ${
      loading
        ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
        : "bg-green-400 text-neutral-900 hover:shadow-lg shadow-primary/20 hover:scale-102 active:scale-95"
    }
  `}
        >
          {loading ? "Publicando anúncio..." : "Publicar anúncio"}
        </button>
      </div>
    </form>
  );
}
