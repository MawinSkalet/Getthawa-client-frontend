"use client";
import { useEffect, useRef, useState } from "react";
type Props = { children: React.ReactNode; className?: string; threshold?: number };
export default function AutoScrollTrack({ children, className = "", threshold = 0.2 }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, [threshold]);
  return (
    <div ref={container} className={"loop-carousel " + className}>
      <div className="loop-viewport" tabIndex={0} aria-label="Scrolling cards">
        <div className="loop-track" data-running={visible}>
          <div className="loop-group">{children}</div>
          <div className="loop-group loop-copy" aria-hidden="true" ref={element => {
            // Keep visible copies clickable without repeating keyboard stops.
            element?.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [tabindex]").forEach(control => { control.tabIndex = -1; });
          }}>{children}</div>
        </div>
      </div>

    </div>
  );
}
