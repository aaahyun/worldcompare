"use client";

import { useEffect } from "react";

/** Records one view per page load. Runs client-side so it fires on every real visit, even for statically prerendered pages. */
export function ViewBeacon({ endpoint }: { endpoint: string }) {
  useEffect(() => {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint);
    } else {
      fetch(endpoint, { method: "POST", keepalive: true }).catch(() => {});
    }
  }, [endpoint]);

  return null;
}
