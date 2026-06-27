import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales — Healthy Bowl",
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black">Mentions légales</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Éditeur du site</h2>
          <p><strong>Healthy Bowl SARL</strong></p>
          <p>Campus Universitaire, Avenue Abdelkrim Al Khattabi</p>
          <p>Marrakech 40000, Maroc</p>
          <p>RC : 123456 — IF : 78901234</p>
          <p>Email : legal@healthybowl.ma</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Hébergement</h2>
          <p>Ce site est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, California 94104, États-Unis.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Propriété intellectuelle</h2>
          <p>L&apos;ensemble des contenus (textes, images, logotypes, etc.) présents sur ce site sont la propriété exclusive de Healthy Bowl SARL ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Responsabilité</h2>
          <p>Healthy Bowl SARL s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations présentes sur ce site, mais ne saurait être tenu responsable des erreurs, omissions ou résultats qui pourraient être obtenus par un mauvais usage de ces informations.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-charcoal mb-3">Données personnelles</h2>
          <p>Le traitement de vos données personnelles est régi par notre <a href="/confidentialite" className="text-brand-green underline">Politique de confidentialité</a>. Conformément à la loi marocaine 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.</p>
        </section>
      </div>
    </div>
  )
}
