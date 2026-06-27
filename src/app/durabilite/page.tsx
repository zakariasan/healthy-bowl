import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Durabilité & RSE — Healthy Bowl",
}

export default function DurabilitePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Durabilité & RSE</h1>
          <p className="text-brand-light text-lg">Notre engagement pour une restauration responsable.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {[
          {
            emoji: "🌱",
            title: "Agriculture locale & bio",
            desc: "80% de nos ingrédients proviennent d'agriculteurs de la région Marrakech-Safi. Circuits courts, zéro transport longue distance. Nous travaillons avec 4 coopératives agricoles locales certifiées bio.",
          },
          {
            emoji: "♻️",
            title: "Zéro déchet alimentaire",
            desc: "Nos invendus de fin de journée sont donnés à l'association locale 'Faim Zéro'. Notre compost est reversé aux agriculteurs partenaires. Objectif : moins de 2% de gaspillage alimentaire.",
          },
          {
            emoji: "📦",
            title: "Emballages 100% biodégradables",
            desc: "Bowls en canne à sucre, couverts en bois FSC, sacs en papier kraft recyclé. Nous avons éliminé tout plastique à usage unique depuis janvier 2024.",
          },
          {
            emoji: "💧",
            title: "Gestion de l'eau",
            desc: "Nos cuisines utilisent 40% moins d'eau que la moyenne du secteur. Système de récupération d'eau de rinçage pour l'arrosage de notre jardin d'herbes aromatiques.",
          },
          {
            emoji: "🤝",
            title: "Impact social",
            desc: "Emploi local prioritaire, tarif étudiant accessible, partenariat avec des programmes d'insertion. 5% de nos bénéfices sont reversés à des associations d'éducation nutritionnelle.",
          },
          {
            emoji: "⚡",
            title: "Énergie renouvelable",
            desc: "Notre restaurant est alimenté à 100% par de l'énergie solaire. Installation de panneaux photovoltaïques en toiture réalisée en 2023.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-card shadow-card p-6 flex gap-5 items-start">
            <span className="text-4xl shrink-0">{item.emoji}</span>
            <div>
              <h3 className="font-bold text-charcoal text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
