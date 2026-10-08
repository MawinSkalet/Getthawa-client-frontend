"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for styling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const throttledScroll = throttle(handleScroll, 16); // 60fps
    handleScroll();
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <div
      data-hero-overlay={pathname === "/" && scrollY < 40}
      data-scrolled={scrollY >= 40}
      className={`site-navbar fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${["/booking", "/profile", "/reviews"].includes(pathname) ? "account-page-navbar" : ""}`}
      style={{
        backgroundColor: scrollY >= 40 ? "transparent" : undefined,
        borderBottom:
          scrollY >= 40 ? "1px solid rgba(229, 184, 105, 0.1)" : undefined,
        boxShadow:
          scrollY >= 40
            ? "0 4px 14px rgba(0, 0, 0, 0.1)"
            : "none",
        backdropFilter: scrollY >= 40 ? "blur(6px)" : "none",
      }}
    >
      <NavbarMobile scrolled={scrollY >= 40} />
      <NavbarDesktop scrolled={scrollY >= 40} />
    </div>
  );
};

// Throttle utility for performance
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function throttled(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      window.setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export default Navbar;
