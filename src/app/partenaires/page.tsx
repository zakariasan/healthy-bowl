import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Nos partenaires — Healthy Bowl",
}

const PARTNER_TYPE_LABELS: Record<string, string> = {
  GYM: "Salle de sport",
  UNIVERSITY: "Université",
  NUTRITIONIST: "Nutritionniste",
  PRODUCER: "Producteur local",
}

const FALLBACK_PARTNERS = [
  { id: "1", type: "GYM", name: "Atlas Fitness Marrakech", description: "Partenaire sport — -10% sur votre abonnement HB avec votre carte membre.", logo: "🏋️" },
  { id: "2", type: "UNIVERSITY", name: "Université Cadi Ayyad", description: "Partenaire université — tarif étudiant exclusif pour les étudiants vérifiés.", logo: "🎓" },
  { id: "3", type: "NUTRITIONIST", name: "Dr. Sarah Benali", description: "Nutritionniste partenaire — consultation offerte pour les abonnés Premium.", logo: "🥦" },
  { id: "4", type: "PRODUCER", name: "Coopérative Al Khadra", description: "Fournisseur légumes bio — partenariat direct depuis 2023.", logo: "🌿" },
]

export default async function PartenairesPage() {
  let partners = FALLBACK_PARTNERS
  try {
    const dbPartners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
    if (dbPartners.length > 0) {
      partners = dbPartners.map((p) => ({
        id: p.id,
        type: p.type as string,
        name: p.name,
        description: p.description ?? "",
        logo: "🤝",
      }))
    }
  } catch {}

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Nos partenaires</h1>
          <p className="text-brand-light text-lg">
            Un réseau de partenaires qui partagent nos valeurs de santé, durabilité et communauté.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-card shadow-card p-6 flex gap-4 items-start">
              <div className="w-14 h-14 bg-brand-light rounded-btn flex items-center justify-center text-3xl shrink-0">
                {partner.logo ?? "🤝"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-charcoal">{partner.name}</h3>
                  <span className="text-xs bg-brand-light text-brand-green px-2 py-0.5 rounded-full">
                    {PARTNER_TYPE_LABELS[partner.type] ?? partner.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand-light rounded-card p-8 text-center">
          <h2 className="text-xl font-bold text-brand-green mb-3">Devenir partenaire</h2>
          <p className="text-gray-700 mb-4">
            Vous représentez une salle de sport, une université ou une entreprise engagée pour la santé ?
            Rejoignez notre réseau de partenaires.
          </p>
          <a href="/contact" className="inline-block bg-brand-green text-white px-6 py-3 rounded-btn font-semibold hover:bg-brand-green/90 transition-colors">
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  )
}
