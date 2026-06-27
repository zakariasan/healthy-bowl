import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Programme de parrainage — Healthy Bowl",
}

export default function ParrainagePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Programme de parrainage</h1>
          <p className="text-brand-light text-xl">Invitez vos amis, gagnez ensemble.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { emoji: "🔗", title: "1. Partagez", desc: "Obtenez votre lien de parrainage unique depuis votre espace compte." },
            { emoji: "👤", title: "2. Votre ami s'inscrit", desc: "Il crée son compte en utilisant votre lien et passe sa première commande." },
            { emoji: "🎁", title: "3. Gagnez 50 points", desc: "Vous recevez 50 points fidélité, l'équivalent de 5 MAD de réduction !" },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-card shadow-card p-6 text-center">
              <div className="text-4xl mb-4">{s.emoji}</div>
              <h3 className="font-bold text-charcoal mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-brand-light rounded-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-brand-green mb-6 text-center">
            Les avantages du parrainage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { who: "Pour vous", benefits: ["50 points fidélité par parrainage", "Pas de limite de parrainages", "Points crédités immédiatement"] },
              { who: "Pour votre ami", benefits: ["Bienvenue dans la communauté HB", "Accès immédiat au Bowl Builder", "Programme de fidélité dès la 1ère commande"] },
            ].map((item) => (
              <div key={item.who} className="bg-white rounded-btn p-5">
                <h3 className="font-bold text-charcoal mb-3">{item.who}</h3>
                <ul className="space-y-2">
                  {item.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-green shrink-0 font-bold">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            Commencez à parrainer dès maintenant
          </h2>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour accéder à votre lien de parrainage unique.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/compte/parrainage">
              <Button size="lg">Accéder à mon lien de parrainage</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">Créer un compte</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
