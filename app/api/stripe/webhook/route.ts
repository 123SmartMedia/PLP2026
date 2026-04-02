import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const { user_id, service_id, coach_id, start_at, end_at, notes } = pi.metadata;

    const supabase = await createClient();
    await supabase.from("bookings").insert({
      user_id,
      service_id,
      coach_id: coach_id || null,
      start_time: start_at,
      end_time: end_at,
      total_cents: pi.amount,
      payment_intent_id: pi.id,
      notes: notes || null,
      status: "confirmed",
    });
  }

  return NextResponse.json({ received: true });
}
