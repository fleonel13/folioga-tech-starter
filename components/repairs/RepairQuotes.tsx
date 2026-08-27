"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
};

type QuoteVersion = {
  id: string;
  version: number;
  createdAt: string;
  items: QuoteItem[];
  currency: string;
  vatRate: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  notes: string;
};

type Quote = {
  id: string;
  number: string;
  version: number;
  status: QuoteStatus;
  createdAt: string;
  validUntil: string;
  currency: string;
  vatRate: number;
  items: QuoteItem[];
  discountType: "percent" | "fixed";
  discountValue: number;
  notes: string;
  clientId: string;
  technicianId: string | null;
  attachments: Attachment[];
  photos: Attachment[];
  versions: QuoteVersion[];
};

type RepairQuotesProps = {
  repairRequestId: string;
  clientId: string;
  technicianId?: string | null;
  userId: string;
  userRole: string;
};

const STORAGE_PREFIX = "folioga-repair-quotes-";
const COMMISSION_RATE = 0.1;

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function createEmptyItem(): QuoteItem {
  return {
    id: makeId(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function createEmptyQuote(
  clientId: string,
  technicianId: string | null,
  number: string
): Quote {
  return {
    id: makeId(),
    number,
    version: 1,
    status: "draft",
    createdAt: new Date().toISOString(),
    validUntil: addDays(30),
    currency: "EUR",
    vatRate: 20,
    items: [createEmptyItem()],
    discountType: "percent",
    discountValue: 0,
    notes: "",
    clientId,
    technicianId,
    attachments: [],
    photos: [],
    versions: [],
  };
}

export default function RepairQuotes({
  repairRequestId,
  clientId,
  technicianId = null,
  userId,
  userRole,
}: RepairQuotesProps) {
  const isTechnician =
    userRole === "technicien" || userRole === "technician";

  const isClient = userId === clientId;

  const storageKey = `${STORAGE_PREFIX}${repairRequestId}`;

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | QuoteStatus>("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | "30" | "90">("all");

  const [currency, setCurrency] = useState("EUR");
  const [vatRate, setVatRate] = useState(20);

  const [discountType, setDiscountType] =
    useState<"percent" | "fixed">("percent");

  const [discountValue, setDiscountValue] = useState(0);

  const [notes, setNotes] = useState("");

  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);

  const [discussionMessage, setDiscussionMessage] = useState("");
  const [discussion, setDiscussion] = useState<string[]>([]);

  const [notification, setNotification] = useState("");

  const [saving, setSaving] = useState(false);

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.id === selectedQuoteId) || null,
    [quotes, selectedQuoteId]
  );

  const items = selectedQuote?.items || [];

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Math.max(0, Number(item.quantity) || 0) *
            Math.max(0, Number(item.unitPrice) || 0),
        0
      ),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!selectedQuote) return 0;

    if (selectedQuote.discountType === "fixed") {
      return Math.min(
        subtotal,
        Math.max(0, Number(selectedQuote.discountValue) || 0)
      );
    }

    return Math.min(
      subtotal,
      subtotal *
        (Math.max(0, Number(selectedQuote.discountValue) || 0) / 100)
    );
  }, [selectedQuote, subtotal]);

  const totalHT = Math.max(0, subtotal - discountAmount);

  const vatAmount = totalHT * (vatRate / 100);

  const totalTTC = totalHT + vatAmount;

  const commission = totalTTC * COMMISSION_RATE;

  const technicianRevenue = Math.max(0, totalTTC - commission);

  const isLocked =
    selectedQuote?.status === "accepted" ||
    selectedQuote?.status === "rejected";

  const isExpired =
    selectedQuote &&
    selectedQuote.status !== "accepted" &&
    selectedQuote.status !== "rejected" &&
    selectedQuote.status !== "cancelled" &&
    new Date(selectedQuote.validUntil).getTime() <
      new Date().setHours(0, 0, 0, 0);

  const notify = useCallback((message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 3500);
  }, []);

  const persist = useCallback(
    (nextQuotes: Quote[]) => {
      setQuotes(nextQuotes);

      try {
        localStorage.setItem(storageKey, JSON.stringify(nextQuotes));
      } catch (error) {
        console.error("Impossible de sauvegarder les devis :", error);
      }
    },
    [storageKey]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);

      if (raw) {
        const parsed = JSON.parse(raw) as Quote[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuotes(parsed);
          setSelectedQuoteId(parsed[0].id);
          return;
        }
      }
    } catch (error) {
      console.error("Erreur chargement brouillon :", error);
    }

    const quote = createEmptyQuote(
      clientId,
      technicianId,
      `FT-${new Date().getFullYear()}-001`
    );

    setQuotes([quote]);
    setSelectedQuoteId(quote.id);
  }, [clientId, technicianId, storageKey]);

  useEffect(() => {
    if (!quotes.length) return;

    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(quotes));
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [quotes, storageKey]);

  useEffect(() => {
    if (!selectedQuote) return;

    setCurrency(selectedQuote.currency);
    setVatRate(selectedQuote.vatRate);
    setDiscountType(selectedQuote.discountType);
    setDiscountValue(selectedQuote.discountValue);
    setNotes(selectedQuote.notes);
  }, [selectedQuoteId]);

  useEffect(() => {
    if (!selectedQuote || selectedQuote.status === "accepted") return;

    if (isExpired && selectedQuote.status !== "expired") {
      const updated = quotes.map((quote) =>
        quote.id === selectedQuote.id
          ? {
              ...quote,
              status: "expired" as QuoteStatus,
            }
          : quote
      );

      persist(updated);
      notify("Le devis a expiré automatiquement.");
    }
  }, [isExpired, notify, persist, quotes, selectedQuote]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        !search ||
        quote.number.toLowerCase().includes(search.toLowerCase()) ||
        quote.notes.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;

      let matchesPeriod = true;

      if (periodFilter !== "all") {
        const days = Number(periodFilter);
        const limit = Date.now() - days * 24 * 60 * 60 * 1000;

        matchesPeriod = new Date(quote.createdAt).getTime() >= limit;
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [periodFilter, quotes, search, statusFilter]);

  const stats = useMemo(() => {
    const accepted = quotes.filter(
      (quote) => quote.status === "accepted"
    ).length;

    const sent = quotes.filter(
      (quote) => quote.status === "sent"
    ).length;

    const draft = quotes.filter(
      (quote) => quote.status === "draft"
    ).length;

    const expired = quotes.filter(
      (quote) => quote.status === "expired"
    ).length;

    return {
      total: quotes.length,
      accepted,
      sent,
      draft,
      expired,
      conversion:
        quotes.length > 0
          ? Math.round((accepted / quotes.length) * 100)
          : 0,
    };
  }, [quotes]);

  function updateSelectedQuote(patch: Partial<Quote>) {
    if (!selectedQuote || isLocked) return;

    const updated = quotes.map((quote) =>
      quote.id === selectedQuote.id
        ? {
            ...quote,
            ...patch,
          }
        : quote
    );

    persist(updated);
  }

  function updateItem(
    itemId: string,
    patch: Partial<QuoteItem>
  ) {
    if (!selectedQuote || isLocked) return;

    const nextItems = selectedQuote.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...patch,
          }
        : item
    );

    updateSelectedQuote({
      items: nextItems,
    });
  }

  function addItem() {
    if (!selectedQuote || isLocked) return;

    updateSelectedQuote({
      items: [...selectedQuote.items, createEmptyItem()],
    });
  }

  function removeItem(itemId: string) {
    if (!selectedQuote || isLocked) return;

    if (selectedQuote.items.length <= 1) {
      notify("Un devis doit conserver au moins une ligne.");
      return;
    }

    updateSelectedQuote({
      items: selectedQuote.items.filter(
        (item) => item.id !== itemId
      ),
    });
  }

  function applySettings() {
    if (!selectedQuote || isLocked) return;

    updateSelectedQuote({
      currency,
      vatRate,
      discountType,
      discountValue,
      notes,
    });

    notify("Brouillon sauvegardé automatiquement.");
  }

  function createQuote() {
    const number = `FT-${new Date().getFullYear()}-${String(
      quotes.length + 1
    ).padStart(3, "0")}`;

    const quote = createEmptyQuote(
      clientId,
      technicianId,
      number
    );

    const next = [...quotes, quote];

    persist(next);
    setSelectedQuoteId(quote.id);

    notify("Nouveau devis créé.");
  }

  function duplicateQuote() {
    if (!selectedQuote) return;

    const duplicated: Quote = {
      ...selectedQuote,
      id: makeId(),
      number: `FT-${new Date().getFullYear()}-${String(
        quotes.length + 1
      ).padStart(3, "0")}`,
      version: 1,
      status: "draft",
      createdAt: new Date().toISOString(),
      validUntil: addDays(30),
      items: selectedQuote.items.map((item) => ({
        ...item,
        id: makeId(),
      })),
      attachments: [],
      photos: [],
      versions: [],
    };

    const next = [...quotes, duplicated];

    persist(next);
    setSelectedQuoteId(duplicated.id);

    notify("Devis dupliqué.");
  }

  function createVersion() {
    if (!selectedQuote || isLocked) return;

    const version: QuoteVersion = {
      id: makeId(),
      version: selectedQuote.version,
      createdAt: new Date().toISOString(),
      items: selectedQuote.items,
      currency: selectedQuote.currency,
      vatRate: selectedQuote.vatRate,
      discountType: selectedQuote.discountType,
      discountValue: selectedQuote.discountValue,
      notes: selectedQuote.notes,
    };

    updateSelectedQuote({
      version: selectedQuote.version + 1,
      versions: [...selectedQuote.versions, version],
      status: "draft",
    });

    notify(
      `Version ${selectedQuote.version + 1} créée.`
    );
  }

  function sendQuote() {
    if (!selectedQuote || isLocked) return;

    if (totalTTC <= 0) {
      notify("Le total du devis doit être supérieur à 0 €.");
      return;
    }

    applySettings();

    updateSelectedQuote({
      status: "sent",
    });

    notify("Devis envoyé au client.");
  }

  function acceptQuote() {
    if (!selectedQuote) return;

    if (selectedQuote.status !== "sent") {
      notify("Seul un devis envoyé peut être accepté.");
      return;
    }

    const confirmed = window.confirm(
      "Accepter ce devis ? Après acceptation, il sera verrouillé."
    );

    if (!confirmed) return;

    updateSelectedQuote({
      status: "accepted",
    });

    notify("Devis accepté et verrouillé.");
  }

  function rejectQuote() {
    if (!selectedQuote) return;

    if (selectedQuote.status !== "sent") {
      notify("Ce devis n'est pas actuellement envoyé.");
      return;
    }

    const confirmed = window.confirm(
      "Voulez-vous refuser ce devis ?"
    );

    if (!confirmed) return;

    updateSelectedQuote({
      status: "rejected",
    });

    notify("Devis refusé.");
  }

  function printPDF() {
    window.print();
  }

  function exportCSV() {
    if (!selectedQuote) return;

    const rows = [
      [
        "Devis",
        "Version",
        "Statut",
        "Description",
        "Quantité",
        "Prix unitaire",
        "Total ligne",
      ],
      ...selectedQuote.items.map((item) => [
        selectedQuote.number,
        selectedQuote.version,
        selectedQuote.status,
        item.description,
        item.quantity,
        item.unitPrice,
        item.quantity * item.unitPrice,
      ]),
      [],
      ["TOTAL HT", "", "", "", "", "", totalHT],
      ["TVA", `${vatRate}%`, "", "", "", "", vatAmount],
      ["TOTAL TTC", "", "", "", "", "", totalTTC],
      ["COMMISSION FOLIOGA", `${COMMISSION_RATE * 100}%`, "", "", "", "", commission],
      ["REVENU TECHNICIEN", "", "", "", "", "", technicianRevenue],
    ];

    const csv = rows
      .map((row) => row.map(csvEscape).join(";"))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedQuote.number}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    notify("Export comptable CSV généré.");
  }

  function addAttachments(
    event: ChangeEvent<HTMLInputElement>,
    type: "attachments" | "photos"
  ) {
    if (!selectedQuote || isLocked) return;

    const files = Array.from(event.target.files || []);

    const mapped: Attachment[] = files.map((file) => ({
      id: makeId(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    updateSelectedQuote({
      [type]: [
        ...selectedQuote[type],
        ...mapped,
      ],
    } as Partial<Quote>);

    notify(`${mapped.length} fichier(s) ajouté(s).`);

    event.target.value = "";
  }

  function removeAttachment(
    attachmentId: string,
    type: "attachments" | "photos"
  ) {
    if (!selectedQuote || isLocked) return;

    updateSelectedQuote({
      [type]: selectedQuote[type].filter(
        (file) => file.id !== attachmentId
      ),
    } as Partial<Quote>);
  }

  function sendDiscussionMessage() {
    const message = discussionMessage.trim();

    if (!message) return;

    setDiscussion((current) => [
      ...current,
      message,
    ]);

    setDiscussionMessage("");

    notify("Message ajouté à la discussion.");
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("fr-FR");
  }

  function statusLabel(status: QuoteStatus) {
    switch (status) {
      case "draft":
        return "📝 Brouillon";
      case "sent":
        return "📤 Envoyé";
      case "accepted":
        return "✅ Accepté";
      case "rejected":
        return "❌ Refusé";
      case "expired":
        return "⏰ Expiré";
      case "cancelled":
        return "🚫 Annulé";
    }
  }

  if (!selectedQuote) {
    return (
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-semibold text-slate-500">
          Chargement des devis...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      {notification && (
        <div className="sticky top-4 z-50 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 font-bold text-blue-700 shadow-lg">
          {notification}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-blue-600">
              💰 Gestion du devis
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Devis & prix final
            </h2>

            <p className="mt-2 text-slate-500">
              Création, versions, calculs, acceptation et suivi financier.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={createQuote}
              className="rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-blue-600"
            >
              + Nouveau
            </button>

            <button
              type="button"
              onClick={duplicateQuote}
              className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:border-blue-400"
            >
              📋 Dupliquer
            </button>

            <button
              type="button"
              onClick={printPDF}
              className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:border-blue-400"
            >
              🧾 PDF
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:border-blue-400"
            >
              📤 CSV
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-4">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="🔎 Rechercher un devis..."
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "all" | QuoteStatus
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillons</option>
            <option value="sent">Envoyés</option>
            <option value="accepted">Acceptés</option>
            <option value="rejected">Refusés</option>
            <option value="expired">Expirés</option>
          </select>

          <select
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(
                event.target.value as "all" | "30" | "90"
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="all">Toutes les périodes</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
          </select>

          <button
            type="button"
            onClick={() => setShowStats((value) => !value)}
            className="rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700"
          >
            📊 Statistiques
          </button>
        </div>

        {showStats && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Stat label="Devis" value={stats.total} />
            <Stat label="Acceptés" value={stats.accepted} />
            <Stat label="Envoyés" value={stats.sent} />
            <Stat label="Brouillons" value={stats.draft} />
            <Stat label="Expirés" value={stats.expired} />
            <Stat
              label="Conversion"
              value={`${stats.conversion}%`}
            />
          </div>
        )}

        <div className="mt-6 grid gap-2">
          {filteredQuotes.map((quote) => (
            <button
              key={quote.id}
              type="button"
              onClick={() => setSelectedQuoteId(quote.id)}
              className={
                "flex flex-col justify-between gap-3 rounded-2xl border p-4 text-left md:flex-row md:items-center " +
                (quote.id === selectedQuote.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white")
              }
            >
              <div>
                <div className="font-black text-slate-950">
                  {quote.number} — V{quote.version}
                </div>

                <div className="text-sm text-slate-500">
                  Créé le {formatDate(quote.createdAt)}
                </div>
              </div>

              <div className="font-bold text-slate-700">
                {statusLabel(quote.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        id="quote-print-area"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row">
          <div>
            <div className="text-sm font-bold text-blue-600">
              FOLIOGA-TECH
            </div>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {selectedQuote.number}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Version {selectedQuote.version} · Créé le{" "}
              {formatDate(selectedQuote.createdAt)}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">
              {statusLabel(
                isExpired
                  ? "expired"
                  : selectedQuote.status
              )}
            </span>

            <span className="text-sm text-slate-500">
              Valable jusqu'au{" "}
              {formatDate(selectedQuote.validUntil)}
            </span>
          </div>
        </div>

        {selectedQuote.status === "accepted" && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-bold text-emerald-700">
            🔐 Devis accepté et verrouillé
          </div>
        )}

        {selectedQuote.status === "expired" && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-bold text-orange-700">
            ⏰ Ce devis est arrivé à expiration.
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-500">
              👥 Client
            </div>
            <div className="mt-1 font-black text-slate-900">
              {clientId}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-500">
              👨‍🔧 Technicien
            </div>
            <div className="mt-1 font-black text-slate-900">
              {technicianId || "Non assigné"}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-500">
              🕐 Échéance
            </div>
            <div className="mt-1 font-black text-slate-900">
              {formatDate(selectedQuote.validUntil)}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xl font-black text-slate-950">
              Prestations
            </h4>

            <button
              type="button"
              onClick={addItem}
              disabled={isLocked}
              className="rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700 disabled:opacity-40"
            >
              + Ajouter
            </button>
          </div>

          <div className="space-y-3">
            {selectedQuote.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_100px_140px_130px_40px]"
              >
                <input
                  disabled={isLocked}
                  value={item.description}
                  onChange={(event) =>
                    updateItem(item.id, {
                      description: event.target.value,
                    })
                  }
                  placeholder="Description de la prestation"
                  className="rounded-xl border border-slate-200 px-3 py-3 disabled:bg-slate-100"
                />

                <input
                  disabled={isLocked}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(item.id, {
                      quantity: Number(event.target.value),
                    })
                  }
                  className="rounded-xl border border-slate-200 px-3 py-3 disabled:bg-slate-100"
                  aria-label="Quantité"
                />

                <input
                  disabled={isLocked}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) =>
                    updateItem(item.id, {
                      unitPrice: Number(event.target.value),
                    })
                  }
                  className="rounded-xl border border-slate-200 px-3 py-3 disabled:bg-slate-100"
                  aria-label="Prix unitaire"
                />

                <div className="flex items-center rounded-xl bg-slate-50 px-3 py-3 font-black">
                  {money(
                    item.quantity * item.unitPrice,
                    currency
                  )}
                </div>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => removeItem(item.id)}
                  className="rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600">
                Devise
              </label>

              <select
                disabled={isLocked}
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="EUR">EUR — Euro</option>
                <option value="CHF">CHF — Franc suisse</option>
                <option value="GBP">GBP — Livre sterling</option>
                <option value="USD">USD — Dollar américain</option>
                <option value="CAD">CAD — Dollar canadien</option>
                <option value="MAD">MAD — Dirham marocain</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">
                TVA
              </label>

              <select
                disabled={isLocked}
                value={vatRate}
                onChange={(event) =>
                  setVatRate(Number(event.target.value))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="0">0 %</option>
                <option value="5.5">5,5 %</option>
                <option value="10">10 %</option>
                <option value="20">20 %</option>
                <option value="21">21 %</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">
                Promotion
              </label>

              <div className="mt-1 grid grid-cols-[120px_1fr] gap-2">
                <select
                  disabled={isLocked}
                  value={discountType}
                  onChange={(event) =>
                    setDiscountType(
                      event.target.value as
                        | "percent"
                        | "fixed"
                    )
                  }
                  className="rounded-xl border border-slate-200 px-3 py-3"
                >
                  <option value="percent">%</option>
                  <option value="fixed">Montant</option>
                </select>

                <input
                  disabled={isLocked}
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(event) =>
                    setDiscountValue(
                      Number(event.target.value)
                    )
                  }
                  className="rounded-xl border border-slate-200 px-3 py-3"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">
                Validité
              </label>

              <input
                disabled={isLocked}
                type="date"
                value={selectedQuote.validUntil}
                onChange={(event) =>
                  updateSelectedQuote({
                    validUntil: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">
                Notes
              </label>

              <textarea
                disabled={isLocked}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                onBlur={applySettings}
                rows={4}
                placeholder="Conditions, garantie, informations complémentaires..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h4 className="text-xl font-black text-slate-950">
              Total
            </h4>

            <div className="mt-5 space-y-3">
              <TotalLine
                label="Sous-total"
                value={money(subtotal, currency)}
              />

              <TotalLine
                label="Remise"
                value={`-${money(
                  discountAmount,
                  currency
                )}`}
              />

              <TotalLine
                label="Total HT"
                value={money(totalHT, currency)}
              />

              <TotalLine
                label={`TVA ${vatRate}%`}
                value={money(vatAmount, currency)}
              />

              <div className="border-t border-slate-200 pt-4">
                <TotalLine
                  label="TOTAL TTC"
                  value={money(totalTTC, currency)}
                  strong
                />
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="text-sm font-bold text-blue-700">
                  Commission Folioga-Tech
                </div>

                <div className="mt-1 text-xl font-black text-blue-950">
                  {money(commission, currency)}
                </div>

                <div className="mt-3 text-sm text-blue-700">
                  Revenu technicien estimé :{" "}
                  <strong>
                    {money(
                      technicianRevenue,
                      currency
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isLocked && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSaving(true);
                applySettings();

                window.setTimeout(() => {
                  setSaving(false);
                  notify("Brouillon sauvegardé.");
                }, 300);
              }}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700"
            >
              {saving
                ? "Sauvegarde..."
                : "💾 Sauvegarder le brouillon"}
            </button>

            {isTechnician && (
              <button
                type="button"
                onClick={sendQuote}
                className="flex-1 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-600"
              >
                📤 Envoyer le devis
              </button>
            )}
          </div>
        )}

        {isClient && selectedQuote.status === "sent" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={acceptQuote}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              ✅ Accepter le devis
            </button>

            <button
              type="button"
              onClick={rejectQuote}
              className="rounded-xl bg-red-50 px-5 py-3 font-bold text-red-700 hover:bg-red-100"
            >
              ❌ Refuser
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black uppercase tracking-wider text-blue-600">
                📎 Documents
              </div>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Pièces jointes
              </h3>
            </div>

            <label
              className={
                "cursor-pointer rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700 " +
                (isLocked ? "pointer-events-none opacity-40" : "")
              }
            >
              + Ajouter
              <input
                hidden
                type="file"
                multiple
                disabled={isLocked}
                onChange={(event) =>
                  addAttachments(event, "attachments")
                }
              />
            </label>
          </div>

          <div className="mt-5 space-y-2">
            {selectedQuote.attachments.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Aucun document.
              </p>
            ) : (
              selectedQuote.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                >
                  <span className="truncate text-sm font-bold">
                    📎 {file.name}
                  </span>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() =>
                      removeAttachment(
                        file.id,
                        "attachments"
                      )
                    }
                    className="text-red-500 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black uppercase tracking-wider text-blue-600">
                📸 Diagnostic
              </div>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Photos du diagnostic
              </h3>
            </div>

            <label
              className={
                "cursor-pointer rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700 " +
                (isLocked ? "pointer-events-none opacity-40" : "")
              }
            >
              📸 Ajouter
              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={isLocked}
                onChange={(event) =>
                  addAttachments(event, "photos")
                }
              />
            </label>
          </div>

          <div className="mt-5 grid gap-2">
            {selectedQuote.photos.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Aucune photo.
              </p>
            ) : (
              selectedQuote.photos.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                >
                  <span className="truncate text-sm font-bold">
                    📸 {file.name}
                  </span>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() =>
                      removeAttachment(
                        file.id,
                        "photos"
                      )
                    }
                    className="text-red-500 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-blue-600">
              🔄 Versionnage
            </div>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Historique du devis
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Version actuelle : V{selectedQuote.version}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isLocked && (
              <button
                type="button"
                onClick={createVersion}
                className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"
              >
                + Nouvelle version
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowHistory((value) => !value)
              }
              className="rounded-xl border border-slate-300 px-4 py-3 font-bold"
            >
              {showHistory
                ? "Masquer"
                : "Voir l'historique"}
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="mt-5 space-y-2">
            {selectedQuote.versions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Aucun historique de version.
              </div>
            ) : (
              selectedQuote.versions.map((version) => (
                <div
                  key={version.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="font-black">
                    Version {version.version}
                  </div>

                  <div className="text-sm text-slate-500">
                    Créée le{" "}
                    {formatDate(version.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-blue-600">
              💬 Discussion
            </div>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Discussion liée au devis
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Échangez directement au sujet du prix et des prestations.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowDiscussion((value) => !value)
            }
            className="rounded-xl bg-slate-950 px-4 py-3 font-bold text-white"
          >
            💬 {showDiscussion ? "Fermer" : "Ouvrir"}
          </button>
        </div>

        {showDiscussion && (
          <div className="mt-6">
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              {discussion.length === 0 ? (
                <p className="text-center text-sm text-slate-500">
                  Aucun message.
                </p>
              ) : (
                discussion.map((message, index) => (
                  <div
                    key={`${message}-${index}`}
                    className="rounded-xl bg-white p-3 shadow-sm"
                  >
                    {message}
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={discussionMessage}
                onChange={(event) =>
                  setDiscussionMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendDiscussionMessage();
                  }
                }}
                placeholder="Votre message..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3"
              />

              <button
                type="button"
                onClick={sendDiscussionMessage}
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
              >
                Envoyer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-blue-600">
              💳 Finance
            </div>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Paiement & historique financier
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <FinanceCard
            label="CA TTC"
            value={money(totalTTC, currency)}
          />

          <FinanceCard
            label="Commission Folioga"
            value={money(commission, currency)}
          />

          <FinanceCard
            label="CA technicien"
            value={money(
              technicianRevenue,
              currency
            )}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          💳 Le paiement en ligne, les remboursements et le reversement
          automatique devront être connectés au système de paiement et à
          Supabase dans l'étape backend.
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <h3 className="text-xl font-black text-slate-950">
          🔔 Notifications & rappels
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ReminderCard
            title="Expiration"
            text={`Rappel avant le ${formatDate(
              selectedQuote.validUntil
            )}`}
          />

          <ReminderCard
            title="Client"
            text={
              selectedQuote.status === "sent"
                ? "En attente de réponse"
                : "Aucune action"
            }
          />

          <ReminderCard
            title="Technicien"
            text={
              selectedQuote.status === "accepted"
                ? "Devis accepté"
                : "En attente"
            }
          />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          nav,
          header,
          footer,
          button,
          input,
          select,
          textarea,
          label {
            display: none !important;
          }

          #quote-print-area {
            display: block !important;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function TotalLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between gap-4 " +
        (strong
          ? "text-xl font-black text-slate-950"
          : "text-sm font-bold text-slate-600")
      }
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-2xl font-black text-slate-950">
        {value}
      </div>
    </div>
  );
}

function FinanceCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="text-sm font-bold text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </div>
    </div>
  );
}

function ReminderCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="font-black text-slate-950">
        {title}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {text}
      </div>
    </div>
  );
}
