import Image from "next/image";
import { redirect } from "next/navigation";
import "leaflet/dist/leaflet-src.esm"


export default function Home() {
  redirect("/auth/login");

  return (
    <div className="">
      <h1>home</h1>
    </div>
  );
}
