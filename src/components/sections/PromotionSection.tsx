
import SiteText from "@/components/SiteText";
import { buildBookingGroups } from "@/lib/bookingCatalog";
import { getPackage } from "@/hooks/usePackage";
import PromotionCarousel from "@/components/PromotionCarousel";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export async function PromotionSection({ standalone = false }: { standalone?: boolean }) {
  const data = await getPackage();
  const promotions = buildBookingGroups(data.filter(p => p.type === "promotion" && p.isActive)).map(group => ({
    id: group.variants[0].id,
    title: group.baseTitle,
    imageSrc: group.pictureUrl,
    variants: group.variants,
  }));

  return <section id="promotion" className="promotion-section" aria-labelledby="promotion-heading">
    {standalone ? <div className="promotion-page-heading"><Link href="/"><SiteText text={"← Back to home"} /></Link><h1 id="promotion-heading">Promotions</h1><p><SiteText text={"A little time for yourself. Discover our current massage packages."} /></p></div> : <SectionHeading id="promotion-heading">Promotion</SectionHeading>}
    <PromotionCarousel promotions={promotions} />
  </section>;
}
