"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  role: string | null;
};

type Post = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  created_at: string;
  profile?: Profile | null;
};

export default function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();

      setUserId(userData.user?.id ?? null);

      // Récupération des publications
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error(
          "Erreur lors du chargement des publications :",
          postsError
        );
        setPosts([]);
        setLoading(false);
        return;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Récupération des profils correspondant aux auteurs
      const userIds = [
        ...new Set(
          postsData
            .map((post) => post.user_id)
            .filter((id): id is string => Boolean(id))
        ),
      ];

      let profiles: Profile[] = [];

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, role")
          .in("id", userIds);

        if (profilesError) {
          console.error(
            "Erreur lors du chargement des profils :",
            profilesError
          );
        } else if (profilesData) {
          profiles = profilesData;
        }
      }

      // Associer chaque publication à son profil
      const postsWithProfiles: Post[] = postsData.map((post) => ({
        ...post,
        profile:
          profiles.find((profile) => profile.id === post.user_id) ?? null,
      }));

      setPosts(postsWithProfiles);
      setLoading(false);
    }

    loadPosts();
  }, []);

  function getRoleLabel(role: string | null | undefined) {
    if (!role) {
      return "Client";
    }

    const normalizedRole = role.toLowerCase().trim();

    if (
      normalizedRole === "technicien" ||
      normalizedRole === "technician" ||
      normalizedRole === "tech"
    ) {
      return "Technicien";
    }

    return "Client";
  }

  return (
    <main className="section">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-bold text-blue-600">
              COMMUNAUTÉ
            </div>

            <h1 className="mt-2 text-4xl font-black">
              Réalisations 📸
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Découvrez les travaux, réparations et projets publiés par la
              communauté Folioga-Tech.
            </p>
          </div>

          {userId ? (
            <Link
              href={"/" + locale + "/posts/create"}
              className="btn btn-dark"
            >
              + Publier un travail
            </Link>
          ) : (
            <Link
              href={"/" + locale + "/login"}
              className="btn btn-dark"
            >
              Se connecter pour publier
            </Link>
          )}
        </div>

        {/* Publications */}
        {loading ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-semibold text-slate-500">
              Chargement des réalisations...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="card mt-10 p-12 text-center">
            <div className="text-5xl">📸</div>

            <h2 className="mt-5 text-2xl font-black">
              Aucune réalisation pour le moment
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Soyez le premier à partager un travail avec la communauté
              Folioga-Tech.
            </p>

            {userId && (
              <Link
                href={"/" + locale + "/posts/create"}
                className="btn btn-dark mt-6"
              >
                Publier ma première réalisation
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card overflow-hidden"
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-100 text-5xl">
                    🔧
                  </div>
                )}

                <div className="p-6">
                  <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {post.category}
                  </div>

                  <h2 className="mt-2 text-xl font-black">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {post.description}
                  </p>

                  {/* Auteur et rôle */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <div className="text-sm font-bold text-slate-700">
                      👤 Auteur
                    </div>

                    <div className="mt-1 break-all text-sm text-slate-600">
                      {post.profile?.email ?? "Utilisateur"}
                    </div>

                    <div className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-600">
                      🔧 {getRoleLabel(post.profile?.role)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                    Publié le{" "}
                    {new Date(post.created_at).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US"
                    )}
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
