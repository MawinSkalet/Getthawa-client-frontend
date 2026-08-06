"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = [
  "home",
  "about",
  "location",
  "testimonials",
  "services",
  "promotion",
  "branches",
  "contact",
  "booking",
  "reviews",
  "profile",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTION_IDS[0]);
  const pathname = usePathname();

  useEffect(() => {
    // Handle route-based navigation (separate pages)
    if (pathname === "/booking") {
      setActive("booking");
      return;
    }
    if (pathname === "/reviews") {
      setActive("reviews");
      return;
    }
    if (pathname === "/profile") {
      setActive("profile");
      return;
    }
    if (pathname !== "/") {
      // For other pages, don't set any active state
      return;
    }

    // Only set up intersection observers on the home page
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      if (id === "booking" || id === "reviews" || id === "profile") return;
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        {
          // Section counts as active when its top crosses lower 40% of viewport
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  return active;
}
