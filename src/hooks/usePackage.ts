import { getBaseUrl } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUrl";

export type Package = {
  id: string;
  title: string;
  description: string;
  price: string; // price comes as string from API
  duration: number;
  pictureUrl: string;
  note: string;
  type: "service" | "promotion" | string;
  isActive: boolean;
};

export async function getPackage(): Promise<Package[]> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/package`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ensure fresh SSR
    });

    if (!res.ok) {
      console.error(`Failed to fetch packages: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data.filter(item => item.isActive && !item.deletedAt).map(item => ({ ...item, pictureUrl: resolveImageUrl(item.pictureUrl || "") })) : [];
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return [];
  }
}


