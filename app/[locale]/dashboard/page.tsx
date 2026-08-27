"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  email: string;
  role: "client" | "technicien";
};

type Repair = {
  id: string;
  client_id: string;
  title: string;
  device_type: string;
  description: string;
  country: string;
  city: string | null;
  budget: number | null;
  status: string;
  created_at: string;
};

type RepairInterest = {
  repair_request_id: string;
  technician_id: string;
  status: string;
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

  const [clientRepairs, setClientRepairs] = useState<Repair[]>([]);
  const [technicianRepairs, setTechnicianRepairs] = useState<Repair[]>([]);

  const [repairsLoading, setRepairsLoading] = useState(false);
  const [repairsError, setRepairsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      setRepairsError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace(`/${locale}/login`);
        return;
      }

      /*
       * On récupère le rôle depuis profiles.
       * Le metadataRole sert seulement de secours.
       */
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erreur profil :", profileError);
      }

      const metadataRole = user.user_metadata?.role;

      const role: "client" | "technicien" =
        profileData?.role === "technicien" ||
        profileData?.role === "technician" ||
        metadataRole === "technicien" ||
        metadataRole === "technician"
          ? "technicien"
          : "client";

      if (!mounted) return;

      setProfile({
        email: user.email || "",
        role,
      });

      /*
       * IMPORTANT :
       * On charge les données AVANT de terminer le chargement
       * du dashboard.
       */
      if (role === "technicien") {
        await loadTechnicianRepairs(user.id);
      } else {
        await loadClientRepairs(user.id);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [locale, router]);

  /*
   * ============================
   * CLIENT
   * ============================
   */
  async function loadClientRepairs(clientId: string) {
    setRepairsLoading(true);
    setRepairsError(null);

    const { data, error } = await supabase
      .from("repair_requests")
      .select(
        "id, client_id, title, device_type, description, country, city, budget, status, created_at"
      )
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement réparations client :", error);

      setClientRepairs([]);

      setRepairsError(
        `Impossible de charger vos réparations : ${error.code || ""} ${
          error.message || ""
        }`
      );

      setRepairsLoading(false);
      return;
    }

    setClientRepairs((data || []) as Repair[]);
    setRepairsLoading(false);
  }

  /*
   * ============================
   * TECHNICIEN
   * ============================
   */
  async function loadTechnicianRepairs(technicianId: string) {
    setRepairsLoading(true);
    setRepairsError(null);

    /*
     * ÉTAPE 1 :
     * On récupère uniquement les intérêts ACCEPTÉS
     * de ce technicien.
     *
     * Cette requête respecte ta policy :
     * technician_id = auth.uid()
     */
    const { data: interests, error: interestsError } = await supabase
      .from("repair_interests")
      .select("repair_request_id, technician_id, status")
      .eq("technician_id", technicianId)
      .eq("status", "accepted");

    if (interestsError) {
      console.error(
        "Erreur chargement intérêts technicien :",
        interestsError
      );

      setTechnicianRepairs([]);

      setRepairsError(
        `Impossible de charger vos intérêts : ${
          interestsError.code || ""
        } ${interestsError.message || ""}`
      );

      setRepairsLoading(false);
      return;
    }

    console.log("Intérêts technicien :", interests);

    if (!interests || interests.length === 0) {
      setTechnicianRepairs([]);
      setRepairsLoading(false);
      return;
    }

    /*
     * ÉTAPE 2 :
     * On extrait les IDs des demandes.
     */
    const requestIds = (interests as RepairInterest[])
      .map((interest) => interest.repair_request_id)
      .filter(Boolean);

    console.log("IDs demandes acceptées :", requestIds);

    if (requestIds.length === 0) {
      setTechnicianRepairs([]);
      setRepairsLoading(false);
      return;
    }

    /*
     * ÉTAPE 3 :
     * On récupère les demandes correspondantes.
     *
     * IMPORTANT :
     * Pas de JOIN avec repair_interests ici.
     * Cela évite de recréer la récursion RLS que nous avions.
     */
    const { data: requests, error: requestsError } = await supabase
      .from("repair_requests")
      .select(
        "id, client_id, title, device_type, description, country, city, budget, status, created_at"
      )
      .in("id", requestIds)
      .order("created_at", { ascending: false });

    if (requestsError) {
      console.error(
        "Erreur chargement missions technicien :",
        requestsError
      );

      setTechnicianRepairs([]);

      setRepairsError(
        `Impossible de charger vos missions : ${
          requestsError.code || ""
        } ${requestsError.message || ""}`
      );

      setRepairsLoading(false);
      return;
    }

    console.log("Demandes technicien :", requests);

    setTechnicianRepairs((requests || []) as Repair[]);
    setRepairsLoading(false);
  }

  /*
   * ============================
   * LOGOUT
   * ============================
   */
  async function handleLogout() {
    await supabase.auth.signOut();

    router.push(`/${locale}`);
    router.refresh();
  }

  /*
   * ============================
   * LOADING
   * ============================
   */
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

  const repairs = isTechnician
    ? technicianRepairs
    : clientRepairs;

  /*
   * ============================
   * AFFICHAGE
   * ============================
   */
  return (
    <main className="section">
      <div className="container">

        {/* HEADER */}
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

        {/* PROFIL */}
        <section className="card mt-8 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                {isTechnician ? "🔧" : "👤"}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {isTechnician
                    ? "Compte technicien"
                    : "Compte client"}
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

        {/* STATISTIQUES */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔧</span>

              <span className="text-3xl font-black">
                {repairs.length}
              </span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              {isTechnician
                ? "Missions acceptées"
                : "Réparations"}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📦</span>

              <span className="text-3xl font-black">
                0
              </span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Commandes
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">❤️</span>

              <span className="text-3xl font-black">
                0
              </span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Favoris
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💬</span>

              <span className="text-3xl font-black">
                0
              </span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Messages
            </div>
          </div>

        </div>

        {/* CONTENU */}
        <section className="card mt-8 p-6">

          {isTechnician ? (
            <>
              {/* TECHNICIEN */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-sm font-bold text-blue-600">
                    🔧 MES MISSIONS
                  </div>

                  <h2 className="mt-1 text-2xl font-black">
                    Réparations acceptées
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Retrouvez les demandes pour lesquelles le
                    client vous a accepté.
                  </p>
                </div>

                <Link
                  href={`/${locale}/repairs/requests`}
                  className="btn btn-secondary"
                >
                  Voir les demandes
                </Link>
              </div>

              {/* ERREUR */}
              {repairsError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  <div className="font-black">
                    ⚠️ Erreur
                  </div>

                  <div className="mt-2">
                    {repairsError}
                  </div>
                </div>
              )}

              {/* CHARGEMENT */}
              {repairsLoading && (
                <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
                  <p className="font-semibold text-slate-500">
                    Chargement de vos missions...
                  </p>
                </div>
              )}

              {/* AUCUNE MISSION */}
              {!repairsLoading &&
                !repairsError &&
                technicianRepairs.length === 0 && (
                  <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
                    <div className="text-4xl">
                      🔧
                    </div>

                    <h3 className="mt-4 text-xl font-black">
                      Aucune mission acceptée
                    </h3>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                      Lorsqu'un client acceptera votre candidature,
                      la réparation apparaîtra ici.
                    </p>

                    <Link
                      href={`/${locale}/repairs/requests`}
                      className="btn btn-primary mt-6 inline-flex"
                    >
                      Voir les demandes disponibles →
                    </Link>
                  </div>
                )}

              {/* MISSIONS */}
              {!repairsLoading &&
                !repairsError &&
                technicianRepairs.length > 0 && (
                  <div className="mt-8 grid gap-5">
                    {technicianRepairs.map((repair) => (
                      <article
                        key={repair.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                          <div>
                            <div className="text-sm font-bold text-blue-600">
                              {repair.device_type}
                            </div>

                            <h3 className="mt-1 text-2xl font-black">
                              {repair.title}
                            </h3>

                            <div className="mt-3">
                              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                                ✅ Technicien accepté
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-sm text-slate-500">
                              Budget
                            </div>

                            <div className="text-2xl font-black">
                              {repair.budget !== null
                                ? `${repair.budget} €`
                                : "À définir"}
                            </div>
                          </div>

                        </div>

                        <p className="mt-5 text-slate-600">
                          {repair.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                          <span>
                            📍{" "}
                            {repair.city
                              ? `${repair.city}, ${repair.country}`
                              : repair.country}
                          </span>

                          <span>
                            📅{" "}
                            {new Date(
                              repair.created_at
                            ).toLocaleDateString("fr-FR")}
                          </span>
                        </div>

                        <div className="mt-6">
                          <Link
                            href={`/${locale}/repairs/request/${repair.id}`}
                            className="btn btn-primary"
                          >
                            Voir la réparation →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
            </>
          ) : (
            <>
              {/* CLIENT */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <div className="text-sm font-bold text-blue-600">
                    🔧 MES RÉPARATIONS
                  </div>

                  <h2 className="mt-1 text-2xl font-black">
                    Mes demandes de réparation
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Retrouvez ici toutes vos demandes de réparation
                    et leur état.
                  </p>
                </div>

                <Link
                  href={`/${locale}/repairs`}
                  className="btn btn-primary"
                >
                  + Nouvelle demande
                </Link>
              </div>

              {/* ERREUR */}
              {repairsError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  <div className="font-black">
                    ⚠️ Erreur
                  </div>

                  <div className="mt-2">
                    {repairsError}
                  </div>
                </div>
              )}

              {/* CHARGEMENT */}
              {repairsLoading && (
                <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
                  <p className="font-semibold text-slate-500">
                    Chargement de vos réparations...
                  </p>
                </div>
              )}

              {/* AUCUNE REPARATION */}
              {!repairsLoading &&
                !repairsError &&
                clientRepairs.length === 0 && (
                  <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">

                    <div className="text-4xl">
                      🔧
                    </div>

                    <h3 className="mt-4 text-xl font-black">
                      Aucune demande de réparation
                    </h3>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                      Vous n'avez pas encore créé de demande de
                      réparation.
                    </p>

                    <Link
                      href={`/${locale}/repairs`}
                      className="btn btn-primary mt-6 inline-flex"
                    >
                      Créer une demande →
                    </Link>
                  </div>
                )}

              {/* REPARATIONS */}
              {!repairsLoading &&
                !repairsError &&
                clientRepairs.length > 0 && (
                  <div className="mt-8 grid gap-5">
                    {clientRepairs.map((repair) => (
                      <article
                        key={repair.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                          <div>
                            <div className="text-sm font-bold text-blue-600">
                              {repair.device_type}
                            </div>

                            <h3 className="mt-1 text-2xl font-black">
                              {repair.title}
                            </h3>

                            <div className="mt-3">
                              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                                {repair.status === "open"
                                  ? "🟢 Ouverte"
                                  : repair.status === "assigned"
                                    ? "🟠 Technicien assigné"
                                    : repair.status === "completed"
                                      ? "🔵 Terminée"
                                      : repair.status}
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-sm text-slate-500">
                              Budget
                            </div>

                            <div className="text-2xl font-black">
                              {repair.budget !== null
                                ? `${repair.budget} €`
                                : "À définir"}
                            </div>
                          </div>

                        </div>

                        <p className="mt-5 text-slate-600">
                          {repair.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                          <span>
                            📍{" "}
                            {repair.city
                              ? `${repair.city}, ${repair.country}`
                              : repair.country}
                          </span>

                          <span>
                            📅{" "}
                            {new Date(
                              repair.created_at
                            ).toLocaleDateString("fr-FR")}
                          </span>
                        </div>

                        <div className="mt-6">
                          <Link
                            href={`/${locale}/repairs/request/${repair.id}`}
                            className="btn btn-primary"
                          >
                            Voir la demande →
                          </Link>
                        </div>

                      </article>
                    ))}
                  </div>
                )}
            </>
          )}

        </section>

        {/* ACTIVITÉ + ACTIONS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Activité récente
            </h2>

            <div className="py-12 text-center text-sm text-slate-400">
              Aucune activité récente pour le moment.
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
                    href={`/${locale}/repairs/requests`}
                    className="btn btn-secondary justify-start"
                  >
                    🔧 Voir les demandes de réparation
                  </Link>

                  <Link
                    href={`/${locale}/technicians`}
                    className="btn btn-secondary justify-start"
                  >
                    👨‍🔧 Voir les techniciens
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/repairs`}
                    className="btn btn-secondary justify-start"
                  >
                    🔧 Demander une réparation
                  </Link>

                  <Link
                    href={`/${locale}/technicians`}
                    className="btn btn-secondary justify-start"
                  >
                    👨‍🔧 Trouver un technicien
                  </Link>
                </>
              )}

              <Link
                href={`/${locale}/shop`}
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
