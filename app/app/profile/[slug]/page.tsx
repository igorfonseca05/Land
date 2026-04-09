"use client";

import { Cards } from "../components/Cards";
import { UserProfile } from "../components/userInfos";
import UserListings from "../components/search";
import NoProducts from "../components/EmptyProd";
import {
  where,
  getDocs,
  collection,
  query,
  Timestamp,
  limit,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/config/firebase";
import { GlobalSpinner } from "@/app/src/components/globalSpinner/GlobalSpinner";
import { Modal } from "@/app/src/components/GlobalModal/Modal";
import { useParams } from "next/navigation";
import { PostSchemaType } from "@/app/utils/zod";
import { useAuth } from "@/app/src/context/useAuthContext";

export type Ad = {
  id: string;
  images: string[];
  details: {
    title: string;
    price: number;
    landSize: number;
    unit: "sqm" | "ha" | "acre";
    type: "";
    landRegistryNumber?: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    observation?: string;
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
  title: string;
  userId: string;
  createdAt: Timestamp;
  status: string
};

export default function profile() {
  const {user} = useAuth()
  const [ads, setAds] = useState<PostSchemaType[]>([]);
  const [loading, setLoading] = useState(false);

  // console.log(uid)


  useEffect(() => {
    setLoading(true);
    const isLoggedIn = user
    if (!isLoggedIn) return;

    const {uid} = isLoggedIn

    console.log(uid)

    const adsCollectionRef = collection(db, "ads");

    const q = query(
      adsCollectionRef,
      where("userId", "==", uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const fetchAds = async () => {
      const snapshot = await getDocs(q);
      const ads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PostSchemaType, "id">),
      }));

      setAds(ads);
      setLoading(false);
    };

    fetchAds();
  }, []);


  return (
   <>
    <div className="space-y-4">
      <UserProfile />
      <UserListings />

      {loading ? (
        <div className="flex p-8 flex-col items-center justify-center bg-white/80 z-50 rounded-lg shadow">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#84C60B]" />
          <p className="pt-2">Carregando seus anúncios</p>
        </div>
      ) : (Array.isArray(ads) && ads.length > 0) ? (
        <>
          {ads.map((card) => (
            <Cards key={card.id} infos={card} />
          ))}
        </>
      ) : (
        <NoProducts />
      )}
    </div>
   </>
  );
}
