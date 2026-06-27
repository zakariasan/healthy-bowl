"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Copy,
  Check,
  Clock,
  Zap,
  Users,
  GraduationCap,
  Star,
  Mail,
  ArrowRight,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ── COUNTDOWN TIMER ── */

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownTimer({ endDate, dark = false }: { endDate: Date; dark?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [endDate])

  const units = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ]

  return (
    <div className="flex items-center gap-2" aria-live="polite" aria-label="Temps restant">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="text-center">
            <div
              key={`${label}-${value}`}
              className={`rounded-xl w-14 h-14 flex items-center justify-center text-2xl font-black animate-count-pulse ${
                dark
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-charcoal text-white"
              }`}
            >
              {String(value).padStart(2, "0")}
            </div>
            <p className={`text-xs mt-1 font-medium uppercase tracking-wider ${dark ? "text-white/50" : "text-muted"}`}>
              {label}
            </p>
          </div>
          {i < units.length - 1 && (
            <span className={`text-2xl font-black mb-5 ${dark ? "text-white/30" : "text-muted"}`}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── COPY CODE BUTTON ── */

function CopyCode({ code, dark = true }: { code: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-2.5 rounded-pill px-5 py-2.5 font-mono transition-all hover:scale-105 active:scale-95 ${
        dark
          ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
          : "bg-charcoal/10 border border-charcoal/20 text-charcoal hover:bg-charcoal/15"
      }`}
      aria-label={`Copier le code ${code}`}
    >
      <Tag className="h-4 w-4 opacity-70" />
      <span className="font-black tracking-[0.2em] text-sm">{code}</span>
      {copied ? (
        <span className="flex items-center gap-1 text-xs font-sans font-medium text-brand-glow">
          <Check className="h-3.5 w-3.5" /> Copié !
        </span>
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-60" />
      )}
    </button>
  )
}

/* ── NEWSLETTER SIGNUP ── */

function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus("success")
    } catch {
      setStatus("success") // Optimistic UI even on network error
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4 animate-scale-in">
        <div className="text-5xl mb-3">🎉</div>
        <p className="text-white font-bold text-lg mb-1">Bienvenue dans la famille !</p>
        <p className="text-white/70 text-sm">Votre code <strong className="text-brand-glow">BIENVENUE20</strong> vous attend dans votre boîte mail.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        className="flex-1 px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 text-sm"
      />
      <Button
        type="submit"
        loading={status === "loading"}
        className="bg-white text-violet font-bold hover:bg-white/90 shrink-0"
      >
        Recevoir le code
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  )
}

/* ── MAIN PAGE ── */

export default function PromotionsPage() {
  const flashEndDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(23, 59, 59, 0)
    return d
  }, [])

  // Next Sunday for the weekend deal
  const weekendEndDate = useMemo(() => {
    const d = new Date()
    const day = d.getDay()
    const daysUntilSunday = (7 - day) % 7 || 7
    d.setDate(d.getDate() + daysUntilSunday)
    d.setHours(23, 59, 59, 0)
    return d
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero header ── */}
      <section className="gradient-dark noise relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-coral/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-brand-green/15 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-coral/20 border border-coral/30 rounded-pill px-4 py-1.5 text-sm text-coral font-medium mb-4">
            <Zap className="h-4 w-4" />
            Offres en cours
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            🔥 Promotions &<br />
            <span className="text-gradient">Offres Exclusives</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Toutes nos offres au même endroit. Copiez le code et économisez sur votre prochain bowl.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* ── FLASH DEAL ── */}
        <div className="relative gradient-coral noise rounded-card overflow-hidden">
          <div className="absolute top-4 right-4 bg-white/20 rounded-pill px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">
            Flash Deal
          </div>
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">🔥</span>
                  <div>
                    <div className="text-7xl font-black text-white leading-none">-20%</div>
                    <p className="text-orange-200 text-sm font-medium">sur votre première commande</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
                  Notre offre flash la plus généreuse. Utilisez ce code lors du paiement et économisez instantanément sur votre bowl personnalisé.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <CopyCode code="FLASH20" />
                  <Link href="/builder">
                    <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold">
                      Commander
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-orange-200/60 text-xs mt-3">
                  * Valable sur la 1ère commande uniquement. Non cumulable.
                </p>
              </div>

              {/* Right: countdown */}
              <div className="text-center">
                <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1 justify-center">
                  <Clock className="h-3.5 w-3.5" /> Expire dans
                </p>
                <CountdownTimer endDate={flashEndDate} dark />
              </div>
            </div>
          </div>
        </div>

        {/* ── WEEKEND DEAL ── */}
        <div className="relative overflow-hidden rounded-card border-2 border-brand-leaf bg-white">
          <div className="absolute top-0 left-0 w-full h-1 gradient-green" />
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">🌅</span>
                  <div>
                    <span className="text-xs font-bold text-brand-leaf uppercase tracking-widest">Week-end uniquement</span>
                    <div className="text-5xl font-black text-brand-green leading-none">-15%</div>
                  </div>
                </div>
                <p className="text-muted text-sm mb-4 max-w-sm">
                  Chaque samedi et dimanche, profitez de 15% de réduction sur l&apos;ensemble de la carte. Idéal pour les brunchs et déjeuners en famille.
                </p>
                <div className="flex flex-wrap gap-3">
                  <CopyCode code="WEEKEND15" dark={false} />
                  <Link href="/menu">
                    <Button variant="outline" className="font-bold">Voir le menu</Button>
                  </Link>
                </div>
                <p className="text-muted/70 text-xs mt-3">
                  * Valable les samedis et dimanches. Utilisable plusieurs fois.
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1 justify-center">
                  <Clock className="h-3.5 w-3.5" /> Ce dimanche dans
                </p>
                <CountdownTimer endDate={weekendEndDate} />
              </div>
            </div>
          </div>
        </div>

        {/* ── DEALS GRID: Student + Group + Loyalty ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Student deal */}
          <div className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-card p-6 text-white overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <GraduationCap className="h-8 w-8 mb-3 text-purple-200" />
            <div className="text-5xl font-black mb-1">-15%</div>
            <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-3">Formule Étudiant</p>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              Tarif spécial permanent pour tous les étudiants avec carte valide. Manger sainement ne devrait pas être un luxe.
            </p>
            <div className="space-y-3">
              <CopyCode code="ETUDIANT15" />
              <Link href="/abonnements">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 font-bold text-sm">
                  Formule abonnement étudiant
                </Button>
              </Link>
            </div>
            <p className="text-purple-200/60 text-xs mt-3">* Vérification carte étudiante requise à la première utilisation.</p>
          </div>

          {/* Group deal */}
          <div className="relative bg-gradient-to-br from-sky-600 to-blue-700 rounded-card p-6 text-white overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <Users className="h-8 w-8 mb-3 text-sky-200" />
            <div className="text-5xl font-black mb-1">-10%</div>
            <p className="text-sky-200 text-xs font-bold uppercase tracking-widest mb-3">Commande Groupe</p>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              Commandez 5 bowls ou plus en une seule transaction et bénéficiez automatiquement de la réduction groupe.
            </p>
            <div className="space-y-3">
              <CopyCode code="GROUPE10" />
              <Link href="/groupes">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 font-bold text-sm">
                  Découvrir les packs groupes
                </Button>
              </Link>
            </div>
            <p className="text-sky-200/60 text-xs mt-3">* Applicable dès 5 bowls dans la même commande.</p>
          </div>

          {/* Loyalty double points */}
          <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-card p-6 text-white overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <Star className="h-8 w-8 mb-3 text-yellow-200 fill-yellow-200" />
            <div className="text-5xl font-black mb-1">×2</div>
            <p className="text-yellow-200 text-xs font-bold uppercase tracking-widest mb-3">Points Fidélité</p>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              Ce weekend, chaque bowl vous rapporte le double de points de fidélité. Accumulez et échangez contre des bowls offerts !
            </p>
            <div className="space-y-3">
              <div className="glass-dark rounded-pill px-4 py-2 inline-flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">Points automatiques — pas de code</span>
              </div>
              <Link href="/compte/fidelite">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 font-bold text-sm">
                  Voir mes points fidélité
                </Button>
              </Link>
            </div>
            <p className="text-yellow-200/60 text-xs mt-3">* Double points valables samedi et dimanche cette semaine.</p>
          </div>
        </div>

        {/* ── NEWSLETTER PROMO ── */}
        <div className="relative bg-gradient-to-br from-violet-800 to-charcoal rounded-card p-8 md:p-10 overflow-hidden noise">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-violet/10 blur-[80px]" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <Mail className="h-10 w-10 text-violet mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">
              Recevez le code <span className="text-gradient-gold">BIENVENUE20</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Inscrivez-vous à notre newsletter et recevez instantanément un code de bienvenue pour -20% sur votre première commande. Plus nos offres exclusives chaque semaine.
            </p>
            <NewsletterSignup />
            <p className="text-gray-600 text-xs mt-4">
              Pas de spam. Désinscription en 1 clic. Données protégées RGPD.
            </p>
          </div>
        </div>

        {/* ── ALL CODES SUMMARY ── */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-brand-light">
            <h3 className="font-black text-charcoal text-lg">📋 Récapitulatif des codes actifs</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { code: "FLASH20", desc: "−20% première commande", expires: "Dimanche", emoji: "🔥" },
              { code: "WEEKEND15", desc: "−15% samedi & dimanche", expires: "Tous les weekends", emoji: "🌅" },
              { code: "ETUDIANT15", desc: "−15% avec carte étudiante", expires: "Permanent", emoji: "🎓" },
              { code: "GROUPE10", desc: "−10% dès 5 bowls", expires: "Permanent", emoji: "👥" },
              { code: "BIENVENUE20", desc: "−20% à l'inscription", expires: "Via newsletter", emoji: "🎉" },
            ].map((item) => (
              <div key={item.code} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-mono font-black text-charcoal text-sm tracking-widest">{item.code}</p>
                    <p className="text-muted text-xs">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted hidden sm:block">{item.expires}</span>
                  <CopyCode code={item.code} dark={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center py-8">
          <p className="text-muted mb-4 text-sm">Prêt à commander votre bowl ?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/builder">
              <Button size="lg">
                Composer mon bowl
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline">
                Voir le menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
