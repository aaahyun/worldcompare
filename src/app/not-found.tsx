import Link from "next/link";

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
