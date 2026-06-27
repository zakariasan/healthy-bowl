import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tableau de bord — Admin Healthy Bowl",
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

async function getStats() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [ordersToday, revenueToday, activeSubscriptions, newCustomers, ordersByStatus] =
      await Promise.all([
        prisma.order.count({
          where: { createdAt: { gte: today, lt: tomorrow }, status: { not: "ANNULEE" } },
        }),
        prisma.order.aggregate({
          where: { createdAt: { gte: today, lt: tomorrow }, status: { not: "ANNULEE" } },
          _sum: { total: true },
        }),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
        prisma.order.groupBy({
          by: ["status"],
          where: { createdAt: { gte: today, lt: tomorrow } },
          _count: true,
        }),
      ])

    return {
      ordersToday,
      revenueToday: revenueToday._sum.total ?? 0,
      activeSubscriptions,
      newCustomers,
      ordersByStatus,
    }
  } catch {
    return {
      ordersToday: 0,
      revenueToday: 0,
      activeSubscriptions: 0,
      newCustomers: 0,
      ordersByStatus: [],
    }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const stats = await getStats()
  const revenueTarget = 5000
  const revenuePercent = Math.min(100, Math.round((stats.revenueToday / revenueTarget) * 100))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">
          Bonjour {session?.user?.name?.split(" ")[0]} — voici les indicateurs du jour.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label="Commandes aujourd'hui"
          value={stats.ordersToday.toString()}
          emoji="📋"
          trend={stats.ordersToday > 20 ? "up" : "neutral"}
        />
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💰</span>
            <span className="text-sm text-gray-500">Chiffre d'affaires</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{formatMAD(stats.revenueToday)}</div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{revenuePercent}% de l'objectif</span>
              <span>{formatMAD(revenueTarget)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${revenuePercent >= 100 ? "bg-green-500" : "bg-brand-green"}`}
                style={{ width: `${revenuePercent}%` }}
              />
            </div>
          </div>
        </div>
        <KPICard
          label="Abonnements actifs"
          value={stats.activeSubscriptions.toString()}
          emoji="⭐"
          trend="up"
        />
        <KPICard
          label="Nouveaux clients"
          value={stats.newCustomers.toString()}
          emoji="👤"
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes par statut (aujourd'hui)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.ordersByStatus.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucune commande aujourd'hui.</p>
            ) : (
              <div className="space-y-3">
                {stats.ordersByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[item.status] ?? "bg-gray-100"}`}>
                      {STATUS_LABELS[item.status] ?? item.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-green rounded-full"
                          style={{
                            width: `${Math.min(100, (item._count / Math.max(1, stats.ordersToday)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-6 text-right">{item._count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/cuisine", label: "Tableau cuisine", emoji: "👨‍🍳" },
              { href: "/admin/commandes", label: "Toutes commandes", emoji: "📋" },
              { href: "/admin/menu", label: "Gérer le menu", emoji: "🥗" },
              { href: "/admin/ingredients", label: "Stocks", emoji: "🥬" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-brand-light rounded-card transition-colors text-center"
              >
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-sm font-medium text-charcoal">{action.label}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({ label, value, emoji, trend }: {
  label: string
  value: string
  emoji: string
  trend: "up" | "down" | "neutral"
}) {
  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{emoji}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-3xl font-black text-gray-900">{value}</div>
      <div className={`text-xs mt-2 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>
        {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} aujourd'hui
      </div>
    </div>
  )
}
