"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const STEPS = [
  { status: "RECUE", label: "Commande reçue", emoji: "📋", desc: "Votre commande est confirmée" },
  { status: "EN_PREPARATION", label: "En préparation", emoji: "👨‍🍳", desc: "Nos chefs préparent votre bowl" },
  { status: "PRETE", label: "Prête !", emoji: "✅", desc: "Venez récupérer votre commande au comptoir" },
  { status: "RECUPEREE", label: "Récupérée", emoji: "🎉", desc: "Bon appétit !" },
]

const STATUS_ORDER = ["RECUE", "EN_PREPARATION", "PRETE", "RECUPEREE"]

interface OrderData {
  id: string
  status: string
  estimatedReadyAt: string | null
  total: number
  createdAt: string
}

export default function SuiviPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}/status`)
      if (!res.ok) throw new Error("Commande introuvable")
      const json = await res.json()
      if (json.success) setOrder(json.data)
    } catch {
      setError("Impossible de récupérer le statut de la commande.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [fetchOrder])

  const currentStepIndex = order
    ? STATUS_ORDER.indexOf(order.status)
    : 0

  const shortId = id.slice(-6).toUpperCase()

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black">Suivi de commande</h1>
          <p className="text-brand-light mt-1">#{shortId}</p>
          <p className="text-brand-light text-sm mt-1">Mise à jour automatique toutes les 5 secondes</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement du statut…</p>
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-sm text-gray-500 mb-4">
                La base de données n&apos;est peut-être pas encore disponible.
              </p>
              <Button onClick={fetchOrder} variant="outline">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            {/* Stepper */}
            <Card className="mb-6">
              <CardContent className="py-6">
                <div className="space-y-0">
                  {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex
                    const isCurrent = idx === currentStepIndex
                    const isFuture = idx > currentStepIndex

                    return (
                      <div key={step.status} className="flex gap-4">
                        {/* Line + circle */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10 ${
                              isCompleted
                                ? "bg-brand-green text-white"
                                : isCurrent
                                ? "bg-brand-green text-white ring-4 ring-brand-green/20 animate-pulse"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isCompleted ? "✓" : step.emoji}
                          </div>
                          {idx < STEPS.length - 1 && (
                            <div
                              className={`w-0.5 h-12 my-1 ${
                                isCompleted ? "bg-brand-green" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <p
                            className={`font-semibold text-sm ${
                              isFuture ? "text-gray-400" : "text-charcoal"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              isFuture ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {step.desc}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-1 text-xs bg-brand-light text-brand-green px-2 py-0.5 rounded-full font-medium">
                              Statut actuel
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order info */}
            {order && (
              <Card className="mb-6">
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Commandé à</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {order.estimatedReadyAt && (
                      <div>
                        <p className="text-gray-500">Prêt estimé</p>
                        <p className="font-semibold">
                          {new Date(order.estimatedReadyAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {order?.status === "PRETE" && (
              <div className="bg-brand-green text-white rounded-card p-6 text-center mb-6">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-xl font-black">Votre bowl est prêt !</p>
                <p className="text-brand-light mt-1">
                  Rendez-vous au comptoir pour récupérer votre commande.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/menu" className="flex-1">
                <Button variant="outline" className="w-full">
                  Retour au menu
                </Button>
              </Link>
              <Link href="/compte/commandes" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Mes commandes
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
