import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-content-secondary">{t("body")}</p>
      <Link href="/" className="mt-6 inline-block underline">
        {t("backHome")}
      </Link>
    </div>
  );
}
