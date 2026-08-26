"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  email: string;
  role: "client" | "technicien";
};

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/" + locale + "/login");
        return;
      }

      const role =
        data.user.user_metadata?.role === "technicien"
          ? "technicien"
          : "client";

      setProfile({
        email: data.user.email || "",
        role,
      });

      setLoading(false);
    }

    loadUser();
  }, [locale, router]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/" + locale);
    router.refresh();
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="card p-10 text-center">
            <p className="font-semibold text-slate-500">
              Chargement de votre espace...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const isTechnician = profile.role === "technicien";

  return (
    <main className="section">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-bold text-blue-600">
              MON ESPACE
            </div>

            <h1 className="mt-2 text-4xl font-black">
              Bienvenue 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Gérez votre compte et vos activités Folioga-Tech.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-dark"
          >
            Se déconnecter
          </button>
        </div>

        {/* Profil */}
        <section className="card mt-8 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                {isTechnician ? "🔧" : "👤"}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {isTechnician ? "Compte technicien" : "Compte client"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile.email}
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              {isTechnician ? "Technicien" : "Client"}
            </span>

          </div>
        </section>

        {/* Statistiques */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔧</span>
              <span className="text-3xl font-black">0</span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              {isTechnician ? "Services" : "Réparations"}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📦</span>
              <span className="text-3xl font-black">0</span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Commandes
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">❤️</span>
              <span className="text-3xl font-black">0</span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Favoris
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💬</span>
              <span className="text-3xl font-black">0</span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Messages
            </div>
          </div>

        </div>

        {/* Contenu */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Activité récente
            </h2>

            <div className="py-12 text-center text-sm text-slate-400">
              Aucune activité pour le moment.
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Actions rapides
            </h2>

            <div className="mt-5 grid gap-3">

              {isTechnician ? (
                <>
                  <Link
                    href={"/" + locale + "/technicians"}
                    className="btn btn-secondary justify-start"
                  >
                    👨‍🔧 Voir les techniciens
                  </Link>

                  <button
                    type="button"
                    className="btn btn-secondary justify-start"
                  >
                    📸 Publier mon travail
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={"/" + locale + "/repairs"}
                    className="btn btn-secondary justify-start"
                  >
                    🔧 Demander une réparation
                  </Link>

                  <Link
                    href={"/" + locale + "/technicians"}
                    className="btn btn-secondary justify-start"
                  >
                    👨‍🔧 Trouver un technicien
                  </Link>
                </>
              )}

              <Link
                href={"/" + locale + "/shop"}
                className="btn btn-secondary justify-start"
              >
                🛒 Explorer la boutique
              </Link>

            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
