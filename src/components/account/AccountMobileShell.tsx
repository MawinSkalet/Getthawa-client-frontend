"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SiteText from "@/components/SiteText";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import AccountIcon from "./AccountIcon";

export default function AccountMobileShell({ children, active, onBack, footer }: {
  children: ReactNode;
  active: "booking" | "bookings" | "reviews";
  onBack?: () => void;
  footer?: ReactNode;
}) {
  const { tr } = useSiteTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="account-mobile" onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>
      <header className="gt-header">
        {onBack ? <button type="button" className="gt-icon" onClick={onBack} aria-label={tr("Back")}><AccountIcon name="back" /></button> : <Link className="gt-icon" href="/" aria-label={tr("Back to home")}><AccountIcon name="back" /></Link>}
        <Link href="/" className="gt-mobile-brand" aria-label="Getthawha Thai Massage"><BrandLogo /></Link>
        <button type="button" className="gt-icon" aria-label={tr(menuOpen ? "Close menu" : "Open menu")} aria-expanded={menuOpen} aria-controls="account-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><AccountIcon name={menuOpen ? "close" : "menu"} /></button>
      </header>
      {menuOpen && <nav className="gt-menu" id="account-mobile-menu" aria-label={tr("Account navigation")}>
        <Link href="/booking" onClick={() => setMenuOpen(false)}>Booking</Link>
        <Link href="/profile" onClick={() => setMenuOpen(false)}>My Booking</Link>
        <Link href="/reviews" onClick={() => setMenuOpen(false)}>My Review</Link>
        <LanguageSwitcher />
      </nav>}
      <div className="gt-content">{children}</div>
      {footer || (active !== "booking" && <nav className="gt-account-switch" aria-label={tr("Account navigation")}>
        <Link href="/profile" aria-current={active === "bookings" ? "page" : undefined}><AccountIcon name="calendar" /><span>My Booking</span></Link>
        <Link href="/reviews" aria-current={active === "reviews" ? "page" : undefined}><AccountIcon name="review" /><span>My Review</span></Link>
      </nav>)}
    </main>
  );
}

export function MobileHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <><h1>{title}</h1><p className="gt-subtitle"><SiteText text={subtitle} /></p></>;
}
