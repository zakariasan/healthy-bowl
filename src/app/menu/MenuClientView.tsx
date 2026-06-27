"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { formatMAD } from "@/lib/utils"
import { MENU_CATEGORIES, FITNESS_SPOTS, type MenuItem, type DietTag, type GoalTag } from "@/lib/menu-data"

const GOAL_FILTERS: { label: string; value: GoalTag | "tous" }[] = [
  { label: "Tous", value: "tous" },
  { label: "Perte de poids 🔥", value: "perte-poids" },
  { label: "Prise de masse 💪", value: "prise-masse" },
  { label: "Énergie ⚡", value: "energie" },
  { label: "Famille 👨‍👩‍👧‍👦", value: "famille" },
  { label: "Étudiant 🎓", value: "étudiant" },
]

const DIET_BADGE_CONFIG: Record<DietTag, { label: string; className: string }> = {
  vegan: { label: "🌱 Vegan", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  "high-protein": { label: "⚡ Protéines", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  "gluten-free": { label: "GF", className: "bg-gray-100 text-gray-600 border border-gray-300" },
  moroccan: { label: "🇲🇦 Marocain", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  fitness: { label: "💪 Fitness", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  new: { label: "Nouveau ✨", className: "bg-purple-50 text-purple-700 border border-purple-200" },
  popular: { label: "⭐ Populaire", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
}

const SPOT_TYPE_COLORS: Record<string, string> = {
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
}

const MOROCCAN_SLUG = "BOWLS_MAROCAINS"
const BOXES_SLUG = "BOXES_FAMILLE"

interface DBCategory {
  id: string
  slug: string
  name: string
}

export default function MenuClientView({ categories: _categories }: { categories: DBCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(MENU_CATEGORIES[0].slug)
  const [activeGoal, setActiveGoal] = useState<GoalTag | "tous">("tous")
  const [search, setSearch] = useState("")

  const activeCategory = useMemo(
    () => MENU_CATEGORIES.find((c) => c.slug === activeSlug) ?? MENU_CATEGORIES[0],
    [activeSlug]
  )

  const filteredItems = useMemo(() => {
    let items = activeCategory.items
    if (activeGoal !== "tous") {
      items = items.filter((item) => item.goals.includes(activeGoal))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [activeCategory, activeGoal, search])

  const isMoroccan = activeCategory.slug === MOROCCAN_SLUG
  const isBoxes = activeCategory.slug === BOXES_SLUG

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* ── Sticky category nav ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scroll-x">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setActiveSlug(cat.slug); setSearch("") }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSlug === cat.slug
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-gray-100 text-charcoal hover:bg-brand-light hover:text-brand-green"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* ── Search + Goal filters ── */}
        <div className="py-6 space-y-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans le menu..."
            className="w-full max-w-md px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition"
          />
          <div className="flex flex-wrap gap-2">
            {GOAL_FILTERS.map((g) => (
              <button
                key={g.value}
                onClick={() => setActiveGoal(g.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeGoal === g.value
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-muted border-gray-200 hover:border-brand-green hover:text-brand-green"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Moroccan header band ── */}
        {isMoroccan && (
          <div className="gradient-warm rounded-card mb-8 px-8 py-6 flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-amber-100 text-xs uppercase tracking-widest font-semibold mb-1">Héritage culinaire</p>
              <h2 className="text-white text-3xl font-black">Nos racines, revisitées</h2>
              <p className="text-amber-200 mt-1 text-sm">Recettes ancestrales marocaines, nutrition moderne</p>
            </div>
            <div className="text-8xl opacity-20 absolute right-6 top-1/2 -translate-y-1/2 select-none">🇲🇦</div>
          </div>
        )}

        {/* ── Category title (non-moroccan) ── */}
        {!isMoroccan && !isBoxes && (
          <div className="mb-6">
            <h2 className="text-2xl font-black text-charcoal flex items-center gap-2">
              <span>{activeCategory.emoji}</span>
              <span>{activeCategory.name}</span>
            </h2>
            <p className="text-muted text-sm mt-0.5">{activeCategory.description}</p>
          </div>
        )}

        {/* ── BOXES special layout ── */}
        {isBoxes ? (
          <BoxesSection items={filteredItems} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">Aucun résultat pour votre recherche</p>
              </div>
            )}
          </div>
        )}

        {/* ── FITNESS SPOTS section ── */}
        <FitnessSpotsSection />

        {/* ── Builder CTA ── */}
        <div className="mt-16 bg-brand-dark rounded-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 gradient-mesh" />
          <div className="relative z-10">
            <span className="text-5xl mb-4 block">🥣</span>
            <h3 className="text-3xl font-black text-white mb-2">Compose ton bowl idéal</h3>
            <p className="text-brand-leaf mb-6 max-w-md mx-auto text-sm">
              7 étapes, macros en temps réel, 100% personnalisé. Ton bowl, tes règles.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-leaf transition-colors shadow-lg"
            >
              Composer mon bowl →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const DISPLAY_TAGS: DietTag[] = ["moroccan", "vegan", "high-protein", "gluten-free", "fitness", "new"]
  const visibleTags = item.tags.filter((t) => DISPLAY_TAGS.includes(t)).slice(0, 3)

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 flex flex-col card-lift overflow-hidden relative">
      {/* Popular badge */}
      {item.popular && (
        <span className="absolute top-3 right-3 z-10 bg-brand-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
          ⭐ Populaire
        </span>
      )}

      {/* Gradient image area */}
      <div className={`h-28 ${item.gradient} flex items-center justify-center`}>
        <span className="text-5xl drop-shadow-sm">{item.emoji}</span>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-charcoal text-sm leading-tight">{item.name}</h3>
          <span className="text-brand-green font-black text-sm whitespace-nowrap">{formatMAD(item.price)}</span>
        </div>

        {item.origin && (
          <p className="text-[10px] text-amber-600 font-medium mb-1">📍 {item.origin}</p>
        )}

        <p className="text-xs text-muted leading-relaxed mb-3 flex-1">{item.description}</p>

        {/* Macros */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-charcoal mb-3 flex gap-3 flex-wrap">
          <span className="font-bold">{item.macros.kcal} kcal</span>
          <span className="text-muted">P {item.macros.protein}g</span>
          <span className="text-muted">G {item.macros.carbs}g</span>
          <span className="text-muted">L {item.macros.fat}g</span>
        </div>

        {/* Diet badges */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {visibleTags.map((tag) => {
              const cfg = DIET_BADGE_CONFIG[tag]
              return (
                <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
                  {cfg.label}
                </span>
              )
            })}
          </div>
        )}

        {/* Size badge */}
        {item.size && (
          <p className="text-[10px] text-muted mb-3">📏 {item.size}</p>
        )}

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          {item.customizable ? (
            <>
              <Link
                href="/builder"
                className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-btn bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white transition-all"
              >
                Personnaliser
              </Link>
              <button className="flex-1 text-xs font-semibold px-3 py-2 rounded-btn bg-brand-green text-white hover:bg-brand-dark transition-all">
                Commander
              </button>
            </>
          ) : (
            <button className="w-full text-xs font-semibold px-3 py-2 rounded-btn bg-brand-green text-white hover:bg-brand-dark transition-all">
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BoxesSection({ items }: { items: MenuItem[] }) {
  const SAVINGS: Record<string, number> = {
    "bf-couple": 20,
    "bf-famille-4": 60,
    "bf-etudiant-semaine": 40,
    "bf-post-training": 15,
    "bf-pique-nique": 18,
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-charcoal flex items-center gap-2">
          <span>📦</span>
          <span>Boxes & Packs</span>
        </h2>
        <p className="text-muted text-sm mt-0.5">Partagez, économisez, régalez-vous</p>
      </div>
      {items.map((item) => {
        const savings = SAVINGS[item.id]
        return (
          <div
            key={item.id}
            className="bg-white rounded-card shadow-card border border-gray-100 card-lift overflow-hidden flex gap-0 relative"
          >
            <div className={`w-24 sm:w-32 flex-shrink-0 ${item.gradient} flex items-center justify-center`}>
              <span className="text-4xl">{item.emoji}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-charcoal text-lg leading-tight">{item.name}</h3>
                <div className="text-right flex-shrink-0">
                  <span className="block text-brand-green font-black text-xl">{formatMAD(item.price)}</span>
                  {savings && (
                    <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-bold">
                      Économie {formatMAD(savings)}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-3">{item.description}</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-charcoal mb-4 inline-flex gap-3 w-fit">
                <span className="font-bold">{item.macros.kcal} kcal total</span>
                <span className="text-muted">P {item.macros.protein}g</span>
                <span className="text-muted">G {item.macros.carbs}g</span>
              </div>
              <div className="flex gap-2 mt-auto">
                {item.customizable && (
                  <Link
                    href="/builder"
                    className="text-xs font-semibold px-4 py-2 rounded-btn bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white transition-all"
                  >
                    Personnaliser
                  </Link>
                )}
                <button className="text-xs font-bold px-6 py-2 rounded-btn bg-brand-green text-white hover:bg-brand-dark transition-all">
                  Commander ce pack →
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FitnessSpotsSection() {
  return (
    <div className="mt-16 bg-navy rounded-card overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-white text-2xl font-black flex items-center gap-2">
              🏟️ Livraison aux spots fitness
            </h3>
            <p className="text-gray-400 text-sm mt-1">On livre directement à votre salle de sport ou stade</p>
          </div>
          <button className="text-sm font-bold bg-brand-green text-white px-5 py-2.5 rounded-full hover:bg-brand-leaf transition-colors">
            Commander pour après la session →
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FITNESS_SPOTS.map((spot) => {
          const dotColor = SPOT_TYPE_COLORS[spot.color] ?? "bg-gray-500"
          return (
            <div
              key={spot.id}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${dotColor}/20`}>
                  {spot.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate">{spot.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{spot.area}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-brand-leaf font-semibold">⏱ {spot.deliveryTime}</span>
                <span className="text-gray-500">{spot.distance}</span>
                <span className="text-gray-500">{spot.schedule}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
