"use client";

import { getDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "@/app/config/firebase";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import {
  MdAddHomeWork,
  MdAddRoad,
  MdAspectRatio,
  MdCheckCircle,
  MdElectricalServices,
  MdEmail,
  MdFavorite,
  MdForest,
  MdHiking,
  MdLandscape,
  MdLocationOn,
  MdMonetizationOn,
  MdShare,
  MdTerrain,
  MdWaterDrop,
  MdWavingHand,
} from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { useEffect, useState } from "react";
import { PostProps } from "@/app/app/profile/[slug]/criar-anuncio/components/Form";
import { NormalizedAd, PostSchema } from "@/app/utils/zod";
import { useRef } from "react";
import L from "leaflet";

type Unit = "ha" | "acre" | "sqm";

export function PostDetails({ uid }: { uid: string | undefined }) {
  const mapRef = useRef<L.Map | null>(null);

  const [post, setPost] = useState<NormalizedAd | null>(null);
  const [loading, setLoading] = useState(false);

  function formatSize(size: number, unit: Unit): string {
    if (unit === "ha") {
      return size === 1 ? "1 hectare" : `${size} hectares`;
    }

    if (unit === "acre") {
      return size === 1 ? "1 acre" : `${size} acres`;
    }

    if (unit === "sqm") {
      return `${size} m²`;
    }

    return "";
  }

  function getUpperCaseLatter(text: string = "") {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    async function getDocument() {
      if (!uid) {
        return <p>Impossivel encontrar documento</p>;
      }
      setLoading(true);
      const docRef = doc(db, "ads", uid);
      const docSnap = await getDoc(docRef);
      setLoading(false);

      if (docSnap.exists()) {
        setPost(docSnap.data() as NormalizedAd);
      }
    }

    getDocument();
  }, []);

  useEffect(() => {     
    if (!mapRef.current || !post?.location?.coord) return;

    const { lat, lng } = post?.location.coord;

    const map = L.map('mapa').setView([-15, -22], 13);

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" },
    );

    const googleStreets = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      },
    );

    const baseMaps = {
      Satélite: satellite,
      Ruas: googleStreets,
    };

    satellite.addTo(map);

    L.control.layers(baseMaps).addTo(map);
  }, [post]);



  return (
    <>
      {loading ? (
        <p>Carregando</p>
      ) : (
        <div className="space-y-4 px-1 md:px-0">
          <div className="relative h-100">
            <Swiper
              modules={[Navigation]}
              navigation
              loop
              slidesPerView={1}
              spaceBetween={20}
              className="select-none"
            >
              <SwiperSlide className="h-100">
                {post?.imgs.map((link, i) => (
                  <div key={i} className="relative w-full h-full aspect-video">
                    <Image
                      src={`${link}`}
                      alt="Slide"
                      fill
                      className="object-cover rounded-xl sm:rounded-sm"
                    />
                  </div>
                ))}
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                      {getUpperCaseLatter(post?.details.title)}
                    </h1>
                    <p className="text-zinc-500 flex items-center gap-1">
                      <MdLocationOn />
                      {`${getUpperCaseLatter(post?.location.city)}, ${post?.location.state}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                      <MdShare />
                    </button>
                    <button className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                      <MdFavorite />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 rounded-xl flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                      <MdAspectRatio className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold">
                        Tamanho terreno
                      </p>
                      <p className="text-zinc-900 dark:text-white font-bold">
                        {formatSize(
                          post?.details.landSize as number,
                          post?.details.unit as Unit,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-100 hidden dark:bg-zinc-800/50 px-4 py-3 rounded-xl  items-center gap-3">
                    <div className="size-10 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                      <MdMonetizationOn className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold">
                        Price/Acre
                      </p>
                      <p className="text-zinc-900 dark:text-white font-bold">
                        $9,000
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 rounded-xl flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                      <MdLandscape className="text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold">
                        Zona
                      </p>
                      <p className="text-zinc-900 dark:text-white font-bold">
                        {getUpperCaseLatter(post?.details.type)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  Sobre esse terreno
                </h3>
                <div className="max-w-none text-zinc-600 dark:text-zinc-300">
                  <p className="mb-4">
                    {getUpperCaseLatter(post?.description)}
                  </p>
                  {/* <p className="mb-4">
                    <strong className="text-zinc-900 dark:text-white">
                      Power is available at the road
                    </strong>
                    , saving you significant development costs. A seasonal creek
                    runs through the northern edge of the property, attracting
                    local wildlife including elk and mule deer.
                  </p>
                  <p>
                    Enjoy panoramic views of the Sangre de Cristo mountain
                    range. This area is known for its dark skies, making it
                    perfect for stargazing. No HOA, so bring your RV for weekend
                    getaways while you plan your build!
                  </p> */}
                </div>
                {/* <button className="mt-4 text-green-600 font-bold flex items-center gap-1 hover:underline">
                  Read more{" "}
                  <span className="material-symbols-outlined text-sm">
                    expand_more
                  </span>
                </button> */}
              </div>

              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                  Features & Amenities
                </h3>
                {post?.features.map((item, i) => (
                  <div className="flex flex-wrap items-center gap-2" key={i}>
                    <MdCheckCircle className="text-green-500" />
                    <span className="inline-block">{item}</span>
                  </div>
                ))}
                {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdElectricalServices className="text-zinc-400" />
                    <span>Power at Street</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdWaterDrop className="text-zinc-400" />
                    <span>Well Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdAddRoad className="text-zinc-400" />
                    <span>Dirt Road Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdForest className="text-zinc-400" />
                    <span>Wooded</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdTerrain className="text-zinc-400" />
                    <span>Rolling Terrain</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MdAddHomeWork className="text-zinc-400" />
                    <span>No HOA</span>
                  </div>
                </div> */}
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  Location
                </h3>
                 <div>
                  <div id="mapa" style={{ height: '180px', zIndex: 1 }}  />
                 </div>
                {/* <div className="rounded-2xl overflow-hidden h-64 w-full bg-zinc-100 cursor-pointer border border-zinc-200">
                </div> */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm text-zinc-500">
                  <div className="flex items-start gap-2">
                    <GiPathDistance className="text-zinc-400" />
                    <span>15 mins to San Luis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MdHiking className="text-zinc-400" />
                    <span>25 mins to Great Sand Dunes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar de Preço/Contato */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                      R${" "}
                      {post?.details.price.toLocaleString("pt-BR", {
                        currency: "BRL",
                      })}
                    </span>
                    <span className="text-zinc-500 text-sm">
                      {" "}
                      / preço à vista
                    </span>
                  </div>
                  {/* <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Doc Fee</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        $250
                      </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Property Taxes</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        ~$120 / yr
                      </span>
                    </div>
                  </div> */}
                  <div className="space-y-3">
                    <button className="w-full bg-green-500 hover:bg-green-400 text-zinc-900 font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                      <MdEmail />
                      Fale com vendedor
                    </button>
                    <button className="w-full bg-transparent border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white text-zinc-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                      <MdWavingHand />
                      Mostrar interesse
                    </button>
                  </div>
                  <p className="text-center text-xs text-zinc-400 mt-4">
                    Sem compromisso. Tire suas dúvidas diretamente.
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4">
                  <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shrink-0">
                    RP
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1 mb-0.5">
                      <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                        Rocky Mtn Properties
                      </h3>
                      <span
                        className="material-symbols-outlined text-[16px] text-blue-500"
                        title="Verified Seller"
                      >
                        verified
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">
                      Member since 2021 • 42 Listings
                    </p>
                    <a
                      className="text-xs font-bold text-green-600 hover:underline"
                      href="#"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
