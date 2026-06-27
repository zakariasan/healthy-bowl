import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos — Healthy Bowl",
}

const TEAM = [
  { name: "Yasmine El Mansouri", role: "Co-fondatrice & Nutritionniste", emoji: "👩‍⚕️", bio: "Nutritionniste diplômée de Paris, Yasmine a fondé Healthy Bowl pour démocratiser l'accès à une alimentation saine au Maroc." },
  { name: "Mehdi Alaoui", role: "Co-fondateur & CEO", emoji: "👨‍💼", bio: "Entrepreneur serial, Mehdi a dirigé plusieurs startups marocaines avant de se lancer dans la restauration saine." },
  { name: "Fatima Zahra Kadiri", role: "Chef exécutive", emoji: "👩‍🍳", bio: "Formée à l'École Ferrandi Paris, Fatima Zahra apporte son expertise culinaire pour créer des recettes saines et savoureuses." },
  { name: "Amine Bensouda", role: "Responsable Supply Chain", emoji: "🌿", bio: "Passionné d'agriculture durable, Amine gère les relations avec nos 12 fournisseurs locaux et garantit la traçabilité des ingrédients." },
]

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">À propos de nous</h1>
          <p className="text-brand-light text-lg">L&apos;équipe derrière vos bowls.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section className="bg-white rounded-card shadow-card p-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Notre histoire en bref</h2>
          <p className="text-gray-600 leading-relaxed">
            Healthy Bowl a été fondé en 2023 à Marrakech par deux amis partageant la même frustration : l&apos;absence d&apos;une offre de restauration rapide saine, transparente et abordable pour les étudiants et jeunes actifs marocains. Depuis, nous servons plus de 200 bowls par jour et continuons de grandir avec notre communauté.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">Notre équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-card shadow-card p-6 flex gap-4">
                <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center text-3xl shrink-0">
                  {member.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{member.name}</h3>
                  <p className="text-brand-green text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { number: "200+", label: "Bowls par jour" },
            { number: "2023", label: "Année de création" },
            { number: "12", label: "Fournisseurs locaux" },
            { number: "4.8★", label: "Note moyenne" },
          ].map((stat) => (
            <div key={stat.label} className="bg-brand-light rounded-card p-6 text-center">
              <div className="text-3xl font-black text-brand-green">{stat.number}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
