"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type PhotoType = "before" | "after" | "other";

type RepairPhoto = {
  id: string;
  repair_request_id: string;
  uploaded_by: string;
  phase: PhotoType;
  storage_path: string;
  created_at: string;
};

type RepairPhotosProps = {
  repairRequestId: string;
};

const BUCKET_NAME = "repair-photos";

const MAX_FILES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getPhotoTypeLabel(type: PhotoType) {
  switch (type) {
    case "before":
      return "Avant réparation";
    case "after":
      return "Après réparation";
    default:
      return "Autres photos";
  }
}

function getPhotoTypeIcon(type: PhotoType) {
  switch (type) {
    case "before":
      return "📸";
    case "after":
      return "✨";
    default:
      return "🖼️";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop();

  if (extension) {
    return extension.toLowerCase();
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";

  return "jpg";
}

function createFileName(file: File) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${randomId}.${getFileExtension(file)}`;
}

export default function RepairPhotos({
  repairRequestId,
}: RepairPhotosProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<RepairPhoto[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedType, setSelectedType] =
    useState<PhotoType>("before");

  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedImage, setSelectedImage] =
    useState<RepairPhoto | null>(null);

  const beforePhotos = useMemo(
    () => photos.filter((photo) => photo.phase === "before"),
    [photos]
  );

  const afterPhotos = useMemo(
    () => photos.filter((photo) => photo.phase === "after"),
    [photos]
  );

  const otherPhotos = useMemo(
    () => photos.filter((photo) => photo.phase === "other"),
    [photos]
  );

  const createImageUrls = useCallback(
    async (photoList: RepairPhoto[]) => {
      if (photoList.length === 0) {
        setImageUrls({});
        return;
      }

      setLoadingImages(true);

      const entries = await Promise.all(
        photoList.map(async (photo) => {
          const { data, error: urlError } =
            await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(photo.storage_path, 3600);

          if (urlError) {
            console.error(
              "Erreur URL signée photo :",
              urlError
            );
            return null;
          }

          return [photo.id, data.signedUrl] as const;
        })
      );

      const urls: Record<string, string> = {};

      for (const entry of entries) {
        if (entry) {
          urls[entry[0]] = entry[1];
        }
      }

      setImageUrls(urls);
      setLoadingImages(false);
    },
    []
  );

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: photosError } =
      await supabase
        .from("repair_photos")
        .select(
          `
            id,
            repair_request_id,
            uploaded_by,
            storage_path,
            phase,
            created_at
          `
        )
        .eq("repair_request_id", repairRequestId)
        .order("created_at", {
          ascending: false,
        });

    if (photosError) {
      console.error(
        "Erreur chargement photos réparation :",
        photosError
      );

      setError(
        `Impossible de charger les photos : ${photosError.message || ""}`
      );

      setPhotos([]);
      setImageUrls({});
      setLoading(false);
      return;
    }

    const photoList = (data || []) as RepairPhoto[];

    setPhotos(photoList);

    await createImageUrls(photoList);

    setLoading(false);
  }, [repairRequestId, createImageUrls]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (userError || !user) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      await loadPhotos();
    }

    init();

    return () => {
      mounted = false;
    };
  }, [loadPhotos]);

  async function uploadPhotos(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    setError("");
    setSuccess("");

    if (!files || files.length === 0) {
      return;
    }

    if (!userId) {
      setError(
        "Vous devez être connecté pour ajouter des photos."
      );
      event.target.value = "";
      return;
    }

    const fileList = Array.from(files);

    if (fileList.length > MAX_FILES) {
      setError(
        `Vous pouvez sélectionner maximum ${MAX_FILES} photos à la fois.`
      );
      event.target.value = "";
      return;
    }

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setError(
          `"${file.name}" n'est pas une image valide.`
        );
        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" dépasse la taille maximale de 10 Mo.`
        );
        event.target.value = "";
        return;
      }
    }

    setUploading(true);

    try {
      for (const file of fileList) {
        const fileName = createFileName(file);

        const storagePath =
          `repairs/${repairRequestId}/${selectedType}/${userId}/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

        if (uploadError) {
          throw new Error(
            `Erreur upload "${file.name}" : ${uploadError.message}`
          );
        }

        const { error: databaseError } =
          await supabase
            .from("repair_photos")
            .insert({
              repair_request_id: repairRequestId,
              uploaded_by: userId,
              phase: selectedType,
              storage_path: storagePath,
            });

        if (databaseError) {
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([storagePath]);

          throw new Error(
            `Erreur enregistrement "${file.name}" : ${databaseError.message}`
          );
        }
      }

      setCaption("");

      setSuccess(
        `${fileList.length} photo${
          fileList.length > 1
            ? "s ont été ajoutées."
            : " a été ajoutée."
        }`
      );

      await loadPhotos();
    } catch (uploadError) {
      console.error(
        "Erreur ajout photos réparation :",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Impossible d'ajouter les photos."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function deletePhoto(photo: RepairPhoto) {
    if (!userId) {
      setError("Vous devez être connecté.");
      return;
    }

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette photo ?"
    );

    if (!confirmed) return;

    setDeletingId(photo.id);
    setError("");
    setSuccess("");

    try {
      const { error: databaseError } =
        await supabase
          .from("repair_photos")
          .delete()
          .eq("id", photo.id);

      if (databaseError) {
        throw new Error(databaseError.message);
      }

      const { error: storageError } =
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([photo.storage_path]);

      if (storageError) {
        console.error(
          "Photo supprimée de la base mais erreur stockage :",
          storageError
        );
      }

      setPhotos((current) =>
        current.filter((item) => item.id !== photo.id)
      );

      setImageUrls((current) => {
        const next = { ...current };
        delete next[photo.id];
        return next;
      });

      setSuccess("La photo a été supprimée.");

      if (selectedImage?.id === photo.id) {
        setSelectedImage(null);
      }
    } catch (deleteError) {
      console.error(
        "Erreur suppression photo :",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? `Impossible de supprimer la photo : ${deleteError.message}`
          : "Impossible de supprimer la photo."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function renderPhotoSection(
    title: string,
    type: PhotoType,
    items: RepairPhoto[]
  ) {
    return (
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-950">
            {getPhotoTypeIcon(type)} {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {items.length} photo{items.length > 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div className="text-3xl">
              {getPhotoTypeIcon(type)}
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Aucune photo pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((photo) => {
              const imageUrl = imageUrls[photo.id];
              const isOwner = photo.uploaded_by === userId;

              return (
                <article
                  key={photo.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl) {
                        setSelectedImage(photo);
                      }
                    }}
                    disabled={!imageUrl}
                    className="block w-full cursor-zoom-in disabled:cursor-wait"
                    aria-label="Agrandir la photo"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={getPhotoTypeLabel(photo.phase)}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-slate-100">
                        <div className="text-center">
                          <div className="text-3xl">
                            ⏳
                          </div>

                          <p className="mt-2 text-xs font-bold text-slate-500">
                            Chargement de la photo...
                          </p>
                        </div>
                      </div>
                    )}
                  </button>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        {getPhotoTypeLabel(photo.phase)}
                      </span>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => deletePhoto(photo)}
                          disabled={deletingId === photo.id}
                          className="text-xs font-bold text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === photo.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Ajoutée le {formatDate(photo.created_at)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="text-sm font-bold text-blue-600">
              📸 PHOTOS DE LA RÉPARATION
            </div>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Avant / Après
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Ajoutez des photos pour suivre l'état de l'appareil
              avant, pendant et après la réparation.
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
            <div className="text-2xl font-black text-blue-700">
              {photos.length}
            </div>

            <div className="text-xs font-bold text-blue-600">
              photo{photos.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-black">
              ⚠️ Une erreur est survenue
            </div>

            <p className="mt-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="font-black">
              ✅ Opération réussie
            </div>

            <p className="mt-1">{success}</p>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">➕</span>

            <div>
              <h3 className="font-black text-slate-950">
                Ajouter des photos
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG ou WEBP — maximum 10 Mo par photo.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="photo-type"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Phase de la réparation
              </label>

              <select
                id="photo-type"
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(
                    event.target.value as PhotoType
                  )
                }
                disabled={uploading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              >
                <option value="before">
                  📸 Avant réparation
                </option>

                <option value="after">
                  ✨ Après réparation
                </option>

                <option value="other">
                  🖼️ Autres photos
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="photo-caption"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Description facultative
              </label>

              <input
                id="photo-caption"
                type="text"
                value={caption}
                onChange={(event) =>
                  setCaption(event.target.value)
                }
                disabled={uploading}
                placeholder="Ex : Écran cassé avant intervention"
                maxLength={250}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="repair-photo-upload"
              className={
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition " +
                (uploading
                  ? "cursor-wait border-slate-200 bg-slate-100"
                  : "border-blue-300 bg-white hover:border-blue-500 hover:bg-blue-50")
              }
            >
              <span className="text-4xl">
                {uploading ? "⏳" : "📤"}
              </span>

              <span className="mt-3 font-black text-slate-950">
                {uploading
                  ? "Téléversement en cours..."
                  : "Cliquez pour sélectionner des photos"}
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Vous pouvez sélectionner jusqu'à {MAX_FILES} photos.
              </span>

              <input
                id="repair-photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading}
                onChange={uploadPhotos}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-3xl">⏳</div>

            <p className="mt-3 font-semibold text-slate-500">
              Chargement des photos...
            </p>
          </div>
        ) : (
          <>
            {loadingImages && photos.length > 0 && (
              <div className="mt-6 rounded-xl bg-blue-50 p-3 text-center text-sm font-semibold text-blue-700">
                🔐 Préparation des photos...
              </div>
            )}

            {renderPhotoSection(
              "Avant réparation",
              "before",
              beforePhotos
            )}

            {renderPhotoSection(
              "Après réparation",
              "after",
              afterPhotos
            )}

            {renderPhotoSection(
              "Autres photos",
              "other",
              otherPhotos
            )}
          </>
        )}
      </section>

      {selectedImage && imageUrls[selectedImage.id] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -right-2 -top-12 rounded-full bg-white px-4 py-2 font-black text-slate-950 shadow-lg"
            >
              ✕ Fermer
            </button>

            <img
              src={imageUrls[selectedImage.id]}
              alt={getPhotoTypeLabel(selectedImage.phase)}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <div className="mt-3 rounded-2xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {getPhotoTypeIcon(selectedImage.phase)}{" "}
                  {getPhotoTypeLabel(selectedImage.phase)}
                </span>

                <span className="text-xs text-slate-400">
                  {formatDate(selectedImage.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
