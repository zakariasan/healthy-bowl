import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité — Healthy Bowl",
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black">Politique de confidentialité</h1>
          <p className="text-brand-light mt-2">Dernière mise à jour : janvier 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-700 leading-relaxed">
        {[
          {
            title: "Données collectées",
            content: "Nous collectons les données que vous nous fournissez lors de l'inscription (nom, email, mot de passe haché), de vos commandes (articles, montant, créneau), de votre profil alimentaire (objectifs, allergènes, préférences) et de votre activité sur le site (logs de connexion).",
          },
          {
            title: "Utilisation des données",
            content: "Vos données sont utilisées pour : traiter vos commandes, gérer votre compte et votre fidélité, personnaliser votre expérience (profil alimentaire), vous envoyer des communications si vous y avez consenti, améliorer nos services via des analyses anonymisées.",
          },
          {
            title: "Partage des données",
            content: "Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec nos prestataires techniques (hébergement, paiement) dans le strict cadre de leurs missions, et uniquement si nécessaire.",
          },
          {
            title: "Sécurité",
            content: "Vos mots de passe sont hachés (bcrypt). Les connexions sont sécurisées par HTTPS. Nous utilisons des sessions JWT sécurisées. Vos données de carte bancaire ne transitent jamais par nos serveurs.",
          },
          {
            title: "Conservation des données",
            content: "Vos données de compte sont conservées tant que votre compte est actif. Les données de commande sont conservées 5 ans pour obligations légales. Vous pouvez demander la suppression de votre compte à tout moment.",
          },
          {
            title: "Vos droits",
            content: "Conformément à la loi marocaine 09-08, vous disposez des droits d'accès, de rectification, d'opposition et de suppression de vos données. Pour exercer ces droits, contactez-nous à privacy@healthybowl.ma.",
          },
          {
            title: "Cookies",
            content: "Nous utilisons des cookies essentiels pour le fonctionnement du site (session, authentification) et des cookies analytiques anonymisés. Vous pouvez désactiver ces derniers dans les paramètres de votre navigateur.",
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-charcoal mb-3">{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Contact</h2>
          <p>Pour toute question relative à cette politique : <a href="mailto:privacy@healthybowl.ma" className="text-brand-green underline">privacy@healthybowl.ma</a></p>
        </section>
      </div>
    </div>
  )
}
