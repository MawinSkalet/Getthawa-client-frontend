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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const res = await fetch(`${baseUrl}/branch`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // ensure SSR (no static caching)
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch branches: ${res.status}`);
  }

  return res.json();
}
