import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions générales de vente — Healthy Bowl",
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black">Conditions générales de vente</h1>
          <p className="text-brand-light mt-2">Dernière mise à jour : janvier 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
        {[
          {
            title: "Article 1 — Objet",
            content: "Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits alimentaires effectuées par Healthy Bowl SARL via son site internet healthybowl.ma et son application mobile.",
          },
          {
            title: "Article 2 — Prix",
            content: "Les prix sont indiqués en Dirham marocain (MAD) toutes taxes comprises. Healthy Bowl se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés au prix en vigueur au moment de la validation de la commande.",
          },
          {
            title: "Article 3 — Commande",
            content: "La commande est validée après confirmation par email ou notification. Healthy Bowl se réserve le droit d'annuler toute commande pour des raisons légitimes (rupture de stock, problème technique, etc.).",
          },
          {
            title: "Article 4 — Paiement",
            content: "Le paiement est effectué en espèces ou par carte bancaire au comptoir lors de la récupération. Le paiement en ligne par carte sera disponible prochainement.",
          },
          {
            title: "Article 5 — Annulation et remboursement",
            content: "Une commande peut être annulée dans les 5 minutes suivant sa passation. Passé ce délai, aucun remboursement ne sera accordé sauf en cas de problème avéré de notre côté (article non conforme, allergie déclarée non respectée, etc.).",
          },
          {
            title: "Article 6 — Allergènes",
            content: "Bien que nous affichions les 14 allergènes réglementaires, nos produits sont préparés dans une cuisine où sont utilisés des allergènes communs. Nous ne pouvons garantir l'absence totale de traces d'allergènes pour les personnes souffrant d'allergies sévères.",
          },
          {
            title: "Article 7 — Litiges",
            content: "En cas de litige, nous vous invitons à nous contacter en premier lieu à l'adresse bonjour@healthybowl.ma. En cas de désaccord persistant, les tribunaux marocains compétents seront saisis.",
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-charcoal mb-3">{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
