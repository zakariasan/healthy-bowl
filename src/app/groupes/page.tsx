"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Users,
  Building2,
  GraduationCap,
  PartyPopper,
  CheckCircle,
  ChevronRight,
  Mail,
  Calendar,
  Phone,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ── CONSTANTS ── */

const PACKAGES = [
  {
    id: "pro",
    emoji: "🏢",
    icon: Building2,
    name: "Pack Réunion Pro",
    size: "5 à 20 personnes",
    color: "from-slate-800 to-slate-900",
    borderColor: "border-slate-700",
    accentColor: "text-sky",
    badge: "Populaire entreprises",
    badgeBg: "bg-sky/20 text-sky-300",
    price: "dès 50 MAD",
    unit: "/personne",
    original: "au lieu de 60 MAD",
    cta: "Réserver mon repas d'équipe",
    ctaHref: "#contact-form",
    features: [
      "Commande groupée en 1 clic via lien partagé",
      "Chaque membre personnalise son bowl",
      "Une seule facture pour la comptabilité",
      "Prêt en 15 min pour 20 personnes",
      "Livraison sur site incluse",
      "Serviettes et ustensiles fournis",
    ],
  },
  {
    id: "campus",
    emoji: "🎓",
    icon: GraduationCap,
    name: "Pack Campus Collectif",
    size: "10+ étudiants",
    color: "from-violet-900 to-purple-900",
    borderColor: "border-violet-700",
    accentColor: "text-purple-300",
    badge: "Tarif étudiant",
    badgeBg: "bg-violet/20 text-violet-300",
    price: "dès 40 MAD",
    unit: "/personne",
    original: "avec carte étudiant",
    cta: "Commander pour mon groupe",
    ctaHref: "#contact-form",
    features: [
      "Tarif étudiant étendu au groupe entier",
      "Idéal : révisions, sorties de promo, BDE",
      "Lien de commande partageable",
      "Paiement individualisable ou groupé",
      "Options pour tous les régimes alimentaires",
      "Allergènes affichés sur chaque bowl",
    ],
  },
  {
    id: "event",
    emoji: "🎉",
    icon: PartyPopper,
    name: "Pack Événement & Traiteur",
    size: "20 à 200 personnes",
    color: "from-emerald-900 to-teal-900",
    borderColor: "border-emerald-700",
    accentColor: "text-emerald-300",
    badge: "Sur devis",
    badgeBg: "bg-emerald-500/20 text-emerald-300",
    price: "Sur devis",
    unit: "",
    original: "contact direct",
    cta: "Demander un devis",
    ctaHref: "#contact-form",
    features: [
      "Formule traiteur : bowls + jus + snacks",
      "Idéal : séminaires, inaugurations, workshops",
      "Chef dédié et équipe sur place",
      "Personnalisation charte graphique entreprise",
      "Service de nutrition disponible",
      "Devis gratuit sous 24h",
    ],
  },
]

const MEETING_PLANS = [
  {
    tier: "Bronze",
    emoji: "🥉",
    price: 1200,
    meals: "5 repas/sem",
    people: "5 personnes",
    features: [
      "Bowls standards",
      "1 lien partagé",
      "Facturation mensuelle",
      "Support email",
    ],
    highlight: false,
  },
  {
    tier: "Silver",
    emoji: "🥈",
    price: 2200,
    meals: "10 repas/sem",
    people: "10 personnes",
    features: [
      "Bowls premium inclus",
      "Gestion des comptes",
      "Facturation mensuelle",
      "Support prioritaire",
      "Rapport nutritionnel mensuel",
    ],
    highlight: true,
  },
  {
    tier: "Gold",
    emoji: "🥇",
    price: 3800,
    meals: "20 repas/sem",
    people: "Équipe illimitée",
    features: [
      "Menu traiteur étendu",
      "Gestionnaire dédié",
      "Facturation sur mesure",
      "Support 7j/7",
      "Ateliers nutrition trimestriels",
      "Rapport nutritionnel hebdo",
    ],
    highlight: false,
  },
]

const BENEFITS = [
  { icon: "⚡", title: "Commande en 1 clic", desc: "Un lien partagé, chaque membre commande son bowl en quelques secondes." },
  { icon: "🎨", title: "Personnalisation totale", desc: "Chacun choisit sa base, protéine et sauce selon ses préférences." },
  { icon: "🧾", title: "Facture unique", desc: "Une seule transaction pour la comptabilité. Export CSV disponible." },
  { icon: "⏱️", title: "Prêt en 15 min", desc: "Même pour 20 personnes, vos bowls sont prêts ensemble, au même moment." },
  { icon: "🥗", title: "Tous les régimes", desc: "Vegan, sans gluten, halal, végétarien — tout le monde est inclus." },
  { icon: "ℹ️", title: "Allergènes visibles", desc: "Chaque bowl affiche ses allergènes. Zéro risque, zéro malentendu." },
]

/* ── CONTACT FORM ── */

interface FormData {
  company: string
  people: string
  date: string
  email: string
  phone: string
  message: string
}

function GroupContactForm() {
  const [form, setForm] = useState<FormData>({
    company: "",
    people: "10",
    date: "",
    email: "",
    phone: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [serverMsg, setServerMsg] = useState("")

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/groupes/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus("success")
        setServerMsg(data.message)
      } else {
        setStatus("error")
        setServerMsg(data.message ?? "Une erreur est survenue.")
      }
    } catch {
      setStatus("error")
      setServerMsg("Erreur réseau. Veuillez réessayer.")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-black text-white mb-2">Demande envoyée !</h3>
        <p className="text-green-300 text-lg mb-2">{serverMsg}</p>
        <p className="text-gray-400 text-sm">
          Un de nos conseillers vous contactera à l&apos;adresse <strong className="text-white">{form.email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {status === "error" && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-300 text-sm rounded-btn px-4 py-3 animate-fade-in">
          {serverMsg}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Company */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/80">
            Nom de l&apos;entreprise / groupe *
          </label>
          <input
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Ex: Agence XYZ, BDE Centrale..."
            required
            className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-leaf text-sm"
          />
        </div>

        {/* Number of people */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/80">
            Nombre de personnes *
          </label>
          <select
            value={form.people}
            onChange={set("people")}
            required
            className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-leaf text-sm appearance-none cursor-pointer"
          >
            <option value="5-10" className="bg-charcoal">5 – 10 personnes</option>
            <option value="10-20" className="bg-charcoal">10 – 20 personnes</option>
            <option value="20-50" className="bg-charcoal">20 – 50 personnes</option>
            <option value="50-100" className="bg-charcoal">50 – 100 personnes</option>
            <option value="100+" className="bg-charcoal">100+ personnes</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/80">
            <Calendar className="h-3.5 w-3.5 inline mr-1 opacity-70" />
            Date souhaitée
          </label>
          <input
            type="date"
            value={form.date}
            onChange={set("date")}
            className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-leaf text-sm"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/80">
            <Phone className="h-3.5 w-3.5 inline mr-1 opacity-70" />
            Téléphone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+212 6XX XXX XXX"
            className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-leaf text-sm"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/80">
          <Mail className="h-3.5 w-3.5 inline mr-1 opacity-70" />
          Email de contact *
        </label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="contact@votre-entreprise.com"
          required
          className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-leaf text-sm"
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/80">
          Message (optionnel)
        </label>
        <textarea
          value={form.message}
          onChange={set("message")}
          placeholder="Précisez vos besoins : régimes alimentaires, horaire de livraison, fréquence, budget..."
          rows={4}
          className="w-full px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-leaf text-sm resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full bg-brand-leaf hover:bg-brand-green text-white font-black text-base shadow-glow"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            Envoyer ma demande
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-gray-500 text-xs text-center">
        Réponse garantie sous 24h. Devis gratuit et sans engagement.
      </p>
    </form>
  )
}

/* ── MAIN PAGE ── */

export default function GroupesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="relative gradient-dark noise overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-green/15 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-brand-leaf/10 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-pill px-4 py-1.5 text-sm text-brand-glow font-medium mb-5">
            <Users className="h-4 w-4" />
            Commandes groupées & Corporate
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-5">
            Healthy Bowls pour<br />
            <span className="text-gradient">toute votre équipe</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Des repas sains, frais et personnalisés pour vos réunions, événements et campus.
            Une seule commande, des prix imbattables, zéro stress logistique.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact-form">
              <Button size="xl" className="bg-brand-leaf hover:bg-brand-green text-white font-black shadow-glow">
                Obtenir un devis gratuit
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href="#packages">
              <Button
                size="xl"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 font-bold"
              >
                Voir les formules
                <ChevronRight className="h-5 w-5" />
              </Button>
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
            {[
              { value: "< 15 min", label: "Pour 20 personnes" },
              { value: "1 lien", label: "Pour toute l'équipe" },
              { value: "−17%", label: "Sur les offres groupes" },
              { value: "24h", label: "Réponse garantie" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-brand-glow">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Main Packages ── */}
      <section id="packages" className="py-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-glow uppercase tracking-widest">Nos formules</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1 mb-3">
              Choisissez votre pack
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              Que vous soyez une startup de 5 ou une entreprise de 200, nous avons la formule qui convient.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-card bg-gradient-to-br ${pkg.color} border ${pkg.borderColor} overflow-hidden group hover:-translate-y-1 transition-all hover:shadow-2xl`}
              >
                {/* Badge */}
                <div className="absolute top-5 right-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-pill ${pkg.badgeBg}`}>
                    {pkg.badge}
                  </span>
                </div>

                <div className="p-7">
                  <div className="text-5xl mb-4">{pkg.emoji}</div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{pkg.size}</p>
                  <h3 className="text-2xl font-black text-white mb-4">{pkg.name}</h3>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle className="h-4 w-4 text-brand-glow shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="pt-5 border-t border-white/10 mb-5">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-white">{pkg.price}</span>
                      {pkg.unit && <span className="text-white/50 text-sm mb-1">{pkg.unit}</span>}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{pkg.original}</p>
                  </div>

                  <a href={pkg.ctaHref}>
                    <Button className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold">
                      {pkg.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meeting Meal Plans (Subscription) ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-leaf uppercase tracking-widest">Abonnements Corporate</span>
            <h2 className="text-3xl md:text-4xl font-black text-charcoal mt-1 mb-3">
              Repas d&apos;équipe récurrents
            </h2>
            <p className="text-muted max-w-xl mx-auto text-sm">
              Des repas frais et sains chaque semaine pour votre équipe. Sans prise de tête.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MEETING_PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-card p-7 border-2 text-center transition-all hover:-translate-y-1 hover:shadow-hover ${
                  plan.highlight
                    ? "border-brand-green bg-brand-light shadow-card"
                    : "border-gray-100 bg-white shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-green text-white text-xs font-black px-4 py-1 rounded-pill shadow">
                    ⭐ Recommandé
                  </div>
                )}
                <div className="text-4xl mb-3">{plan.emoji}</div>
                <h3 className="font-black text-charcoal text-xl mb-1">{plan.tier}</h3>
                <p className="text-muted text-xs mb-1">{plan.meals} · {plan.people}</p>
                <div className="text-4xl font-black text-brand-green my-4">
                  {plan.price.toLocaleString("fr-MA")} MAD
                  <span className="text-sm font-normal text-muted">/mois</span>
                </div>
                <ul className="space-y-2 mb-6 text-left">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact-form">
                  <Button
                    variant={plan.highlight ? "primary" : "outline"}
                    size="sm"
                    className="w-full font-bold"
                  >
                    Choisir {plan.tier}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-leaf uppercase tracking-widest">Pourquoi choisir Healthy Bowl ?</span>
            <h2 className="text-3xl md:text-4xl font-black text-charcoal mt-1 mb-3">
              Conçu pour simplifier<br />vos repas en groupe
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="flex gap-4 p-5 rounded-card border border-gray-100 hover:border-brand-leaf hover:shadow-card transition-all animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-brand-light flex items-center justify-center text-2xl shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal mb-1">{b.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Testimonial ── */}
      <section className="py-16 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-5">💬</div>
          <blockquote className="text-2xl font-black text-charcoal leading-tight mb-6 italic">
            &ldquo;Depuis qu&apos;on commande Healthy Bowl pour les réunions du lundi, la productivité
            de l&apos;équipe a augmenté et les repas sont un vrai moment de cohésion. Simple, rapide,
            délicieux.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-green flex items-center justify-center text-xl">
              👨‍💼
            </div>
            <div className="text-left">
              <p className="font-bold text-charcoal">Mehdi B.</p>
              <p className="text-muted text-sm">DRH · Agence Digitale Casablanca · 35 employés</p>
            </div>
            <div className="flex gap-0.5 ml-4">
              {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400">★</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section id="contact-form" className="py-20 gradient-dark noise relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-green/10 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-brand-glow uppercase tracking-widest">Contact</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1 mb-3">
              Parlez-nous de votre projet
            </h2>
            <p className="text-gray-400 text-sm">
              Remplissez ce formulaire et notre équipe vous contacte sous 24h avec un devis personnalisé.
            </p>
          </div>

          <div className="glass-dark rounded-card p-8">
            <GroupContactForm />
          </div>

          {/* Direct contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">Ou contactez-nous directement :</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="tel:+212600000000"
                className="flex items-center gap-2 text-brand-glow hover:text-white transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                +212 6 00 00 00 00
              </a>
              <a
                href="mailto:groupes@healthybowl.ma"
                className="flex items-center gap-2 text-brand-glow hover:text-white transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                groupes@healthybowl.ma
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-12 bg-brand-light">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-charcoal font-bold mb-2">Pas encore prêt à vous engager ?</p>
          <p className="text-muted text-sm mb-5">
            Essayez d&apos;abord notre menu standard et commandez pour votre équipe sans abonnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/menu">
              <Button size="lg" variant="primary">
                Voir le menu
              </Button>
            </Link>
            <Link href="/promotions">
              <Button size="lg" variant="outline">
                🔥 Voir les promotions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
