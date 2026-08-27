"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RepairMessage = {
  id: string;
  repair_request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

type RepairMessagesProps = {
  repairRequestId: string;
};

export default function RepairMessages({
  repairRequestId,
}: RepairMessagesProps) {
  const [messages, setMessages] = useState<RepairMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  /*
   * ============================================================
   * UTILITAIRE
   * ============================================================
   */

  function formatDate(date: string) {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /*
   * ============================================================
   * MARQUER LES MESSAGES COMME LUS
   * ============================================================
   *
   * Il n'existe PAS de receiver_id dans repair_messages.
   *
   * Donc :
   *
   * - mes messages       = sender_id === userId
   * - messages reçus     = sender_id !== userId
   *
   * On marque uniquement les messages reçus qui sont encore
   * is_read = false.
   */

  const markMessagesAsRead = useCallback(
    async (currentUserId: string) => {
      setMarkingRead(true);

      const { error: updateError } = await supabase
        .from("repair_messages")
        .update({ is_read: true })
        .eq("repair_request_id", repairRequestId)
        .eq("is_read", false)
        .neq("sender_id", currentUserId);

      if (updateError) {
        console.error(
          "Erreur marquage messages lus :",
          updateError
        );

        /*
         * On ne bloque pas toute la messagerie si le marquage
         * échoue. Les messages restent consultables.
         */
      }

      setMarkingRead(false);
    },
    [repairRequestId]
  );

  /*
   * ============================================================
   * CHARGER LES MESSAGES
   * ============================================================
   */

  const loadMessages = useCallback(
    async (currentUserId: string) => {
      setLoading(true);
      setError("");

      const { data, error: messagesError } = await supabase
        .from("repair_messages")
        .select(
          "id, repair_request_id, sender_id, message, created_at, is_read"
        )
        .eq("repair_request_id", repairRequestId)
        .order("created_at", {
          ascending: true,
        });

      if (messagesError) {
        console.error(
          "Erreur chargement messages :",
          messagesError
        );

        setMessages([]);

        setError(
          `Impossible de charger les messages : ${
            messagesError.message || ""
          }`
        );

        setLoading(false);
        return;
      }

      const loadedMessages = (data || []) as RepairMessage[];

      setMessages(loadedMessages);

      /*
       * --------------------------------------------------------
       * IMPORTANT
       * --------------------------------------------------------
       *
       * Dès que la conversation est ouverte, on marque les
       * messages reçus comme lus.
       */

      const unreadReceivedMessages = loadedMessages.filter(
        (item) =>
          !item.is_read &&
          item.sender_id !== currentUserId
      );

      if (unreadReceivedMessages.length > 0) {
        await markMessagesAsRead(currentUserId);

        /*
         * Mise à jour locale immédiate.
         *
         * Cela évite d'avoir visuellement des messages encore
         * indiqués comme non lus après leur ouverture.
         */

        setMessages((current) =>
          current.map((item) =>
            item.sender_id !== currentUserId
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );
      }

      setLoading(false);
    },
    [repairRequestId, markMessagesAsRead]
  );

  /*
   * ============================================================
   * INITIALISATION
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (mounted) {
          setError("Vous devez être connecté.");
          setLoading(false);
        }

        return;
      }

      if (!mounted) return;

      setUserId(user.id);

      await loadMessages(user.id);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [loadMessages]);

  /*
   * ============================================================
   * TEMPS RÉEL
   * ============================================================
   *
   * Si le technicien envoie un message pendant que la page est
   * ouverte, il apparaît automatiquement.
   */

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`repair-messages-${repairRequestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "repair_messages",
          filter: `repair_request_id=eq.${repairRequestId}`,
        },
        async (payload) => {
          const newMessage =
            payload.new as RepairMessage;

          setMessages((current) => {
            const alreadyExists = current.some(
              (item) => item.id === newMessage.id
            );

            if (alreadyExists) {
              return current;
            }

            return [...current, newMessage];
          });

          /*
           * Si le nouveau message vient de quelqu'un d'autre,
           * il devient immédiatement lu puisque la conversation
           * est actuellement ouverte.
           */

          if (newMessage.sender_id !== userId) {
            await supabase
              .from("repair_messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);

            setMessages((current) =>
              current.map((item) =>
                item.id === newMessage.id
                  ? {
                      ...item,
                      is_read: true,
                    }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [repairRequestId, userId]);

  /*
   * ============================================================
   * ENVOYER UN MESSAGE
   * ============================================================
   */

  async function sendMessage() {
    const cleanText = text.trim();

    if (!cleanText) return;

    if (!userId) {
      setError("Vous devez être connecté.");
      return;
    }

    setSending(true);
    setError("");

    const { data, error: sendError } = await supabase
      .from("repair_messages")
      .insert({
        repair_request_id: repairRequestId,
        sender_id: userId,
        message: cleanText,
        is_read: false,
      })
      .select(
        "id, repair_request_id, sender_id, message, created_at, is_read"
      )
      .single();

    if (sendError) {
      console.error(
        "Erreur envoi message :",
        sendError
      );

      setError(
        sendError.message ||
          "Impossible d'envoyer le message."
      );

      setSending(false);
      return;
    }

    /*
     * Le realtime peut déjà avoir ajouté le message.
     * On évite donc les doublons.
     */

    if (data) {
      const newMessage = data as RepairMessage;

      setMessages((current) => {
        const exists = current.some(
          (item) => item.id === newMessage.id
        );

        if (exists) {
          return current;
        }

        return [...current, newMessage];
      });
    }

    setText("");
    setSending(false);
  }

  /*
   * ============================================================
   * APPUYER SUR ENTRÉE
   * ============================================================
   */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sending) {
        sendMessage();
      }
    }
  }

  /*
   * ============================================================
   * COMPTEUR NON LU LOCAL
   * ============================================================
   */

  const unreadCount = messages.filter(
    (item) =>
      !item.is_read &&
      item.sender_id !== userId
  ).length;

  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm font-bold text-blue-600">
            💬 MESSAGERIE
          </div>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Conversation
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Échangez avec le technicien au sujet de cette
            réparation.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
            {unreadCount} message
            {unreadCount > 1 ? "s" : ""} non lu
            {unreadCount > 1 ? "s" : ""}
          </div>
        )}

        {markingRead && unreadCount === 0 && (
          <div className="text-xs font-semibold text-slate-400">
            Messages lus
          </div>
        )}
      </div>

      {/* ERREUR */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-black">
            ⚠️ Erreur
          </div>

          <div className="mt-1">
            {error}
          </div>
        </div>
      )}

      {/* MESSAGES */}

      <div className="mt-6 max-h-[520px] space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
        {loading ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-slate-500">
              Chargement des messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-4xl">💬</div>

            <h3 className="mt-3 font-black text-slate-950">
              Aucun message
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Commencez la conversation.
            </p>
          </div>
        ) : (
          messages.map((item) => {
            const isMine =
              item.sender_id === userId;

            return (
              <div
                key={item.id}
                className={
                  "flex " +
                  (isMine
                    ? "justify-end"
                    : "justify-start")
                }
              >
                <div
                  className={
                    "max-w-[85%] rounded-2xl px-4 py-3 " +
                    (isMine
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-950")
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={
                        "text-xs font-black " +
                        (isMine
                          ? "text-slate-300"
                          : "text-blue-600")
                      }
                    >
                      {isMine
                        ? "Vous"
                        : "Technicien"}
                    </span>

                    {!isMine &&
                      !item.is_read && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
                          NON LU
                        </span>
                      )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                    {item.message}
                  </p>

                  <div
                    className={
                      "mt-2 text-[11px] " +
                      (isMine
                        ? "text-slate-400"
                        : "text-slate-400")
                    }
                  >
                    {formatDate(item.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SAISIE */}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Votre message
        </label>

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={sending}
          rows={4}
          placeholder="Écrivez votre message..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-white p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
        />

        <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            Entrée pour envoyer · Maj + Entrée pour une
            nouvelle ligne
          </p>

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              sending ||
              !text.trim() ||
              !userId
            }
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "Envoi..."
              : "Envoyer le message"}
          </button>
        </div>
      </div>
    </section>
  );
}
