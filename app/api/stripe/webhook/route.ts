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
  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();

    const event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

    /*
     * On traite uniquement les paiements Checkout terminés.
     */
    if (
      event.type !==
      "checkout.session.completed"
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    const session =
      event.data.object as Stripe.Checkout.Session;

    const quoteId =
      session.metadata?.quote_id;

    if (!quoteId) {
      console.error(
        "quote_id absent des metadata Stripe"
      );

      return NextResponse.json({
        received: true,
      });
    }

    /*
     * Récupération des identifiants Stripe.
     */
    const checkoutSessionId =
      session.id;

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null;

    /*
     * Anti-doublon.
     *
     * Stripe peut envoyer plusieurs fois
     * le même événement.
     */
    const {
      data: existingPayment,
      error: existingPaymentError,
    } =
      await supabaseAdmin
        .from("repair_quote_payments")
        .select("id")
        .eq(
          "stripe_checkout_session_id",
          checkoutSessionId
        )
        .maybeSingle();

    if (existingPaymentError) {
      throw existingPaymentError;
    }

    if (existingPayment) {
      console.log(
        "Paiement Stripe déjà enregistré:",
        checkoutSessionId
      );

      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    /*
     * Récupération du devis.
     */
    const {
      data: quote,
      error: quoteError,
    } =
      await supabaseAdmin
        .from("repair_quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

    if (quoteError || !quote) {
      throw new Error(
        `Devis introuvable : ${quoteId}`
      );
    }

    /*
     * Montant réellement payé.
     */
    const amountPaid =
      (session.amount_total || 0) / 100;

    const currency =
      String(
        session.currency || "eur"
      ).toUpperCase();

    if (amountPaid <= 0) {
      throw new Error(
        "Montant Stripe invalide."
      );
    }

    /*
     * Vérification du compte Stripe Connect.
     */
    const technicianId =
      quote.technician_id;

    if (!technicianId) {
      throw new Error(
        "Aucun technicien associé au devis."
      );
    }

    const {
      data: technician,
      error: technicianError,
    } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "id, stripe_connect_account_id, stripe_connect_onboarding_complete"
        )
        .eq("id", technicianId)
        .single();

    if (
      technicianError ||
      !technician
    ) {
      throw new Error(
        "Technicien introuvable."
      );
    }

    if (
      !technician.stripe_connect_account_id
    ) {
      throw new Error(
        "Le technicien n'a pas de compte Stripe Connect."
      );
    }

    /*
     * Commission FoliogaTech = 10 %.
     *
     * Le paiement Stripe a déjà été configuré
     * avec application_fee_amount et transfer_data.
     *
     * Ici on enregistre exactement la répartition
     * financière dans Supabase.
     */
    const commissionRate =
      COMMISSION_RATE;

    const commissionAmount =
      Math.round(
        amountPaid *
          commissionRate
      ) / 100;

    const technicianAmount =
      Math.round(
        (amountPaid -
          commissionAmount) *
          100
      ) / 100;

    /*
     * Vérification du montant restant.
     */
    const oldPaidAmount =
      Number(
        quote.paid_amount || 0
      );

    const totalTtc =
      Number(
        quote.total_ttc || 0
      );

    const remaining =
      Math.max(
        0,
        totalTtc -
          oldPaidAmount
      );

    if (
      amountPaid >
      remaining + 0.01
    ) {
      throw new Error(
        `Montant Stripe trop élevé. Payé=${amountPaid}, restant=${remaining}`
      );
    }

    /*
     * Récupération du PaymentIntent
     * pour obtenir le Charge Stripe.
     */
    let chargeId: string | null = null;

    if (paymentIntentId) {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(
          paymentIntentId,
          {
            expand: ["latest_charge"],
          }
        );

      if (
        paymentIntent.latest_charge &&
        typeof paymentIntent.latest_charge !==
          "string"
      ) {
        chargeId =
          paymentIntent.latest_charge.id;
      } else if (
        typeof paymentIntent.latest_charge ===
        "string"
      ) {
        chargeId =
          paymentIntent.latest_charge;
      }
    }

    /*
     * Enregistrement du paiement.
     */
    const {
      error: paymentError,
    } =
      await supabaseAdmin
        .from("repair_quote_payments")
        .insert({
          quote_id: quoteId,

          amount: amountPaid,

          currency,

          status: "paid",

          provider: "stripe",

          provider_payment_id:
            paymentIntentId ||
            checkoutSessionId,

          stripe_checkout_session_id:
            checkoutSessionId,

          stripe_payment_intent_id:
            paymentIntentId,

          stripe_charge_id:
            chargeId,

          platform_fee_amount:
            commissionAmount,

          technician_amount:
            technicianAmount,

          paid_at:
            new Date().toISOString(),
        });

    if (paymentError) {
      throw paymentError;
    }

    /*
     * Nouveau montant payé sur le devis.
     */
    const newPaidAmount =
      Math.round(
        (oldPaidAmount +
          amountPaid) *
          100
      ) / 100;

    const isFullyPaid =
      newPaidAmount >=
      totalTtc - 0.01;

    /*
     * Mise à jour du devis.
     */
    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("repair_quotes")
        .update({
          paid_amount:
            newPaidAmount,

          payment_status:
            isFullyPaid
              ? "paid"
              : "partial",

          paid_at:
            new Date().toISOString(),

          payment_reference:
            paymentIntentId ||
            checkoutSessionId,

          stripe_checkout_session_id:
            checkoutSessionId,

          stripe_payment_intent_id:
            paymentIntentId,

          commission_rate:
            commissionRate,

          commission_amount:
            commissionAmount,

          technician_amount:
            technicianAmount,
        })
        .eq("id", quoteId);

    if (updateError) {
      throw updateError;
    }

    /*
     * Événement financier.
     */
    const {
      error: financialError,
    } =
      await supabaseAdmin
        .from(
          "repair_quote_financial_events"
        )
        .insert({
          quote_id:
            quoteId,

          technician_id:
            technicianId,

          event_type:
            "stripe_payment",

          amount:
            amountPaid,

          commission_amount:
            commissionAmount,

          technician_amount:
            technicianAmount,

          currency,

          description:
            `Paiement Stripe ${checkoutSessionId} — commission FoliogaTech ${commissionRate}%`,
        });

    if (financialError) {
      throw financialError;
    }

    console.log(
      "================================="
    );

    console.log(
      "PAIEMENT STRIPE ENREGISTRÉ"
    );

    console.log(
      "Devis:",
      quoteId
    );

    console.log(
      "Montant:",
      amountPaid,
      currency
    );

    console.log(
      "Commission FoliogaTech:",
      commissionAmount,
      currency,
      `(${commissionRate}%)`
    );

    console.log(
      "Technicien:",
      technicianAmount,
      currency,
      "(90%)"
    );

    console.log(
      "Checkout:",
      checkoutSessionId
    );

    console.log(
      "PaymentIntent:",
      paymentIntentId
    );

    console.log(
      "Charge:",
      chargeId
    );

    console.log(
      "================================="
    );

    return NextResponse.json({
      received: true,

      quote_id:
        quoteId,

      amount:
        amountPaid,

      commission_rate:
        commissionRate,

      commission_amount:
        commissionAmount,

      technician_amount:
        technicianAmount,
    });
  } catch (error) {
    console.error(
      "Webhook Stripe error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur webhook Stripe.",
      },
      { status: 400 }
    );
  }
}
