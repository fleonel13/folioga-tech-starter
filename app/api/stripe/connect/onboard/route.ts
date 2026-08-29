import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = getStripe();

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server configuration missing");
  }

  return createClient(url, serviceKey);
}

export async function POST(request: Request) {
  try {
    const { technicianId } = await request.json();

    if (!technicianId) {
      return NextResponse.json(
        { error: "technicianId est obligatoire." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: technician, error: technicianError } = await supabase
      .from("profiles")
      .select(
        "id, email, name, role, stripe_connect_account_id, stripe_connect_onboarding_complete"
      )
      .eq("id", technicianId)
      .single();

    if (technicianError || !technician) {
      console.error("Technicien introuvable :", technicianError);

      return NextResponse.json(
        { error: "Technicien introuvable." },
        { status: 404 }
      );
    }

    /*
     * Le projet utilise "technicien" dans le dashboard.
     * On accepte aussi "technician" pour rester compatible
     * avec les anciennes données.
     */
    if (
      technician.role !== "technicien" &&
      technician.role !== "technician"
    ) {
      return NextResponse.json(
        {
          error: `Ce profil n'est pas un technicien. Rôle actuel : ${technician.role}`,
        },
        { status: 400 }
      );
    }

    let accountId = technician.stripe_connect_account_id;

    /*
     * Création du compte Stripe Connect si nécessaire.
     */
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: technician.email || undefined,
        capabilities: {
          transfers: {
            requested: true,
          },
        },
        metadata: {
          folioga_technician_id: technician.id,
        },
      });

      accountId = account.id;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          stripe_connect_account_id: accountId,
          stripe_connect_onboarding_complete: false,
        })
        .eq("id", technician.id);

      if (updateError) {
        console.error(
          "Erreur sauvegarde Stripe Connect :",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "Le compte Stripe a été créé mais impossible de l'enregistrer.",
          },
          { status: 500 }
        );
      }
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/fr/dashboard?stripe=refresh`,
      return_url: `${origin}/fr/dashboard?stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      success: true,
      accountId,
      url: accountLink.url,
    });
  } catch (error) {
    console.error("Stripe Connect onboarding error :", error);

    return NextResponse.json(
      {
        error: "Impossible de créer le lien Stripe Connect.",
      },
      { status: 500 }
    );
  }
}
