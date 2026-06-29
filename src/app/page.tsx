"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  ArrowRight, Star, Shield, Zap, Leaf, Users, Copy, Check,
  ChevronRight, Building2, GraduationCap, PartyPopper, Flame,
  Timer, Heart, TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DietBadges } from "@/components/ui/badge"
import { formatMAD } from "@/lib/utils"

/* ━━━━━━━━ DATA ━━━━━━━━ */

const TICKER_ITEMS = [
  "🔥 Flash Deal — Code FLASH20 pour -20%",
  "🎓 Formule Étudiant dès 399 MAD/mois",
  "💚 Ingrédients 100% frais & locaux",
  "💪 Points fidélité doublés ce weekend",
  "🥗 Nouveau: Bol Thaï Mango disponible",
  "🎁 1er bowl GRATUIT à l'inscription",
]

const FEATURED_BOWLS = [
  {
    id: "power-bowl",
    name: "Power Bowl",
    tagline: "Énergie & performance",
    description: "Quinoa, poulet grillé, légumes rôtis, avocat crémeux, sauce tahini",
    price: 59,
    kcal: 520,
    protein: 38,
    isHighProtein: true,
    isGlutenFree: true,
    emoji: "💪",
    plateGrad: "gradient-plate-orange",
    tag: "Best-seller",
    tagColor: "bg-amber-500",
  },
  {
    id: "green-goddess",
    name: "Green Goddess",
    tagline: "Détox & légèreté",
    description: "Épinards bio, tofu mariné, edamame, concombre, graines de chia, vinaigrette citronnée",
    price: 55,
    kcal: 420,
    protein: 22,
    isVegan: true,
    isGlutenFree: true,
    emoji: "🌿",
    plateGrad: "gradient-plate-green",
    tag: "Vegan",
    tagColor: "bg-emerald-600",
  },
  {
    id: "thai-mango",
    name: "Bol Thaï Mango",
    tagline: "Saveurs d'Asie",
    description: "Riz jasmin, crevettes sautées, mangue fraîche, coriandre, cacahuètes, sauce nuoc-mâm",
    price: 62,
    kcal: 490,
    protein: 28,
    isGlutenFree: true,
    emoji: "🥭",
    plateGrad: "gradient-plate-coral",
    tag: "Nouveau",
    tagColor: "bg-rose-500",
  },
]

const SUBSCRIPTION_PLANS = [
  { emoji: "🌱", name: "Bowl Starter",  price: 399, meals: 10,  tag: "Idéal pour débuter" },
  { emoji: "💪", name: "Bowl Active",   price: 699, meals: 20,  tag: "Le plus populaire", popular: true },
  { emoji: "⭐", name: "Bowl Premium", price: 999, meals: -1,  tag: "Illimité + smoothie" },
]

const TESTIMONIALS = [
  {
    name: "Sara M.", city: "Casablanca", avatar: "👩‍💼", stars: 5,
    text: "Healthy Bowl pour toute mon équipe depuis 3 mois. La fraîcheur est remarquable — on ne reviendra jamais aux sandwichs !",
    badge: "Abonnée Pro",
  },
  {
    name: "Youssef A.", city: "Marrakech", avatar: "🧑‍🎓", stars: 5,
    text: "Étudiant en médecine, la formule étudiant est une aubaine. Repas équilibrés en 7 minutes pour mes longues journées.",
    badge: "Formule Étudiant",
  },
  {
    name: "Imane B.", city: "Rabat", avatar: "👩‍🍳", stars: 5,
    text: "Le bowl builder est génial ! Je suis mes macros précisément. La transparence nutritionnelle est rare ici.",
    badge: "Bowl Builder Fan",
  },
]

const STEPS = [
  { n: "01", icon: "🥗", title: "Composez",       desc: "Choisissez base, protéine, toppings et sauce parmi des dizaines d'options fraîches." },
  { n: "02", icon: "👤", title: "Profil sauvegardé", desc: "Vos préférences alimentaires sont mémorisées pour commander encore plus vite." },
  { n: "03", icon: "⚡", title: "Commandez",      desc: "Sur place, à emporter ou click & collect. Paiement sécurisé en ligne." },
  { n: "04", icon: "🎉", title: "Savourez !",     desc: "Bowl prêt en moins de 7 min. Chaque ingrédient pesé avec précision." },
]

/* ━━━━━━━━ COMPONENTS ━━━━━━━━ */

function Plate({ emoji, gradient, size, delay = 0, className = "" }: {
  emoji: string; gradient: string; size: number; delay?: number; className?: string
}) {
  return (
    <div
      className={`plate ${gradient} animate-float ${className}`}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    >
      <span className="relative z-10 select-none" style={{ fontSize: size * 0.42 }}>
        {emoji}
      </span>
    </div>
  )
}

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    function calc() {
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 })
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [endDate])

  return (
    <div className="flex items-end gap-2">
      {[{ v: t.d, l: "J" }, { v: t.h, l: "H" }, { v: t.m, l: "M" }, { v: t.s, l: "S" }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="glass-dark rounded-xl w-14 h-14 flex items-center justify-center text-2xl font-black text-white animate-count-pulse tabular-nums">
            {String(v).padStart(2, "0")}
          </div>
          <p className="text-[10px] text-orange-300 mt-1 font-bold uppercase tracking-widest">{l}</p>
        </div>
      ))}
    </div>
  )
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 rounded-pill px-5 py-2.5 font-mono text-sm text-white transition-all hover:scale-105 active:scale-95"
    >
      <span className="font-black tracking-[0.2em]">{code}</span>
      {copied
        ? <Check className="h-4 w-4 text-brand-glow shrink-0" />
        : <Copy className="h-4 w-4 opacity-70 shrink-0" />
      }
    </button>
  )
}

/* ━━━━━━━━ MAIN PAGE ━━━━━━━━ */

export default function HomePage() {
  const flashEnd = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 3); d.setHours(23, 59, 59, 0); return d
  }, [])

  return (
    <div className="overflow-hidden">

      {/* ━━━ 1. PROMO TICKER ━━━ */}
      <div className="bg-navy text-white py-2 overflow-hidden border-b border-white/5">
        <div className="promo-ticker">
          <div className="promo-ticker-track text-xs font-medium">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="shrink-0 px-3 opacity-90">
                {item}
                <span className="mx-4 opacity-30">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ 2. HERO ━━━ */}
      <section className="relative gradient-mesh noise overflow-hidden min-h-[92vh] flex items-center">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-brand-green/10 blur-[140px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-leaf/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-center">

            {/* LEFT: copy */}
            <div>
              <div className="inline-flex items-center gap-2 glass-green rounded-pill px-4 py-1.5 text-sm text-brand-glow font-semibold mb-8 animate-fade-up">
                <Leaf className="h-4 w-4" />
                Casablanca · bientôt
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.0] mb-6 animate-fade-up delay-100">
                Mangez mieux,<br />
                <span className="text-gradient">vivez mieux.</span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed animate-fade-up delay-200">
                Bowls frais composés sur mesure selon votre profil nutritionnel.
                Des ingrédients locaux, zéro additif, prêt en&nbsp;<strong className="text-white">moins de 7&nbsp;minutes</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-300">
                <Link href="/builder">
                  <Button size="xl" className="w-full sm:w-auto bg-brand-green hover:bg-brand-dark text-white font-bold shadow-glow group">
                    Composer mon bowl
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button size="xl" variant="white" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Explorer le menu
                  </Button>
                </Link>
              </div>

              {/* Stats pills */}
              <div className="mt-10 flex flex-wrap gap-3 animate-fade-up delay-400">
                {[
                  { icon: <Timer className="h-3.5 w-3.5" />, value: "< 7 min" },
                  { icon: <Heart className="h-3.5 w-3.5" />, value: "100% frais" },
                  { icon: <Star className="h-3.5 w-3.5 fill-current" />, value: "4.9 / 5" },
                  { icon: <TrendingUp className="h-3.5 w-3.5" />, value: "2 000+ clients" },
                ].map((s) => (
                  <div key={s.value} className="flex items-center gap-1.5 bg-white/8 border border-white/12 rounded-pill px-3 py-1.5 text-xs font-semibold text-slate-300">
                    <span className="text-brand-glow">{s.icon}</span>
                    {s.value}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: plate stack */}
            <div className="relative h-[500px] hidden lg:block animate-fade-in delay-300">
              {/* Back plates (peeking behind) */}
              <div className="absolute top-12 left-16 opacity-60" style={{ filter: "blur(1px)" }}>
                <Plate emoji="🥭" gradient="gradient-plate-coral" size={180} delay={1.5} />
              </div>
              <div className="absolute bottom-8 right-4 opacity-70" style={{ filter: "blur(0.5px)" }}>
                <Plate emoji="🌿" gradient="gradient-plate-teal" size={160} delay={2.5} />
              </div>

              {/* Main center plate */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Plate emoji="🥗" gradient="gradient-plate-green" size={280} delay={0} className="glow-green" />
              </div>

              {/* Floating info cards */}
              <div className="absolute top-6 right-0 z-30 hero-card p-4 w-48 text-left" style={{ animation: "float 4s ease-in-out infinite" }}>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">📊 Macros</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted">Calories</span><span className="font-bold text-navy">420 kcal</span></div>
                  <div className="flex justify-between"><span className="text-muted">Protéines</span><span className="font-bold text-blue-600">28g</span></div>
                  <div className="flex justify-between"><span className="text-muted">Glucides</span><span className="font-bold text-orange-500">38g</span></div>
                  <div className="flex justify-between"><span className="text-muted">Lipides</span><span className="font-bold text-amber-600">14g</span></div>
                </div>
              </div>

              <div className="absolute bottom-16 left-0 z-30 glass rounded-2xl px-3 py-2.5 shadow-hover" style={{ animation: "float 5.5s ease-in-out 1s infinite" }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center animate-pulse-ring">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-navy">Prêt en 7 min</p>
                    <p className="text-[10px] text-muted">Green Goddess Bowl</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 right-2 z-30 glass rounded-2xl px-3 py-2 shadow-lg" style={{ animation: "float 4.5s ease-in-out 0.8s infinite" }}>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-black text-navy text-sm">4.9</span>
                  <span className="text-muted text-[10px]">· 200+ avis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 3. TRUST STRIP ━━━ */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "2 000+", label: "Clients satisfaits", icon: "😊" },
              { value: "4.9★",   label: "Note moyenne",       icon: "⭐" },
              { value: "< 7min", label: "Temps de préparation",icon: "⚡" },
              { value: "0",      label: "Additifs artificiels", icon: "🌿" },
            ].map((s) => (
              <div key={s.label} className="group">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-navy group-hover:text-brand-green transition-colors">{s.value}</div>
                <div className="text-xs text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 4. FEATURED BOWLS ━━━ */}
      <section className="py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-brand-green uppercase tracking-[0.2em] mb-3 px-3 py-1 bg-brand-light rounded-pill">Notre sélection</span>
            <h2 className="text-4xl md:text-5xl font-black text-navy mb-3">
              Bowls <span className="text-gradient">qui font du bien</span>
            </h2>
            <p className="text-muted text-lg">Ou composez le vôtre depuis zéro</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_BOWLS.map((bowl, i) => (
              <div
                key={bowl.id}
                className="group bg-white rounded-[2rem] shadow-card card-lift overflow-hidden animate-fade-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Plate visual */}
                <div className="relative pt-10 pb-8 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                  {/* Decorative ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-slate-100/80 border-8 border-white/60" />
                  </div>
                  <div className="relative z-10">
                    <Plate emoji={bowl.emoji} gradient={bowl.plateGrad} size={140} delay={i * 0.8} />
                  </div>
                  {bowl.tag && (
                    <span className={`absolute top-5 right-5 ${bowl.tagColor} text-white text-xs font-black px-3 py-1 rounded-pill shadow-sm`}>
                      {bowl.tag}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{bowl.tagline}</p>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-xl text-navy">{bowl.name}</h3>
                    <span className="text-brand-green font-black text-xl whitespace-nowrap ml-2">{formatMAD(bowl.price)}</span>
                  </div>
                  <p className="text-muted text-sm mb-4 leading-relaxed">{bowl.description}</p>

                  {/* Macros mini-bar */}
                  <div className="flex gap-3 mb-4 text-xs">
                    <span className="flex items-center gap-1 text-slate-600"><span className="font-bold text-navy">{bowl.kcal}</span> kcal</span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-600"><span className="font-bold text-blue-600">{bowl.protein}g</span> protéines</span>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <DietBadges isVegan={bowl.isVegan} isGlutenFree={bowl.isGlutenFree} isHighProtein={bowl.isHighProtein} />
                  </div>

                  <Link href={`/builder?preset=${bowl.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-brand-green group-hover:text-white group-hover:border-brand-green transition-all font-semibold">
                      Commander ce bowl
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                Voir tout le menu
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 5. FLASH PROMO ━━━ */}
      <section className="relative gradient-coral noise overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0  left-0  w-72 h-72 rounded-full bg-white/5 blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-pill px-4 py-1.5 text-sm text-white font-semibold mb-4">
            <Flame className="h-4 w-4 fill-current" />
            Offre Flash — Durée limitée
          </div>

          <div className="text-5xl mb-2">🔥</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
            -20% sur votre<br />première commande
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Copiez le code et utilisez-le au paiement. Offre valable jusqu&apos;au dimanche.
          </p>

          <div className="flex justify-center mb-8">
            <CountdownTimer endDate={flashEnd} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CopyCode code="FLASH20" />
            <Link href="/menu">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-black shadow-xl w-full sm:w-auto">
                Commander maintenant
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-orange-200/70">* Valable sur la 1ère commande. Non cumulable.</p>
        </div>
      </section>

      {/* ━━━ 6. HOW IT WORKS ━━━ */}
      <section className="py-24 bg-navy relative overflow-hidden noise">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] rounded-full bg-brand-green/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-brand-glow uppercase tracking-[0.2em] mb-3">Simple & rapide</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              Comment ça <span className="text-gradient">marche ?</span>
            </h2>
            <p className="text-slate-400 text-lg">De la commande à votre bowl en moins de 7 minutes</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+3.5rem)] w-[calc(100%-7rem)] h-px bg-gradient-to-r from-brand-green/30 to-brand-green/0 z-0" />
                )}
                <div className="relative z-10 glass-dark rounded-[1.5rem] p-6 text-center hover:border-brand-green/30 transition-colors group">
                  <div className="relative inline-flex mb-5">
                    <div className="h-20 w-20 rounded-2xl bg-navy-mid flex items-center justify-center text-4xl border border-white/8 group-hover:border-brand-green/20 transition-colors">
                      {s.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 h-7 w-7 bg-brand-green text-white text-xs font-black rounded-full flex items-center justify-center shadow-glow-sm">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 7. GROUP MEALS ━━━ */}
      <section className="py-24 bg-navy-mid relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-green rounded-pill px-4 py-1.5 text-sm text-brand-glow font-semibold mb-4">
              <Users className="h-4 w-4" />
              Commandes Groupées
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              Healthy Bowl pour<br /><span className="text-gradient">toute l&apos;équipe</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Des bowls frais pour vos réunions, campus et événements. Une seule commande, prix imbattables.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🏢", icon: Building2,    name: "Pack Entreprise",       size: "5 à 20 personnes", desc: "Commande groupée en 1 clic, facture unique, livraison sur site incluse.", price: "dès 50 MAD/pers", original: "au lieu de 60 MAD", border: "hover:border-sky-500/40" },
              { emoji: "🎓", icon: GraduationCap, name: "Pack Campus Collectif", size: "10+ étudiants",     desc: "Tarif étudiant étendu au groupe. Idéal pour révisions, BDE et sorties de promo.", price: "dès 40 MAD/pers", original: "avec carte étudiant", border: "hover:border-violet-500/40" },
              { emoji: "🎉", icon: PartyPopper,   name: "Pack Événement",        size: "20 à 200 personnes", desc: "Formule traiteur complète: bowls, jus et snacks. Séminaires et inaugurations.", price: "Sur devis", original: "contact direct", border: "hover:border-brand-green/40" },
            ].map((pkg) => (
              <div key={pkg.name} className={`glass-dark rounded-[1.75rem] p-7 border border-white/8 ${pkg.border} transition-all card-lift cursor-pointer`}>
                <div className="text-4xl mb-5">{pkg.emoji}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{pkg.size}</div>
                <h3 className="text-xl font-black text-white mb-3">{pkg.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{pkg.desc}</p>
                <div className="pt-5 border-t border-white/8">
                  <p className="text-xl font-black text-white">{pkg.price}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.original}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/groupes">
              <Button size="lg" variant="white" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Découvrir toutes les formules groupes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 8. TESTIMONIALS ━━━ */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-brand-green uppercase tracking-[0.2em] mb-3 px-3 py-1 bg-brand-light rounded-pill">Témoignages</span>
            <h2 className="text-4xl md:text-5xl font-black text-navy mb-3">
              Ils mangent mieux <span className="text-gradient">chaque jour</span>
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-muted">Note moyenne de 4.9/5 · +200 avis vérifiés</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="bg-white rounded-[1.75rem] p-7 shadow-card card-lift animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-brand-light flex items-center justify-center text-xl shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy text-sm">{t.name}</p>
                    <p className="text-muted text-xs">{t.city}</p>
                  </div>
                  <span className="shrink-0 text-xs bg-brand-light text-brand-green px-2 py-1 rounded-pill font-semibold">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 9. SUBSCRIPTIONS ━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-brand-green uppercase tracking-[0.2em] mb-3 px-3 py-1 bg-brand-light rounded-pill">Abonnements</span>
            <h2 className="text-4xl md:text-5xl font-black text-navy mb-3">
              Abonnez-vous &<br /><span className="text-gradient">économisez</span>
            </h2>
            <p className="text-muted text-lg">Des repas sains chaque jour, sans effort</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-[2rem] p-7 text-center card-lift animate-fade-up ${
                  plan.popular
                    ? "bg-navy text-white border-2 border-brand-green shadow-glow"
                    : "bg-white border-2 border-slate-100 shadow-card"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white text-xs font-black px-5 py-1.5 rounded-pill shadow-glow-sm">
                    ⭐ Le plus populaire
                  </div>
                )}
                <div className="text-5xl mb-4">{plan.emoji}</div>
                <h3 className={`font-black text-xl mb-1 ${plan.popular ? "text-white" : "text-navy"}`}>{plan.name}</h3>
                <p className={`text-xs mb-5 ${plan.popular ? "text-slate-400" : "text-muted"}`}>{plan.tag}</p>
                <div className={`text-4xl font-black mb-0.5 ${plan.popular ? "text-brand-glow" : "text-brand-green"}`}>
                  {plan.price} <span className="text-lg font-bold">MAD</span>
                </div>
                <p className={`text-xs mb-5 ${plan.popular ? "text-slate-500" : "text-muted"}`}>/mois</p>
                <p className={`text-sm font-semibold mb-6 ${plan.popular ? "text-slate-300" : "text-slate-700"}`}>
                  {plan.meals === -1 ? "Repas illimités" : `${plan.meals} repas inclus`}
                </p>
                <Link href="/abonnements">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="sm"
                    className={`w-full font-bold ${plan.popular ? "bg-brand-green hover:bg-brand-dark text-white shadow-glow-sm" : ""}`}
                  >
                    Choisir ce plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted mt-8 flex items-center justify-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand-green" />
            Tarif étudiant disponible avec carte étudiante validée
          </p>
        </div>
      </section>

      {/* ━━━ 10. VALUES ━━━ */}
      <section className="py-24 bg-navy noise relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-green/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold text-brand-glow uppercase tracking-[0.2em]">Notre ADN</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-10 leading-tight">
                Notre engagement<br />envers vous
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <Shield className="h-5 w-5" />, title: "Transparence totale", desc: "Calories, macros et allergènes affichés sur chaque plat. Zéro surprise, zéro fioriture." },
                  { icon: <Zap className="h-5 w-5" />,    title: "Préparation express", desc: "Votre bowl prêt en moins de 7 minutes, sans compromis sur qualité ni fraîcheur." },
                  { icon: <Leaf className="h-5 w-5" />,   title: "Sourcing local & éthique", desc: "Partenariats directs avec producteurs locaux. Circuits courts, prix équitables." },
                  { icon: <Users className="h-5 w-5" />,  title: "Pour tous les profils", desc: "Étudiants, sportifs, végétaliens, intolérants — tout le monde trouve son bowl." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="shrink-0 h-11 w-11 bg-brand-green/10 border border-brand-green/20 rounded-xl flex items-center justify-center text-brand-glow group-hover:bg-brand-green group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark rounded-[2rem] p-9 text-center border border-white/8">
              <div className="text-6xl mb-5">🌍</div>
              <h3 className="text-2xl font-black text-white mb-3">Durabilité & RSE</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Emballages 100% recyclables, objectif zéro gaspillage alimentaire,
                ateliers nutrition gratuits et dons des surplus aux associations locales.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { v: "100%", l: "Emballages recyclables" },
                  { v: "0",    l: "Gaspillage alimentaire" },
                  { v: "12",   l: "Ateliers/an gratuits"  },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-2xl font-black text-brand-glow">{s.v}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-tight">{s.l}</div>
                  </div>
                ))}
              </div>
              <Link href="/durabilite">
                <Button variant="white" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Notre démarche RSE →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 11. FINAL CTA ━━━ */}
      <section className="py-28 gradient-mesh noise relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/3 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/3 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🥗</div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
            Prêt à manger<br /><span className="text-gradient">mieux ?</span>
          </h2>
          <p className="text-slate-400 text-xl mb-3 leading-relaxed">
            Rejoignez +2 000 personnes qui ont transformé leur alimentation.
          </p>
          <p className="text-slate-300 text-lg mb-10">
            Créez votre compte et obtenez le code{" "}
            <span className="font-black text-brand-glow bg-brand-green/20 px-2 py-0.5 rounded">BIENVENUE20</span>{" "}
            — <strong className="text-white">-20%</strong> sur votre première commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-auto bg-brand-green hover:bg-brand-dark text-white font-black shadow-glow">
                Créer mon compte gratuit
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/builder">
              <Button size="xl" className="w-full sm:w-auto bg-white/10 text-white border border-white/25 hover:bg-white/20">
                Essayer sans compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
