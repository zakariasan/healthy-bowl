import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { formatMAD } from "@/lib/utils"
import { StripeCheckoutForm } from "@/components/subscription/stripe-checkout-form"

interface PageProps {
  params: Promise<{ plan: string }>
}

const PLANS: Record<string, {
  slug: string
  name: string
  emoji: string
  price: number
  meals: number
  perMeal: number
  highlights: string[]
}> = {
  starter: {
    slug: "starter",
    name: "Starter",
    emoji: "🌱",
    price: 299,
    meals: 8,
    perMeal: 37,
    highlights: ["8 repas / mois", "Fidélité x1", "Sans engagement"],
  },
  active: {
    slug: "active",
    name: "Active",
    emoji: "💪",
    price: 449,
    meals: 14,
    perMeal: 32,
    highlights: ["14 repas / mois", "1 jus / semaine offert", "Fidélité x1.5", "File prioritaire"],
  },
  premium: {
    slug: "premium",
    name: "Premium",
    emoji: "⭐",
    price: 699,
    meals: 22,
    perMeal: 32,
    highlights: ["22 repas / mois", "Jus & Smoothies illimités", "Fidélité x2", "Conseils nutritionnels"],
  },
  etudiant: {
    slug: "etudiant",
    name: "Étudiant",
    emoji: "🎓",
    price: 199,
    meals: 10,
    perMeal: 20,
    highlights: ["10 repas / mois", "Tarif étudiant −33%", "Fidélité x1"],
  },
}

export async function generateMetadata({ params }: PageProps) {
  const { plan } = await params
  const data = PLANS[plan?.toLowerCase()]
  return {
    title: data ? `Paiement — ${data.name} — Healthy Bowl` : "Paiement — Healthy Bowl",
  }
}

export default async function CheckoutPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=/abonnements/checkout/${(await params).plan}`)
  }

  const { plan } = await params
  const data = PLANS[plan?.toLowerCase()]
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header strip */}
      <div className="bg-brand-green text-white py-6">
        <div className="max-w-5xl mx-auto px-4">
          <Link href={`/abonnements/${data.slug}`} className="text-green-200 hover:text-white text-sm inline-flex items-center gap-1 mb-2">
            ← Retour au plan
          </Link>
          <h1 className="text-2xl font-black">Paiement — Abonnement {data.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Order summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="font-bold text-charcoal mb-4 text-sm uppercase tracking-wide text-gray-500">
                Récapitulatif
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-green/10 rounded-xl flex items-center justify-center text-3xl">
                  {data.emoji}
                </div>
                <div>
                  <p className="font-black text-charcoal text-lg">Plan {data.name}</p>
                  <p className="text-sm text-gray-500">{data.meals} repas / mois</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {data.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm">
                    <span className="text-brand-green font-bold shrink-0">✓</span>
                    <span className="text-charcoal">{h}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Soit par repas</span>
                  <span>{formatMAD(data.perMeal)}</span>
                </div>
                <div className="flex justify-between font-black text-charcoal text-lg">
                  <span>Total mensuel</span>
                  <span className="text-brand-green">{formatMAD(data.price)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Renouvellement automatique · Résiliable à tout moment</p>
              </div>
            </div>

            {/* Logged-in as */}
            <div className="bg-white rounded-card shadow-card px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">{session.user.name}</p>
                <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
              </div>
              <Link href="/login" className="ml-auto text-xs text-brand-green hover:underline shrink-0">
                Changer
              </Link>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>🔒 Paiement SSL 256-bit</span>
              <span>🛡️ Powered by Stripe</span>
              <span>✅ Sans CB conservée</span>
            </div>
          </div>

          {/* Right: Stripe payment form */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="font-bold text-charcoal mb-6">Payer par carte</h2>
            <StripeCheckoutForm plan={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
