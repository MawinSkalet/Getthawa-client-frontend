"use client";

import Image from "@/components/SiteImage";
import SiteText from "@/components/SiteText";
import AccountIcon from "@/components/account/AccountIcon";
import type { RootState } from "@/stores/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function AccountNavigation({ active }: { active: "booking" | "review" }) {
  const user = useSelector((state: RootState) => state.user);
  const initials = (user.displayName || "G")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="h-fit lg:sticky lg:top-28">
      <div className="hidden border-b border-[#E5D9C7] px-2 pb-5 lg:flex lg:items-center lg:gap-3">
        {user.pictureUrl ? (
          <Image src={user.pictureUrl} alt={user.displayName || "Profile"} width={44} height={44} className="h-11 w-11 rounded-full border border-[#D8C6A7] object-cover" />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#D8C6A7] bg-[#F1E5C8] text-sm font-semibold text-[#66461C]">{initials}</span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#38281F]">{user.displayName || <SiteText text="Guest" />}</p>
          <p className="mt-0.5 text-xs text-[#766557]"><SiteText text="Your account" /></p>
        </div>
      </div>
      <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto border-b border-[#E5D9C7] pb-3 lg:mt-4 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
        <Link href="/profile" aria-current={active === "booking" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${active === "booking" ? "bg-[#F1E5C8] font-semibold text-[#66461C]" : "text-[#766557] hover:bg-[#F3EEE4] hover:text-[#38281F]"}`}>
          <AccountIcon name="calendar" />
          <span><SiteText text="My Booking" /></span>
        </Link>
        <Link href="/reviews" aria-current={active === "review" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${active === "review" ? "bg-[#F1E5C8] font-semibold text-[#66461C]" : "text-[#766557] hover:bg-[#F3EEE4] hover:text-[#38281F]"}`}>
          <AccountIcon name="review" />
          <span><SiteText text="My Review" /></span>
        </Link>
      </nav>
      <Link href="/" className="mt-5 hidden min-h-10 items-center gap-2 px-3 text-xs text-[#766557] transition hover:text-[#38281F] lg:flex">
        <AccountIcon name="back" />
        <SiteText text="Back to home" />
      </Link>
    </aside>
  );
}
