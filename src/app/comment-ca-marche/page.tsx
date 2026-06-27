import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Comment ça marche — Healthy Bowl",
}

const STEPS = [
  {
    number: "01",
    title: "Choisissez votre bowl",
    desc: "Parcourez notre menu ou créez votre bowl 100% personnalisé avec le Bowl Builder. Chaque ingrédient est sélectionné pour ses valeurs nutritionnelles.",
    emoji: "🥗",
  },
  {
    number: "02",
    title: "Personnalisez vos macros",
    desc: "Ajustez base, protéines, toppings et sauce. Visualisez vos macros en temps réel. Votre profil alimentaire applique vos préférences automatiquement.",
    emoji: "📊",
  },
  {
    number: "03",
    title: "Commandez en ligne",
    desc: "Commandez depuis l'app, choisissez votre créneau horaire et votre mode de récupération (sur place, à emporter ou Click & Collect).",
    emoji: "📱",
  },
  {
    number: "04",
    title: "Récupérez votre bowl",
    desc: "Votre bowl est préparé fraîchement en 15 minutes. Suivez la préparation en temps réel et récupérez-le dès qu'il est prêt.",
    emoji: "✅",
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4">Comment ça marche ?</h1>
          <p className="text-xl text-brand-light">Simple, rapide, sain. En 4 étapes.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-8 mb-16">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-brand-green rounded-card flex items-center justify-center text-white text-2xl font-black">
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 h-8 bg-brand-light mx-auto mt-2" />
                )}
              </div>
              <div className="bg-white rounded-card shadow-card p-6 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{step.emoji}</span>
                  <h3 className="text-xl font-bold text-charcoal">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-light rounded-card p-10 text-center">
          <h2 className="text-2xl font-bold text-brand-green mb-4">Prêt à commencer ?</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/builder">
              <Button size="lg">Créer mon bowl →</Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" size="lg">Voir le menu</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
