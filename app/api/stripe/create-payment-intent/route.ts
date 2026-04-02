import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { priceCents, serviceId, coachId, startAt, endAt, notes } = await req.json();

  if (!priceCents || priceCents < 50) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      user_id: user.id,
      service_id: serviceId,
      coach_id: coachId ?? "",
      start_at: startAt,
      end_at: endAt,
      notes: notes ?? "",
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
