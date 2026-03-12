"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useRef } from "react";

export function Mapa() {
  const mapaContainer = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapaContainer.current) return;

     const map = L.map("mapa").setView([-22.45, -44.45], 13);

     mapaContainer.current = map

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" },
    ).addTo(mapaContainer.current);

    // pegar localização do usuário
    map.locate({ setView: true, maxZoom: 16 })

    // quando a localização for encontrada
    map.on("locationfound", (e) => {

      const { lat, lng } = e.latlng

      console.log("Latitude:", lat)
      console.log("Longitude:", lng)

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup()

      L.circle([lat, lng], {
        radius: e.accuracy
      }).addTo(map)

    })

    map.on("locationerror", () => {
      // alert("Não foi possível obter sua localização")
    })

    mapaContainer.current.on("click", (e) => {
      console.log(e.latlng);
    });
  }, []);

  return (
    <div>
      <div id="mapa" style={{ height: "86vh", width: "100%", zIndex: 1 }} />
    </div>
  );
}
