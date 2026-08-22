import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.warn("Stripe Webhook called but keys are missing. Ignoring.");
    return NextResponse.json({ status: "ignored - missing keys" });
  }

  // Initialize Supabase with Service Role to bypass RLS
  // We do it here because if keys are missing we don't want it to crash on import
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id || session.metadata?.userId;
      const tierId = session.metadata?.tierId;

      if (userId && tierId) {
        // Upgrade the user's subscription in Supabase
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: tierId,
            billing_cycle: "monthly",
          })
          .eq("id", userId);

        if (error) {
          console.error("Failed to upgrade user in Supabase:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        
        console.log(`Successfully upgraded user ${userId} to ${tierId}`);
      } else {
        console.error("Missing userId or tierId in session metadata", { userId, tierId });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
