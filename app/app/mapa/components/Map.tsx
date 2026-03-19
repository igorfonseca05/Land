"use client";

import { db } from "@/app/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useRef } from "react";

type Ad = {
  adId: string;
  city: string;
  lat: number;
  lng: number;
  price: number;
  status: "active" | "inactive" | "sold";
  title: string;
  image: string
};

export function Mapa() {
  const mapaContainer = useRef<L.Map | null>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -15.7806,
    lng: -47.9297,
  });

  const userPosition = L.divIcon({
    html: `
    <svg width="25" height="25" viewBox="0 0 24 24">
      <path 
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#4285F4"
      />
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const customIcon = L.divIcon({
    html: `
    <svg width="25" height="25" viewBox="0 0 24 24">
      <path 
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#6add55"
      />
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  function handleMap() {
    if (mapaContainer.current) return;
    const map = L.map("mapa").setView([location.lat, location.lng], 3.5);

    mapaContainer.current = map;

    // mapa satélite
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" },
    );

    const terrain = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenTopoMap",
      },
    );

    const googleStreets = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      },
    );

    const baseMaps = {
      Satélite: satellite,
      Terreno: terrain,
      Ruas: googleStreets,
    };

    satellite.addTo(map);

    L.control.layers(baseMaps).addTo(map);

    map.on("click", (e) => {
      setLocation(e.latlng);
    });

    // Buscando localização do usuário
    map.locate({ setView: true, maxZoom: 60 });

    map.on("locationfound", (e) => {
      setLocation(e.latlng);

      const userLocationMarker = L.marker(e.latlng, {
        icon: userPosition,
      }).addTo(map);

      userLocationMarker.bindPopup("Sua localização.");
    });

    map.on("locationerror", () => {
      console.log("não encontrada");
    });
  }

  function createAdPopup(ad: {
    id: string;
    title: string;
    price: string;
    city: string;
    image: string;
  }) {
    return `
    <div class="w-56">
      
      <img 
        src="${ad.image}" 
        alt="${ad.title}" 
        class="w-full h-28 object-cover rounded-lg"
      />

      <h3 class="font-semibold text-sm capitalize">
        ${ad.title}
      </h3>

      <p class="text-green-600 font-bold text-sm m-0 ">
        ${ad.price.toLocaleString()}
      </p>

      <p class="text-xs text-gray-500  capitalize">
        ${ad.city}
      </p>

      <a 
        href="/app/ads/${ad.id}" 
        class="block text-center bg-green-600 text-white text-xs py-1.5 rounded-md hover:bg-green-700 transition"
      >
        <span class="text-center text-white text-xs py-1.5">Ver anúncio</span>
      </a>

    </div>
  `;
  }

  // Buscando terrenos cadastrados e renderizando pins no mapa
  async function getLands() {
    const snapshot = await getDocs(collection(db, "mapMarkers"));

    const points = snapshot.docs.map((point) => {
      if (!point.exists()) return;

      const postData = point.data() as Ad;

      const { lat, lng } = point.data();

      if (!mapaContainer.current) return;

      const availableLandmarker = L.marker([lat, lng], {
        icon: customIcon,
      }).addTo(mapaContainer.current);

      availableLandmarker.bindPopup(
        createAdPopup({
          id: postData.adId,
          title: postData.title,
          price: `R$: ${postData.price}`,
          city: `${postData.city}`,
          image: postData.image,
        }),
      );
    });
  }

  useEffect(() => {
    handleMap();
    getLands();
  }, []);

  return (
    <div>
      <div id="mapa" style={{ height: "86vh", width: "100%", zIndex: 1 }} />
    </div>
  );
}
