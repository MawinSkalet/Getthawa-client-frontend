import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import I18nText from "@/components/I18nText";

export function ContactSection() {
  return (
    <footer
      id="contact"
      className="scroll-mt-[100px] w-full py-16 px-4 md:px-8 bg-[#1A0F0B] text-white border-t border-[#3A221A]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Contact Us Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#E5B869] font-serif font-bold text-center mb-10">
          <I18nText i18nKey="sections.contact.title" fallback="Contact Us" />
        </h2>

        {/* 2-Column Footer Layout matching Figma Image 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto bg-[#261510] border border-[#4A2C22] p-8 md:p-10 rounded-2xl shadow-xl">
          {/* Left: Inviting Tagline */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-light">
              Your moment of relaxation awaits. Step into Getthawha and experience the beauty of traditional Thai wellness.
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs uppercase tracking-widest text-[#E5B869] font-serif">
                ❖ GETTHAWHА THAI MASSAGE ❖
              </span>
            </div>
          </div>

          {/* Right: Contact Information & Storefront thumbnail */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t md:border-t-0 md:border-l border-[#4A2C22] pt-6 md:pt-0 md:pl-8">
            <div className="space-y-3 text-sm text-white/90">
              <p className="flex items-center gap-2">
                <span className="text-[#E5B869]">📍</span>
                <span>Rimping, Chiang Mai</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#E5B869]">📞</span>
                <a className="hover:text-[#E5B869] transition-colors" href="tel:0876579546">
                  087-657-9546
                </a>
                <span className="text-white/40">|</span>
                <a className="hover:text-[#E5B869] transition-colors" href="tel:053247661">
                  053-247-661
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#E5B869]">✉️</span>
                <a className="hover:text-[#E5B869] transition-colors" href="mailto:pawinee.qa@gmail.com">
                  pawinee.qa@gmail.com
                </a>
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform inline-block"
                  aria-label="Contact via LINE"
                >
                  <Image
                    src="/figma-assets/images.png"
                    alt="LINE"
                    width={28}
                    height={28}
                    className="rounded-full shadow-md"
                  />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform inline-block"
                  aria-label="Visit Facebook page"
                >
                  <Image
                    src="/figma-assets/facebook-icon-qwj.png"
                    alt="Facebook"
                    width={28}
                    height={28}
                    className="rounded-full shadow-md"
                  />
                </a>
              </div>
            </div>

            {/* Storefront Thumbnail */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#E5B869]/40 shrink-0 shadow-lg">
              <Image
                src="/branch-4.jpg"
                alt="Getthawha Storefront"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 text-center text-xs text-white/40 border-t border-white/5 pt-6">
          © {new Date().getFullYear()} Getthawha Thai Massage & Wellness. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
