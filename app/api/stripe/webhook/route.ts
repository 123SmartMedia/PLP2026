import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendBookingConfirmation } from "@/lib/sendgrid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service role client — bypasses RLS, safe for server-only webhook use
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

    const supabase = createServiceClient();

    // Insert the booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id,
        service_id,
        coach_id: coach_id || null,
        start_time: start_at,
        end_time: end_at,
        total_cents: pi.amount,
        payment_intent_id: pi.id,
        notes: notes || null,
        status: "confirmed",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Webhook booking insert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation emails (non-blocking — don't fail the webhook if email fails)
    try {
      if (process.env.SENDGRID_API_KEY) {
        // Fetch details needed for the email in parallel
        const [profileRes, serviceRes, coachRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user_id)
            .single(),
          supabase
            .from("services")
            .select("name")
            .eq("id", service_id)
            .single(),
          coach_id
            ? supabase
                .from("coaches")
                .select("profiles(full_name)")
                .eq("id", coach_id)
                .single()
            : Promise.resolve({ data: null }),
        ]);

        const customerName = profileRes.data?.full_name ?? "Customer";
        const customerEmail = profileRes.data?.email;
        const serviceName = serviceRes.data?.name ?? "Session";
        const coachName =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (coachRes.data as any)?.profiles?.full_name ?? null;

        if (customerEmail) {
          await sendBookingConfirmation({
            customerName,
            customerEmail,
            serviceName,
            coachName,
            startTime: start_at,
            endTime: end_at,
            totalCents: pi.amount,
            bookingId: booking.id,
          });
        }
      }
    } catch (emailError) {
      // Log but don't return an error — booking is already saved
      console.error("Email send failed:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}
