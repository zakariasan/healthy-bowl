import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Abonnements — Admin Healthy Bowl",
}

export default async function AdminAbonnementsPage() {
  let subscriptions: Array<{
    id: string
    status: string
    priceMonthly: number
    mealCreditsRemaining: number
    renewsAt: Date
    user: { name: string; email: string }
    plan: { name: string; emoji: string | null }
  }> = []

  let planConfigs: Array<{
    id: string
    plan: string
    name: string
    emoji: string | null
    priceMonthly: number
    mealCredits: number
    isActive: boolean
    _count: { subscriptions: number }
  }> = []

  try {
    const [subs, plans] = await Promise.all([
      prisma.subscription.findMany({
        where: { status: { in: ["ACTIVE", "PAUSED"] } },
        include: {
          user: { select: { name: true, email: true } },
          plan: { select: { name: true, emoji: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.subscriptionPlanConfig.findMany({
        include: { _count: { select: { subscriptions: true } } },
        orderBy: { priceMonthly: "asc" },
      }),
    ])
    subscriptions = subs
    planConfigs = plans
  } catch {}

  const mrr = subscriptions
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + s.priceMonthly, 0)

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-6">Abonnements</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-500 mb-1">Abonnés actifs</p>
            <p className="text-3xl font-black text-gray-900">
              {subscriptions.filter((s) => s.status === "ACTIVE").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-500 mb-1">MRR (Revenus mensuels)</p>
            <p className="text-3xl font-black text-brand-green">{formatMAD(mrr)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-500 mb-1">Suspendus</p>
            <p className="text-3xl font-black text-gray-900">
              {subscriptions.filter((s) => s.status === "PAUSED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {planConfigs.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{plan.emoji ?? "⭐"}</span>
                <span className="font-bold text-charcoal">{plan.name}</span>
              </div>
              <p className="text-2xl font-black text-brand-green">{plan._count.subscriptions}</p>
              <p className="text-xs text-gray-500">abonnés · {formatMAD(plan.priceMonthly)}/mois</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriber list */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Abonnés actifs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Plan</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Statut</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Montant</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Crédits restants</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Renouvellement</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Aucun abonné pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{sub.user.name}</p>
                      <p className="text-xs text-gray-400">{sub.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{sub.plan.emoji} {sub.plan.name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sub.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {sub.status === "ACTIVE" ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-green">
                      {formatMAD(sub.priceMonthly)}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">
                      {sub.mealCreditsRemaining}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(sub.renewsAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
