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

export async function POST(request: Request) {
  try {
    const { technicianId } = await request.json();

    if (!technicianId) {
      return NextResponse.json(
        {
          error:
            "technicianId est obligatoire.",
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
        "id, email, role, stripe_connect_account_id"
      )
      .eq("id", technicianId)
      .eq("role", "technicien")
      .single();

    if (technicianError || !technician) {
      return NextResponse.json(
        {
          error:
            "Technicien introuvable.",
        },
        { status: 404 }
      );
    }

    if (
      !technician.stripe_connect_account_id
    ) {
      return NextResponse.json({
        success: true,
        connected: false,
        onboarding_complete: false,
        message:
          "Aucun compte Stripe Connect.",
      });
    }

    const account =
      await stripe.accounts.retrieve(
        technician.stripe_connect_account_id
      );

    const onboardingComplete =
      Boolean(
        account.details_submitted
      );

    const payoutsEnabled =
      Boolean(
        account.payouts_enabled
      );

    const transfersEnabled =
      Boolean(
        account.capabilities?.transfers ===
          "active"
      );

    const ready =
      onboardingComplete &&
      payoutsEnabled &&
      transfersEnabled;

    await supabaseAdmin
      .from("profiles")
      .update({
        stripe_connect_onboarding_complete:
          onboardingComplete,
      })
      .eq("id", technician.id);

    return NextResponse.json({
      success: true,
      connected: true,
      onboarding_complete:
        onboardingComplete,
      payouts_enabled:
        payoutsEnabled,
      transfers_enabled:
        transfersEnabled,
      ready,
      account_id:
        technician.stripe_connect_account_id,
    });
  } catch (error) {
    console.error(
      "Stripe Connect status error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de vérifier le compte Stripe Connect.",
      },
      { status: 500 }
    );
  }
}
