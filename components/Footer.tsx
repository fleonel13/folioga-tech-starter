import Link from "next/link";

const footerLinks = {
  folioga: [
    { label: "Notre mission", href: "/" },
    { label: "Comment ça marche", href: "/" },
    { label: "Pourquoi Folioga-tech", href: "/" },
    { label: "Nos engagements", href: "/" },
    { label: "Devenir partenaire", href: "/" },
    { label: "Devenir technicien", href: "/technicians" },
  ],

  services: [
    { label: "Trouver une réparation", href: "/repairs" },
    { label: "Smartphones", href: "/repairs" },
    { label: "Ordinateurs", href: "/repairs" },
    { label: "Tablettes", href: "/repairs" },
    { label: "Consoles", href: "/repairs" },
    { label: "Électronique", href: "/repairs" },
    { label: "Produits reconditionnés", href: "/shop" },
  ],

  about: [
    { label: "Centre d'aide", href: "/" },
    { label: "Mon espace", href: "/dashboard" },
    { label: "Suivre ma commande", href: "/dashboard" },
    { label: "FAQ", href: "/" },
    { label: "Contact", href: "/" },
    { label: "Mentions légales", href: "/" },
    { label: "Conditions générales", href: "/" },
    { label: "Confidentialité", href: "/" },
  ],
};

const partners = [
  {
    name: "Partenaire",
    logo: null,
  },
  {
    name: "Partenaire",
    logo: null,
  },
  {
    name: "Partenaire",
    logo: null,
  },
  {
    name: "Partenaire",
    logo: null,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#06284b] text-white">
      <div className="mx-auto max-w-[1248px] px-6 py-16 lg:px-8">

        {/* =========================
            4 COLONNES
        ========================== */}

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">

          {/* PARTENAIRES */}
          <div>
            <h2 className="text-[21px] font-semibold tracking-tight">
              Nos partenaires
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex h-12 items-center justify-start"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-10 max-w-[120px] object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium text-white/60">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FOLIOGA-TECH */}
          <div>
            <h2 className="text-[21px] font-semibold tracking-tight">
              Folioga-tech
            </h2>

            <ul className="mt-10 space-y-3">
              {footerLinks.folioga.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] leading-6 text-white/90 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className="text-[21px] font-semibold tracking-tight">
              Nos services
            </h2>

            <ul className="mt-10 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] leading-6 text-white/90 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À PROPOS */}
          <div>
            <h2 className="text-[21px] font-semibold tracking-tight">
              À propos
            </h2>

            <ul className="mt-10 space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] leading-6 text-white/90 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =========================
            PAYS
        ========================== */}

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="text-[20px] font-semibold">
            Pays
          </span>

          <button
            type="button"
            className="flex h-12 w-[255px] items-center justify-between rounded-xl bg-white px-4 text-left text-[16px] text-slate-900 transition hover:bg-slate-100"
          >
            <span>France FR</span>

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6L8 11L13 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* =========================
            SEPARATEUR
        ========================== */}

        <div className="mt-20 border-t border-white/30" />

        {/* =========================
            SIGNATURE
        ========================== */}

        <div className="pt-14 text-center">
          <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">
            La technologie mérite une seconde vie.
          </h2>

          {/* =========================
              RESEAUX SOCIAUX
          ========================== */}

          <div className="mt-8 flex justify-center gap-8">

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-xl font-semibold transition hover:bg-white hover:text-[#06284b]"
            >
              f
            </a>

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white transition hover:bg-white hover:text-[#06284b]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-sm font-bold transition hover:bg-white hover:text-[#06284b]"
            >
              in
            </a>
          </div>
        </div>

        {/* =========================
            BAS DU FOOTER
        ========================== */}

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Folioga-tech — Tous droits réservés.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Mentions légales
            </Link>

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Confidentialité
            </Link>

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Conditions générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
