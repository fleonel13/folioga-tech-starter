"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const categories = [
  "Réparation smartphone",
  "Réparation ordinateur",
  "Réparation tablette",
  "Réparation console",
  "Maintenance",
  "Autre",
];

export default function CreatePostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/" + locale + "/login");
        return;
      }

      setCheckingUser(false);
    }

    checkUser();
  }, [locale, router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Veuillez sélectionner une image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setMessage("");
    setImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Veuillez entrer un titre.");
      return;
    }

    if (!description.trim()) {
      setMessage("Veuillez entrer une description.");
      return;
    }

    setLoading(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      setMessage("Vous devez être connecté pour publier.");
      return;
    }

    const user = userData.user;

    let imageUrl: string | null = null;

    if (image) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        user.id +
        "-" +
        Date.now() +
        "." +
        extension;

      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setLoading(false);
        setMessage(
          "Impossible d'envoyer la photo : " + uploadError.message
        );
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      image_url: imageUrl,
    });

    if (error) {
      setLoading(false);
      setMessage(
        "Impossible de publier votre travail : " + error.message
      );
      return;
    }

    router.push("/" + locale + "/posts");
    router.refresh();
  }

  if (checkingUser) {
    return (
      <main className="section">
        <div className="container">
          <div className="card p-10 text-center">
            <p className="font-semibold text-slate-500">
              Vérification de votre connexion...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="mx-auto max-w-2xl">

          <Link
            href={"/" + locale + "/posts"}
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            ← Retour aux réalisations
          </Link>

          <div className="mt-6">
            <div className="text-sm font-bold text-blue-600">
              COMMUNAUTÉ
            </div>

            <h1 className="mt-2 text-4xl font-black">
              Publier un travail 📸
            </h1>

            <p className="mt-3 text-slate-500">
              Partagez une réparation, un projet ou une réalisation avec la
              communauté Folioga-Tech.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="card mt-8 space-y-6 p-6 sm:p-8"
          >

            {/* Titre */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Titre du travail
              </label>

              <input
                id="title"
                type="text"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Remplacement écran iPhone 14"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Catégorie
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                required
                maxLength={2000}
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre travail, les problèmes rencontrés, les réparations effectuées..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {description.length}/2000
              </p>
            </div>

            {/* Photo */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Photo du travail
              </label>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">

                {preview ? (
                  <div>
                    <img
                      src={preview}
                      alt="Aperçu"
                      className="mx-auto max-h-72 rounded-xl object-contain"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Supprimer la photo
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex cursor-pointer flex-col items-center justify-center py-8 text-center"
                  >
                    <span className="text-5xl">📷</span>

                    <span className="mt-3 font-black text-slate-900">
                      Choisir une photo
                    </span>

                    <span className="mt-1 text-sm text-slate-500">
                      JPG, PNG ou WebP — 5 Mo maximum
                    </span>
                  </label>
                )}

                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {message}
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                href={"/" + locale + "/posts"}
                className="btn btn-secondary justify-center"
              >
                Annuler
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Publication en cours..."
                  : "Publier mon travail"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
