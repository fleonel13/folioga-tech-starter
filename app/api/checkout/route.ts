import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items, locale } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide." },
        { status: 400 }
      );
    }

    const lineItems = items.map((item: {
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
    }));

    const origin = request.headers.get("origin");

    if (!origin) {
      return NextResponse.json(
        { error: "Origine du site introuvable." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
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
