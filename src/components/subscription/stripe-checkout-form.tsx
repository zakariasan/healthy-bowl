"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import { formatMAD } from "@/lib/utils"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_")
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface Plan {
  slug: string
  name: string
  emoji: string
  price: number
  meals: number
}

interface CheckoutFormInnerProps {
  plan: Plan
  clientSecret: string
}

function CheckoutFormInner({ plan, clientSecret }: CheckoutFormInnerProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setStatus("processing")
    setErrorMessage(null)

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    })

    if (error) {
      setStatus("error")
      setErrorMessage(error.message ?? "Paiement refusé.")
      return
    }

    if (paymentIntent?.status === "succeeded") {
      // Activate subscription in DB
      const res = await fetch("/api/subscriptions/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMessage(data.error ?? "Erreur lors de l'activation.")
        return
      }

      setStatus("success")
      setTimeout(() => router.push(`/abonnements/succes?plan=${plan.slug}`), 1500)
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4 animate-bounce-subtle">🎉</div>
        <h3 className="text-xl font-black text-charcoal mb-2">Abonnement activé !</h3>
        <p className="text-gray-600 text-sm">Redirection vers votre espace…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Test card banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-btn px-4 py-3">
        <p className="text-xs font-semibold text-amber-800 mb-1">🧪 Mode test — Carte de démonstration</p>
        <p className="text-xs text-amber-700 font-mono">4242 4242 4242 4242 · 12/34 · 123 · 00000</p>
      </div>

      {/* Card element */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">
          Informations de carte
        </label>
        <div className="border border-gray-200 rounded-btn px-3 py-3 bg-white focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#1C1C1E",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
              hidePostalCode: true,
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-btn px-4 py-3">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !cardComplete || status === "processing"}
        className="w-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-btn transition-all flex items-center justify-center gap-2"
      >
        {status === "processing" ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours…
          </>
        ) : (
          <>
            🔒 Payer {formatMAD(plan.price)} / mois
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par Stripe · Résiliable à tout moment
      </p>
    </form>
  )
}

interface StripeCheckoutFormProps {
  plan: Plan
}

export function StripeCheckoutForm({ plan }: StripeCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/subscriptions/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planSlug: plan.slug }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Erreur de chargement.")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [plan.slug])

  if (!stripePromise) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-btn px-4 py-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Stripe non configuré</p>
        <p>Ajoutez votre clé <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> dans le fichier <code className="bg-amber-100 px-1 rounded">.env</code> pour activer les paiements.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Initialisation du paiement…</span>
      </div>
    )
  }

  if (loadError || !clientSecret) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-btn px-4 py-4 text-sm text-red-700">
        <p className="font-semibold mb-1">Erreur d&apos;initialisation</p>
        <p>{loadError ?? "Impossible de créer la session de paiement."}</p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#10B981",
            fontFamily: "Inter, sans-serif",
            borderRadius: "8px",
          },
        },
      }}
    >
      <CheckoutFormInner plan={plan} clientSecret={clientSecret} />
    </Elements>
  )
}
