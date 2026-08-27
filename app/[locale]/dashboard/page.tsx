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

type UnreadMessage = {
  id: string;
  repair_request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

type UnreadConversation = {
  repairRequestId: string;
  title: string;
  deviceType: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
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

  const [unreadConversations, setUnreadConversations] = useState<
    UnreadConversation[]
  >([]);

  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      setRepairsError(null);
      setMessagesError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace(`/${locale}/login`);
        return;
      }

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

      await Promise.all([
        role === "technicien"
          ? loadTechnicianRepairs(user.id)
          : loadClientRepairs(user.id),
        loadUnreadMessages(user.id),
      ]);

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
   * ============================================================
   * CLIENT : RÉPARATIONS
   * ============================================================
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
   * ============================================================
   * TECHNICIEN : MISSIONS
   * ============================================================
   */

  async function loadTechnicianRepairs(technicianId: string) {
    setRepairsLoading(true);
    setRepairsError(null);

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

    const requestIds = (interests as RepairInterest[])
      .map((interest) => interest.repair_request_id)
      .filter(Boolean);

    if (requestIds.length === 0) {
      setTechnicianRepairs([]);
      setRepairsLoading(false);
      return;
    }

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

    setTechnicianRepairs((requests || []) as Repair[]);
    setRepairsLoading(false);
  }

  /*
   * ============================================================
   * MESSAGERIE : MESSAGES NON LUS
   * ============================================================
   *
   * Structure utilisée :
   *
   * repair_messages
   * - id
   * - repair_request_id
   * - sender_id
   * - message
   * - created_at
   * - is_read
   *
   * On ne cherche PAS receiver_id car cette colonne n'existe pas.
   */

  async function loadUnreadMessages(userId: string) {
    setMessagesLoading(true);
    setMessagesError(null);

    /*
     * ------------------------------------------------------------
     * ÉTAPE 1
     * ------------------------------------------------------------
     *
     * Récupérer les messages non lus.
     *
     * IMPORTANT :
     * On récupère uniquement les messages qui ne sont pas
     * envoyés par l'utilisateur connecté.
     *
     * Les messages envoyés par le client ne doivent évidemment
     * pas apparaître comme "non lus" pour lui-même.
     */

    const { data: messages, error: messagesError } = await supabase
      .from("repair_messages")
      .select(
        "id, repair_request_id, sender_id, message, created_at, is_read"
      )
      .eq("is_read", false)
      .neq("sender_id", userId)
      .order("created_at", { ascending: false });

    if (messagesError) {
      console.error(
        "Erreur chargement messages non lus :",
        messagesError
      );

      setUnreadConversations([]);

      setMessagesError(
        `Impossible de charger la messagerie : ${
          messagesError.code || ""
        } ${messagesError.message || ""}`
      );

      setMessagesLoading(false);
      return;
    }

    const unreadMessages = (messages || []) as UnreadMessage[];

    console.log("Messages non lus :", unreadMessages);

    if (unreadMessages.length === 0) {
      setUnreadConversations([]);
      setMessagesLoading(false);
      return;
    }

    /*
     * ------------------------------------------------------------
     * ÉTAPE 2
     * ------------------------------------------------------------
     *
     * Récupérer les IDs des réparations concernées.
     */

    const repairIds = Array.from(
      new Set(
        unreadMessages
          .map((message) => message.repair_request_id)
          .filter(Boolean)
      )
    );

    if (repairIds.length === 0) {
      setUnreadConversations([]);
      setMessagesLoading(false);
      return;
    }

    /*
     * ------------------------------------------------------------
     * ÉTAPE 3
     * ------------------------------------------------------------
     *
     * Récupérer les informations des réparations.
     */

    const { data: repairData, error: repairError } = await supabase
      .from("repair_requests")
      .select("id, title, device_type")
      .in("id", repairIds);

    if (repairError) {
      console.error(
        "Erreur récupération réparations des messages :",
        repairError
      );

      /*
       * Même si les réparations ne peuvent pas être chargées,
       * on affiche une erreur claire.
       */

      setUnreadConversations([]);

      setMessagesError(
        `Impossible de charger les conversations : ${
          repairError.code || ""
        } ${repairError.message || ""}`
      );

      setMessagesLoading(false);
      return;
    }

    /*
     * ------------------------------------------------------------
     * ÉTAPE 4
     * ------------------------------------------------------------
     *
     * Construire une conversation par réparation.
     *
     * Exemple :
     *
     * réparation A -> 2 messages non lus
     * réparation B -> 1 message non lu
     *
     * Le dashboard affichera donc :
     *
     * 🔵 mon Telephone       2 messages non lus
     * 🔵 les boutons         1 message non lu
     */

    const conversationsMap = new Map<string, UnreadConversation>();

    for (const unreadMessage of unreadMessages) {
      const repair = repairData?.find(
        (item) => item.id === unreadMessage.repair_request_id
      );

      if (!repair) {
        continue;
      }

      const existing = conversationsMap.get(
        unreadMessage.repair_request_id
      );

      if (existing) {
        existing.unreadCount += 1;

        /*
         * Les messages sont déjà triés du plus récent au plus ancien.
         * Le premier message rencontré est donc le dernier message.
         */
      } else {
        conversationsMap.set(unreadMessage.repair_request_id, {
          repairRequestId: unreadMessage.repair_request_id,
          title: repair.title || "Réparation",
          deviceType: repair.device_type || "Appareil",
          unreadCount: 1,
          lastMessage: unreadMessage.message || "",
          lastMessageAt: unreadMessage.created_at,
        });
      }
    }

    const conversations = Array.from(
      conversationsMap.values()
    ).sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
    );

    console.log("Conversations non lues :", conversations);

    setUnreadConversations(conversations);
    setMessagesLoading(false);
  }

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push(`/${locale}`);
    router.refresh();
  }

  /*
   * ============================================================
   * STATUT RÉPARATION
   * ============================================================
   */

  function getStatusLabel(status: string) {
    switch (status) {
      case "open":
        return "🟢 Ouverte";

      case "assigned":
        return "🟠 Technicien assigné";

      case "in_progress":
        return "🔵 En cours";

      case "completed":
        return "✅ Terminée";

      case "cancelled":
        return "🔴 Annulée";

      default:
        return status;
    }
  }

  /*
   * ============================================================
   * DATE MESSAGE
   * ============================================================
   */

  function formatMessageDate(date: string) {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
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

  const unreadTotal = unreadConversations.reduce(
    (total, conversation) =>
      total + conversation.unreadCount,
    0
  );

  return (
    <main className="section">
      <div className="container">

        {/* ====================================================
            HEADER
        ==================================================== */}

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

        {/* ====================================================
            PROFIL
        ==================================================== */}

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

        {/* ====================================================
            STATISTIQUES
        ==================================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">
                🔧
              </span>

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
              <span className="text-2xl">
                📦
              </span>

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
              <span className="text-2xl">
                ❤️
              </span>

              <span className="text-3xl font-black">
                0
              </span>
            </div>

            <div className="mt-4 font-semibold text-slate-500">
              Favoris
            </div>
          </div>

          {/* ==================================================
              MESSAGES
          ================================================== */}

          <a
            href="#messages"
            className={
              "card p-5 transition hover:-translate-y-1 hover:shadow-md " +
              (unreadTotal > 0
                ? "border-2 border-blue-300 bg-blue-50/50"
                : "")
            }
          >
            <div className="flex items-center justify-between">

              <span className="text-2xl">
                💬
              </span>

              <span className="text-3xl font-black">
                {unreadTotal}
              </span>

            </div>

            <div className="mt-4 flex items-center gap-2 font-semibold text-slate-500">

              Messages

              {unreadTotal > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">
                  Non lu{unreadTotal > 1 ? "s" : ""}
                </span>
              )}

            </div>
          </a>

        </div>

        {/* ====================================================
            MESSAGERIE
        ==================================================== */}

        <section
          id="messages"
          className="card mt-8 scroll-mt-24 p-6"
        >

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <div className="text-sm font-bold text-blue-600">
                💬 MESSAGERIE
              </div>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Vos messages
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Retrouvez les conversations liées à vos réparations.
              </p>
            </div>

            {unreadTotal > 0 && (
              <div className="w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                {unreadTotal} message
                {unreadTotal > 1 ? "s" : ""} non lu
                {unreadTotal > 1 ? "s" : ""}
              </div>
            )}

          </div>

          {/* ERREUR MESSAGERIE */}

          {messagesError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">

              <div className="font-black">
                ⚠️ Impossible de charger la messagerie
              </div>

              <div className="mt-2">
                {messagesError}
              </div>

            </div>
          )}

          {/* CHARGEMENT */}

          {messagesLoading && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
              <p className="font-semibold text-slate-500">
                Chargement des messages...
              </p>
            </div>
          )}

          {/* AUCUN MESSAGE */}

          {!messagesLoading &&
            !messagesError &&
            unreadConversations.length === 0 && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">

                <div className="text-4xl">
                  💬
                </div>

                <h3 className="mt-3 text-lg font-black text-slate-950">
                  Aucun nouveau message
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Vous n'avez aucun message non lu pour le moment.
                </p>

              </div>
            )}

          {/* ==================================================
              CONVERSATIONS NON LUES
          ================================================== */}

          {!messagesLoading &&
            unreadConversations.length > 0 && (
              <div className="mt-6 space-y-4">

                {unreadConversations.map((conversation) => (
                  <Link
                    key={conversation.repairRequestId}
                    href={`/${locale}/repairs/request/${conversation.repairRequestId}`}
                    className="block rounded-2xl border border-blue-200 bg-white p-5 transition hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                          💬
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                              {conversation.deviceType}
                            </span>

                            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-black text-white">
                              {conversation.unreadCount} non lu
                              {conversation.unreadCount > 1
                                ? "s"
                                : ""}
                            </span>

                          </div>

                          <h3 className="mt-1 text-lg font-black text-slate-950">
                            {conversation.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {conversation.lastMessage}
                          </p>

                          <p className="mt-2 text-xs font-semibold text-slate-400">
                            Dernier message :{" "}
                            {formatMessageDate(
                              conversation.lastMessageAt
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0">

                        <span className="inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
                          Ouvrir la conversation →
                        </span>

                      </div>

                    </div>

                  </Link>
                ))}

              </div>
            )}

        </section>

        {/* ====================================================
            CONTENU RÉPARATIONS
        ==================================================== */}

        <section className="card mt-8 p-6">

          {isTechnician ? (
            <>
              {/* ==================================================
                  TECHNICIEN
              ================================================== */}

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <div className="text-sm font-bold text-blue-600">
                    🔧 MES MISSIONS
                  </div>

                  <h2 className="mt-1 text-2xl font-black">
                    Réparations acceptées
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Retrouvez les demandes pour lesquelles le client
                    vous a accepté.
                  </p>
                </div>

                <Link
                  href={`/${locale}/repairs/requests`}
                  className="btn btn-secondary"
                >
                  Voir les demandes
                </Link>

              </div>

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

              {repairsLoading && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-semibold text-slate-500">
                    Chargement des missions...
                  </p>
                </div>
              )}

              {!repairsLoading &&
                !repairsError &&
                technicianRepairs.length === 0 && (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">

                    <div className="text-4xl">
                      🔧
                    </div>

                    <h3 className="mt-3 text-lg font-black">
                      Aucune mission acceptée
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Les missions pour lesquelles un client vous
                      accepte apparaîtront ici.
                    </p>

                  </div>
                )}

              {!repairsLoading &&
                technicianRepairs.length > 0 && (
                  <div className="mt-6 space-y-4">

                    {technicianRepairs.map((repair) => (
                      <Link
                        key={repair.id}
                        href={`/${locale}/repairs/request/${repair.id}`}
                        className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:bg-blue-50"
                      >

                        <div className="flex flex-col justify-between gap-3 sm:flex-row">

                          <div>

                            <div className="text-sm font-bold text-blue-600">
                              {repair.device_type}
                            </div>

                            <h3 className="mt-1 text-xl font-black">
                              {repair.title}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              {repair.description}
                            </p>

                          </div>

                          <div className="shrink-0">

                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-bold">
                              {getStatusLabel(repair.status)}
                            </span>

                          </div>

                        </div>

                      </Link>
                    ))}

                  </div>
                )}
            </>
          ) : (
            <>
              {/* ==================================================
                  CLIENT
              ================================================== */}

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
                  className="btn btn-secondary"
                >
                  + Nouvelle demande
                </Link>

              </div>

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

              {repairsLoading && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-semibold text-slate-500">
                    Chargement de vos réparations...
                  </p>
                </div>
              )}

              {!repairsLoading &&
                !repairsError &&
                clientRepairs.length === 0 && (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">

                    <div className="text-4xl">
                      🔧
                    </div>

                    <h3 className="mt-3 text-lg font-black">
                      Aucune réparation
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Vous n'avez pas encore créé de demande.
                    </p>

                    <Link
                      href={`/${locale}/repairs`}
                      className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
                    >
                      Demander une réparation →
                    </Link>

                  </div>
                )}

              {!repairsLoading &&
                clientRepairs.length > 0 && (
                  <div className="mt-6 space-y-4">

                    {clientRepairs.map((repair) => (
                      <Link
                        key={repair.id}
                        href={`/${locale}/repairs/request/${repair.id}`}
                        className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:bg-blue-50"
                      >

                        <div className="flex flex-col justify-between gap-3 sm:flex-row">

                          <div>

                            <div className="text-sm font-bold text-blue-600">
                              {repair.device_type}
                            </div>

                            <h3 className="mt-1 text-xl font-black">
                              {repair.title}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              {repair.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">

                              <span>
                                💰{" "}
                                {repair.budget !== null
                                  ? `${repair.budget} €`
                                  : "Budget non renseigné"}
                              </span>

                              <span>
                                📍{" "}
                                {[repair.city, repair.country]
                                  .filter(Boolean)
                                  .join(", ") || "Localisation non renseignée"}
                              </span>

                            </div>

                          </div>

                          <div className="shrink-0">

                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-bold">
                              {getStatusLabel(repair.status)}
                            </span>

                          </div>

                        </div>

                      </Link>
                    ))}

                  </div>
                )}

            </>
          )}

        </section>

      </div>
    </main>
  );
}
