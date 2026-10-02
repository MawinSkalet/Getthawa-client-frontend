"use client";
import SiteText from "@/components/SiteText";


import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import PromotionImage from "@/components/PromotionImage";

export type PromotionCard = {
  id: string;
  title: string;
  imageSrc: string;
  variants: { id: string; duration: number; price: number }[];
};

export default function PromotionCarousel({ promotions }: { promotions: PromotionCard[] }) {
  const { tr, locale } = useSiteTranslation();
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = promotions.length;
  const selected = active % Math.max(count, 1);
  const move = (step: number) => setActive(index => (index + step + count) % count);

  if (!count) return <div className="promotion-empty"><p><SiteText text={"No active promotions at the moment."} /></p><Link className="gold-button" href="/booking"><SiteText text={"Explore treatments"} /></Link></div>;

  return (
    <div className="promotion-carousel" role="region" aria-roledescription="carousel" aria-label="Promotions"
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={event => {
        if (count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}>
      <div className="coverflow-stage"
        onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={event => {
          if (!touchStart.current || count < 2) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        {promotions.map((promo, index) => {
          let offset = (index - selected + count) % count;
          if (offset > count / 2) offset -= count;
          const current = index === selected;
          const visible = Math.abs(offset) <= 2;
          return <article key={promo.id} className="promotion-card" data-active={current}
            role="group" aria-roledescription="slide" aria-label={tr("Promotion {{number}} of {{total}}: {{title}}", { number: index + 1, total: count, title: tr(promo.title) })}
            aria-hidden={!current} inert={!current}
            style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: count - Math.abs(offset), visibility: visible ? "visible" : "hidden" } as CSSProperties}>
            <div className="promotion-photo"><PromotionImage src={promo.imageSrc} alt={tr(promo.title)} /></div>
            <div className="promotion-copy">
              <h3>{tr(promo.title)}</h3>
              <div className="promotion-variants">
                {promo.variants.map(variant => <p key={variant.id}><span>{variant.duration} <SiteText text={"min"} /></span><strong>฿{variant.price.toLocaleString(locale)}</strong></p>)}
              </div>
              <Link className="promotion-book" href={`/booking?packageId=${encodeURIComponent(promo.id)}`}><SiteText text={"Book this package"} /></Link>
            </div>
          </article>;
        })}
      </div>
      {count > 1 && <div className="carousel-controls">
        <button className="carousel-arrow" type="button" aria-label={tr("Previous promotion")} onClick={() => move(-1)}>←</button>
        <div className="carousel-dots">
          {promotions.map((promo, index) => <button type="button" key={promo.id} aria-label={tr("Show promotion {{number}}: {{title}}", { number: index + 1, title: tr(promo.title) })} aria-current={index === selected ? "true" : undefined} onClick={() => setActive(index)} />)}
        </div>
        <button className="carousel-arrow" type="button" aria-label={tr("Next promotion")} onClick={() => move(1)}>→</button>
      </div>}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{tr("Promotion {{number}} of {{total}}: {{title}}", { number: selected + 1, total: count, title: tr(promotions[selected].title) })}</p>
    </div>
  );
}
