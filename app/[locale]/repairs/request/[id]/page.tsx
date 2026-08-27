"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      const { data: requestData, error: requestError } =
        await supabase
          .from("repair_requests")
          .select(
            "id, client_id, title, device_type, description, country, city, budget, status, created_at"
          )
          .eq("id", id)
          .eq("client_id", user.id)
          .single();

      if (requestError || !requestData) {
        console.error("Erreur demande :", requestError);
        setMessage("Cette demande est introuvable.");
        setLoading(false);
        return;
      }

      setRequest(requestData);

      const { data: interests, error: interestsError } =
        await supabase
          .from("repair_interests")
          .select("technician_id, status, created_at")
          .eq("repair_request_id", id)
          .order("created_at", { ascending: false });

      if (interestsError) {
        console.error("Erreur intérêts :", interestsError);
        setMessage("Impossible de charger les techniciens intéressés.");
        setLoading(false);
        return;
      }

      if (!interests || interests.length === 0) {
        setTechnicians([]);
        setLoading(false);
        return;
      }

      const technicianIds = interests.map(
        (interest: Interest) => interest.technician_id
      );

      const { data: profiles, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, name, city, country")
          .in("id", technicianIds);

      if (profilesError) {
        console.error("Erreur profils :", profilesError);

        setTechnicians(
          technicianIds.map((technicianId) => ({
            id: technicianId,
            name: null,
            city: null,
            country: null,
          }))
        );

        setLoading(false);
        return;
      }

      const technicianList = technicianIds.map((technicianId) => {
        const profile = profiles?.find(
          (item) => item.id === technicianId
        );

        return {
          id: technicianId,
          name: profile?.name || null,
          city: profile?.city || null,
          country: profile?.country || null,
        };
      });

      setTechnicians(technicianList);
      setLoading(false);
    }

    loadData();
  }, [id]);

  async function acceptTechnician(technicianId: string) {
    if (!request) return;

    const confirmation = window.confirm(
      "Voulez-vous accepter ce technicien pour cette réparation ?"
    );

    if (!confirmation) return;

    setAcceptingId(technicianId);
    setMessage("");

    const { error: interestError } = await supabase
      .from("repair_interests")
      .update({ status: "accepted" })
      .eq("repair_request_id", request.id)
      .eq("technician_id", technicianId);

    if (interestError) {
      console.error("Erreur acceptation technicien :", interestError);

      setMessage(
        "Impossible d'accepter le technicien. Vérifiez les permissions Supabase."
      );

      setAcceptingId(null);
      return;
    }

    const { error: requestError } = await supabase
      .from("repair_requests")
      .update({ status: "assigned" })
      .eq("id", request.id);

    if (requestError) {
      console.error("Erreur changement statut :", requestError);

      setMessage(
        "Le technicien a été accepté, mais le statut de la demande n'a pas pu être modifié."
      );

      setAcceptingId(null);
      return;
    }

    setRequest({
      ...request,
      status: "assigned",
    });

    setMessage("Technicien accepté avec succès !");

    setAcceptingId(null);
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
            <div className="text-5xl">🔧</div>

            <h1 className="mt-5 text-2xl font-black text-slate-950">
              Demande introuvable
            </h1>

            <p className="mt-3 text-slate-500">{message}</p>

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

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="page-container">

        <Link
          href={"/" + locale + "/dashboard"}
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          ← Retour à mon espace
        </Link>

        {message && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 font-semibold text-blue-700">
            {message}
          </div>
        )}

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

            <span className="h-fit w-fit rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
              {request.status === "open"
                ? "🟢 Ouverte"
                : request.status === "assigned"
                ? "🔵 Technicien accepté"
                : request.status || "Inconnue"}
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
                {[request.city, request.country]
                  .filter(Boolean)
                  .join(", ") || "Non renseignée"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-bold text-slate-700">
                💰 Budget
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
                {new Date(request.created_at).toLocaleDateString(
                  "fr-FR"
                )}
              </div>
            </div>

          </div>
        </section>

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

              {technicians.map((technician) => (
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
                      {[technician.city, technician.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  {request.status === "assigned" ? (
                    <div className="mt-5 rounded-xl bg-green-50 px-5 py-3 text-center font-bold text-green-700">
                      ✅ Technicien accepté
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        acceptTechnician(technician.id)
                      }
                      disabled={acceptingId === technician.id}
                      className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {acceptingId === technician.id
                        ? "Acceptation..."
                        : "Accepter ce technicien →"}
                    </button>
                  )}

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
