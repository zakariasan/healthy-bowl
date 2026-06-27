import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Abonnements — Healthy Bowl",
  description: "Choisissez votre formule d'abonnement Healthy Bowl et économisez sur vos repas sains.",
}

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    emoji: "🌱",
    price: 299,
    meals: 8,
    color: "border-gray-200",
    highlight: false,
    features: [
      "8 repas / mois",
      "Accès au menu complet",
      "Fidélité x1",
      "Commande en ligne",
    ],
    notIncluded: ["Jus offerts", "Conseils nutritionnels", "Livraison prioritaire"],
  },
  {
    id: "ACTIVE",
    name: "Active",
    emoji: "💪",
    price: 449,
    meals: 14,
    color: "border-brand-green",
    highlight: true,
    features: [
      "14 repas / mois",
      "1 jus offert / semaine",
      "Fidélité x1.5",
      "File prioritaire",
      "Commande en ligne",
    ],
    notIncluded: ["Conseils nutritionnels personnalisés", "Livraison express"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    emoji: "⭐",
    price: 699,
    meals: 22,
    color: "border-earth",
    highlight: false,
    features: [
      "22 repas / mois",
      "Jus & Smoothies illimités",
      "Fidélité x2",
      "Conseils nutritionnels mensuels",
      "File VIP",
      "Bowl exclusif mensuel",
    ],
    notIncluded: [],
  },
  {
    id: "ETUDIANT",
    name: "Étudiant",
    emoji: "🎓",
    price: 199,
    meals: 10,
    color: "border-blue-300",
    highlight: false,
    features: [
      "10 repas / mois",
      "Tarif réduit étudiant",
      "Fidélité x1",
      "Vérification carte étudiante requise",
    ],
    notIncluded: ["Jus offerts", "Conseils nutritionnels"],
  },
]

export default function AbonnementsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Abonnements</h1>
          <p className="text-brand-light text-lg max-w-2xl mx-auto">
            Mangez sain tous les jours sans vous prendre la tête. Choisissez votre formule et économisez jusqu&apos;à 30%.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 ${plan.color} relative flex flex-col ${
                plan.highlight ? "shadow-hover" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              <CardContent className="flex flex-col flex-1 pt-8">
                <div className="text-3xl mb-3">{plan.emoji}</div>
                <h3 className="text-xl font-black text-charcoal">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-black text-brand-green">{formatMAD(plan.price)}</span>
                  <span className="text-gray-500 text-sm">/mois</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>{plan.meals} repas</strong> par mois
                </p>

                <div className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-brand-green font-bold shrink-0">✓</span>
                      <span className="text-charcoal">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="shrink-0">✗</span>
                      <span className="text-gray-500 line-through">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/abonnements/${plan.id.toLowerCase()}`}>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "primary" : "outline"}
                  >
                    Choisir {plan.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-card shadow-card text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-gray-500 font-medium">Fonctionnalité</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="p-4 text-center font-bold text-charcoal">
                      {p.emoji} {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Repas/mois", values: ["8", "14", "22", "10"] },
                  { label: "Prix/repas", values: ["37 MAD", "32 MAD", "32 MAD", "20 MAD"] },
                  { label: "Jus offerts", values: ["✗", "1/semaine", "Illimité", "✗"] },
                  { label: "Fidélité", values: ["x1", "x1.5", "x2", "x1"] },
                  { label: "File prioritaire", values: ["✗", "✓", "VIP", "✗"] },
                  { label: "Conseils nutri", values: ["✗", "✗", "✓", "✗"] },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                    <td className="p-4 text-gray-600 font-medium">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="p-4 text-center text-charcoal">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-card shadow-card p-8">
          <h2 className="text-xl font-bold text-charcoal mb-6">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Puis-je changer de plan ?", a: "Oui, à tout moment depuis votre espace client. Le changement prend effet au prochain cycle." },
              { q: "Les crédits repas sont-ils cumulables ?", a: "Non, les crédits non utilisés expirent à la fin du mois." },
              { q: "Comment fonctionne la vérification étudiante ?", a: "Uploadez votre carte étudiante lors de l'inscription. Vérification sous 24h." },
              { q: "Puis-je suspendre mon abonnement ?", a: "Oui, jusqu'à 2 fois par an depuis votre espace abonnement." },
            ].map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-charcoal mb-1">{item.q}</p>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
