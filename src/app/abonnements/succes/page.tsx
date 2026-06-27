"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter",
  active: "Active",
  premium: "Premium",
  etudiant: "Étudiant",
}

function SuccessContent() {
  const params = useSearchParams()
  const plan = params.get("plan") ?? "starter"
  const planName = PLAN_NAMES[plan] ?? plan

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-card shadow-card p-10 max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-charcoal mb-2">
          Bienvenue dans le plan {planName} !
        </h1>
        <p className="text-gray-600 mb-2">
          Votre abonnement est maintenant actif. Vos crédits repas sont disponibles immédiatement.
        </p>
        <div className="my-6 bg-brand-green/8 border border-brand-green/20 rounded-btn px-5 py-4 text-left space-y-2">
          <p className="text-sm font-semibold text-brand-green">Ce qui vient de se passer côté serveur :</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✅ Stripe a confirmé le paiement (PaymentIntent <code>succeeded</code>)</li>
            <li>✅ L&apos;abonnement a été activé dans la base de données</li>
            <li>✅ Vos crédits repas ont été rechargés</li>
            <li>✅ Renouvellement automatique dans 30 jours</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/menu"
            className="flex-1 bg-brand-green text-white rounded-btn py-3 font-bold hover:bg-brand-green/90 transition-colors"
          >
            Commander maintenant →
          </Link>
          <Link
            href="/compte"
            className="flex-1 border border-gray-200 text-charcoal rounded-btn py-3 font-medium hover:border-gray-300 transition-colors"
          >
            Mon espace
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
