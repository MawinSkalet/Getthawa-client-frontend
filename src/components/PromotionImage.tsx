"use client";
import Image from "next/image";
import { useState } from "react";
const fallback = "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg";
export default function PromotionImage({src,alt}:{src:string;alt:string}) {
  const [failed,setFailed]=useState(false);
  const unavailable = src === "https://images.unsplash.com/photo-1544161515-4ab6ce6db874";
  return <Image src={failed || unavailable || !src ? fallback : src} alt={alt} fill className="object-cover" sizes="(min-width:1024px) 25vw, 90vw" onError={() => setFailed(true)} />;
}
