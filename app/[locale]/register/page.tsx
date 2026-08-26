
"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();

  const [role, setRole] = useState<"client" | "technicien">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      router.push("/" + locale + "/dashboard");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Folioga-Tech
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Créer votre compte
            </h1>

            <p className="mt-3 text-slate-500">
              Rejoignez Folioga-Tech gratuitement.
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Je suis :
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={
                    role === "client"
                      ? "rounded-2xl border border-blue-500 bg-blue-50 p-4 text-left ring-2 ring-blue-100"
                      : "rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300"
                  }
                >
                  <div className="text-2xl">👤</div>

                  <div className="mt-2 font-black text-slate-950">
                    Client
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Acheter, demander une réparation et trouver un technicien.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("technicien")}
                  className={
                    role === "technicien"
                      ? "rounded-2xl border border-blue-500 bg-blue-50 p-4 text-left ring-2 ring-blue-100"
                      : "rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300"
                  }
                >
                  <div className="text-2xl">🔧</div>

                  <div className="mt-2 font-black text-slate-950">
                    Technicien
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Présenter vos services, publier vos réalisations et trouver
                    des clients.
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Adresse email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Confirmer le mot de passe
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez votre mot de passe"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            Vous avez déjà un compte ?{" "}
            <Link
              href={"/" + locale + "/login"}
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
