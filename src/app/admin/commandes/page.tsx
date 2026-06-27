"use client"

import { useEffect, useState, useCallback } from "react"
import { formatMAD } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  fulfillmentType: string
  user: { name: string; email: string } | null
  items: { menuItem: { name: string } | null; quantity: number }[]
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

export default function CommandesAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0])
  const [total, setTotal] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" })
    if (statusFilter) params.set("status", statusFilter)
    if (dateFilter) params.set("date", dateFilter)

    try {
      const res = await fetch(`/api/admin/orders?${params}`)
      const json = await res.json()
      if (json.success) {
        setOrders(json.data)
        setTotal(json.total)
      }
    } catch {}
    finally { setLoading(false) }
  }, [statusFilter, dateFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      await fetchOrders()
    } catch {}
    finally { setUpdating(null) }
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-6">Commandes</h1>

      {/* Filters */}
      <div className="bg-white rounded-card shadow-card p-4 mb-6 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
        />
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Actualiser
        </Button>
        <span className="ml-auto text-sm text-gray-500 self-center">
          {total} commande{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">N° commande</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Articles</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Statut</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Heure</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.user?.name ?? "Client anonyme"}</p>
                        <p className="text-xs text-gray-400">{order.user?.email ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-gray-700 truncate">
                          {order.items.map((i) => `${i.menuItem?.name ?? "Bowl"} ×${i.quantity}`).join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-brand-green">
                        {formatMAD(order.total)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {order.status === "RECUE" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={updating === order.id}
                              onClick={() => updateStatus(order.id, "EN_PREPARATION")}
                            >
                              Préparer
                            </Button>
                          )}
                          {order.status === "EN_PREPARATION" && (
                            <Button
                              size="sm"
                              loading={updating === order.id}
                              onClick={() => updateStatus(order.id, "PRETE")}
                            >
                              Prête
                            </Button>
                          )}
                          {order.status === "PRETE" && (
                            <Button
                              size="sm"
                              variant="outline"
                              loading={updating === order.id}
                              onClick={() => updateStatus(order.id, "RECUPEREE")}
                            >
                              Récupérée
                            </Button>
                          )}
                          {!["RECUPEREE", "ANNULEE"].includes(order.status) && (
                            <Button
                              size="sm"
                              variant="danger"
                              loading={updating === order.id}
                              onClick={() => updateStatus(order.id, "ANNULEE")}
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
