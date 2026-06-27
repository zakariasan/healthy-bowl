import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre philosophie nutritionnelle — Healthy Bowl",
}

export default function NutritionPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Philosophie nutritionnelle</h1>
          <p className="text-brand-light text-lg">Une alimentation équilibrée, pas une restriction.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section className="bg-white rounded-card shadow-card p-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">🔬 La science derrière nos bowls</h2>
          <p className="text-gray-600 mb-4">
            Chaque bowl est conçu par notre équipe de nutritionnistes pour respecter les recommandations de l&apos;OMS :
            30% de protéines, 45% de glucides complexes et 25% de bonnes graisses pour un repas standard.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Protéines", pct: "30%", color: "bg-blue-500", note: "Récupération & satiété" },
              { label: "Glucides", pct: "45%", color: "bg-orange-400", note: "Énergie durable" },
              { label: "Lipides", pct: "25%", color: "bg-yellow-400", note: "Bonnes graisses" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className={`w-16 h-16 ${m.color} rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-2`}>
                  {m.pct}
                </div>
                <p className="font-semibold text-charcoal text-sm">{m.label}</p>
                <p className="text-xs text-gray-500">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "🌾 Céréales complètes",
              desc: "Quinoa, riz brun, boulgour : des glucides à index glycémique bas pour une énergie stable toute la journée.",
            },
            {
              title: "💪 Protéines de qualité",
              desc: "Sources animales et végétales sélectionnées. Poulet élevé localement, tofu bio, légumineuses riches en fibres.",
            },
            {
              title: "🥑 Graisses essentielles",
              desc: "Avocat, graines, huile d'olive. Les oméga-3 et oméga-9 pour la santé cardiovasculaire.",
            },
            {
              title: "🌿 Micronutriments",
              desc: "Nos légumes frais apportent vitamines, minéraux et antioxydants. Zéro transformation, maximum de nutriments.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-card shadow-card p-6">
              <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-brand-light rounded-card p-8">
          <h2 className="text-2xl font-bold text-brand-green mb-4">14 allergènes sous contrôle</h2>
          <p className="text-gray-700 mb-4">
            Nous affichons systématiquement les 14 allergènes réglementaires sur chaque article.
            Votre profil alimentaire peut exclure automatiquement les ingrédients problématiques.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Gluten", "Lactose", "Œufs", "Arachides", "Fruits à coque", "Soja", "Poisson", "Crustacés", "Céleri", "Moutarde", "Sésame", "Sulfites", "Lupin", "Mollusques"].map((a) => (
              <span key={a} className="text-xs bg-white text-charcoal px-3 py-1 rounded-full border border-brand-green/20">
                {a}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
