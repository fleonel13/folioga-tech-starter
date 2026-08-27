"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type Interest = {
repair_request_id: string;
technician_id: string;
status: string | null;
};

export default function RepairRequestsPage() {
const router = useRouter();

const [requests, setRequests] = useState<RepairRequest[]>([]);
const [interests, setInterests] = useState<Interest[]>([]);
const [loading, setLoading] = useState(true);
const [sendingId, setSendingId] = useState<string | null>(null);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

async function loadData() {
setLoading(true);
setMessage("");
setError("");

const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  router.replace("/fr/login");
  return;
}

const userId = user.id;

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

if (profileError || !profile) {
  setError("Impossible de vérifier votre profil.");
  setLoading(false);
  return;
}

const role = String(profile.role || "").toLowerCase();

if (role !== "technicien" && role !== "technician") {
  setError("Cette page est réservée aux techniciens.");
  setLoading(false);
  return;
}

const { data: repairData, error: repairError } = await supabase
  .from("repair_requests")
  .select(
    "id, client_id, title, device_type, description, country, city, budget, status, created_at"
  )
  .neq("client_id", userId)
  .order("created_at", { ascending: false });

if (repairError) {
  console.error("Erreur demandes :", repairError);
  setError("Impossible de charger les demandes.");
  setLoading(false);
  return;
}

const allRequests = (repairData || []) as RepairRequest[];

const { data: interestData, error: interestError } = await supabase
  .from("repair_interests")
  .select("repair_request_id, technician_id, status")
  .eq("technician_id", userId);

if (interestError) {
  console.error("Erreur intérêts :", interestError);
}

const myInterests = (interestData || []) as Interest[];

setRequests(allRequests);
setInterests(myInterests);
setLoading(false);

}

useEffect(() => {
loadData();
}, []);

async function handleInterest(requestId: string) {
setMessage("");
setError("");
setSendingId(requestId);

const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  setError("Vous devez être connecté.");
  setSendingId(null);
  return;
}

const existingInterest = interests.find(
  (interest) => interest.repair_request_id === requestId
);

if (existingInterest) {
  setMessage("Vous avez déjà manifesté votre intérêt.");
  setSendingId(null);
  return;
}

const { error: insertError } = await supabase
  .from("repair_interests")
  .insert({
    repair_request_id: requestId,
    technician_id: user.id,
    status: "pending",
  });

if (insertError) {
  console.error("Erreur intérêt :", insertError);

  if (insertError.code === "23505") {
    setMessage("Vous êtes déjà intéressé par cette demande.");
    await loadData();
  } else {
    setError(
      "Impossible d'enregistrer votre intérêt. Réessayez."
    );
  }

  setSendingId(null);
  return;
}

setMessage(
  "Votre intérêt a bien été envoyé au client. ✅"
);

await loadData();

setSendingId(null);

}

if (loading) {
return (
<main className="min-h-screen bg-slate-50 py-12">
<div className="page-container">
<div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
<p className="font-semibold text-slate-500">
Chargement des demandes...
</p>
</div>
</div>
</main>
);
}

if (error === "Cette page est réservée aux techniciens.") {
return (
<main className="min-h-screen bg-slate-50 py-12">
<div className="page-container">
<div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
<p className="font-semibold text-red-600">{error}</p>

        <Link
          href="/fr/dashboard"
          className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
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

    <div>
      <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
        🔧 Espace technicien
      </div>

      <h1 className="mt-3 text-4xl font-black text-slate-950">
        Demandes de réparation
      </h1>

      <p className="mt-3 max-w-2xl text-slate-500">
        Consultez les demandes ouvertes et manifestez votre
        intérêt pour les réparations que vous souhaitez réaliser.
      </p>
    </div>

    <div className="mt-5">
      <Link
        href="/fr/dashboard"
        className="font-bold text-blue-600 hover:text-blue-700"
      >
        ← Mon espace
      </Link>
    </div>

    {message && (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="font-semibold text-green-700">
          {message}
        </p>
      </div>
    )}

    {error && error !== "Cette page est réservée aux techniciens." && (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-700">
          {error}
        </p>
      </div>
    )}

    {requests.length === 0 ? (
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <div className="text-5xl">🔧</div>

        <h2 className="mt-5 text-2xl font-black text-slate-950">
          Aucune demande disponible
        </h2>

        <p className="mx-auto mt-2 max-w-md text-slate-500">
          Il n'y a actuellement aucune demande de réparation.
        </p>
      </div>
    ) : (
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {requests.map((request) => {
          const interest = interests.find(
            (item) =>
              item.repair_request_id === request.id
          );

          const sending = sendingId === request.id;

          const isAccepted =
            interest?.status === "accepted";

          const isPending =
            interest?.status === "pending";

          const isOpen =
            request.status === "open";

          return (
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

                {isAccepted ? (
                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                    🔵 Technicien accepté
                  </span>
                ) : isOpen ? (
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                    🟢 Ouverte
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                    {request.status || "Fermée"}
                  </span>
                )}
              </div>

              {request.description && (
                <p className="mt-4 leading-6 text-slate-600">
                  {request.description}
                </p>
              )}

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">

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
                    📅 Publiée le :
                  </span>{" "}
                  <span className="text-slate-500">
                    {new Date(
                      request.created_at
                    ).toLocaleDateString("fr-FR")}
                  </span>
                </div>

              </div>

              {isAccepted ? (
                <div className="mt-6 rounded-xl bg-blue-50 px-5 py-3 text-center font-bold text-blue-700">
                  ✅ Technicien accepté
                  <div className="mt-1 text-xs font-medium text-blue-600">
                    Le client vous a accepté pour cette réparation.
                  </div>
                </div>
              ) : isPending ? (
                <div className="mt-6 rounded-xl bg-amber-50 px-5 py-3 text-center font-bold text-amber-700">
                  ⏳ Intérêt envoyé
                  <div className="mt-1 text-xs font-medium text-amber-600">
                    Votre candidature est en attente de réponse du client.
                  </div>
                </div>
              ) : !isOpen ? (
                <div className="mt-6 rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-600">
                  Demande fermée
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    handleInterest(request.id)
                  }
                  disabled={sending}
                  className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending
                    ? "Envoi..."
                    : "Je suis intéressé →"}
                </button>
              )}

            </article>
          );
        })}

      </div>
    )}

  </div>
</main>

);
}
