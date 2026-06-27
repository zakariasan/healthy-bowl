import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre concept — Healthy Bowl Marrakech",
  description: "Découvrez la mission, les valeurs et l'histoire de Healthy Bowl.",
}

export default function ConceptPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4">Notre concept</h1>
          <p className="text-xl text-brand-light max-w-2xl mx-auto">
            Healthy Bowl est né d&apos;une conviction simple : manger sain doit être accessible, délicieux et rapide.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-charcoal mb-4">Notre mission 🌿</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Démocratiser la nutrition de qualité au Maroc. Chaque bowl que nous préparons est pensé pour nourrir le corps et l&apos;esprit, sans compromis sur le goût.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nous croyons que la santé commence dans l&apos;assiette — et que cette assiette mérite d&apos;être belle, équilibrée et traçable.
            </p>
          </div>
          <div className="h-64 bg-brand-light rounded-card flex items-center justify-center text-8xl">
            🌱
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-black text-charcoal mb-8 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🥦", title: "Fraîcheur", desc: "Ingrédients livrés chaque matin par nos producteurs locaux." },
              { emoji: "🔬", title: "Transparence", desc: "Macros et allergènes affichés sur chaque article, sans exception." },
              { emoji: "♻️", title: "Durabilité", desc: "Emballages biodégradables, zéro gaspillage, circuit court." },
              { emoji: "🎨", title: "Personnalisation", desc: "Votre alimentation est unique. Votre bowl devrait l'être aussi." },
              { emoji: "🤝", title: "Communauté", desc: "Partenariats locaux, programme d'inclusion étudiant." },
              { emoji: "⚡", title: "Rapidité", desc: "Prêt en 15 minutes, sans sacrifier la qualité." },
            ].map((val) => (
              <div key={val.title} className="bg-white rounded-card shadow-card p-6 text-center">
                <div className="text-4xl mb-3">{val.emoji}</div>
                <h3 className="font-bold text-charcoal mb-2">{val.title}</h3>
                <p className="text-sm text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="bg-white rounded-card shadow-card p-10">
          <h2 className="text-3xl font-black text-charcoal mb-6">Notre histoire</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Fondée en 2023 sur le campus universitaire de Marrakech, Healthy Bowl est née de la frustration partagée par des milliers d&apos;étudiants et de jeunes actifs : impossible de manger sain, rapide et abordable dans la ville.
            </p>
            <p>
              Nos fondateurs, anciens nutritionnistes et entrepreneurs, ont décidé de créer le restaurant qu&apos;ils auraient voulu avoir. Avec une obsession : la qualité des ingrédients, sourcés directement chez des agriculteurs bio de la région Marrakech-Safi.
            </p>
            <p>
              Aujourd&apos;hui, Healthy Bowl sert plus de 200 bowls par jour et construit une communauté autour d&apos;une alimentation consciente et savoureuse.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
