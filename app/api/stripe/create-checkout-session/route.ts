import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const COMMISSION_RATE = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const quoteId = body.quoteId;
    const locale = body.locale === "en" ? "en" : "fr";

    if (!quoteId) {
      return NextResponse.json(
        { error: "quoteId manquant." },
        { status: 400 }
      );
    }

    const { data: quote, error: quoteError } =
      await supabaseAdmin
        .from("repair_quotes")
        .select("*")
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
        {
          error:
            "Le devis doit être accepté avant le paiement.",
        },
        { status: 400 }
      );
    }

    const totalTtc = Number(quote.total_ttc || 0);
    const paidAmount = Number(quote.paid_amount || 0);

    const remaining = Math.max(
      0,
      totalTtc - paidAmount
    );

    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Ce devis est déjà payé." },
        { status: 400 }
      );
    }

    const technicianId = quote.technician_id;

    if (!technicianId) {
      return NextResponse.json(
        {
          error:
            "Aucun technicien associé à ce devis.",
        },
        { status: 400 }
      );
    }

    const {
      data: technician,
      error: technicianError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, email, name, role, stripe_connect_account_id, stripe_connect_onboarding_complete"
      )
      .eq("id", technicianId)
      .eq("role", "technicien")
      .single();

    if (technicianError || !technician) {
      console.error(
        "Technicien introuvable:",
        technicianError
      );

      return NextResponse.json(
        {
          error:
            "Technicien introuvable dans les profils.",
        },
        { status: 404 }
      );
    }

    const connectAccountId =
      technician.stripe_connect_account_id;

    if (!connectAccountId) {
      return NextResponse.json(
        {
          error:
            "Le technicien doit d'abord connecter son compte Stripe.",
        },
        { status: 400 }
      );
    }

    let account: Stripe.Account;

    try {
      account =
        await stripe.accounts.retrieve(
          connectAccountId
        );
    } catch (error) {
      console.error(
        "Erreur récupération compte Stripe Connect:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Le compte Stripe Connect du technicien est invalide.",
        },
        { status: 400 }
      );
    }

    if (account.deleted) {
      return NextResponse.json(
        {
          error:
            "Le compte Stripe Connect du technicien a été supprimé.",
        },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(
      remaining * 100
    );

    /*
     * Commission FoliogaTech :
     * 10 %
     */
    const commissionInCents = Math.round(
      amountInCents *
        COMMISSION_RATE /
        100
    );

    /*
     * Technicien :
     * 90 %
     */
    const technicianInCents =
      amountInCents -
      commissionInCents;

    if (
      amountInCents <= 0 ||
      technicianInCents <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Montant de paiement invalide.",
        },
        { status: 400 }
      );
    }

    const currency = String(
      quote.currency || "EUR"
    ).toLowerCase();

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            quantity: 1,

            price_data: {
              currency,
              unit_amount: amountInCents,

              product_data: {
                name: `Devis ${
                  quote.quote_number ||
                  `V${quote.version}`
                }`,
              },
            },
          },
        ],

        payment_intent_data: {
          application_fee_amount:
            commissionInCents,

          transfer_data: {
            destination:
              connectAccountId,
          },

          metadata: {
            quote_id: quote.id,

            technician_id:
              technician.id,

            commission_rate:
              String(COMMISSION_RATE),

            commission_amount:
              String(
                commissionInCents / 100
              ),

            technician_amount:
              String(
                technicianInCents / 100
              ),
          },
        },

        metadata: {
          quote_id: quote.id,

          repair_request_id:
            quote.repair_request_id,

          technician_id:
            technician.id,

          commission_rate:
            String(COMMISSION_RATE),

          commission_amount:
            String(
              commissionInCents / 100
            ),

          technician_amount:
            String(
              technicianInCents / 100
            ),
        },

        success_url:
          `${baseUrl}/${locale}/paiement/succes` +
          `?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${baseUrl}/${locale}/paiement/annule`,

        billing_address_collection:
          "required",
      });

    console.log(
      "Checkout Stripe créé:",
      {
        quoteId: quote.id,
        amount: amountInCents / 100,
        commissionRate: COMMISSION_RATE,
        commission:
          commissionInCents / 100,
        technician:
          technicianInCents / 100,
        connectAccount:
          connectAccountId,
      }
    );

    return NextResponse.json({
      url: session.url,

      commission_rate:
        COMMISSION_RATE,

      commission_amount:
        commissionInCents / 100,

      technician_amount:
        technicianInCents / 100,
    });
  } catch (error) {
    console.error(
      "Stripe Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de créer la session de paiement.",
      },
      { status: 500 }
    );
  }
}
