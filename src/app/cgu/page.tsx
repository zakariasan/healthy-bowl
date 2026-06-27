import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Healthy Bowl",
}

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black">Conditions générales d&apos;utilisation</h1>
          <p className="text-brand-light mt-2">Dernière mise à jour : janvier 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-700 leading-relaxed">
        {[
          {
            title: "1. Acceptation des CGU",
            content: "L'utilisation du site healthybowl.ma implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation. Ces CGU peuvent être modifiées à tout moment ; les utilisateurs sont invités à les consulter régulièrement.",
          },
          {
            title: "2. Accès au service",
            content: "Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Healthy Bowl se réserve le droit de suspendre, limiter ou interrompre l'accès au site pour des raisons de maintenance ou de force majeure.",
          },
          {
            title: "3. Création de compte",
            content: "Pour accéder à certains services (commande, fidélité, abonnement), vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants. Toute utilisation frauduleuse doit être signalée immédiatement.",
          },
          {
            title: "4. Comportement de l'utilisateur",
            content: "Il est interdit d'utiliser le site à des fins illégales, de tenter de perturber le fonctionnement du service, de publier des contenus offensants, ou d'usurper l'identité d'une autre personne.",
          },
          {
            title: "5. Propriété intellectuelle",
            content: "Tous les contenus du site sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite.",
          },
          {
            title: "6. Limitation de responsabilité",
            content: "Healthy Bowl ne saurait être tenu responsable des dommages indirects liés à l'utilisation du site. La responsabilité totale de Healthy Bowl est limitée au montant de la commande concernée.",
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
