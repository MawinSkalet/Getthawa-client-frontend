
import SiteText from "@/components/SiteText";
import Image from "@/components/SiteImage";
import I18nText from "@/components/I18nText";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

const gallery = [
  { src: "498205899_1317171190414607_4302194740465620141_n.jpg", alt: "Getthawha wooden reception area" },
  { src: "images.jpg", alt: "Getthawha teakwood logo wall" },
  { src: "1.png", alt: "Massage bed with folded towels" },
  { src: "79144015_564793101019583_7341423754087497728_n.jpg", alt: "Foot massage lounge" },
  { src: "499423492_1317171240414602_1759116723071476687_n.jpg", alt: "Traditional Thai massage room" },
];
const certifications = [
  ["home-pic2.png", "Ministry of Public Health certification"],
  ["home-pic3.png", "Thai Spa certification"],
  ["home-pic4.png", "Thai Traditional Massage certification"],
  ["home-pic5.png", "SHA Plus certification"],
  ["home-pic6.jpeg", "Chiang Mai Brand"],
  ["home-pic7.png", "TAG Thai certification"],
];

export default function HomeHero() {
  return <>
    <section id="home" className="landing-hero">
      <Image className="landing-hero-photo" src="/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg" alt="Relaxing oil massage at Getthawha" fill priority sizes="100vw" />
        <div className="landing-hero-shade" />
        <div className="landing-hero-copy">
        <h1 translate="no">GETTHAWHA<span>THAI MASSAGE</span></h1>
        <p><I18nText i18nKey="hero.description" fallback="Experience authentic Thai massage techniques in a serene environment designed for ultimate relaxation and recovery." /></p>
        <div className="landing-hero-actions">
          <Link className="landing-hero-booking" href="/booking">
            <I18nText i18nKey="hero.bookNow" fallback="Book Now" />
          </Link>
          <Link className="landing-hero-services" href="#services">
            <I18nText i18nKey="hero.viewServices" fallback="View Services" />
          </Link>
        </div>
        <div className="certification-row">{certifications.map(([src, alt]) => <Image key={src} src={`/certifications/${src}`} alt={alt} width={76} height={76} />)}</div>
      </div>
    </section>
    <section id="about" className="about-section">
      <div className="about-intro">
        <SectionHeading>About</SectionHeading>
        <h2><SiteText text="Where Tradition Meets Modern Wellness" /></h2>
        <div className="about-description">
          <p><SiteText text={"Inspired by centuries of Thai healing traditions, GETTHAWHA brings together authentic techniques, mindful care, and modern wellness."} /></p>
          <p><SiteText text={"Every treatment is thoughtfully crafted to restore balance, ease tension, and create a moment of tranquility for both body and mind."} /></p>
        </div>
      </div>
      <div className="about-gallery">{gallery.map(item => <div key={item.src}><Image src={`/figma-assets/${item.src}`} alt={item.alt} fill sizes="(max-width: 600px) 40vw, 19vw" className="object-cover" /></div>)}</div>
    </section>
  </>;
}
