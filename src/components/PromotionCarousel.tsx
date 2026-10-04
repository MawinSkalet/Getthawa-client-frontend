"use client";

import SiteText from "@/components/SiteText";
import PromotionImage from "@/components/PromotionImage";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type TransitionEvent } from "react";

export type PromotionCard = {
  id: string;
  title: string;
  imageSrc: string;
  variants: { id: string; duration: number; price: number }[];
};

export default function PromotionCarousel({ promotions }: { promotions: PromotionCard[] }) {
  const { tr, locale } = useSiteTranslation();
  const [position, setPosition] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);
  const count = promotions.length;
  const visibleRange = count > 1 ? 1 : 0;
  const padding = count > 1 ? 2 : 1;
  const selected = count ? (position % count + count) % count : 0;
  const carouselPosition = position + padding;

  if (!count) return <div className="promotion-empty"><p><SiteText text={"No active promotions at the moment."} /></p><Link className="gold-button" href="/booking"><SiteText text={"Explore treatments"} /></Link></div>;

  const slides = [
    ...Array.from({ length: padding }, (_, index) => ({
      promo: promotions[(count - padding + index % count) % count],
      originalIndex: (count - padding + index % count) % count,
      slidePosition: index,
      key: `before-${index}`,
    })),
    ...promotions.map((promo, index) => ({ promo, originalIndex: index, slidePosition: padding + index, key: promo.id })),
    ...Array.from({ length: padding }, (_, index) => ({
      promo: promotions[index % count],
      originalIndex: index % count,
      slidePosition: padding + count + index,
      key: `after-${index}`,
    })),
  ];

  const move = (step: number) => {
    if (count < 2) return;
    isMoving.current = true;
    setPosition(current => current + step);
  };

  const showPromotion = (index: number) => {
    if (index === selected) return;
    isMoving.current = true;
    setPosition(index);
  };

  const finishMove = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform" || !isMoving.current) return;
    isMoving.current = false;

    if (position < 0 || position >= count) {
      const normalizedPosition = position < 0 ? position + count : position - count;
      setTransitionEnabled(false);
      setPosition(normalizedPosition);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
    }
  };

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
        {slides.map(({ promo, originalIndex, slidePosition, key }) => {
          const offset = slidePosition - carouselPosition;
          const visible = Math.abs(offset) <= visibleRange;
          const isCenter = offset === 0;
          return <article key={key} className={`promotion-card${transitionEnabled ? "" : " is-resetting"}`} data-active={isCenter}
            role="group" aria-roledescription="slide" aria-label={tr("Promotion {{number}} of {{total}}: {{title}}", { number: originalIndex + 1, total: count, title: tr(promo.title) })}
            aria-hidden={!visible} inert={!visible}
            onTransitionEnd={finishMove}
            style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: slides.length - Math.abs(offset), visibility: visible ? "visible" : "hidden" } as CSSProperties}>
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
          {promotions.map((promo, index) => <button type="button" key={promo.id} aria-label={tr("Show promotion {{number}}: {{title}}", { number: index + 1, title: tr(promo.title) })} aria-current={index === selected ? "true" : undefined} onClick={() => showPromotion(index)} />)}
        </div>
        <button className="carousel-arrow" type="button" aria-label={tr("Next promotion")} onClick={() => move(1)}>→</button>
      </div>}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{tr("Promotion {{number}} of {{total}}: {{title}}", { number: selected + 1, total: count, title: tr(promotions[selected].title) })}</p>
    </div>
  );
}
