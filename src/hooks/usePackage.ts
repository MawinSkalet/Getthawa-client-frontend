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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const res = await fetch(`${baseUrl}/package`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // ensure fresh SSR
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch packages: ${res.status}`);
  }

  return res.json();
}

