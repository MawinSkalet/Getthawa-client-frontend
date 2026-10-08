import { getBaseUrl } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUrl";

export type Branch = {
  id: string;
  isActive?: boolean;
  name: string;
  address: string;
  googleMapUrl: string;
  phone: string;
  googleMapEmbedUrl: string;
  pictureUrl: string;
  description: string;
};

export async function getBranches(): Promise<Branch[]> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/branch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ensure SSR (no static caching)
    });

    if (!res.ok) {
      console.error(`Failed to fetch branches: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data.filter(branch => branch.isActive !== false && !branch.deletedAt).map(branch => ({ ...branch, pictureUrl: resolveImageUrl(branch.pictureUrl || "") })) : [];
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
}

