"use client";
import Image, { type ImageProps, type ImageLoaderProps } from "next/image";
import manifest from "@/lib/image-manifest.json";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";

const images: Record<string, { width: number; src: string }[]> = manifest;
function localImageLoader({ src, width }: ImageLoaderProps) {
  const variants = images[src];
  return variants.find(variant => variant.width >= width)?.src ?? variants[variants.length - 1].src;
}
export default function SiteImage({ src, alt, ...props }: ImageProps) {
  const { tr } = useSiteTranslation();
  const local = typeof src === "string" && images[src];
  return <Image {...props} src={src} alt={tr(alt)} loader={local ? localImageLoader : props.loader} />;
}
