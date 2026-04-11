"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder";
declare module "leaflet-control-geocoder";


export function AdsMap({
  handleLocationDetails,
}: {
  handleLocationDetails: (name: string, value: any) => void;
}) {
  const customMap = useRef<L.Map | null>(null);

  // const [newPinLocation, setNewPinLocation] = useState<MapProps | null>(null);
  const [addedMarker, setNewMarker] = useState<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLngExpression>({
    lat: -23,
    lng: -46,
  });

  useEffect(() => {
    if (customMap.current) return;

    const map = L.map("mapa").setView(userLocation, 15);
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

    satellite.addTo(map);

    const baseMaps = {
      Mapa: streets,
      Satélite: satellite,
      Terreno: terrain,
    };

    L.control.layers(baseMaps).addTo(map);

    (L.Control as any)
      .geocoder({
        defaultMarkGeocode: true,
      })
      .addTo(map);

    map.on("click", (e) => {
      const customIcon = L.divIcon({
        html: `
          <svg width="25" height="25" viewBox="0 0 24 24">
            <path 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#72fb5e"
            />
            <circle cx="12" cy="9" r="3" fill="white"/>
          </svg>
        `,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker(e.latlng, {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      setNewMarker((prev) => {
        if (prev) {
          prev.removeFrom(map);
        }

        return marker;
      });

      handleLocationDetails("coord", {
        lat: marker.getLatLng().lat,
        lng: marker.getLatLng().lng,
      });

      marker.on("dragend", (e) => {
        handleLocationDetails("coord", {
          lat: marker.getLatLng().lat,
          lng: marker.getLatLng().lng,
        });
      });

      marker.on("contextmenu", (e) => {
        marker.removeFrom(map);
        handleLocationDetails("coord", {
          lat: "",
          lng: "",
        });
      });
    });

    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: true,
    });

    map.on("locationfound", (e) => {
      const userLocationIcon = L.divIcon({
        html: `
    <div style="
      width:20px;
      height:20px;
      background:#1a73e8;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 6px rgba(26,115,232,0.25);
    "></div>
  `,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker(e.latlng, {
        icon: userLocationIcon,
        draggable: true,
      }).addTo(map);

      L.circle(e.latlng, {
        radius: e.accuracy,
        color: "#1a73e8",
        fillOpacity: 0.05,
      }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setUserLocation(pos);
      });

      setUserLocation(e.latlng);
    });
  }, []);

  return (
    <div>
      <div id="mapa" style={{ height: "400px", zIndex: 1 }}></div>
    </div>
  );
}
