import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Handle Demo Mode if Stripe keys are missing
const isDemoMode = !process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;
if (!isDemoMode) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any, // Using stable API version
  });
}

export async function POST(req: NextRequest) {
  try {
    const { tierId, price, name } = await req.json();

    if (isDemoMode || !stripe) {
      // Demo Mode: Mock the checkout session by returning a fake URL
      console.warn("DEMO MODE: Stripe Secret Key is missing. Simulating checkout.");
      
      // We will redirect to dashboard with a fake success parameter
      const origin = req.headers.get("origin") || "http://localhost:3000";
      return NextResponse.json({ 
        url: `${origin}/dashboard?success=true&demo=true` 
      });
    }

    // Production Mode: Create real Stripe Checkout Session
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "promptpay"], // Support PromptPay and Credit Cards
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: `แพ็กเกจ ${name}`,
              description: `NEXORA AGRI AI - ${name} Subscription`,
            },
            unit_amount: price * 100, // Stripe expects amounts in the smallest currency unit (satang for THB)
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Using 'payment' for one-time payment for MVP. Change to 'subscription' for recurring.
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        tierId,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
