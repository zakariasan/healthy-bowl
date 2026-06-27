import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
    }

    const { paymentIntentId } = await req.json()
    if (!paymentIntentId) {
      return NextResponse.json({ error: "paymentIntentId requis." }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: `Paiement non confirmé (statut: ${paymentIntent.status}).` },
        { status: 400 }
      )
    }

    if (paymentIntent.metadata.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const planConfigId = paymentIntent.metadata.planConfigId
    const planConfig = await prisma.subscriptionPlanConfig.findUnique({
      where: { id: planConfigId },
    })
    if (!planConfig) {
      return NextResponse.json({ error: "Plan introuvable." }, { status: 404 })
    }

    const renewsAt = new Date()
    renewsAt.setMonth(renewsAt.getMonth() + 1)

    const billingEntry = {
      date: new Date().toISOString(),
      amount: planConfig.priceMonthly,
      paymentIntentId,
      plan: planConfig.name,
    }

    // Upsert subscription (cancel existing, create new)
    const existing = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "PENDING"] } },
    })

    let subscription
    if (existing) {
      subscription = await prisma.subscription.update({
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
      subscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          planId: planConfig.id,
          status: "ACTIVE",
          mealCreditsRemaining: planConfig.mealCredits,
          renewsAt,
          priceMonthly: planConfig.priceMonthly,
          billingHistory: [billingEntry],
        },
      })
    }

    return NextResponse.json({ success: true, subscription })
  } catch (err) {
    console.error("[SUBSCRIPTION ACTIVATE]", err)
    const message = err instanceof Error ? err.message : "Erreur serveur."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
