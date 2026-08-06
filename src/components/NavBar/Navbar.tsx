"use client";

import { useEffect, useState } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for styling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const throttledScroll = throttle(handleScroll, 16); // 60fps
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
      style={{
        boxShadow:
          scrollY > 0
            ? "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(220, 169, 0, 0.1)"
            : "none",
        backdropFilter: scrollY > 0 ? "blur(10px)" : "none",
      }}
    >
      <NavbarMobile />
      <NavbarDesktop />
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
