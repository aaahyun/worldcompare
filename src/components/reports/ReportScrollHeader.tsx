"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

export function ReportScrollHeader({
  title,
  backHref,
  backLabel,
}: {
  title: string;
  backHref: string;
  backLabel: string;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setFloating(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-40 border-b border-neutral-200 bg-surface-card/95 backdrop-blur transition-transform duration-200 ${
          floating ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={backHref}
            aria-label={backLabel}
            className="shrink-0 text-content-secondary hover:text-content-primary"
          >
            ←
          </Link>
          <span className="truncate text-sm font-semibold text-content-primary">{title}</span>
        </div>
      </div>
      <h1 ref={titleRef} className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
        {title}
      </h1>
    </>
  );
}
