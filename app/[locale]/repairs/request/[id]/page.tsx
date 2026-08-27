"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import RepairMessages from "@/components/repairs/RepairMessages";
import RepairPhotos from "@/components/repairs/RepairPhotos";
import RepairQuotes from "@/components/repairs/RepairQuotes";

type RepairRequest = {
  id: string;
  client_id: string;
  title: string;
  device_type: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  budget: number | null;
  status: string | null;
  created_at: string;
};

type Technician = {
  id: string;
  name: string | null;
  city: string | null;
  country: string | null;
};

type Interest = {
  technician_id: string;
  status: string | null;
  created_at: string;
};

export default function RepairRequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [myInterest, setMyInterest] = useState<Interest | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function loadData() {
    setLoading(true);
    setMessage("");
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Erreur profil :", profileError);
    }

    const role = String(
      profile?.role || user.user_metadata?.role || ""
    )
      .toLowerCase()
      .trim();

    setUserRole(role);

    const { data: requestData, error: requestError } = await supabase
      .from("repair_requests")
      .select(
        "id, client_id, title, device_type, description, country, city, budget, status, created_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (requestError || !requestData) {
      console.error("Erreur demande :", requestError);

      setError(
        "Cette demande est introuvable ou vous n'êtes pas autorisé à la consulter."
      );

      setRequest(null);
      setLoading(false);
      return;
    }

    const currentRequest = requestData as RepairRequest;

    setRequest(currentRequest);

    const isClient = currentRequest.client_id === user.id;

    /*
     * ============================================================
     * CLIENT
     * ============================================================
     */

    if (isClient) {
      const { data: interests, error: interestsError } =
        await supabase
          .from("repair_interests")
          .select("technician_id, status, created_at")
          .eq("repair_request_id", id)
          .order("created_at", { ascending: false });

      if (interestsError) {
        console.error("Erreur intérêts :", interestsError);

        setError(
          "Impossible de charger les techniciens intéressés."
        );

        setLoading(false);
        return;
      }

      const interestList = (interests || []) as Interest[];

      setMyInterest(
        interestList.find(
          (interest) => interest.technician_id === user.id
        ) || null
      );

      if (interestList.length === 0) {
        setTechnicians([]);
        setLoading(false);
        return;
      }

      const technicianIds = interestList
        .map((interest) => interest.technician_id)
        .filter(Boolean);

      const { data: profiles, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, name, city, country")
          .in("id", technicianIds);

      if (profilesError) {
        console.error("Erreur profils :", profilesError);
      }

      const technicianList: Technician[] = technicianIds.map(
        (technicianId) => {
          const profile = profiles?.find(
            (item) => item.id === technicianId
          );

          return {
            id: technicianId,
            name: profile?.name || null,
            city: profile?.city || null,
            country: profile?.country || null,
          };
        }
      );

      setTechnicians(technicianList);
      setLoading(false);
      return;
    }

    /*
     * ============================================================
     * TECHNICIEN
     * ============================================================
     */

    if (
      role === "technicien" ||
      role === "technician"
    ) {
      const { data: interest, error: interestError } =
        await supabase
          .from("repair_interests")
          .select("technician_id, status, created_at")
          .eq("repair_request_id", id)
          .eq("technician_id", user.id)
          .maybeSingle();

      if (interestError) {
        console.error(
          "Erreur intérêt technicien :",
          interestError
        );
      }

      const currentInterest =
        interest as Interest | null;

      setMyInterest(currentInterest);

      if (!currentInterest) {
        setError(
          "Vous n'avez pas manifesté votre intérêt pour cette réparation."
        );
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  /*
   * ============================================================
   * CLIENT : ACCEPTER UN TECHNICIEN
   * ============================================================
   */

  async function acceptTechnician(
    technicianId: string
  ) {
    if (!request) return;

    if (request.status !== "open") {
      setError(
        "Cette demande n'est plus ouverte à l'acceptation d'un technicien."
      );
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous accepter ce technicien pour cette réparation ?"
    );

    if (!confirmation) return;

    setAcceptingId(technicianId);
    setMessage("");
    setError("");

    const { error: interestError } = await supabase
      .from("repair_interests")
      .update({
        status: "accepted",
      })
      .eq("repair_request_id", request.id)
      .eq("technician_id", technicianId);

    if (interestError) {
      console.error(
        "Erreur acceptation technicien :",
        interestError
      );

      setError(
        "Impossible d'accepter le technicien. Vérifiez les permissions Supabase."
      );

      setAcceptingId(null);
      return;
    }

    const { error: statusError } =
      await supabase.rpc(
        "update_repair_status",
        {
          p_repair_id: request.id,
          p_status: "assigned",
        }
      );

    if (statusError) {
      console.error(
        "Erreur changement statut :",
        statusError
      );

      setError(
        "Le technicien a été accepté, mais le statut de la demande n'a pas pu être modifié."
      );

      setAcceptingId(null);
      return;
    }

    setRequest({
      ...request,
      status: "assigned",
    });

    setMessage(
      "Technicien accepté avec succès ! La mission est maintenant assignée. ✅"
    );

    setAcceptingId(null);

    await loadData();
  }

  /*
   * ============================================================
   * TECHNICIEN : CHANGER LE STATUT
   * ============================================================
   */

  async function updateRepairStatus(
    newStatus: "in_progress" | "completed"
  ) {
    if (!request) return;

    if (!userId) {
      setError("Utilisateur non connecté.");
      return;
    }

    if (
      userRole !== "technicien" &&
      userRole !== "technician"
    ) {
      setError(
        "Seul le technicien accepté peut modifier l'avancement de cette mission."
      );
      return;
    }

    if (
      !myInterest ||
      myInterest.status !== "accepted"
    ) {
      setError(
        "Vous devez être le technicien accepté pour modifier cette mission."
      );
      return;
    }

    if (
      newStatus === "in_progress" &&
      request.status !== "assigned"
    ) {
      setError(
        "La réparation doit d'abord être assignée avant de commencer."
      );
      return;
    }

    if (
      newStatus === "completed" &&
      request.status !== "in_progress"
    ) {
      setError(
        "La réparation doit être en cours avant de pouvoir être terminée."
      );
      return;
    }

    const confirmation = window.confirm(
      newStatus === "in_progress"
        ? "Voulez-vous commencer cette réparation ?"
        : "Voulez-vous marquer cette réparation comme terminée ?"
    );

    if (!confirmation) return;

    setUpdatingStatus(true);
    setMessage("");
    setError("");

    const { error: statusError } =
      await supabase.rpc(
        "update_repair_status",
        {
          p_repair_id: request.id,
          p_status: newStatus,
        }
      );

    if (statusError) {
      console.error(
        "Erreur mise à jour statut :",
        statusError
      );

      setError(
        statusError.message ||
          "Impossible de modifier le statut de la réparation."
      );

      setUpdatingStatus(false);
      return;
    }

    setRequest({
      ...request,
      status: newStatus,
    });

    setMessage(
      newStatus === "in_progress"
        ? "La réparation est maintenant en cours. 🔵"
        : "La réparation est maintenant terminée. ✅"
    );

    setUpdatingStatus(false);

    await loadData();
  }

  function getStatusLabel(
    status: string | null
  ) {
    switch (status) {
      case "open":
        return "🟢 Ouverte";

      case "assigned":
        return "🟠 Technicien assigné";

      case "in_progress":
        return "🔵 Réparation en cours";

      case "completed":
        return "✅ Réparation terminée";

      case "cancelled":
        return "🔴 Annulée";

      default:
        return status || "Inconnue";
    }
  }

  function getStatusClass(
    status: string | null
  ) {
    switch (status) {
      case "open":
        return "bg-green-50 text-green-700";

      case "assigned":
        return "bg-orange-50 text-orange-700";

      case "in_progress":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="page-container">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold text-slate-500">
              Chargement de la demande...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="page-container">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <div className="text-5xl">
              🔧
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-950">
              Demande introuvable
            </h1>

            <p className="mt-3 text-slate-500">
              {error || message}
            </p>

            <Link
              href={"/" + locale + "/dashboard"}
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
            >
              Retour à mon espace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isClient =
    userId === request.client_id;

  const isTechnician =
    userRole === "technicien" ||
    userRole === "technician";

  const isAcceptedTechnician =
    isTechnician &&
    myInterest?.status === "accepted";

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="page-container">

        <Link
          href={"/" + locale + "/dashboard"}
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          ← Retour à mon espace
        </Link>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 font-semibold text-blue-700">
            {message}
          </div>
        )}

        {/* ====================================================
            INFORMATIONS DE LA DEMANDE
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div>
              <div className="text-sm font-bold text-blue-600">
                {request.device_type || "Appareil"}
              </div>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                {request.title}
              </h1>
            </div>

            <span
              className={
                "h-fit w-fit rounded-full px-4 py-2 text-sm font-bold " +
                getStatusClass(request.status)
              }
            >
              {getStatusLabel(request.status)}
            </span>

          </div>

          {request.description && (
            <div className="mt-6">
              <h2 className="text-lg font-black text-slate-950">
                Description
              </h2>

              <p className="mt-2 leading-7 text-slate-600">
                {request.description}
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-bold text-slate-700">
                📍 Localisation
              </div>

              <div className="mt-1 text-slate-500">
                {[
                  request.city,
                  request.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Non renseignée"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-bold text-slate-700">
                💰 Budget initial
              </div>

              <div className="mt-1 text-slate-500">
                {request.budget !== null
                  ? request.budget + " €"
                  : "Non renseigné"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-bold text-slate-700">
                📅 Date
              </div>

              <div className="mt-1 text-slate-500">
                {new Date(
                  request.created_at
                ).toLocaleDateString("fr-FR")}
              </div>
            </div>

          </div>
        </section>

        {/* ====================================================
            GESTION DES DEVIS / PRIX
        ==================================================== */}

        <RepairQuotes
  repairRequestId={request.id}
  clientId={request.client_id}
  technicianId={
    isAcceptedTechnician && userId
      ? userId
      : null
  }
  userId={userId || ""}
  userRole={userRole}
/>

        {/* ====================================================
            MISSION TECHNICIEN
        ==================================================== */}

        {isAcceptedTechnician && (
          <section className="mt-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">

            <div className="flex items-center gap-3">
              <div className="text-3xl">
                🔧
              </div>

              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Votre mission
                </div>

                <h2 className="text-2xl font-black text-slate-950">
                  Suivi de la réparation
                </h2>
              </div>
            </div>

            <p className="mt-4 text-slate-500">
              Faites évoluer le statut de la mission lorsque vous commencez puis terminez la réparation.            </p>

            {request.status === "assigned" && (
              <button
                type="button"
                onClick={() =>
                  updateRepairStatus("in_progress")
                }
                disabled={updatingStatus}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingStatus
                  ? "Mise à jour..."
                  : "▶️ Commencer la réparation →"}
              </button>
            )}

            {request.status === "in_progress" && (
              <button
                type="button"
                onClick={() =>
                  updateRepairStatus("completed")
                }
                disabled={updatingStatus}
                className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingStatus
                  ? "Mise à jour..."
                  : "✅ Marquer la réparation comme terminée →"}
              </button>
            )}

            {request.status === "completed" && (
              <div className="mt-6 rounded-xl bg-emerald-100 px-5 py-4 text-center font-bold text-emerald-700">
                ✅ Cette réparation est terminée.
              </div>
            )}

          </section>
        )}

        {/* ====================================================
            MESSAGERIE
        ==================================================== */}

        <RepairMessages
          repairRequestId={request.id}
        />

        {/* ====================================================
            PHOTOS
        ==================================================== */}

        <RepairPhotos
          repairRequestId={request.id}
        />

        {/* ====================================================
            CLIENT : TECHNICIENS
        ==================================================== */}

        {isClient && (
          <section className="mt-8">

            <h2 className="text-2xl font-black text-slate-950">
              👨‍🔧 Techniciens intéressés
            </h2>

            <p className="mt-2 text-slate-500">
              Les techniciens qui souhaitent intervenir sur votre réparation.
            </p>

            {technicians.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center">

                <div className="text-5xl">
                  👨‍🔧
                </div>

                <h3 className="mt-4 text-xl font-black text-slate-950">
                  Aucun technicien pour le moment
                </h3>

                <p className="mt-2 text-slate-500">
                  Les techniciens intéressés apparaîtront ici.
                </p>

              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {technicians.map(
                  (technician) => (
                    <article
                      key={technician.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                          🔧
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-slate-950">
                            {technician.name ||
                              "Technicien Folioga-Tech"}
                          </h3>

                          <p className="text-sm font-bold text-blue-600">
                            Technicien
                          </p>
                        </div>

                      </div>

                      {(technician.city ||
                        technician.country) && (
                        <p className="mt-5 text-sm text-slate-500">
                          📍{" "}
                          {[
                            technician.city,
                            technician.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}

                      {request.status === "assigned" && (
                        <div className="mt-5 rounded-xl bg-orange-50 px-5 py-3 text-center font-bold text-orange-700">
                          🟠 Technicien accepté
                        </div>
                      )}

                      {request.status === "in_progress" && (
                        <div className="mt-5 rounded-xl bg-blue-50 px-5 py-3 text-center font-bold text-blue-700">
                          🔵 Réparation en cours
                        </div>
                      )}

                      {request.status === "completed" && (
                        <div className="mt-5 rounded-xl bg-emerald-50 px-5 py-3 text-center font-bold text-emerald-700">
                          ✅ Réparation terminée
                        </div>
                      )}

                      {request.status === "open" && (
                        <button
                          type="button"
                          onClick={() =>
                            acceptTechnician(
                              technician.id
                            )
                          }
                          disabled={
                            acceptingId ===
                            technician.id
                          }
                          className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {acceptingId ===
                          technician.id
                            ? "Acceptation..."
                            : "Accepter ce technicien →"}
                        </button>
                      )}

                    </article>
                  )
                )}

              </div>
            )}

          </section>
        )}

        {/* ====================================================
            TECHNICIEN NON ACCEPTÉ
        ==================================================== */}

        {isTechnician &&
          !isAcceptedTechnician && (
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="rounded-2xl bg-slate-50 p-6 text-center">

                <div className="text-4xl">
                  ⏳
                </div>

                <h2 className="mt-4 text-xl font-black text-slate-950">
                  En attente d'acceptation
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                  Vous avez manifesté votre intérêt pour cette réparation. Le client doit maintenant accepter votre candidature.
                </p>

              </div>

            </section>
          )}

      </div>
    </main>
  );
}
