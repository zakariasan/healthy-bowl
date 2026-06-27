import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

interface PageProps {
  params: Promise<{ plan: string }>
}

const PLAN_DATA: Record<string, {
  id: string
  name: string
  emoji: string
  price: number
  meals: number
  requiresStudent: boolean
  features: string[]
  description: string
}> = {
  starter: {
    id: "STARTER", name: "Starter", emoji: "🌱", price: 299, meals: 8,
    requiresStudent: false,
    description: "Parfait pour découvrir Healthy Bowl et manger sain 2 fois par semaine.",
    features: ["8 repas / mois", "Accès au menu complet", "Points fidélité x1", "Commande en ligne prioritaire"],
  },
  active: {
    id: "ACTIVE", name: "Active", emoji: "💪", price: 449, meals: 14,
    requiresStudent: false,
    description: "Le plan idéal pour les sportifs et actifs qui mangent sain 3-4 fois par semaine.",
    features: ["14 repas / mois", "1 jus offert par semaine", "Points fidélité x1.5", "File prioritaire au comptoir"],
  },
  premium: {
    id: "PREMIUM", name: "Premium", emoji: "⭐", price: 699, meals: 22,
    requiresStudent: false,
    description: "Pour les vrais passionnés de nutrition. Repas quotidiens + conseils personnalisés.",
    features: ["22 repas / mois", "Jus & Smoothies illimités", "Points fidélité x2", "Conseils nutritionnels mensuels", "Bowl exclusif chaque mois", "File VIP"],
  },
  etudiant: {
    id: "ETUDIANT", name: "Étudiant", emoji: "🎓", price: 199, meals: 10,
    requiresStudent: true,
    description: "Tarif spécial étudiant. Mangez sain sans sacrifier votre budget.",
    features: ["10 repas / mois", "Tarif étudiant (−33%)", "Points fidélité x1", "Commande en ligne"],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { plan } = await params
  const data = PLAN_DATA[plan.toLowerCase()]
  return {
    title: data ? `Abonnement ${data.name} — Healthy Bowl` : "Abonnement — Healthy Bowl",
  }
}

export default async function PlanPage({ params }: PageProps) {
  const { plan } = await params
  const data = PLAN_DATA[plan.toLowerCase()]
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/abonnements" className="text-brand-light hover:text-white text-sm mb-4 inline-block">
            ← Tous les abonnements
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{data.emoji}</span>
            <div>
              <h1 className="text-4xl font-black">Abonnement {data.name}</h1>
              <p className="text-brand-light mt-1">{data.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-4">Ce qui est inclus</h2>
            <div className="space-y-3">
              {data.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span className="text-charcoal">{f}</span>
                </div>
              ))}
            </div>

            {data.requiresStudent && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-btn p-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  🎓 Plan réservé aux étudiants
                </p>
                <p className="text-xs text-blue-700">
                  Ce plan nécessite une carte étudiante valide. Vous devrez uploader votre justificatif lors de la souscription. Vérification sous 24h.
                </p>
              </div>
            )}
          </div>

          <div>
            <Card className="border-2 border-brand-green">
              <CardContent className="text-center py-8">
                <div className="text-5xl mb-4">{data.emoji}</div>
                <h3 className="text-2xl font-black text-charcoal">{data.name}</h3>
                <div className="my-4">
                  <span className="text-4xl font-black text-brand-green">{formatMAD(data.price)}</span>
                  <span className="text-gray-500">/mois</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {data.meals} repas · {formatMAD(Math.round(data.price / data.meals))}/repas
                </p>
                <p className="text-xs text-gray-400 mb-6">Sans engagement · Résiliable à tout moment</p>

                <Link href={`/abonnements/checkout/${plan.toLowerCase()}`}>
                  <Button size="lg" className="w-full">
                    Souscrire avec Stripe →
                  </Button>
                </Link>
                <p className="text-xs text-gray-400 mt-3">
                  Paiement mensuel · Premier prélèvement immédiat
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
