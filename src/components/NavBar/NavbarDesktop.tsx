"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/stores/store";
import { logout } from "@/stores/userSlice";
import { useActiveSection } from "@/hooks/useActiveSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import "@/locales/i18n";
import { logoutUser } from "@/lib/logout";
const NavbarDesktop = () => {
  const displayName = useSelector((state: RootState) => state.user.displayName);
  const pictureUrl = useSelector((state: RootState) => state.user.pictureUrl);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);
  const localeFontClass = useLocaleFontClass();
  useEffect(() => setHydrated(true), []);

  const active = useActiveSection();
  const readyText = (k: string, fb: string) => (hydrated ? t(k) : fb);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    router.push("/");
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!displayName) {
      e.preventDefault();
      // Redirect to login if user is not authenticated
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/line/authentication`;
    }
  };

  return (
    <div
      className="hidden md:block text-white py-3"
      style={{
        backgroundColor: "rgba(32, 8, 0, 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`${localeFontClass} text-2xl lg:text-3xl font-semibold hover:text-[#DCA900] transition-colors duration-300`}
              style={{
                color: "#DCA900",
                letterSpacing: "0.1em",
              }}
            >
              GETTHAWHA
            </Link>
            <div className="hidden lg:block text-sm text-white/70 border-l border-white/20 pl-4">
              <span className={localeFontClass}>
                THAI MASSAGE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-2">
            {[
              {
                key: "location",
                href: "/#location",
                label: readyText("nav.location", "Location"),
              },
              {
                key: "services",
                href: "/#services",
                label: readyText("nav.services", "Services"),
              },
              {
                key: "promotion",
                href: "/#promotion",
                label: readyText("nav.promotion", "Promotion"),
              },
              {
                key: "branches",
                href: "/#branches",
                label: readyText("nav.branches", "Branches"),
              },
              {
                key: "testimonials",
                href: "/#testimonials",
                label: readyText("nav.testimonials", "Testimonials"),
              },
              {
                key: "contact",
                href: "/#contact",
                label: readyText("nav.contact", "Contact"),
              },
            ].map(({ key, href, label }) => (
              <Link
                key={key}
                href={href}
                prefetch={false}
                className={`${localeFontClass} relative px-3 py-2 text-sm lg:text-base rounded-lg transition-all duration-300 ${
                  active === key
                    ? "text-[#DCA900] "
                    : "text-white/90 hover:text-[#DCA900] hover:bg-white/5"
                }`}
                style={{
                  fontWeight: 400,
                }}
              >
                <span
                  className={`relative ${
                    active === key ? "border-b-2 border-[#DCA900] pb-1" : ""
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}

            {/* Booking Button */}
            <Link
              href="/booking"
              prefetch={false}
              onClick={handleBookingClick}
              className={`${localeFontClass} px-4 py-2 ml-2 rounded-lg text-sm lg:text-base font-semibold transition-all duration-300 ${
                !displayName
                  ? "bg-white/10 text-white/70 cursor-not-allowed border border-white/20"
                  : active === "booking"
                  ? "bg-[#DCA900] text-[#200800] shadow-lg"
                  : "bg-[#DCA900]/90 text-white hover:bg-[#DCA900] hover:shadow-lg"
              }`}
              title={
                !displayName
                  ? readyText("nav.loginRequired", "Login required to book")
                  : ""
              }
            >
              <span
                className={`${
                  active === "booking" && displayName
                    ? "border-b-2 border-[#200800] pb-1"
                    : ""
                }`}
              >
                {readyText("nav.booking", "Booking")}
              </span>
              {!displayName && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 inline-block ml-1 opacity-60"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          </nav>

          {/* User Section & Language */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {displayName ? (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className={`${localeFontClass} btn btn-ghost px-3 py-2 text-white hover:text-[#DCA900] hover:bg-[#DCA900]/10 border border-white/20 hover:border-[#DCA900]/40 transition-all duration-300 rounded-lg`}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {pictureUrl && (
                      <Image
                        src={pictureUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#DCA900]/40"
                      />
                    )}
                    <span className="max-w-[120px] truncate text-sm">
                      {displayName}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 opacity-80"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className={`${localeFontClass} dropdown-content menu text-white rounded-lg z-[9999] mt-2 w-52 p-2 shadow-xl border border-[#DCA900]/20`}
                  style={{
                    backgroundColor: "rgba(32, 8, 0, 0.95)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <li>
                    <Link
                      href="/profile"
                      className="hover:bg-[#DCA900]/20 hover:text-[#DCA900] transition-all duration-200 px-4 py-3 rounded-lg"
                >
                  {readyText("nav.myBooking", "My Bookings")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:bg-[#DCA900]/20 hover:text-[#DCA900] transition-all duration-200 px-4 py-3 rounded-lg"
                >
                  {readyText("nav.myReviews", "My Reviews")}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 px-4 py-3 rounded-lg"
                >
                      {readyText("nav.logout", "Logout")}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() =>
                  (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/line/authentication`)
                }
                className={`${localeFontClass} px-4 py-2 text-sm font-semibold text-white border border-[#DCA900] hover:bg-[#DCA900] hover:text-[#200800] transition-all duration-300 rounded-lg`}
              >
                {readyText("nav.login", "Login")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
