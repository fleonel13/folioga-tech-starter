import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Configuration Supabase serveur manquante.");
  }

  return createClient(url, serviceKey);
}

export async function POST(request: Request) {
  try {
    const { items, locale, quoteId } = await request.json();

    const origin = request.headers.get("origin");

    if (!origin) {
      return NextResponse.json(
        { error: "Origine du site introuvable." },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * PAIEMENT D'UN DEVIS DE RÉPARATION
     * ============================================================
     */
    if (quoteId) {
      const supabase = getSupabaseAdmin();

      const { data: quote, error: quoteError } = await supabase
        .from("repair_quotes")
        .select(`
          id,
          repair_request_id,
          technician_id,
          status,
          currency,
          total_ttc,
          payment_status,
          paid_amount,
          quote_number,
          stripe_checkout_session_id
        `)
        .eq("id", quoteId)
        .single();

      if (quoteError || !quote) {
        return NextResponse.json(
          { error: "Devis introuvable." },
          { status: 404 }
        );
      }

      if (quote.status !== "accepted") {
        return NextResponse.json(
          { error: "Le devis doit être accepté avant le paiement." },
          { status: 400 }
        );
      }

      if (
        quote.payment_status === "paid" ||
        Number(quote.paid_amount || 0) >= Number(quote.total_ttc || 0)
      ) {
        return NextResponse.json(
          { error: "Ce devis est déjà payé." },
          { status: 400 }
        );
      }

      const amount = Math.round(Number(quote.total_ttc) * 100);

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Montant du devis invalide." },
          { status: 400 }
        );
      }

      const currency = (quote.currency || "eur").toLowerCase();

      /*
       * Si une ancienne session existe, on peut simplement
       * en créer une nouvelle. Le webhook décidera si le paiement
       * est réellement confirmé.
       */
      const session = await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Réparation ${quote.quote_number || quote.id}`,
                description: "Paiement du devis de réparation Folioga",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],

        success_url:
          `${origin}/${locale}/repairs/request/${quote.repair_request_id}` +
          `?payment=success&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/${locale}/repairs/request/${quote.repair_request_id}` +
          `?payment=cancelled`,

        billing_address_collection: "required",

        metadata: {
          type: "repair_quote",
          quote_id: quote.id,
          repair_request_id: quote.repair_request_id,
          technician_id: quote.technician_id,
        },
      });

      /*
       * On enregistre la session Stripe sur le devis.
       * Le devis ne devient PAS payé ici.
       */
      const { error: updateError } = await supabase
        .from("repair_quotes")
        .update({
          stripe_checkout_session_id: session.id,
          payment_status: "pending",
        })
        .eq("id", quote.id);

      if (updateError) {
        console.error(
          "Erreur sauvegarde session Stripe:",
          updateError
        );
      }

      return NextResponse.json({
        url: session.url,
      });
    }

    /*
     * ============================================================
     * PAIEMENT DE LA BOUTIQUE
     * ============================================================
     */

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide." },
        { status: 400 }
      );
    }

    const lineItems = items.map(
      (item: {
        id: string;
        name: string;
        description?: string;
        price: number;
        image?: string;
        quantity: number;
      }) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description || undefined,
            ...(item.image
              ? {
                  images: [item.image],
                }
              : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url:
        `${origin}/${locale}/checkout/success` +
        `?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "LU", "DE"],
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Erreur Stripe Checkout:", error);

    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 }
    );
  }
}
