import {NextRequest, NextResponse} from 'next/server';
import {getStripe} from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const {items} = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((i: any) => ({
      price_data: {
        currency: i.currency || 'eur',
        product_data: {
          name: i.name
        },
        unit_amount: Math.round(i.price * 100)
      },
      quantity: i.quantity || 1
    })),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/shop?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/shop?cancel=1`
  });

  return NextResponse.json({url: session.url});
}
