"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import Image from "next/image";
import type { RootState } from "@/stores/store";
import { logout } from "@/stores/userSlice";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import "@/locales/i18n";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import { logoutUser } from "@/lib/logout";

const NavbarMobile = () => {
  const displayName = useSelector((state: RootState) => state.user.displayName);
  const pictureUrl = useSelector((state: RootState) => state.user.pictureUrl);
  const dispatch = useDispatch();
  const router = useRouter();
  const active = useActiveSection();
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const readyText = (k: string, fb: string) => (hydrated ? t(k) : fb);
  const localeFontClass = useLocaleFontClass();

  const handleLogout = async () => {
    closeDrawer(); // Close drawer before logout
    await logoutUser();
    dispatch(logout());
    router.push("/");
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    closeDrawer(); // Always close the drawer first
    if (!displayName) {
      e.preventDefault();
      // Redirect to login if user is not authenticated
      router.push("/login?next=%2Fbooking");
    }
  };

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer") as HTMLInputElement;
    if (drawer) {
      drawer.checked = false;
    }
  };

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* top bar (mobile only) */}
          <div
            className="md:hidden flex justify-between items-center text-white px-4 py-2 relative z-[70] overflow-visible"
            style={{
              backgroundColor: "rgba(32, 13, 7, 0.95)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Link href="/" aria-label="Getthawha home"><BrandLogo /></Link>
            <LanguageSwitcher />

            <div className="flex items-center gap-2">
              {displayName ? (
                <div className="dropdown dropdown-end relative z-[80]">
                  <button
                    tabIndex={0}
                    className={`${localeFontClass} btn btn-ghost btn-sm px-2 text-white hover:text-[#DCA900] hover:bg-[#DCA900]/10 border border-white/20 hover:border-[#DCA900]/40 transition-all duration-300 rounded-md`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {pictureUrl && (
                        <Image
                          src={pictureUrl}
                          alt="Profile"
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="max-w-[80px] truncate text-xs">
                        {displayName}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 opacity-80"
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
                    className={`${localeFontClass} dropdown-content menu text-white rounded-lg mt-2 w-48 p-2 shadow-xl border border-[#DCA900]/20 fixed md:absolute right-2 md:right-auto top-12 md:top-auto z-[99999]`}
                    style={{
                      backgroundColor: "rgba(32, 13, 7, 0.95)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <li>
                      <Link
                        href="/profile"
                        className="hover:bg-[#DCA900]/20 hover:text-[#DCA900] transition-all duration-200 px-3 py-2 rounded-md text-sm"
                        onClick={closeDrawer}
                      >
                        {readyText("nav.myBooking", "My Booking")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/reviews"
                        className="hover:bg-[#DCA900]/20 hover:text-[#DCA900] transition-all duration-200 px-3 py-2 rounded-md text-sm"
                        onClick={closeDrawer}
                      >
                        {readyText("nav.myReviews", "My Reviews")}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded-md text-sm"
                      >
                        {readyText("nav.logout", "Logout")}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() =>
                    router.push("/login?next=%2Fbooking")
                  }
                  className={`${localeFontClass} px-3 py-1 text-xs font-semibold text-white border border-[#DCA900] hover:bg-[#DCA900] hover:text-[#200800] transition-all duration-300 rounded-md`}
                >
                  {readyText("nav.login", "Login")}
                </button>
              )}
            </div>
          </div>

          {/* main mobile nav bar */}
          <div className="md:hidden flex w-full h-[56px] text-white relative z-[60] overflow-visible">
            {/* Left section with menu and logo */}
            <div
              className="flex flex-row items-center flex-grow h-full px-4"
              style={{
                backgroundColor: "rgba(32, 8, 0, 0.95)",
                backdropFilter: "blur(12px)",
              }}
            >
              <button className="mr-3">
                <label htmlFor="my-drawer">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#DCA900]"
                  >
                    <path
                      d="M3 12h18M3 6h18M3 18h18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </button>

              <div className="flex flex-col justify-center">
                <div
                  className={`${localeFontClass} text-lg font-semibold`}
                  style={{
                    color: "#DCA900",
                    letterSpacing: "0.05em",
                  }}
                >
                  GETTHAWHA
                </div>
                <div
                  className={`${localeFontClass} text-xs text-white/70 -mt-1`}
                  style={{
                    letterSpacing: "0.1em",
                  }}
                >
                  THAI MASSAGE
                </div>
              </div>
            </div>

            {/* Booking button */}
            <div
              className={`${localeFontClass} flex justify-center items-center w-[110px] h-full text-sm font-bold transition-all duration-300 ${
                !displayName
                  ? "bg-[#DCA900]/50 text-white/70 cursor-not-allowed"
                  : active === "booking"
                  ? "bg-[#DCA900] text-[#200800] shadow-lg"
                  : "bg-[#DCA900]/90 text-white hover:bg-[#DCA900]"
              }`}
              style={{
                fontWeight: "600",
                fontSize: "14px",
              }}
              title={
                !displayName
                  ? readyText("nav.loginRequired", "Login required to book")
                  : ""
              }
            >
              <Link
                href="/booking"
                onClick={handleBookingClick}
                className="flex items-center gap-1"
              >
                {readyText("nav.booking", "BOOKING")}
                {!displayName && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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
            </div>
          </div>
        </div>
        <div className="drawer-side z-[100]">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay z-[90]"
          ></label>
          <ul
            className={`${localeFontClass} menu min-h-full w-80 p-4 text-white custom-scrollbar relative z-[100]`}
            style={{
              backgroundColor: "#280A00",
              fontWeight: 400,
              lineHeight: "250%",
              fontSize: "17px",
              letterSpacing: "0.25px",
              listStyle: "none",
            }}
          >
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                borderBottom: "1px solid #ffffff2b",
                textAlign: "left",
              }}
            >
              <Link href="/" onClick={closeDrawer}>
                {readyText("nav.home", "HOME")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                borderBottom: "1px solid #ffffff2b",
                textAlign: "left",
              }}
            >
              <Link
                href="/#location"
                prefetch={false}
                className={
                  active === "location" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.location", "LOCATION")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                borderBottom: "1px solid #ffffff2b",
                textAlign: "left",
              }}
            >
              <Link
                href="/#testimonials"
                prefetch={false}
                className={
                  active === "testimonials"
                    ? "text-yellow-400 font-semibold"
                    : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.testimonials", "TESTIMONIALS")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                borderBottom: "1px solid #ffffff2b",
                textAlign: "left",
              }}
            >
              <Link
                href="/#services"
                prefetch={false}
                className={
                  active === "services" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.services", "OUR SERVICES")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                borderBottom: "1px solid #ffffff2b",
                textAlign: "left",
              }}
            >
              <Link
                href="/#promotion"
                prefetch={false}
                className={
                  active === "promotion" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.promotion", "PROMOTION")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                textAlign: "left",
              }}
            >
              <Link
                href="/#branches"
                prefetch={false}
                className={
                  active === "branches" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.branches", "BRANCHES")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                textAlign: "left",
              }}
            >
              <Link
                href="/#contact"
                prefetch={false}
                className={
                  active === "contact" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.contact", "CONTACT US")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                textAlign: "left",
              }}
            >
              <Link
                href="/profile"
                prefetch={false}
                className={
                  active === "profile" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.myBooking", "My Bookings")}
              </Link>
            </li>
            <li
              style={{
                padding: "12px 0",
                paddingLeft: "30px",
                textAlign: "left",
              }}
            >
              <Link
                href="/reviews"
                prefetch={false}
                className={
                  active === "reviews" ? "text-yellow-400 font-semibold" : ""
                }
                onClick={closeDrawer}
              >
                {readyText("nav.myReviews", "My Reviews")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
