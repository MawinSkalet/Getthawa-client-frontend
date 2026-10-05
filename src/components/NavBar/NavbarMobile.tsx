"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import BrandLogo from "@/components/BrandLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { RootState } from "@/stores/store";
import { logout } from "@/stores/userSlice";
import { logoutUser } from "@/lib/logout";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import { useHydrated } from "@/hooks/useHydrated";
import "@/locales/i18n";

const links = [
  { id: "services", href: "/#services", key: "nav.services", label: "Service" },
  { id: "location", href: "/location", key: "nav.location", label: "Location" },
  { id: "branches", href: "/#branches", key: "nav.branches", label: "Branches" },
  { id: "promotion", href: "/#promotion", key: "nav.promotion", label: "Promotion" },
  { id: "testimonials", href: "/#testimonials", key: "nav.testimonials", label: "Testimonials" },
  { id: "contact", href: "/#contact", key: "nav.contact", label: "Contact Us" },
];

export default function NavbarMobile({ scrolled }: { scrolled: boolean }) {
  const displayName = useSelector((state: RootState) => state.user.displayName);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const active = useActiveSection();
  const { t, i18n } = useTranslation();
  const fontClass = useLocaleFontClass();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLDivElement>(null);
  const text = (key: string, fallback: string) => hydrated ? t(key, { defaultValue: fallback }) : fallback;
  const bookingHref = displayName ? "/booking" : "/login?next=%2Fbooking";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = Array.from(navigation.current?.querySelectorAll<HTMLElement>("a, button") || []).filter(element => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const closeOnResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logoutUser();
    dispatch(logout());
    router.push("/");
  };

  return <div ref={navigation} className={`mobile-navigation md:hidden ${fontClass}`} role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label={open ? text("nav.navigation", "Main navigation") : undefined} data-open={open} data-scrolled={scrolled} data-location={pathname === "/location"}>
    <div className="mobile-header">
      <LanguageSwitcher variant="globe" className="mobile-language" />
      <Link className="mobile-brand" href="/" aria-label="Getthawha home" onClick={() => setOpen(false)}><BrandLogo /></Link>
      <Link className="mobile-booking" href={bookingHref} onClick={() => setOpen(false)} aria-current={active === "booking" ? "page" : undefined}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18" /></svg>
        {text("nav.booking", "Booking")}
      </Link>
      <button ref={toggle} className="mobile-menu-toggle" aria-label={open ? text("nav.closeMenu", "Close menu") : text("nav.openMenu", "Open menu")} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
    </div>
    {open && <nav ref={menu} id="mobile-menu" className="mobile-menu-panel" aria-label={text("nav.navigation", "Main navigation")}>
      <div className="mobile-menu-links">
        {links.map(link => <Link key={link.id} href={link.href} prefetch={false} aria-current={active === link.id ? "location" : undefined} onClick={() => setOpen(false)}>{link.id === "services" && (!hydrated || i18n.resolvedLanguage?.startsWith("en")) ? "Service" : text(link.key, link.label)}</Link>)}
      </div>
      <div className="mobile-menu-account">
        {displayName ? <>
          <span className="mobile-account-name">{displayName}</span>
          <Link href="/profile" onClick={() => setOpen(false)}>{text("nav.myBooking", "My Booking")}</Link>
          <Link href="/reviews" onClick={() => setOpen(false)}>{text("nav.myReviews", "My Reviews")}</Link>
          <button onClick={handleLogout}>{text("nav.logout", "Logout")}</button>
        </> : <Link href="/login" onClick={() => setOpen(false)}>{text("nav.login", "Login")}</Link>}
      </div>
    </nav>}
  </div>;
}
