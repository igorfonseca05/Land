"use client";

import { auth, db } from "@/app/config/firebase";
import { Modal } from "@/app/src/components/GlobalModal/Modal";
import { useAuth } from "@/app/src/context/useAuthContext";
// UserProfile.jsx
import { useProfileContext } from "@/app/src/context/userProfileContext";
import { Profile, ProfileInfoSchema } from "@/app/utils/zod";
import { FirebaseError } from "firebase/app";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  MdClose,
  MdEdit,
  MdPhotoCamera,
  MdUpload,
  MdVerified,
} from "react-icons/md";
import { toast } from "sonner";
import z, { ZodError, ZodFlattenedError } from "zod";

type ErrorField = "name" | "profession" | "location" | "description" | "phone";

interface ImageProps {
  place: string;
  preview: string;
  file: File;
}

export function UserProfile() {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const inputPhotoProfileRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfileContext();

 const formInitialState = useMemo(() => ({
  name: profile?.name || "",
  profession: profile?.profession || "",
  location: profile?.location || "",
  description: profile?.description || "",
  phone: profile?.phone || "",
}), [profile]);

  const [profileImage, setProfileImage] = useState<ImageProps | null>(null);
  const [profileCover, setProfileCover] = useState<ImageProps | null>(null);
  const [profileInfo, setProfileInfo] = useState({
    name: profile?.name || "",
    profession: profile?.profession || "",
    location: profile?.location || "",
    description: profile?.description || "",
    phone: profile?.phone || "",
  });
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [error, setError] = useState<
    ZodFlattenedError<Profile>["fieldErrors"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  function hasError(field: ErrorField) {
    return Boolean(error?.[field]?.length);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setProfileInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError({
      ...error,
      [e.target.name]: [],
    });
  }

  async function handleForm(e: FormEvent) {
    e.preventDefault();

    if (!user) return;

    const isValidData = ProfileInfoSchema.safeParse(profileInfo);
    if (!isValidData.success) {
      return setError(isValidData.error.flatten().fieldErrors);
    }

    const images = [profileCover?.file, profileImage?.file];

    try {
      setLoading(true);

      const noImageToUpload = images.every(
        (image) => image === null || image === undefined,
      );

      if (noImageToUpload) {
        const data = isValidData.data;
        onlyUpdateUser(data);
      } else {
        const urls = await makeUploadsAndGetUrls();

        const userInfo = {
          ...isValidData.data,
          ...urls,
          updatedAt: serverTimestamp(),
        };

        if (urls.profile) {
          await updateFirebasePhoto();
        }

        await setDoc(doc(db, "users", user.uid), userInfo, {
          merge: true,
        });

        toast.success("Dados salvos com sucesso");
        setLoading(false);
        setEditModalIsOpen(false);
        setProfileCover(null);
        setProfileImage(null);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError) {
        toast.error(`Erro do Firebase: ${error.message}`);
      } else {
        toast.error(`Erro inesperado: ${error}`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onlyUpdateUser(data: {
    name: string;
    profession?: string | undefined;
    location?: string | undefined;
    description?: string | undefined;
    phone?: string | undefined;
  }) {
    if (!user) return;

    try {
      const userInfo = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      // console.log(userInfo);

      await setDoc(
        doc(db, "users", user.uid),
        { ...userInfo },
        {
          merge: true,
        },
      );

      setLoading(false);
      toast.success("Dados salvos com sucesso");
      setEditModalIsOpen(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "permission-denied":
            toast.error("Sem permissão para salvar os dados");
            break;

          case "unavailable":
            toast.error("Firestore indisponível no momento");
            break;

          default:
            toast.error(`Erro do Firebase: ${error.message}`);
        }
      } else {
        toast.error(`Erro inesperado: ${error}`);
      }
    }
  }

  async function makeUploadsAndGetUrls(): Promise<
    Partial<{ cover: string; profile: string }>
  > {
    const profileFormData = new FormData();
    const coverFormData = new FormData();

    if (profileImage?.file && profileImage.file !== null) {
      profileFormData.append("profile", profileImage.file);
    }

    if (profileCover?.file && profileCover.file !== null) {
      coverFormData.append("cover", profileCover.file);
    }

    const uploads = await Promise.all(
      [
        {
          key: "cover",
          endpoint: "/api/cover",
          formData: coverFormData,
        },
        {
          key: "profile",
          endpoint: "/api/profile",
          formData: profileFormData,
        },
      ]
        .filter(({ key, formData }) => formData.get(key))
        .map(async ({ formData, endpoint }) => {
          const res = await fetch(`${endpoint}/${user?.uid}`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Erro no upload");
          }

          return res.json();
        }),
    );

    const urls: Partial<{ cover: string; profile: string }> = uploads.reduce(
      (acc, img) => {
        acc = { ...acc, [`${img.place}`]: img.url };
        return acc;
      },
      {},
    );

    return urls;
  }

  async function updateFirebasePhoto() {
    if (!user) return;

    await updateProfile(user, {
      photoURL: null,
    });
  }

  // Validando arquivo antes de setar ele como valido no estado
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const maxSize = 1 * 1024 * 1024;
    const sentFile = e.target.files?.[0];
    const inputName = e.target.name;
    const profileCoverSize = sentFile ? sentFile.size : 0;
    const profileImageSize = sentFile ? sentFile.size : 0;

    if (!sentFile) return;

    const file = {
      place: inputName,
      preview: URL.createObjectURL(sentFile),
      file: sentFile,
    };

    if (inputName === "cover") {
      if (profileCoverSize > maxSize) {
        toast.error(`A imagem de capa deve ter no máximo 1 MB.`);
        return setProfileCover(null);
      }
      setProfileCover(file ?? null);
    } else {
      if (profileImageSize > maxSize) {
        toast.error(`A imagem de perfil deve ter no máximo 500 KB.`);
        return setProfileImage(null);
      }
      setProfileImage(file ?? null);
    }
  }

  async function handleVerifyEmail() {
    if (user && !user.emailVerified) {
      try {
        // toast.loading('Enviando email, aguarde!')
        await sendEmailVerification(user);
        toast.success(
          "Enviamos um link de verificação para o seu email. Verifique sua caixa de entrada (e o spam).",
        );
      } catch (error: unknown) {
        const erro =
          error instanceof FirebaseError
            ? error
            : new Error("Erro desconhecido");
        toast.error(erro.message);
      }
    }
  }
  
  
  // Calculando caracteres restantes
  
  useEffect(() => {
    if (profile) {
      setProfileInfo({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        profession: profile.profession ?? "",
        location: profile.location ?? "",
        description: profile.description ?? "",
      });
    }
  }, [profile]);
  
  if (profileLoading) return <p>Carregando...</p>;
  
  // useEffect(() => {
  //   setSizeDescription(215 - profileInfo.description.length);
  // }, [profileInfo.description]);

  return (
    <>
     {profile && (
      <>
         <Modal
        isOpen={editModalIsOpen}
        setIsOpen={setEditModalIsOpen}
        style="w-[70%] h-[97%]"
      >
        {/* Header */}
        <div className="flex justify-end">
          <div className="hover:bg-gray-100 p-2 rounded-lg">
            <MdClose
              className="hover:bg-gray-100"
              onClick={() => setEditModalIsOpen(false)}
            />
          </div>
        </div>

        <div className="px-6 py-0 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 z-10">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Editar Perfil
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 h-[76%] overflow-y-auto p-6 space-y-8 ">
          {/* Photo Management */}
          <section className="space-y-4">
            {/* Capa do modal de edit */}
            <div className="relative group">
              {profileCover?.preview || profile?.profile ? (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                  <Image
                    src={profileCover?.preview || profile?.cover || "/capa.png"}
                    alt="Imagem de capa do perfil"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={false}
                  />
                </div>
              ) : (
                <div className="h-40 w-full rounded-xl bg-gray-200 bg-center border-2 border-dashed border-neutral-200 dark:border-neutral-700" />
              )}
              <div className="group absolute inset-0 flex items-center justify-center">
                <input
                  ref={inputFile}
                  type="file"
                  name="cover"
                  id=""
                  className="hidden"
                  accept="image/webp, image/png, image/jpeg, image/jpg"
                  onChange={handleFile}
                />
                <button
                  className="bg-white/90 opacity-0 dark:bg-black/90 hover:bg-white text-neutral-900 dark:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all group-hover:opacity-100"
                  onClick={() => inputFile.current?.click()}
                >
                  <MdUpload size={20} />
                </button>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  className="size-24 rounded-full border-4 border-white dark:border-neutral-800 shadow-md object-cover"
                  src={`${
                    profileImage?.preview || profile?.profile || "/place.webp"
                  }`}
                  alt="Profile"
                />
                <input
                  ref={inputPhotoProfileRef}
                  type="file"
                  name="profile"
                  id=""
                  className="hidden"
                  accept="image/webp,image/png,image/jpeg,image/jpg"
                  onChange={handleFile}
                />
                <button
                  className="absolute bottom-0 right-0 size-8 bg-primary hover:bg-green-400 text-neutral-900 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center shadow-sm transition-colors"
                  onClick={() => inputPhotoProfileRef.current?.click()}
                >
                  <MdEdit size={18} />
                </button>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  Imagem de Perfil
                </h4>
                <p className="text-sm text-neutral-500 mb-2">
                  Recomendado: 400x400px
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => setProfileImage(null)}
                    className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline decoration-dotted"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <form
            onSubmit={handleForm}
            id="profileInfosForm"
            className="space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Informações pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* input name */}
              <div className="space-y-1.5">
                <label className="text-sm flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                  Nome completo
                  {hasError("name") && (
                    <span className="text-xs font-light text-red-500">
                      {error?.name}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full capitalize px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                    error?.name?.length && "ring-2 ring-red-500"
                  }`}
                  value={profileInfo?.name}
                  onChange={handleChange}
                />
              </div>

              {/* input email */}
              <div className="space-y-1.5">
                <label className="text-sm flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                  Email
                  {!user?.emailVerified && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Email não verificado
                    </span>
                  )}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="email"
                    disabled={true}
                    className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                      error?.name?.length && "ring-2 ring-red-500"
                    }`}
                    value={profile?.email}
                    onChange={handleChange}
                  />
                  {user?.emailVerified ? (
                    <MdVerified
                      size={18}
                      className="absolute text-green-500 right-4 top-1/2 -translate-y-1/2 text-xs font-medium focus:outline-none "
                    />
                  ) : (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 px-3 py-1 text-xs font-medium focus:outline-none hover:text-green-500"
                      onClick={handleVerifyEmail}
                    >
                      Verificar
                    </button>
                  )}
                </div>
              </div>

              {/* Input Profissão */}
              <div className="space-y-1.5">
                <label className="text-sm flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                  Profissão
                  {hasError("profession") && (
                    <span className="text-xs font-light text-red-500">
                      {error?.profession}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="profession"
                  className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                    error?.profession?.length && "ring-2 ring-red-500"
                  }`}
                  placeholder="Insira sua profissão"
                  value={profileInfo?.profession}
                  onChange={handleChange}
                />
              </div>

              {/* Input Numero */}
              <div className="space-y-1.5">
                <label className="text-sm flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                  Numero de contato
                  {hasError("phone") && (
                    <span className="text-xs font-light text-red-500">
                      {error?.profession}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="phone"
                  className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                    error?.profession?.length && "ring-2 ring-red-500"
                  }`}
                  placeholder="(12) 992456578"
                  value={profileInfo?.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input localização */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Onde mora (Cidade, Estado)
                {hasError("location") && (
                  <span className="text-xs font-light text-red-500">
                    {error?.location}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="location"
                className={`w-full capitalize px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                  error?.location?.length && "ring-2 ring-red-500"
                }`}
                placeholder="ex: Rio de Janeiro, RJ"
                value={profileInfo?.location}
                onChange={handleChange}
              />
            </div>

            {/* Input bios */}
            <div className="space-y-1.5">
              <label className="text-sm flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                Bio
                {hasError("description") && (
                  <span className="text-xs font-light text-red-500">
                    {error?.description}
                  </span>
                )}
                <span className="text-xs font-light">
                  Restam {215 - profileInfo.description.length} caracteres
                </span>
              </label>
              <textarea
                rows={4}
                maxLength={215}
                name="description"
                className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-gray-500  focus:border-transparent transition-all outline-none ${
                  error?.profession?.length && "ring-2 ring-red-500"
                }`}
                placeholder="Cria uma bios para seu perfil"
                value={profileInfo?.description}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-neutral-900 z-10">
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:text-green-400 dark:text-neutral-400 dark:hover:text-white transition-colors"
            onClick={() => {
              setEditModalIsOpen(false);
              setProfileInfo(formInitialState);
              setProfileCover(null);
              setProfileImage(null);
              setError(null);
            }}
          >
            Cancel
          </button>
          <button
            form="profileInfosForm"
            type="submit"
            disabled={loading}
            className={` px-8 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all transform
            ${
              loading
                ? "bg-green-300 text-neutral-700 cursor-not-allowed"
                : "bg-green-400 hover:scale-102 hover:shadow-lg text-neutral-900 active:scale-95"
            }`}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </Modal>

      {/* Body */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
        {/* Capa */}
        <div className="relative h-40 w-full">
          <Image
            src={profile?.cover || "/capa.png"}
            alt="Imagem de capa do perfil"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Informações do usuário */}
        <div className="px-6">
          <div className="flex justify-between items-end -mt-16 ">
            <div className="relative flex flex-col gap-2 flex-1">
              {/* Foto de perfil */}
              <div className="flex justify-between w-full items-end">
                <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src={profile?.profile || "/place.webp"}
                    alt="profile image"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => setEditModalIsOpen(true)}
                  className="px-4 py-2 rounded-lg  bg-white font-bold text-sm hover:bg-gray-50 "
                >
                  <MdEdit size={20} />
                  {/* <span className="hidden sm:inline">Edit Profile</span> */}
                </button>
              </div>

              {/* Nome usuário */}
              <div className="gap-1 space-y-2">
                <h1 className="text-2xl font-bold capitalize text-gray-900 dark:text-white flex items-center gap-1">
                  {profile?.name.trim().split(/\s+/)[0]}
                  {profile?.profileVerified && (
                    <MdVerified className="text-blue-500 text-xs " />
                  )}
                </h1>
                {profile?.location && (
                  <p className="text-sm capitalize text-gray-500 font-medium">
                    {profile?.profession} - {profile?.location}
                  </p>
                )}

                {/* Bio */}
                {profile?.description ? (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    {profile?.description}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    Edite seu perfil e adicione a bios que combina com você
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {profile?.name.trim().split(/\s+/)[0]}
              <MdVerified className="text-blue-500" />
            </h1>
            {profile?.profession && profile?.location ? (
              <p className="text-sm capitalize text-gray-500 font-medium">
                {profile?.profession}, {profile?.location}
              </p>
            ) : (
              <p>Cidade, SC</p>
            )}
          </div>

          {/* Estatísticas */}
          {/* <div className="flex  flex-wrap gap-8 border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex flex-col cursor-pointer group">
            <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
              12
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Active Listings
            </span>
          </div>
          <div className="flex flex-col cursor-pointer group">
            <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
              148
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Sold Properties
            </span>
          </div>
          <div className="flex flex-col cursor-pointer group">
            <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
              850
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Followers
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1">
              4.9{" "}
              <span className="text-yellow-400 text-sm material-symbols-filled">
                star
              </span>
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Rating
            </span>
          </div>
        </div> */}
        </div>
      </div>
      </>
    )}
    </>
  );
}
