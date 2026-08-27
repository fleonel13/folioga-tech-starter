"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "negotiating"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"
  | "superseded";

type QuoteItem = {
  id: string;
  quote_id: string;
  description: string;
  item_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  position: number;
};

type Quote = {
  id: string;
  repair_request_id: string;
  technician_id: string;
  version: number;
  status: QuoteStatus;
  currency: string;
  subtotal: number;
  discount_type: string | null;
  discount_value: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_ht: number;
  total_ttc: number;
  notes: string | null;
  expires_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
};

type RepairQuotesProps = {
  repairRequestId: string;
  clientId: string;
  technicianId?: string | null;
  userId: string;
  userRole: string;
};

type DraftItem = {
  description: string;
  item_type: string;
  quantity: number;
  unit_price: number;
};

const emptyItem = (): DraftItem => ({
  description: "",
  item_type: "labor",
  quantity: 1,
  unit_price: 0,
});

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

function statusLabel(status: QuoteStatus) {
  switch (status) {
    case "draft":
      return "📝 Brouillon";
    case "sent":
      return "📤 Envoyé";
    case "viewed":
      return "👀 Vu";
    case "negotiating":
      return "💬 En négociation";
    case "accepted":
      return "✅ Accepté";
    case "rejected":
      return "❌ Refusé";
    case "expired":
      return "⏰ Expiré";
    case "cancelled":
      return "🚫 Annulé";
    case "superseded":
      return "🔄 Remplacé";
    default:
      return status;
  }
}

function statusClass(status: QuoteStatus) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700";

    case "rejected":
    case "cancelled":
    case "expired":
      return "bg-red-50 text-red-700";

    case "sent":
    case "viewed":
      return "bg-blue-50 text-blue-700";

    case "negotiating":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function RepairQuotes({
  repairRequestId,
  clientId,
  technicianId,
  userId,
  userRole,
}: RepairQuotesProps) {
  const isClient = userId === clientId;

  const hasTechnicianRole =
    userRole === "technicien" ||
    userRole === "technician";

  /*
   * Le technicien peut créer un devis uniquement si :
   * - il a le rôle technicien
   * - un technicien est assigné à la réparation
   * - l'utilisateur connecté est ce technicien
   */
  const isAssignedTechnician =
    hasTechnicianRole &&
    !!technicianId &&
    technicianId === userId;

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [items, setItems] = useState<Record<string, QuoteItem[]>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [showBuilder, setShowBuilder] = useState(false);

  const [draftItems, setDraftItems] = useState<DraftItem[]>([
    emptyItem(),
  ]);

  const [discountType, setDiscountType] = useState<
    "none" | "fixed" | "percent"
  >("none");

  const [discountValue, setDiscountValue] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeQuote = useMemo(
    () =>
      quotes.find(
        (quote) =>
          quote.status !== "superseded" &&
          quote.status !== "cancelled"
      ) || null,
    [quotes]
  );

  const draftSubtotal = useMemo(
    () =>
      draftItems.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantity) || 0) *
            (Number(item.unit_price) || 0),
        0
      ),
    [draftItems]
  );

  const draftDiscount = useMemo(() => {
    if (discountType === "fixed") {
      return Math.min(
        Math.max(0, Number(discountValue) || 0),
        draftSubtotal
      );
    }

    if (discountType === "percent") {
      return Math.min(
        draftSubtotal,
        draftSubtotal *
          (Math.max(0, Number(discountValue) || 0) / 100)
      );
    }

    return 0;
  }, [discountType, discountValue, draftSubtotal]);

  const draftHt = Math.max(
    0,
    draftSubtotal - draftDiscount
  );

  const draftTax =
    draftHt *
    (Math.max(0, Number(taxRate) || 0) / 100);

  const draftTtc = draftHt + draftTax;

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: quoteError } = await supabase
      .from("repair_quotes")
      .select(`
        id,
        repair_request_id,
        technician_id,
        version,
        status,
        currency,
        subtotal,
        discount_type,
        discount_value,
        discount_amount,
        tax_rate,
        tax_amount,
        total_ht,
        total_ttc,
        notes,
        expires_at,
        accepted_at,
        rejected_at,
        created_at,
        updated_at
      `)
      .eq("repair_request_id", repairRequestId)
      .order("version", { ascending: false });

    if (quoteError) {
      console.error(
        "Erreur chargement devis :",
        quoteError
      );

      setError(
        `Impossible de charger les devis : ${quoteError.message}`
      );

      setQuotes([]);
      setLoading(false);
      return;
    }

    const quoteList = (data || []) as Quote[];

    setQuotes(quoteList);

    if (quoteList.length > 0) {
      const quoteIds = quoteList.map(
        (quote) => quote.id
      );

      const { data: itemData, error: itemError } =
        await supabase
          .from("repair_quote_items")
          .select(`
            id,
            quote_id,
            description,
            item_type,
            quantity,
            unit_price,
            total_price,
            position
          `)
          .in("quote_id", quoteIds)
          .order("position", {
            ascending: true,
          });

      if (itemError) {
        console.error(
          "Erreur chargement lignes devis :",
          itemError
        );
      } else {
        const grouped: Record<
          string,
          QuoteItem[]
        > = {};

        for (const item of (itemData ||
          []) as QuoteItem[]) {
          if (!grouped[item.quote_id]) {
            grouped[item.quote_id] = [];
          }

          grouped[item.quote_id].push(item);
        }

        setItems(grouped);
      }
    } else {
      setItems({});
    }

    setLoading(false);
  }, [repairRequestId]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  function updateDraftItem(
    index: number,
    field: keyof DraftItem,
    value: string
  ) {
    setDraftItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (
          field === "description" ||
          field === "item_type"
        ) {
          return {
            ...item,
            [field]: value,
          };
        }

        return {
          ...item,
          [field]: Number(value) || 0,
        };
      })
    );
  }

  function addDraftItem() {
    setDraftItems((current) => [
      ...current,
      emptyItem(),
    ]);
  }

  function removeDraftItem(index: number) {
    setDraftItems((current) =>
      current.length === 1
        ? current
        : current.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
    );
  }

  async function createQuote() {
    if (!isAssignedTechnician || !technicianId) {
      setError(
        "Seul le technicien accepté pour cette réparation peut créer un devis."
      );
      return;
    }

    const validItems = draftItems.filter(
      (item) =>
        item.description.trim() &&
        Number(item.quantity) > 0 &&
        Number(item.unit_price) >= 0
    );

    if (validItems.length === 0) {
      setError(
        "Ajoutez au moins une ligne valide au devis."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const nextVersion =
        quotes.length > 0
          ? Math.max(
              ...quotes.map(
                (quote) => quote.version
              )
            ) + 1
          : 1;

      const { data: quote, error: quoteError } =
        await supabase
          .from("repair_quotes")
          .insert({
            repair_request_id:
              repairRequestId,
            technician_id: technicianId,
            version: nextVersion,
            status: "draft",
            currency: "EUR",
            subtotal: draftSubtotal,
            discount_type:
              discountType === "none"
                ? null
                : discountType,
            discount_value:
              discountType === "none"
                ? 0
                : Number(discountValue) || 0,
            discount_amount: draftDiscount,
            tax_rate:
              Number(taxRate) || 0,
            tax_amount: draftTax,
            total_ht: draftHt,
            total_ttc: draftTtc,
            notes:
              notes.trim() || null,
            expires_at: expiresAt
              ? new Date(
                  `${expiresAt}T23:59:59`
                ).toISOString()
              : null,
          })
          .select()
          .single();

      if (quoteError || !quote) {
        throw new Error(
          quoteError?.message ||
            "Impossible de créer le devis."
        );
      }

      const { error: itemsError } =
        await supabase
          .from("repair_quote_items")
          .insert(
            validItems.map(
              (item, index) => ({
                quote_id: quote.id,
                description:
                  item.description.trim(),
                item_type:
                  item.item_type,
                quantity:
                  Number(item.quantity),
                unit_price:
                  Number(item.unit_price),
                total_price:
                  Number(item.quantity) *
                  Number(item.unit_price),
                position: index,
              })
            )
          );

      if (itemsError) {
        await supabase
          .from("repair_quotes")
          .delete()
          .eq("id", quote.id);

        throw new Error(
          `Impossible d'enregistrer les lignes : ${itemsError.message}`
        );
      }

      setMessage(
        `Devis version ${nextVersion} créé avec succès.`
      );

      setShowBuilder(false);
      setDraftItems([emptyItem()]);
      setDiscountType("none");
      setDiscountValue(0);
      setTaxRate(0);
      setNotes("");
      setExpiresAt("");

      await loadQuotes();
    } catch (createError) {
      console.error(
        "Erreur création devis :",
        createError
      );

      setError(
        createError instanceof Error
          ? createError.message
          : "Impossible de créer le devis."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeQuoteStatus(
    quote: Quote,
    newStatus:
      | "sent"
      | "accepted"
      | "rejected"
  ) {
    setProcessingId(quote.id);
    setError("");
    setMessage("");

    const updates: Record<string, unknown> = {
      status: newStatus,
    };

    if (newStatus === "accepted") {
      updates.accepted_at =
        new Date().toISOString();
    }

    if (newStatus === "rejected") {
      updates.rejected_at =
        new Date().toISOString();
    }

    const { error: updateError } =
      await supabase
        .from("repair_quotes")
        .update(updates)
        .eq("id", quote.id);

    if (updateError) {
      console.error(
        "Erreur changement statut devis :",
        updateError
      );

      setError(updateError.message);
      setProcessingId(null);
      return;
    }

    setMessage(
      newStatus === "sent"
        ? "Le devis a été envoyé au client."
        : newStatus === "accepted"
        ? "Le devis a été accepté."
        : "Le devis a été refusé."
    );

    setProcessingId(null);

    await loadQuotes();
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center text-slate-500">
          Chargement des devis...
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="text-sm font-bold text-blue-600">
            💰 GESTION DU DEVIS
          </div>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Devis & prix final
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consultez, créez et suivez les devis de
            cette réparation.
          </p>
        </div>

        {isAssignedTechnician && (
          <button
            type="button"
            onClick={() =>
              setShowBuilder(
                (current) => !current
              )
            }
            className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-600"
          >
            {showBuilder
              ? "Fermer"
              : "➕ Nouveau devis"}
          </button>
        )}
      </div>

      {!isClient &&
        hasTechnicianRole &&
        !isAssignedTechnician && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
            ⚠️ Vous devez être le technicien
            accepté pour créer un devis.
          </div>
        )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          ✅ {message}
        </div>
      )}

      {showBuilder &&
        isAssignedTechnician && (
          <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50/50 p-5">
            <h3 className="text-xl font-black text-slate-950">
              Créer un devis
            </h3>

            <div className="mt-5 space-y-4">
              {draftItems.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-4">
                      <input
                        value={item.description}
                        onChange={(event) =>
                          updateDraftItem(
                            index,
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Description"
                        className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
                      />

                      <select
                        value={item.item_type}
                        onChange={(event) =>
                          updateDraftItem(
                            index,
                            "item_type",
                            event.target.value
                          )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                      >
                        <option value="labor">
                          🔧 Main-d'œuvre
                        </option>

                        <option value="part">
                          🔩 Pièce
                        </option>

                        <option value="travel">
                          🚗 Déplacement
                        </option>

                        <option value="other">
                          📦 Autre
                        </option>
                      </select>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(event) =>
                          updateDraftItem(
                            index,
                            "unit_price",
                            event.target.value
                          )
                        }
                        placeholder="Prix unitaire"
                        className="rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <label className="text-sm font-bold text-slate-600">
                        Quantité

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(event) =>
                            updateDraftItem(
                              index,
                              "quantity",
                              event.target.value
                            )
                          }
                          className="ml-2 w-24 rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-950">
                          {money(
                            item.quantity *
                              item.unit_price
                          )}
                        </span>

                        {draftItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeDraftItem(
                                index
                              )
                            }
                            className="text-sm font-bold text-red-600"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={addDraftItem}
              className="mt-4 rounded-xl border border-blue-300 bg-white px-4 py-2 font-bold text-blue-700"
            >
              ➕ Ajouter une ligne
            </button>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Remise
                </label>

                <select
                  value={discountType}
                  onChange={(event) =>
                    setDiscountType(
                      event.target.value as
                        | "none"
                        | "fixed"
                        | "percent"
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="none">
                    Aucune remise
                  </option>

                  <option value="fixed">
                    Montant fixe (€)
                  </option>

                  <option value="percent">
                    Pourcentage (%)
                  </option>
                </select>
              </div>

              {discountType !== "none" && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Valeur de la remise
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountValue}
                    onChange={(event) =>
                      setDiscountValue(
                        Number(
                          event.target.value
                        ) || 0
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  TVA (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxRate}
                  onChange={(event) =>
                    setTaxRate(
                      Number(
                        event.target.value
                      ) || 0
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Validité du devis
                </label>

                <input
                  type="date"
                  value={expiresAt}
                  onChange={(event) =>
                    setExpiresAt(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Conditions, informations complémentaires..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Sous-total</span>
                <span>
                  {money(draftSubtotal)}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm text-slate-500">
                <span>Remise</span>
                <span>
                  - {money(draftDiscount)}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm text-slate-500">
                <span>TVA</span>
                <span>
                  {money(draftTax)}
                </span>
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-xl font-black text-slate-950">
                <span>Total TTC</span>
                <span>
                  {money(draftTtc)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={createQuote}
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Création..."
                : "💰 Créer le devis"}
            </button>
          </div>
        )}

      {quotes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="text-4xl">
            💰
          </div>

          <h3 className="mt-3 text-xl font-black text-slate-950">
            Aucun devis
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Le devis apparaîtra ici lorsqu'il sera créé.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {quotes.map((quote) => {
            const quoteItems =
              items[quote.id] || [];

            return (
              <article
                key={quote.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="text-sm font-bold text-blue-600">
                      DEVIS VERSION{" "}
                      {quote.version}
                    </div>

                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      {money(
                        quote.total_ttc,
                        quote.currency
                      )}
                    </h3>
                  </div>

                  <span
                    className={
                      "h-fit w-fit rounded-full px-4 py-2 text-sm font-bold " +
                      statusClass(
                        quote.status
                      )
                    }
                  >
                    {statusLabel(
                      quote.status
                    )}
                  </span>
                </div>

                {quoteItems.length > 0 && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {quoteItems.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-b-0"
                        >
                          <div>
                            <div className="font-bold text-slate-800">
                              {
                                item.description
                              }
                            </div>

                            <div className="text-xs text-slate-500">
                              {
                                item.quantity
                              }{" "}
                              ×{" "}
                              {money(
                                item.unit_price,
                                quote.currency
                              )}
                            </div>
                          </div>

                          <div className="font-black text-slate-950">
                            {money(
                              item.total_price,
                              quote.currency
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">
                      TOTAL HT
                    </div>

                    <div className="mt-1 font-black text-slate-950">
                      {money(
                        quote.total_ht,
                        quote.currency
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">
                      TVA
                    </div>

                    <div className="mt-1 font-black text-slate-950">
                      {money(
                        quote.tax_amount,
                        quote.currency
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">
                      TOTAL TTC
                    </div>

                    <div className="mt-1 font-black text-slate-950">
                      {money(
                        quote.total_ttc,
                        quote.currency
                      )}
                    </div>
                  </div>
                </div>

                {quote.notes && (
                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">
                    <strong>
                      Notes :
                    </strong>{" "}
                    {quote.notes}
                  </div>
                )}

                {quote.expires_at && (
                  <div className="mt-4 text-xs font-semibold text-slate-500">
                    ⏰ Valable jusqu'au{" "}
                    {new Date(
                      quote.expires_at
                    ).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {isAssignedTechnician &&
                    quote.technician_id ===
                      userId &&
                    quote.status === "draft" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeQuoteStatus(
                            quote,
                            "sent"
                          )
                        }
                        disabled={
                          processingId ===
                          quote.id
                        }
                        className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-50"
                      >
                        {processingId ===
                        quote.id
                          ? "Envoi..."
                          : "📤 Envoyer au client"}
                      </button>
                    )}

                  {isClient &&
                    (quote.status ===
                      "sent" ||
                      quote.status ===
                        "viewed" ||
                      quote.status ===
                        "negotiating") && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            changeQuoteStatus(
                              quote,
                              "accepted"
                            )
                          }
                          disabled={
                            processingId ===
                            quote.id
                          }
                          className="rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white disabled:opacity-50"
                        >
                          {processingId ===
                          quote.id
                            ? "Traitement..."
                            : "✅ Accepter"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuoteStatus(
                              quote,
                              "rejected"
                            )
                          }
                          disabled={
                            processingId ===
                            quote.id
                          }
                          className="rounded-xl border border-red-200 bg-white px-4 py-3 font-bold text-red-600 disabled:opacity-50"
                        >
                          ❌ Refuser
                        </button>
                      </>
                    )}
                </div>

                {quote.status ===
                  "accepted" && (
                  <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-center font-bold text-emerald-700">
                    ✅ Ce devis a été accepté.
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {activeQuote?.status ===
        "accepted" && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="font-black text-emerald-800">
            💳 Prochaine étape :
            paiement
          </div>

          <p className="mt-1 text-sm text-emerald-700">
            Le devis accepté pourra ensuite être
            relié au système de paiement et à la
            facture.
          </p>
        </div>
      )}
    </section>
  );
}
