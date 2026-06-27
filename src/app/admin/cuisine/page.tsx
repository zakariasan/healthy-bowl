"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: string
  quantity: number
  menuItem: { name: string } | null
  computedMacros: Record<string, number> | null
  customization: Record<string, unknown> | null
  notes: string | null
}

interface KitchenOrder {
  id: string
  status: "RECUE" | "EN_PREPARATION"
  createdAt: string
  prepStartedAt: string | null
  fulfillmentType: string
  timeSlot: string | null
  specialInstructions: string | null
  items: OrderItem[]
  _allergens?: string[]
}

const ALLERGEN_LABELS: Record<string, string> = {
  GLUTEN: "Gluten", LACTOSE: "Lactose", OEUFS: "Œufs", SESAME: "Sésame",
  POISSON: "Poisson", SOJA: "Soja", ARACHIDES: "Arachides", FRUITS_A_COQUE: "Noix",
}

export default function CuisinePage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ today: 0, avgPrepTime: 0 })
  const [now, setNow] = useState(Date.now())

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders?status=RECUE&limit=50")
      const json = await res.json()
      if (json.success) {
        const recue = json.data.filter((o: KitchenOrder) => o.status === "RECUE")

        const res2 = await fetch("/api/admin/orders?status=EN_PREPARATION&limit=50")
        const json2 = await res2.json()
        const enPrep = json2.success ? json2.data.filter((o: KitchenOrder) => o.status === "EN_PREPARATION") : []

        setOrders([...enPrep, ...recue])
        setStats({ today: json.total + json2.total, avgPrepTime: 8 })
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchOrders()
    const orderInterval = setInterval(fetchOrders, 3000)
    const timeInterval = setInterval(() => setNow(Date.now()), 1000)
    return () => { clearInterval(orderInterval); clearInterval(timeInterval) }
  }, [fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      await fetchOrders()
    } catch {}
  }

  const getElapsedTime = (createdAt: string) => {
    const elapsed = Math.floor((now - new Date(createdAt).getTime()) / 1000)
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    return { mins, secs, isLate: mins >= 7 }
  }

  const recueOrders = orders.filter((o) => o.status === "RECUE")
  const prepOrders = orders.filter((o) => o.status === "EN_PREPARATION")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">🍳 Tableau Cuisine</h1>
          <p className="text-gray-500 text-sm mt-1">Mise à jour automatique toutes les 3 secondes</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white rounded-card px-4 py-2 text-center shadow-card">
            <p className="text-2xl font-black text-gray-900">{stats.today}</p>
            <p className="text-xs text-gray-500">commandes auj.</p>
          </div>
          <div className={cn(
            "rounded-card px-4 py-2 text-center shadow-card",
            stats.avgPrepTime > 7 ? "bg-red-50" : "bg-white"
          )}>
            <p className={cn("text-2xl font-black", stats.avgPrepTime > 7 ? "text-red-600" : "text-gray-900")}>
              {stats.avgPrepTime} min
            </p>
            <p className="text-xs text-gray-500">temps moyen</p>
          </div>
          <div className="bg-white rounded-card px-4 py-2 text-center shadow-card">
            <p className="text-xs text-gray-400">Objectif</p>
            <p className="text-sm font-bold text-gray-600">7 min</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Received orders */}
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              Commandes reçues ({recueOrders.length})
            </h2>
            <div className="space-y-4">
              {recueOrders.length === 0 ? (
                <div className="bg-white rounded-card p-8 text-center text-gray-400">
                  <p className="text-2xl mb-2">✅</p>
                  <p>Aucune commande en attente</p>
                </div>
              ) : (
                recueOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    elapsed={getElapsedTime(order.createdAt)}
                    onAction={() => updateStatus(order.id, "EN_PREPARATION")}
                    actionLabel="▶ Commencer préparation"
                    actionClass="bg-orange-500 hover:bg-orange-600 text-white"
                    isNew={Date.now() - new Date(order.createdAt).getTime() < 30000}
                  />
                ))
              )}
            </div>
          </div>

          {/* In preparation */}
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              En préparation ({prepOrders.length})
            </h2>
            <div className="space-y-4">
              {prepOrders.length === 0 ? (
                <div className="bg-white rounded-card p-8 text-center text-gray-400">
                  <p className="text-2xl mb-2">👨‍🍳</p>
                  <p>Aucune commande en cours</p>
                </div>
              ) : (
                prepOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    elapsed={getElapsedTime(order.prepStartedAt ?? order.createdAt)}
                    onAction={() => updateStatus(order.id, "PRETE")}
                    actionLabel="✅ Marquer comme prête"
                    actionClass="bg-green-500 hover:bg-green-600 text-white"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order, elapsed, onAction, actionLabel, actionClass, isNew,
}: {
  order: KitchenOrder
  elapsed: { mins: number; secs: number; isLate: boolean }
  onAction: () => void
  actionLabel: string
  actionClass: string
  isNew?: boolean
}) {
  const shortId = order.id.slice(-6).toUpperCase()

  return (
    <div className={cn(
      "bg-white rounded-card shadow-card overflow-hidden border-l-4 transition-all",
      elapsed.isLate ? "border-red-500" : order.status === "EN_PREPARATION" ? "border-orange-400" : "border-blue-400",
      isNew ? "animate-pulse border-green-500" : ""
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg text-gray-900">#{shortId}</span>
          <span className="text-xs text-gray-500">
            {order.fulfillmentType === "DINE_IN" ? "🍽️ Sur place" :
             order.fulfillmentType === "TAKEAWAY" ? "🛍️ À emporter" : "📱 Click & Collect"}
          </span>
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NOUVELLE
            </span>
          )}
        </div>
        <div className={cn(
          "text-lg font-black tabular-nums",
          elapsed.isLate ? "text-red-600" : elapsed.mins >= 5 ? "text-orange-500" : "text-gray-700"
        )}>
          {String(elapsed.mins).padStart(2, "0")}:{String(elapsed.secs).padStart(2, "0")}
          {elapsed.isLate && <span className="text-xs ml-1">⚠️ RETARD</span>}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3">
        <div className="space-y-2 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="font-bold text-brand-green text-sm w-5 shrink-0">{item.quantity}×</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.menuItem?.name ?? "Bowl personnalisé"}
                </p>
                {item.notes && (
                  <p className="text-xs text-orange-600">📝 {item.notes}</p>
                )}
                {item.customization && Object.keys(item.customization).length > 0 && (
                  <p className="text-xs text-gray-500">Personnalisé</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Special instructions */}
        {order.specialInstructions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-3 text-xs text-yellow-800">
            📝 {order.specialInstructions}
          </div>
        )}

        {/* Time slot */}
        {order.timeSlot && (
          <p className="text-xs text-gray-500 mb-3">
            ⏰ Créneau : {new Date(order.timeSlot).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}

        {/* Allergen warnings */}
        {order._allergens && order._allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {order._allergens.map((a) => (
              <span key={a} className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                ⚠️ {ALLERGEN_LABELS[a] ?? a}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onAction}
          className={cn("w-full py-2.5 rounded-btn text-sm font-bold transition-colors", actionClass)}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
