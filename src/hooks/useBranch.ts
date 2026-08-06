import { getBaseUrl } from "@/lib/api";

export type Branch = {
  id: string;
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

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
}

