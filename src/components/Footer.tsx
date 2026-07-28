import { getTranslations } from "next-intl/server";
import { siteName } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-neutral-200 bg-surface-0 py-6 text-sm text-content-tertiary">
      <div className="mx-auto max-w-5xl px-4">
        <p>{t("sourcesNote")}</p>
        <p className="mt-1">
          © {new Date().getFullYear()} {siteName}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
