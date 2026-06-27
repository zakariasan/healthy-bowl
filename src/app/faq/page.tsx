"use client"

import { useState } from "react"
import type { Metadata } from "next"

const FAQS = [
  { q: "Comment fonctionne le Bowl Builder ?", a: "Le Bowl Builder est un outil en 7 étapes qui vous permet de créer votre bowl 100% personnalisé. Vous choisissez votre base, protéine, toppings, sauce et superfoods. Les macros sont calculées en temps réel à chaque sélection." },
  { q: "Les ingrédients sont-ils frais chaque jour ?", a: "Oui. Nos fournisseurs locaux livrent chaque matin. Tous nos ingrédients sont préparés sur place le jour même. Aucun produit congelé dans nos bowls." },
  { q: "Puis-je personnaliser mon bowl pour mes allergies ?", a: "Absolument. Chaque ingrédient affiche ses allergènes. Depuis votre profil alimentaire, vous pouvez enregistrer vos exclusions et elles seront appliquées automatiquement à vos commandes." },
  { q: "Comment fonctionne l'abonnement ?", a: "L'abonnement vous donne un nombre de crédits repas par mois. Chaque commande utilise un crédit. Les crédits non utilisés expirent en fin de mois. Vous pouvez suspendre votre abonnement jusqu'à 2 fois par an." },
  { q: "Le tarif étudiant, comment ça marche ?", a: "Le plan Étudiant est réservé aux étudiants avec une carte d'étudiant valide. Lors de l'inscription, uploadez votre justificatif. Vérification effectuée sous 24h ouvrées." },
  { q: "Comment gagner des points de fidélité ?", a: "Vous gagnez 1 point pour chaque 10 MAD dépensés. Des points bonus sont accordés pour le parrainage (50 pts) et l'inscription à la newsletter (20 pts). Les points peuvent être échangés contre des récompenses." },
  { q: "Quelle est la politique d'annulation ?", a: "Une commande peut être annulée jusqu'à 5 minutes après sa passation. Passé ce délai, la préparation est déjà lancée et aucun remboursement n'est possible. Contactez-nous en cas de problème particulier." },
  { q: "Proposez-vous la livraison ?", a: "Actuellement, nous proposons la récupération sur place, à emporter et le Click & Collect. La livraison sera bientôt disponible dans un rayon de 3km autour du restaurant." },
  { q: "Les bowls conviennent-ils aux végétaliens ?", a: "Oui ! Nous proposons de nombreuses options veganes. Filtrez par le badge 'Vegan' sur notre menu, ou créez votre bowl avec des protéines végétales (tofu, légumineuses)." },
  { q: "Comment changer mon mot de passe ?", a: "Depuis votre espace compte > Paramètres, vous pouvez modifier votre mot de passe. En cas d'oubli, utilisez le lien 'Mot de passe oublié' sur la page de connexion." },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Questions fréquentes</h1>
          <p className="text-brand-light text-lg">Tout ce que vous voulez savoir sur Healthy Bowl.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-card shadow-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-charcoal">{faq.q}</span>
                <span className={`text-brand-green text-xl shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                  <div className="pt-3">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-brand-light rounded-card p-6 text-center">
          <p className="text-charcoal font-semibold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</p>
          <a href="/contact" className="text-brand-green hover:underline font-medium text-sm">
            Contactez-nous →
          </a>
        </div>
      </div>
    </div>
  )
}
