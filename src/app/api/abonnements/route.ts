import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const subscribeSchema = z.object({
  plan: z.enum(["STARTER", "ACTIVE", "PREMIUM", "ETUDIANT"]),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const body = await req.json()
    const { plan } = subscribeSchema.parse(body)

    // Check student requirement
    if (plan === "ETUDIANT") {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user?.isStudent) {
        return NextResponse.json(
          { success: false, message: "Ce plan est réservé aux étudiants vérifiés." },
          { status: 403 }
        )
      }
    }

    const planConfig = await prisma.subscriptionPlanConfig.findUnique({ where: { plan } })
    if (!planConfig) {
      return NextResponse.json({ success: false, message: "Plan introuvable." }, { status: 404 })
    }

    // Cancel any existing active subscription
    await prisma.subscription.updateMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    })

    const renewsAt = new Date()
    renewsAt.setMonth(renewsAt.getMonth() + 1)

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: planConfig.id,
        status: "ACTIVE",
        mealCreditsRemaining: planConfig.mealCredits,
        renewsAt,
        priceMonthly: planConfig.priceMonthly,
      },
      include: { plan: true },
    })

    return NextResponse.json({ success: true, data: subscription }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[ABONNEMENTS POST]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: subscription })
  } catch (err) {
    console.error("[ABONNEMENTS GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
