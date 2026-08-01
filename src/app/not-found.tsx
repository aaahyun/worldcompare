import type { Metadata } from "next";
import Link from "next/link";
import { emojiFaviconDataUrl } from "@/lib/homeCountry";

export const metadata: Metadata = {
  icons: { icon: emojiFaviconDataUrl("🌍") },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 480, margin: "6rem auto", textAlign: "center" }}>
          <h1>Page not found</h1>
          <p>
            <Link href="/en">Back to home</Link>
          </p>
        </div>
      </body>
    </html>
  );
}
