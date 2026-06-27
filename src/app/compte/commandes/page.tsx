import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Mes commandes — Healthy Bowl",
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

export default async function CommandesPage() {
  const session = await getServerSession(authOptions)

  let orders: Array<{
    id: string
    status: string
    total: number
    createdAt: Date
    fulfillmentType: string
    items: Array<{ menuItem: { name: string } | null; quantity: number }>
  }> = []

  try {
    orders = await prisma.order.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { menuItem: { select: { name: true } } },
          take: 3,
        },
      },
    })
  } catch {}

  const FULFILLMENT_LABELS: Record<string, string> = {
    DINE_IN: "Sur place",
    TAKEAWAY: "À emporter",
    CLICK_COLLECT: "Click & Collect",
    DELIVERY: "Livraison",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Mes commandes</h1>
        <p className="text-gray-600 mt-1">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Aucune commande"
          description="Vous n'avez pas encore passé de commande. Commencez par explorer notre menu !"
          action={{ label: "Voir le menu", href: "/menu" }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-charcoal">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {FULFILLMENT_LABELS[order.fulfillmentType] ?? order.fulfillmentType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" — "}
                    {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items
                      .map((item) => `${item.menuItem?.name ?? "Bowl personnalisé"} ×${item.quantity}`)
                      .join(", ")}
                    {order.items.length >= 3 ? "…" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-bold text-brand-green">{formatMAD(order.total)}</span>
                  <div className="flex gap-2">
                    <Link href={`/suivi/${order.id}`}>
                      <Button variant="outline" size="sm">Suivre</Button>
                    </Link>
                    <Button variant="ghost" size="sm" disabled>Recommander</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
