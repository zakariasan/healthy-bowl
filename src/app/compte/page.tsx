import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Mon compte — Healthy Bowl",
}

const STATUS_LABELS: Record<string, string> = {
  RECUE: "Reçue",
  EN_PREPARATION: "En préparation",
  PRETE: "Prête",
  RECUPEREE: "Récupérée",
  ANNULEE: "Annulée",
}

const STATUS_COLORS: Record<string, string> = {
  RECUE: "bg-blue-100 text-blue-700",
  EN_PREPARATION: "bg-orange-100 text-orange-700",
  PRETE: "bg-green-100 text-green-700",
  RECUPEREE: "bg-gray-100 text-gray-600",
  ANNULEE: "bg-red-100 text-red-600",
}

export default async function ComptePage() {
  const session = await getServerSession(authOptions)

  let recentOrders: Array<{ id: string; status: string; total: number; createdAt: Date }> = []
  let loyaltyPoints = 0
  let activeSubscription: { plan: { name: string; emoji: string | null }; mealCreditsRemaining: number; renewsAt: Date } | null = null

  try {
    const [orders, loyalty, subscription] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session!.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, status: true, total: true, createdAt: true },
      }),
      prisma.loyaltyAccount.findUnique({
        where: { userId: session!.user.id },
        select: { points: true },
      }),
      prisma.subscription.findFirst({
        where: { userId: session!.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
        include: { plan: { select: { name: true, emoji: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ])
    recentOrders = orders
    loyaltyPoints = loyalty?.points ?? 0
    activeSubscription = subscription
  } catch {
    // DB may not be ready
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-charcoal">
          {greeting()}, {session!.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">Voici un résumé de votre espace Healthy Bowl.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/builder">
          <Button size="lg" className="w-full h-16 flex-col gap-1">
            <span className="text-xl">🥣</span>
            <span className="text-sm">Créer un bowl</span>
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" size="lg" className="w-full h-16 flex-col gap-1">
            <span className="text-xl">📋</span>
            <span className="text-sm">Voir le menu</span>
          </Button>
        </Link>
        <Link href="/compte/commandes">
          <Button variant="secondary" size="lg" className="w-full h-16 flex-col gap-1">
            <span className="text-xl">🔍</span>
            <span className="text-sm">Mes commandes</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loyalty points */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Points fidélité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-brand-green mb-1">{loyaltyPoints}</div>
            <p className="text-sm text-gray-600 mb-4">points disponibles</p>
            <div className="bg-brand-light rounded-btn p-3 text-sm text-brand-green">
              💡 {loyaltyPoints >= 100
                ? `Vous pouvez obtenir une réduction de ${formatMAD(Math.floor(loyaltyPoints / 100) * 5)} !`
                : `Encore ${100 - loyaltyPoints} points pour votre première récompense.`}
            </div>
            <Link href="/compte/fidelite" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full">
                Voir mes récompenses →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>⭐ Mon abonnement</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{activeSubscription.plan.emoji ?? "⭐"}</span>
                  <span className="font-bold text-charcoal text-lg">{activeSubscription.plan.name}</span>
                  <Badge className="ml-auto">Actif</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Crédits restants :{" "}
                  <strong>{activeSubscription.mealCreditsRemaining} repas</strong>
                </p>
                <p className="text-xs text-gray-400">
                  Renouvellement :{" "}
                  {new Date(activeSubscription.renewsAt).toLocaleDateString("fr-FR")}
                </p>
                <Link href="/compte/abonnement" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Gérer mon abonnement →
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Vous n&apos;avez pas d&apos;abonnement actif. Économisez jusqu&apos;à 30% sur vos repas.
                </p>
                <Link href="/abonnements">
                  <Button className="w-full">Découvrir les abonnements</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📋 Commandes récentes</CardTitle>
            <Link href="/compte/commandes">
              <Button variant="ghost" size="sm">Voir tout →</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm mb-4">Aucune commande pour l&apos;instant.</p>
              <Link href="/menu">
                <Button size="sm">Commander maintenant</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-btn"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-bold text-brand-green">
                      {formatMAD(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
