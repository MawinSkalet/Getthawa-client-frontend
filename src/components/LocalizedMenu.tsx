"use client";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import type { ServiceGroup } from "@/lib/bookingCatalog";

export default function LocalizedMenu({ groups }: { groups: ServiceGroup[] }) {
  const { tr, language, locale } = useSiteTranslation();
  if (!groups.length) return null;
  return <details key={language} className="localized-menu" open={language !== "en"}>
    <summary>{tr("Read menu and prices")}</summary>
    <ul>{groups.map(group => <li key={group.variants[0].id}>
      <h3>{tr(group.baseTitle)}</h3>
      <p>{group.variants.map(variant => tr("{{duration}} min", { duration: variant.duration }) + " · ฿" + variant.price.toLocaleString(locale)).join(" / ")}</p>
    </li>)}</ul>
  </details>;
}
