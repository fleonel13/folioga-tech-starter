"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RepairRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDevice = searchParams.get("device") || "Smartphone";

  const [deviceType, setDeviceType] = useState(initialDevice);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    setLoading(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      setMessage("Vous devez être connecté pour envoyer une demande.");
      return;
    }

    const { error } = await supabase.from("repair_requests").insert({
      client_id: userData.user.id,
      title,
      device_type: deviceType,
      description,
      country: country || null,
      city: city || null,
      budget: budget ? Number(budget) : null,
      status: "open",
    });

    setLoading(false);

    if (error) {
      console.error("Erreur création demande :", error);
      setMessage("Impossible d'envoyer la demande. Veuillez réessayer.");
      return;
    }

    setMessage("✅ Votre demande a bien été envoyée !");

    setTitle("");
    setDescription("");
    setCountry("");
    setCity("");
    setBudget("");

    setTimeout(() => {
      router.push("/fr/repairs");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="page-container">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
              🔧 Demande de réparation
            </div>

            <h1 className="mt-3 text-3xl font-black text-slate-950">
              Décrivez votre problème
            </h1>

            <p className="mt-3 text-slate-500">
              Votre demande sera enregistrée et pourra ensuite être proposée
              aux techniciens.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Type d'appareil
                </label>

                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                >
                  <option>Smartphone</option>
                  <option>Ordinateur</option>
                  <option>Tablette</option>
                  <option>Console</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Titre de la demande
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Écran cassé"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Décrivez le problème
                </label>

                <textarea
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez ce qui ne fonctionne plus..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Pays
                  </label>

                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="France"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Ville
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Strasbourg"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Budget souhaité (€) — optionnel
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex : 100"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              {message && (
                <div className="rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Envoi en cours..."
                  : "Envoyer ma demande"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
