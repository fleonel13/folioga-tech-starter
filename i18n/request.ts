import { getRequestConfig } from "next-intl/server";

const locales = ["fr", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale =
    requestedLocale && locales.includes(requestedLocale as (typeof locales)[number])
      ? requestedLocale
      : "fr";

  const messages =
    locale === "en"
      ? (await import("../messages/en.json")).default
      : (await import("../messages/fr.json")).default;

  return {
    locale,
    messages,
  };
});
