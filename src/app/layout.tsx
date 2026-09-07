import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/NavBar/Navbar";
import { cookies } from "next/headers";
import ClientProvider from "./ClientProvider";

import { getBaseUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Getthawha",
  description: "Getthawha Thai Massage in Chiang Mai. Explore our traditional Thai treatments, massage menu, branches and guest reviews.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("info")?.value;

  let user = null;
  if (token) {
    try {
      const response = await fetch(
        `${getBaseUrl()}/userinfo/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: token ? `info=${token}` : "",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        user = data.user || null;
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  return (
    <html lang="en">
      <body className={`antialiased vsc-initialized custom-scrollbar`}>
        <ClientProvider
          id={user?.id || ""}
          displayName={user?.displayName || ""}
          pictureUrl={user?.pictureUrl || ""}
        >
          <Navbar />
          {/* Spacer to offset fixed navbar height */}
          <div className="nav-spacer h-[76px] md:h-[104px]"></div>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
