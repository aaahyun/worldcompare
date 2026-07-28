import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CountrySearch } from "./CountrySearch";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getCountryIndex } from "@/lib/countryIndex";
import { siteName } from "@/lib/site";

export async function Header() {
  const t = await getTranslations("nav");
  const index = getCountryIndex();

  return (
    <header className="border-b border-neutral-200 bg-surface-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold text-content-primary">
            {siteName}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-content-secondary">
            <Link href="/countries">{t("countries")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <CountrySearch index={index} />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
