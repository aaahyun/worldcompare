import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/**
 * Root layout for /embed/* — deliberately outside the [locale] tree so it
 * ships without Header/Footer/nav chrome and stays transparent for iframe
 * embedding on third-party pages.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* inline style, not a Tailwind class: globals.css's unlayered `body { background }`
          rule outranks any @layer utility class regardless of specificity, so only an
          inline style can force the transparency embedding needs. */}
      <body className="text-content-primary antialiased" style={{ background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
