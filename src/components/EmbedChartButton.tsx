"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { embedSrcUrl, EMBED_HEIGHT, type EmbedMetric } from "@/lib/embed";

/**
 * Lightweight, dependency-free modal built on the native <dialog> element
 * (focus trap, ESC-to-close, and backdrop come for free) rather than pulling
 * in a component library just for this one dialog.
 */
export function EmbedChartButton({
  pair,
  metric,
  metricLabel,
  nameA,
  nameB,
}: {
  pair: string;
  metric: EmbedMetric;
  metricLabel: string;
  nameA: string;
  nameB: string;
}) {
  const t = useTranslations("compare.embed");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  const src = embedSrcUrl(pair, metric);
  const iframeTitle = t("iframeTitle", { a: nameA, b: nameB, metric: metricLabel });
  const code = `<iframe src="${src}" width="100%" height="${EMBED_HEIGHT}" frameborder="0" loading="lazy" title="${iframeTitle}"></iframe>`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCopied(false);
          dialogRef.current?.showModal();
        }}
        className="rounded-full border border-neutral-200 bg-surface-0 px-3 py-1.5 text-xs font-medium text-content-secondary shadow-sm transition hover:text-brand-600"
      >
        {t("button")}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="w-full max-w-md rounded-2xl border-none bg-surface-card p-5 text-content-primary shadow-lg backdrop:bg-neutral-900/40"
      >
        <h3 className="mb-1 text-base font-semibold">{t("modalTitle")}</h3>
        <p className="mb-3 text-sm text-content-secondary">{t("modalHint")}</p>
        <textarea
          readOnly
          value={code}
          rows={3}
          onFocus={(e) => e.currentTarget.select()}
          className="mb-3 w-full resize-none rounded-lg border border-neutral-200 bg-surface-100 p-2 font-mono text-xs text-content-primary"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-full px-3 py-1.5 text-sm text-content-secondary hover:text-content-primary"
          >
            {t("close")}
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-medium text-content-inverse hover:bg-brand-600"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </dialog>
    </>
  );
}
