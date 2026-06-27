import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe, madToCentimes } from "@/lib/stripe"

const PLAN_SLUG_TO_ENUM: Record<string, "STARTER" | "ACTIVE" | "PREMIUM" | "ETUDIANT"> = {
  starter: "STARTER",
  active: "ACTIVE",
  premium: "PREMIUM",
  etudiant: "ETUDIANT",
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
    }

    const { planSlug } = await req.json()
    const planEnum = PLAN_SLUG_TO_ENUM[planSlug?.toLowerCase()]
    if (!planEnum) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 })
    }

    const planConfig = await prisma.subscriptionPlanConfig.findUnique({
      where: { plan: planEnum },
    })
    if (!planConfig || !planConfig.isActive) {
      return NextResponse.json({ error: "Plan non disponible." }, { status: 404 })
    }

    const amountInCentimes = madToCentimes(planConfig.priceMonthly)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCentimes,
      currency: "mad",
      metadata: {
        userId: session.user.id,
        planSlug,
        planConfigId: planConfig.id,
        planName: planConfig.name,
      },
      description: `Abonnement Healthy Bowl — ${planConfig.name}`,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error("[SUBSCRIPTION CREATE-INTENT]", err)
    const message = err instanceof Error ? err.message : "Erreur serveur."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
