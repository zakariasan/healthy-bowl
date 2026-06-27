import { NextRequest, NextResponse } from "next/server"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`[WEBHOOK] ${event.type}`)

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object
    const { userId, planConfigId } = pi.metadata

    if (!userId || !planConfigId) return NextResponse.json({ ok: true })

    const planConfig = await prisma.subscriptionPlanConfig.findUnique({
      where: { id: planConfigId },
    })
    if (!planConfig) return NextResponse.json({ ok: true })

    const renewsAt = new Date()
    renewsAt.setMonth(renewsAt.getMonth() + 1)

    const existing = await prisma.subscription.findFirst({
      where: { userId, status: { in: ["ACTIVE", "PENDING"] } },
    })

    const billingEntry = {
      date: new Date().toISOString(),
      amount: planConfig.priceMonthly,
      paymentIntentId: pi.id,
      plan: planConfig.name,
      source: "webhook",
    }

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId: planConfig.id,
          status: "ACTIVE",
          mealCreditsRemaining: planConfig.mealCredits,
          renewsAt,
          priceMonthly: planConfig.priceMonthly,
          billingHistory: [...(existing.billingHistory as object[]), billingEntry],
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          planId: planConfig.id,
          status: "ACTIVE",
          mealCreditsRemaining: planConfig.mealCredits,
          renewsAt,
          priceMonthly: planConfig.priceMonthly,
          billingHistory: [billingEntry],
        },
      })
    }

    console.log(`[WEBHOOK] Subscription activated for user ${userId}, plan ${planConfig.name}`)
  }

  return NextResponse.json({ ok: true })
}
