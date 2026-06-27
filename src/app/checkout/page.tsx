"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatMAD } from "@/lib/utils"
import { cn } from "@/lib/utils"

const TIME_SLOTS = [
  "12:00", "12:15", "12:30", "12:45",
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "19:00", "19:15",
  "19:30", "19:45", "20:00",
]

const FULFILLMENT_OPTIONS = [
  { id: "DINE_IN", label: "Sur place", emoji: "🍽️", desc: "Mangez dans notre espace" },
  { id: "TAKEAWAY", label: "À emporter", emoji: "🛍️", desc: "Récupérez et partez" },
  { id: "CLICK_COLLECT", label: "Click & Collect", emoji: "📱", desc: "Commandez, récupérez" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { state, total, subtotal, dispatch } = useCart()
  const [fulfillment, setFulfillment] = useState<"DINE_IN" | "TAKEAWAY" | "CLICK_COLLECT">("TAKEAWAY")
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (state.items.length === 0) {
    router.replace("/panier")
    return null
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const today = new Date()
      const [hours, minutes] = timeSlot.split(":").map(Number)
      const slotDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentType: fulfillment,
          timeSlot: slotDate.toISOString(),
          locationId: "default-location",
          items: state.items.map((item) => ({
            menuItemId: item.menuItemId,
            savedBowlId: item.savedBowlId,
            quantity: item.quantity,
            unitPrice: item.price,
            customization: item.customization,
            computedMacros: item.macros,
          })),
          promoCode: state.promoCode,
          specialInstructions: instructions || undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        if (res.status === 401) {
          router.push("/login?redirect=/checkout")
          return
        }
        setError(json.message ?? "Erreur lors de la commande.")
        return
      }

      dispatch({ type: "CLEAR" })
      router.push(`/checkout/confirmation/${json.data.id}`)
    } catch {
      setError("Erreur réseau. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-black">Finaliser ma commande</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Fulfillment */}
          <Card>
            <CardHeader>
              <CardTitle>1. Mode de récupération</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {FULFILLMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFulfillment(opt.id as typeof fulfillment)}
                  className={cn(
                    "p-4 rounded-card border-2 text-center transition-all",
                    fulfillment === opt.id
                      ? "border-brand-green bg-brand-light"
                      : "border-gray-200 hover:border-brand-green/50"
                  )}
                >
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className="text-sm font-semibold text-charcoal">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* 2. Time slot */}
          <Card>
            <CardHeader>
              <CardTitle>2. Créneau horaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={cn(
                      "py-2 rounded-btn text-sm font-medium border transition-all",
                      timeSlot === slot
                        ? "bg-brand-green text-white border-brand-green"
                        : "border-gray-200 text-charcoal hover:border-brand-green"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Special instructions */}
          <Card>
            <CardHeader>
              <CardTitle>3. Instructions spéciales (optionnel)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-btn text-sm resize-none h-20 focus:outline-none focus:border-brand-green"
                placeholder="Allergies particulières, préférences de préparation…"
              />
            </CardContent>
          </Card>

          {/* 4. Payment */}
          <Card>
            <CardHeader>
              <CardTitle>4. Paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 border-brand-green bg-brand-light rounded-btn cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-brand-green" />
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Paiement à la livraison / sur place</p>
                    <p className="text-xs text-gray-500">Espèces ou carte au comptoir</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-btn cursor-not-allowed opacity-60">
                  <input type="radio" name="payment" disabled className="text-brand-green" />
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Carte bancaire en ligne</p>
                    <p className="text-xs text-gray-500">Bientôt disponible</p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-btn px-4 py-3">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="font-medium">{formatMAD(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{formatMAD(subtotal)}</span>
                </div>
                {state.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({state.promoCode})</span>
                    <span>− {formatMAD(state.promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand-green">{formatMAD(total)}</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>⏱️ Prêt dans ~15 minutes</p>
                <p>📍 Healthy Bowl Marrakech Campus</p>
                <p>🕐 Créneau : {timeSlot}</p>
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                loading={loading}
                onClick={handleSubmit}
              >
                Confirmer ma commande
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
