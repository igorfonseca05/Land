"use client";

import { db } from "@/app/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useRef } from "react";

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

    // mapa de ruas
    const streets = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" },
    );

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

    streets.addTo(map);

    const baseMaps = {
      Mapa: streets,
      Satélite: satellite,
      Terreno: terrain,
    };

    L.control.layers(baseMaps).addTo(map);

    map.on("click", (e) => {
      setLocation(e.latlng);
    });

    map.locate({ setView: true, maxZoom: 60 });

    map.on("locationfound", (e) => {
      setLocation(e.latlng);

      L.marker(e.latlng, { icon: userPosition }).addTo(map);
    });

    map.on("locationerror", () => {
      console.log("não encontrada");
    });
  }

  async function getLands() {
    const snapshot = await getDocs(collection(db, "mapMarkers"));

    const points = snapshot.docs.map((point) => {
      if (!point.exists()) return;

      const { lat, lng } = point.data();

      if (!mapaContainer.current) return;

      console.log(lat, lng)

      L.marker([lat, lng], { icon: customIcon }).addTo(mapaContainer.current);
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
