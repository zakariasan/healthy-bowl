"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { formatMAD } from "@/lib/utils"

export default function PanierPage() {
  const { state, dispatch, subtotal, total, itemCount } = useCart()
  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)

  const applyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError("")
    try {
      const res = await fetch(`/api/promo?code=${promoInput.trim().toUpperCase()}`)
      const json = await res.json()
      if (json.success && json.data) {
        let discount = 0
        if (json.data.type === "PERCENT") discount = (subtotal * json.data.value) / 100
        else if (json.data.type === "FIXED_MAD") discount = json.data.value
        dispatch({ type: "SET_PROMO", code: promoInput.toUpperCase(), discount })
      } else {
        setPromoError("Code promo invalide ou expiré.")
      }
    } catch {
      setPromoError("Impossible de vérifier ce code.")
    } finally {
      setPromoLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <EmptyState
          icon="🛒"
          title="Votre panier est vide"
          description="Ajoutez des articles depuis le menu ou créez votre bowl personnalisé."
          action={{ label: "Voir le menu", href: "/menu" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-black">Mon panier</h1>
          <p className="text-brand-light mt-1">{itemCount} article{itemCount > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-start gap-4">
                <div className="w-14 h-14 bg-brand-light rounded-btn flex items-center justify-center text-2xl shrink-0">
                  {item.isCustomBowl ? "🥣" : "🌿"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-charcoal">{item.name}</h3>
                      {item.macros && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.macros.kcal} kcal · P {item.macros.protein}g · G {item.macros.carbs}g · L {item.macros.fat}g
                        </p>
                      )}
                      {item.isCustomBowl && item.customization && (
                        <p className="text-xs text-gray-400 mt-1">Bowl personnalisé</p>
                      )}
                    </div>
                    <span className="font-bold text-brand-green whitespace-nowrap">
                      {formatMAD(item.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-btn overflow-hidden">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          dispatch({ type: "UPDATE_QUANTITY", id: item.id, quantity: item.quantity - 1 })
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          dispatch({ type: "UPDATE_QUANTITY", id: item.id, quantity: item.quantity + 1 })
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <button
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            onClick={() => dispatch({ type: "CLEAR" })}
          >
            🗑️ Vider le panier
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <CardContent>
              <h2 className="font-bold text-charcoal text-lg mb-4">Récapitulatif</h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{formatMAD(subtotal)}</span>
                </div>
                {state.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo ({state.promoCode})</span>
                    <span>− {formatMAD(state.promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-brand-green">{formatMAD(total)}</span>
                </div>
              </div>

              {/* Promo code */}
              {!state.promoCode && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Code promo"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={applyPromo}
                      loading={promoLoading}
                    >
                      OK
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                </div>
              )}
              {state.promoCode && (
                <div className="flex items-center justify-between bg-green-50 rounded-btn px-3 py-2 mb-4 text-sm">
                  <span className="text-green-700">✓ {state.promoCode}</span>
                  <button
                    className="text-xs text-gray-500 hover:text-red-500"
                    onClick={() => dispatch({ type: "REMOVE_PROMO" })}
                  >
                    Retirer
                  </button>
                </div>
              )}

              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Commander → {formatMAD(total)}
                </Button>
              </Link>

              <p className="text-xs text-gray-400 text-center mt-3">
                Paiement sécurisé · Prêt en ~15 min
              </p>
            </CardContent>
          </Card>

          <Link href="/menu" className="block text-center text-sm text-brand-green hover:underline">
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}
