"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Portion of the section that must be visible to run the animation */
  threshold?: number;
};

export default function AutoScrollTrack({
  children,
  className,
  threshold = 0.2,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const container =
      trackRef.current?.closest(".tt-marquee-container") ?? trackRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setRunning(entry.isIntersecting);
      },
      { threshold }
    );
    io.observe(container);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={trackRef}
      className={`flex w-max gap-6 md:gap-8 animate-scrollX group-hover:[animation-play-state:paused] ${
        className ?? ""
      }`}
      style={{
        animationPlayState: running
          ? ("running" as const)
          : ("paused" as const),
      }}
    >
      {children}
    </div>
  );
}
