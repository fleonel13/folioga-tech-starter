"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RepairMessage = {
  id: string;
  repair_request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

type Props = {
  repairRequestId: string;
};

export default function RepairMessages({
  repairRequestId,
}: Props) {
  const [messages, setMessages] = useState<RepairMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error: messagesError } = await supabase
      .from("repair_messages")
      .select(
        "id, repair_request_id, sender_id, message, created_at"
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

      setError(
        "Impossible de charger les messages."
      );

      setLoading(false);
      return;
    }

    setMessages((data || []) as RepairMessage[]);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();

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
        (payload) => {
          const newMessage =
            payload.new as RepairMessage;

          setMessages((current) => {
            if (
              current.some(
                (message) =>
                  message.id === newMessage.id
              )
            ) {
              return current;
            }

            return [...current, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [repairRequestId]);

  async function sendMessage() {
    const text = newMessage.trim();

    if (!text) return;

    if (!userId) {
      setError("Vous devez être connecté.");
      return;
    }

    setSending(true);
    setError("");

    const { data, error: sendError } =
      await supabase
        .from("repair_messages")
        .insert({
          repair_request_id: repairRequestId,
          sender_id: userId,
          message: text,
        })
        .select(
          "id, repair_request_id, sender_id, message, created_at"
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

    if (data) {
      setMessages((current) => {
        if (
          current.some(
            (message) => message.id === data.id
          )
        ) {
          return current;
        }

        return [
          ...current,
          data as RepairMessage,
        ];
      });
    }

    setNewMessage("");
    setSending(false);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
          💬
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Communication
          </div>

          <h2 className="text-2xl font-black text-slate-950">
            Messagerie de la réparation
          </h2>
        </div>
      </div>

      <p className="mt-3 text-slate-500">
        Échangez avec les personnes autorisées sur cette réparation.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
        {loading ? (
          <div className="py-10 text-center text-slate-500">
            Chargement des messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-4xl">💬</div>

            <p className="mt-3 font-bold text-slate-700">
              Aucun message
            </p>

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
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-800")
                  }
                >
                  <p className="whitespace-pre-wrap break-words">
                    {item.message}
                  </p>

                  <div
                    className={
                      "mt-2 text-xs " +
                      (isMine
                        ? "text-blue-100"
                        : "text-slate-400")
                    }
                  >
                    {new Date(
                      item.created_at
                    ).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5">
        <textarea
          value={newMessage}
          onChange={(event) =>
            setNewMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Écrivez votre message..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          disabled={sending}
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Entrée pour envoyer · Shift + Entrée pour aller à la ligne
          </p>

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              sending ||
              !newMessage.trim()
            }
            className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Envoi..." : "Envoyer →"}
          </button>
        </div>
      </div>
    </section>
  );
}
