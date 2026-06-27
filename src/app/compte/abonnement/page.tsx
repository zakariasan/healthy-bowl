import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Mon abonnement — Healthy Bowl",
}

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions)

  let subscription: {
    id: string
    status: string
    mealCreditsRemaining: number
    renewsAt: Date
    priceMonthly: number
    createdAt: Date
    pausedUntil: Date | null
    plan: { name: string; emoji: string | null; mealCredits: number; features: unknown }
  } | null = null

  try {
    subscription = await prisma.subscription.findFirst({
      where: { userId: session!.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })
  } catch {}

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-600",
    PENDING: "bg-blue-100 text-blue-700",
  }

  const STATUS_LABELS: Record<string, string> = {
    ACTIVE: "Actif",
    PAUSED: "Suspendu",
    CANCELLED: "Annulé",
    PENDING: "En attente",
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-charcoal">Mon abonnement</h1>
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-5xl mb-4">⭐</div>
            <h2 className="text-xl font-bold text-charcoal mb-2">Aucun abonnement actif</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Souscrivez à un abonnement et économisez jusqu&apos;à 30% sur vos repas.
            </p>
            <Link href="/abonnements">
              <Button size="lg">Découvrir les abonnements</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usedMeals = (subscription.plan.mealCredits) - subscription.mealCreditsRemaining
  const progress = Math.round((usedMeals / subscription.plan.mealCredits) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Mon abonnement</h1>
        <p className="text-gray-600 mt-1">Gérez votre formule Healthy Bowl.</p>
      </div>

      {/* Main card */}
      <Card className="border-2 border-brand-green">
        <CardContent className="py-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{subscription.plan.emoji ?? "⭐"}</span>
              <div>
                <h2 className="text-2xl font-black text-charcoal">{subscription.plan.name}</h2>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[subscription.status]}`}>
                  {STATUS_LABELS[subscription.status]}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-brand-green">
                {formatMAD(subscription.priceMonthly)}
              </div>
              <div className="text-xs text-gray-500">par mois</div>
            </div>
          </div>

          {/* Meal credits */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Crédits repas utilisés</span>
              <span className="font-semibold text-charcoal">
                {usedMeals} / {subscription.plan.mealCredits}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-green rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {subscription.mealCreditsRemaining} repas restants ce mois
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-gray-500">Prochain renouvellement</p>
              <p className="font-semibold text-charcoal">
                {new Date(subscription.renewsAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Membre depuis</p>
              <p className="font-semibold text-charcoal">
                {new Date(subscription.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" disabled>
              ⏸️ Suspendre
            </Button>
            <Link href="/abonnements">
              <Button variant="secondary" size="sm">
                🔄 Changer de plan
              </Button>
            </Link>
            <Button variant="danger" size="sm" disabled>
              Annuler l&apos;abonnement
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Contactez le support pour annuler ou suspendre votre abonnement.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
