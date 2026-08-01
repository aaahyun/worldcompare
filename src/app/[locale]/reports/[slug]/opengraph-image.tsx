import { ImageResponse } from "next/og";
import { getReport, localized } from "@/lib/reports";
import type { ReportCoverArt } from "@/lib/reportSchema";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Report cover";

const COLOR_TARGET = "#2f6fed";
const COLOR_HOME = "#d9822b";

function ThumbnailArt({ variant }: { variant: ReportCoverArt }) {
  if (variant === "area-comparison") {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
        <div style={{ width: 168, height: 168, borderRadius: 24, background: COLOR_TARGET }} />
        <div style={{ width: 30, height: 30, borderRadius: 7, background: COLOR_HOME }} />
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
      <div style={{ width: 68, height: 188, borderRadius: 16, background: COLOR_TARGET }} />
      <div style={{ width: 34, height: 22, borderRadius: 7, background: COLOR_HOME }} />
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const report = getReport(slug);

  if (!report) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#2650c2",
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          {siteName}
        </div>
      ),
      size
    );
  }

  const title = localized(report.title, locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #3468e0 0%, #172f75 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex" }}>
          <ThumbnailArt variant={report.coverArt} />
        </div>

        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>{siteName}</div>
      </div>
    ),
    size
  );
}
