"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      setMessage("");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setMessage("Vous devez être connecté pour voir vos demandes.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("repair_requests")
        .select(
          "id, client_id, title, device_type, description, country, city, budget, status, created_at"
        )
        .eq("client_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur chargement demandes :", error);
        setMessage("Impossible de charger vos demandes.");
        setLoading(false);
        return;
      }

      setRequests(data || []);
      setLoading(false);
    }

    loadRequests();
  }, []);

  function getStatusLabel(status: string | null) {
    switch (status?.toLowerCase()) {
      case "open":
        return "🟢 Ouverte";

      case "pending":
        return "🟡 En attente";

      case "in_progress":
        return "🔵 En cours";

      case "completed":
        return "✅ Terminée";

      case "cancelled":
        return "🔴 Annulée";

      default:
        return "🟢 Ouverte";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="page-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
              🔧 Mes réparations
            </div>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Mes demandes
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              Retrouvez ici toutes vos demandes de réparation et leur état.
            </p>
          </div>

          <Link
            href="/fr/repairs"
            className="btn btn-dark"
          >
            + Nouvelle demande
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold text-slate-500">
              Chargement de vos demandes...
            </p>
          </div>
        ) : message ? (
          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              {message}
            </p>

            <Link
              href="/fr/login"
              className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
            >
              Se connecter
            </Link>
          </div>
        ) : requests.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-5xl">🔧</div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Aucune demande
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Vous n'avez pas encore envoyé de demande de réparation.
            </p>

            <Link
              href="/fr/repairs"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-blue-600"
            >
              Demander une réparation
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-blue-600">
                      {request.device_type || "Appareil"}
                    </div>

                    <h2 className="mt-2 text-xl font-black text-slate-950">
                      {request.title}
                    </h2>
                  </div>

                  <div className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold">
                    {getStatusLabel(request.status)}
                  </div>
                </div>

                {request.description && (
                  <p className="mt-4 leading-6 text-slate-600">
                    {request.description}
                  </p>
                )}

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 text-sm">
                  {(request.city || request.country) && (
                    <div>
                      <span className="font-bold text-slate-700">
                        📍 Localisation :
                      </span>{" "}
                      <span className="text-slate-500">
                        {[request.city, request.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {request.budget !== null && (
                    <div>
                      <span className="font-bold text-slate-700">
                        💰 Budget :
                      </span>{" "}
                      <span className="text-slate-500">
                        {request.budget} €
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-slate-700">
                      📅 Date :
                    </span>{" "}
                    <span className="text-slate-500">
                      {new Date(request.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
