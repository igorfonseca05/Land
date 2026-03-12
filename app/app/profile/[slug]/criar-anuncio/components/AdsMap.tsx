"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css"
declare module "leaflet-control-geocoder"
// import {geocoder} from "leaflet-control-geocoder"; "leaflet-control-geocoder";

export function AdsMap() {
  const customMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (customMap.current) return;

    const map = L.map("mapa").setView([-22.6807, -44.3237], 13);

    customMap.current = map;

   
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

    (L.Control as any).geocoder({
      defaultMarkGeocode: true,
    }).addTo(map);
  }, []);

  return (
    <div>
      <div id="mapa" style={{ height: "400px" }}></div>
    </div>
  );
}
