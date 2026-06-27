"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { MacroBar } from "@/components/ui/nutrition-label"
import { Badge } from "@/components/ui/badge"
import { formatMAD } from "@/lib/utils"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────────────────────
// Hardcoded ingredient catalogue (kcal/protein/carbs/fat per 100g unless noted)
// ──────────────────────────────────────────────────────────────

interface Ingredient {
  id: string
  name: string
  emoji: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  price: number // in MAD
  isVegan: boolean
  isGlutenFree: boolean
  allergens: string[]
}

const BASES: Ingredient[] = [
  { id: "roquette", name: "Roquette", emoji: "🥬", kcal: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, price: 5, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "epinard", name: "Épinards baby", emoji: "🥬", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, price: 5, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "laitue", name: "Laitue mixte", emoji: "🥗", kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.8, price: 4, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "quinoa", name: "Quinoa", emoji: "🌾", kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, price: 10, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "riz-brun", name: "Riz brun", emoji: "🍚", kcal: 110, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, price: 6, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "boulgour", name: "Boulgour", emoji: "🌾", kcal: 115, protein: 4.3, carbs: 23, fat: 0.6, fiber: 4.5, price: 7, isVegan: true, isGlutenFree: false, allergens: ["GLUTEN"] },
]

const PROTEINS: Ingredient[] = [
  { id: "poulet", name: "Poulet grillé", emoji: "🍗", kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, price: 18, isVegan: false, isGlutenFree: true, allergens: [] },
  { id: "tofu", name: "Tofu grillé", emoji: "🟨", kcal: 144, protein: 17, carbs: 3, fat: 8, fiber: 0.3, price: 12, isVegan: true, isGlutenFree: true, allergens: ["SOJA"] },
  { id: "legumineuses", name: "Pois chiches rôtis", emoji: "🫘", kcal: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 7.6, price: 8, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "saumon", name: "Saumon", emoji: "🐟", kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, price: 24, isVegan: false, isGlutenFree: true, allergens: ["POISSON"] },
  { id: "thon", name: "Thon", emoji: "🐠", kcal: 132, protein: 29, carbs: 0, fat: 1, fiber: 0, price: 16, isVegan: false, isGlutenFree: true, allergens: ["POISSON"] },
]

const TOPPINGS: Ingredient[] = [
  { id: "tomate", name: "Tomates cerises", emoji: "🍅", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, price: 3, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "concombre", name: "Concombre", emoji: "🥒", kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, price: 2, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "avocat", name: "Avocat", emoji: "🥑", kcal: 160, protein: 2, carbs: 9, fat: 15, fiber: 6.7, price: 8, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "betterave", name: "Betterave rôtie", emoji: "🟣", kcal: 43, protein: 1.6, carbs: 9.6, fat: 0.2, fiber: 2.8, price: 3, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "carotte", name: "Carottes râpées", emoji: "🥕", kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, price: 2, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "poivron", name: "Poivrons grillés", emoji: "🫑", kcal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, price: 3, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "champignon", name: "Champignons sautés", emoji: "🍄", kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, price: 4, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "oeuf", name: "Œuf dur", emoji: "🥚", kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, price: 5, isVegan: false, isGlutenFree: true, allergens: ["OEUFS"] },
]

const SAUCES: Ingredient[] = [
  { id: "tahini", name: "Tahini", emoji: "🫙", kcal: 90, protein: 2.7, carbs: 3.2, fat: 8, fiber: 1, price: 4, isVegan: true, isGlutenFree: true, allergens: ["SESAME"] },
  { id: "vinaigrette", name: "Vinaigrette citronnée", emoji: "🍋", kcal: 45, protein: 0.1, carbs: 1, fat: 4.5, fiber: 0, price: 2, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "cesar", name: "Sauce César", emoji: "🫙", kcal: 80, protein: 1.5, carbs: 2, fat: 7.5, fiber: 0, price: 3, isVegan: false, isGlutenFree: false, allergens: ["OEUFS","POISSON"] },
  { id: "yaourt-herbes", name: "Yaourt & Herbes", emoji: "🫙", kcal: 35, protein: 2.5, carbs: 4, fat: 1, fiber: 0, price: 3, isVegan: false, isGlutenFree: true, allergens: ["LACTOSE"] },
  { id: "houmous", name: "Houmous", emoji: "🫙", kcal: 70, protein: 3.5, carbs: 8, fat: 3, fiber: 3, price: 4, isVegan: true, isGlutenFree: true, allergens: ["SESAME"] },
]

const ADDONS: Ingredient[] = [
  { id: "graines-chia", name: "Graines de chia", emoji: "⚫", kcal: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.9, price: 4, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "graines-courge", name: "Graines de courge", emoji: "🟢", kcal: 55, protein: 3, carbs: 1.8, fat: 4.5, fiber: 0.5, price: 4, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "noix", name: "Noix & Amandes", emoji: "🥜", kcal: 65, protein: 2, carbs: 1.5, fat: 6, fiber: 0.7, price: 5, isVegan: true, isGlutenFree: true, allergens: ["FRUITS_A_COQUE"] },
  { id: "spiruline", name: "Spiruline", emoji: "💚", kcal: 10, protein: 1.8, carbs: 0.9, fat: 0.3, fiber: 0.1, price: 5, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "maca", name: "Poudre de Maca", emoji: "🟤", kcal: 15, protein: 0.5, carbs: 3, fat: 0.2, fiber: 0.4, price: 5, isVegan: true, isGlutenFree: true, allergens: [] },
  { id: "fromage", name: "Feta", emoji: "🧀", kcal: 35, protein: 2, carbs: 0.5, fat: 3, fiber: 0, price: 5, isVegan: false, isGlutenFree: true, allergens: ["LACTOSE"] },
]

const PORTION_MULTIPLIERS = { SMALL: 0.75, MEDIUM: 1, LARGE: 1.35 }
const SAUCE_FAT_MULTIPLIERS = { LIGHT: 0.5, MEDIUM: 1, FULL: 1.5 }

const FAT_LABELS = { LIGHT: "Légère", MEDIUM: "Normale", FULL: "Généreuse" }

const STEPS = [
  { id: 1, label: "Base", emoji: "🥬" },
  { id: 2, label: "Protéine", emoji: "💪" },
  { id: 3, label: "Toppings", emoji: "🍅" },
  { id: 4, label: "Sauce", emoji: "🫙" },
  { id: 5, label: "Superfoods", emoji: "✨" },
  { id: 6, label: "Portion", emoji: "📏" },
  { id: 7, label: "Récapitulatif", emoji: "✅" },
]

export default function BuilderPage() {
  const router = useRouter()
  const { dispatch } = useCart()

  const [step, setStep] = useState(1)
  const [base, setBase] = useState<string | null>(null)
  const [protein, setProtein] = useState<string | null>(null)
  const [toppings, setToppings] = useState<string[]>([])
  const [sauce, setSauce] = useState<string | null>(null)
  const [fatLevel, setFatLevel] = useState<"LIGHT" | "MEDIUM" | "FULL">("MEDIUM")
  const [addons, setAddons] = useState<string[]>([])
  const [portion, setPortion] = useState<"SMALL" | "MEDIUM" | "LARGE">("MEDIUM")
  const [bowlName, setBowlName] = useState("Mon bowl")

  // ── Live macro calculation ──────────────────────────────────
  const macros = useMemo(() => {
    const mult = PORTION_MULTIPLIERS[portion]
    const fatMult = sauce ? SAUCE_FAT_MULTIPLIERS[fatLevel] : 1
    const allItems: { ingredient: Ingredient; quantityMult: number }[] = []

    if (base) {
      const b = BASES.find((i) => i.id === base)
      if (b) allItems.push({ ingredient: b, quantityMult: mult })
    }
    if (protein) {
      const p = PROTEINS.find((i) => i.id === protein)
      if (p) allItems.push({ ingredient: p, quantityMult: mult * 0.6 })
    }
    toppings.forEach((tid) => {
      const t = TOPPINGS.find((i) => i.id === tid)
      if (t) allItems.push({ ingredient: t, quantityMult: mult * 0.5 })
    })
    if (sauce) {
      const s = SAUCES.find((i) => i.id === sauce)
      if (s) allItems.push({ ingredient: s, quantityMult: fatMult })
    }
    addons.forEach((aid) => {
      const a = ADDONS.find((i) => i.id === aid)
      if (a) allItems.push({ ingredient: a, quantityMult: 0.3 })
    })

    return allItems.reduce(
      (acc, { ingredient: ing, quantityMult }) => ({
        kcal: acc.kcal + ing.kcal * quantityMult,
        protein: acc.protein + ing.protein * quantityMult,
        carbs: acc.carbs + ing.carbs * quantityMult,
        fat: acc.fat + ing.fat * quantityMult,
        fiber: acc.fiber + ing.fiber * quantityMult,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    )
  }, [base, protein, toppings, sauce, fatLevel, addons, portion])

  const totalPrice = useMemo(() => {
    const mult = PORTION_MULTIPLIERS[portion]
    let price = 0
    if (base) price += (BASES.find((i) => i.id === base)?.price ?? 0) * mult
    if (protein) price += (PROTEINS.find((i) => i.id === protein)?.price ?? 0) * mult
    toppings.forEach((tid) => {
      price += (TOPPINGS.find((i) => i.id === tid)?.price ?? 0)
    })
    if (sauce) price += (SAUCES.find((i) => i.id === sauce)?.price ?? 0)
    addons.forEach((aid) => {
      price += (ADDONS.find((i) => i.id === aid)?.price ?? 0)
    })
    // Base bowl price
    return Math.max(45, price + 20)
  }, [base, protein, toppings, sauce, addons, portion])

  const allergens = useMemo(() => {
    const set = new Set<string>()
    const allIng = [
      ...(base ? [BASES.find((i) => i.id === base)] : []),
      ...(protein ? [PROTEINS.find((i) => i.id === protein)] : []),
      ...toppings.map((t) => TOPPINGS.find((i) => i.id === t)),
      ...(sauce ? [SAUCES.find((i) => i.id === sauce)] : []),
      ...addons.map((a) => ADDONS.find((i) => i.id === a)),
    ].filter(Boolean) as Ingredient[]
    allIng.forEach((ing) => ing.allergens.forEach((a) => set.add(a)))
    return Array.from(set)
  }, [base, protein, toppings, sauce, addons])

  const toggleTopping = (id: string) => {
    setToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    if (step === 1) return !!base
    if (step === 2) return !!protein
    if (step === 4) return !!sauce
    return true
  }

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: `bowl-${Date.now()}`,
        name: bowlName || "Mon bowl personnalisé",
        price: totalPrice,
        quantity: 1,
        isCustomBowl: true,
        customization: { base, protein, toppings, sauce, fatLevel, addons, portion },
        macros: {
          kcal: Math.round(macros.kcal),
          protein: Math.round(macros.protein),
          carbs: Math.round(macros.carbs),
          fat: Math.round(macros.fat),
        },
      },
    })
    router.push("/panier")
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-brand-green text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black mb-2">Créez votre bowl 🥣</h1>
          <p className="text-brand-light text-sm">
            Personnalisez chaque ingrédient — macros calculées en temps réel.
          </p>
        </div>
      </div>

      {/* Live stats bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <MacroBar macros={macros} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              Estimation calories & macros en direct
            </span>
            <span className="font-bold text-brand-green text-lg">
              {formatMAD(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                "flex-1 min-w-[70px] py-2 px-1 rounded-btn text-xs font-medium transition-all flex flex-col items-center gap-1",
                s.id === step
                  ? "bg-brand-green text-white"
                  : s.id < step
                  ? "bg-brand-light text-brand-green cursor-pointer hover:bg-brand-green hover:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <span className="text-base">{s.emoji}</span>
              <span className="hidden sm:block">{s.label}</span>
              <span className="sm:hidden">{s.id}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-card shadow-card p-6 mb-6">
          {step === 1 && (
            <StepBase
              bases={BASES}
              selected={base}
              onSelect={setBase}
            />
          )}
          {step === 2 && (
            <StepRadio
              title="Choisissez votre protéine"
              subtitle="Une source de protéines pour booster votre bowl"
              items={PROTEINS}
              selected={protein}
              onSelect={setProtein}
            />
          )}
          {step === 3 && (
            <StepMultiSelect
              title="Toppings & légumes rôtis"
              subtitle="Sélectionnez autant que vous voulez"
              items={TOPPINGS}
              selected={toppings}
              onToggle={toggleTopping}
            />
          )}
          {step === 4 && (
            <StepSauce
              sauces={SAUCES}
              selected={sauce}
              onSelect={setSauce}
              fatLevel={fatLevel}
              onFatLevel={setFatLevel}
            />
          )}
          {step === 5 && (
            <StepMultiSelect
              title="Superfoods & add-ons"
              subtitle="Boostez vos nutriments"
              items={ADDONS}
              selected={addons}
              onToggle={toggleAddon}
            />
          )}
          {step === 6 && (
            <StepPortion
              portion={portion}
              onSelect={setPortion}
            />
          )}
          {step === 7 && (
            <StepReview
              base={base ? (BASES.find((i) => i.id === base) ?? null) : null}
              protein={protein ? (PROTEINS.find((i) => i.id === protein) ?? null) : null}
              toppings={toppings.map((t) => TOPPINGS.find((i) => i.id === t)!).filter(Boolean)}
              sauce={sauce ? (SAUCES.find((i) => i.id === sauce) ?? null) : null}
              fatLevel={fatLevel}
              addons={addons.map((a) => ADDONS.find((i) => i.id === a)!).filter(Boolean)}
              portion={portion}
              macros={macros}
              allergens={allergens}
              totalPrice={totalPrice}
              bowlName={bowlName}
              onNameChange={setBowlName}
              onAddToCart={addToCart}
            />
          )}
        </div>

        {/* Navigation */}
        {step < 7 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              ← Précédent
            </Button>
            <Button
              onClick={() => setStep((s) => Math.min(7, s + 1))}
              disabled={!canProceed()}
            >
              {step === 6 ? "Voir le récapitulatif →" : "Suivant →"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step components ──────────────────────────────────────────

function StepBase({ bases, selected, onSelect }: {
  bases: Ingredient[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">Choisissez votre base</h2>
      <p className="text-sm text-gray-500 mb-6">La fondation de votre bowl — verts ou céréales</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {bases.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={() => onSelect(item.id)}
            type="radio"
          />
        ))}
      </div>
    </div>
  )
}

function StepRadio({ title, subtitle, items, selected, onSelect }: {
  title: string
  subtitle: string
  items: Ingredient[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={() => onSelect(item.id)}
            type="radio"
          />
        ))}
      </div>
    </div>
  )
}

function StepMultiSelect({ title, subtitle, items, selected, onToggle }: {
  title: string
  subtitle: string
  items: Ingredient[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            selected={selected.includes(item.id)}
            onSelect={() => onToggle(item.id)}
            type="checkbox"
          />
        ))}
      </div>
    </div>
  )
}

function StepSauce({ sauces, selected, onSelect, fatLevel, onFatLevel }: {
  sauces: Ingredient[]
  selected: string | null
  onSelect: (id: string) => void
  fatLevel: "LIGHT" | "MEDIUM" | "FULL"
  onFatLevel: (level: "LIGHT" | "MEDIUM" | "FULL") => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">Choisissez votre sauce</h2>
      <p className="text-sm text-gray-500 mb-6">Et ajustez la quantité de matières grasses</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {sauces.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={() => onSelect(item.id)}
            type="radio"
          />
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-charcoal mb-3">
          Niveau de sauce : <span className="text-brand-green">{FAT_LABELS[fatLevel]}</span>
        </h3>
        <div className="flex gap-3">
          {(["LIGHT", "MEDIUM", "FULL"] as const).map((level) => (
            <button
              key={level}
              onClick={() => onFatLevel(level)}
              className={cn(
                "flex-1 py-3 rounded-btn text-sm font-medium border-2 transition-all",
                fatLevel === level
                  ? "border-brand-green bg-brand-light text-brand-green"
                  : "border-gray-200 text-gray-600 hover:border-brand-green/50"
              )}
            >
              {level === "LIGHT" ? "🥄 Légère" : level === "MEDIUM" ? "🥄🥄 Normale" : "🥄🥄🥄 Généreuse"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepPortion({ portion, onSelect }: {
  portion: "SMALL" | "MEDIUM" | "LARGE"
  onSelect: (p: "SMALL" | "MEDIUM" | "LARGE") => void
}) {
  const options = [
    { id: "SMALL" as const, label: "Petit", emoji: "S", desc: "~350 kcal", note: "Idéal collation" },
    { id: "MEDIUM" as const, label: "Moyen", emoji: "M", desc: "~500 kcal", note: "Repas standard" },
    { id: "LARGE" as const, label: "Grand", emoji: "L", desc: "~700 kcal", note: "Repas sportif" },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">Taille de la portion</h2>
      <p className="text-sm text-gray-500 mb-6">Adaptez la quantité à vos besoins caloriques</p>
      <div className="grid grid-cols-3 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "p-6 rounded-card border-2 text-center transition-all",
              portion === opt.id
                ? "border-brand-green bg-brand-light"
                : "border-gray-200 hover:border-brand-green/50"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-xl font-black mx-auto mb-3">
              {opt.emoji}
            </div>
            <div className="font-bold text-charcoal">{opt.label}</div>
            <div className="text-sm text-brand-green font-medium">{opt.desc}</div>
            <div className="text-xs text-gray-500 mt-1">{opt.note}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepReview({
  base, protein, toppings, sauce, fatLevel, addons, portion,
  macros, allergens, totalPrice, bowlName, onNameChange, onAddToCart,
}: {
  base: Ingredient | null
  protein: Ingredient | null
  toppings: Ingredient[]
  sauce: Ingredient | null
  fatLevel: "LIGHT" | "MEDIUM" | "FULL"
  addons: Ingredient[]
  portion: "SMALL" | "MEDIUM" | "LARGE"
  macros: { kcal: number; protein: number; carbs: number; fat: number; fiber: number }
  allergens: string[]
  totalPrice: number
  bowlName: string
  onNameChange: (name: string) => void
  onAddToCart: () => void
}) {
  const ALLERGEN_LABELS: Record<string, string> = {
    GLUTEN: "Gluten", LACTOSE: "Lactose", OEUFS: "Œufs", ARACHIDES: "Arachides",
    FRUITS_A_COQUE: "Fruits à coque", SOJA: "Soja", POISSON: "Poisson",
    CRUSTACES: "Crustacés", CELERI: "Céleri", MOUTARDE: "Moutarde",
    SESAME: "Sésame", SULFITES: "Sulfites", LUPIN: "Lupin", MOLLUSQUES: "Mollusques",
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-1">Récapitulatif de votre bowl</h2>
      <p className="text-sm text-gray-500 mb-6">Vérifiez votre sélection avant de commander</p>

      {/* Bowl name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-charcoal mb-1">
          Nom de votre bowl (optionnel)
        </label>
        <input
          type="text"
          value={bowlName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 rounded-btn border border-gray-200 focus:outline-none focus:border-brand-green text-sm"
          placeholder="Ex : Mon bowl fétiche"
        />
      </div>

      {/* Composition */}
      <div className="space-y-3 mb-6">
        <ReviewRow label="Base" items={base ? [base] : []} />
        <ReviewRow label="Protéine" items={protein ? [protein] : []} />
        <ReviewRow label="Toppings" items={toppings} />
        <ReviewRow
          label="Sauce"
          items={sauce ? [sauce] : []}
          extra={sauce ? `(${FAT_LABELS[fatLevel]})` : undefined}
        />
        <ReviewRow label="Superfoods" items={addons} />
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span className="text-gray-500 font-medium">Portion</span>
          <span className="font-semibold text-charcoal">
            {portion === "SMALL" ? "Petit (S)" : portion === "MEDIUM" ? "Moyen (M)" : "Grand (L)"}
          </span>
        </div>
      </div>

      {/* Macros */}
      <div className="bg-gray-50 rounded-btn p-4 mb-6">
        <h3 className="font-semibold text-charcoal mb-3">Valeurs nutritionnelles</h3>
        <MacroBar macros={macros} />
        {macros.fiber > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Fibres : {Math.round(macros.fiber)}g
          </p>
        )}
      </div>

      {/* Allergens */}
      {allergens.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-btn p-4 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ Allergènes présents :</p>
          <div className="flex flex-wrap gap-1">
            {allergens.map((a) => (
              <span key={a} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {ALLERGEN_LABELS[a] ?? a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profile note */}
      <div className="bg-brand-light border border-brand-green/20 rounded-btn p-3 mb-6 text-sm text-brand-green">
        💡 <strong>Astuce :</strong> Connectez-vous pour enregistrer votre profil alimentaire et appliquer vos exclusions automatiquement à chaque commande.
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between p-5 bg-white border-2 border-brand-green rounded-card">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-black text-brand-green">{formatMAD(totalPrice)}</p>
        </div>
        <Button size="xl" onClick={onAddToCart}>
          Ajouter au panier →
        </Button>
      </div>
    </div>
  )
}

function ReviewRow({ label, items, extra }: {
  label: string
  items: Ingredient[]
  extra?: string
}) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 text-sm">
      <span className="text-gray-500 font-medium w-24 shrink-0">{label}</span>
      <span className="text-charcoal text-right">
        {items.length === 0
          ? <span className="text-gray-400 italic">Non sélectionné</span>
          : items.map((i) => `${i.emoji} ${i.name}`).join(", ")}
        {extra && <span className="text-gray-500 ml-1">{extra}</span>}
      </span>
    </div>
  )
}

function IngredientCard({ item, selected, onSelect, type }: {
  item: Ingredient
  selected: boolean
  onSelect: () => void
  type: "radio" | "checkbox"
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-3 rounded-card border-2 text-left transition-all w-full",
        selected
          ? "border-brand-green bg-brand-light"
          : "border-gray-200 bg-white hover:border-brand-green/50"
      )}
    >
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xl">{item.emoji}</span>
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 ml-auto shrink-0 flex items-center justify-center",
            type === "radio" ? "rounded-full" : "rounded",
            selected ? "border-brand-green bg-brand-green" : "border-gray-300"
          )}
        >
          {selected && (
            <span className="text-white text-xs leading-none">
              {type === "radio" ? "●" : "✓"}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs font-semibold text-charcoal leading-tight">{item.name}</p>
      <p className="text-xs text-gray-500 mt-1">
        {Math.round(item.kcal)} kcal · P{Math.round(item.protein)}g
      </p>
      {item.allergens.length > 0 && (
        <p className="text-xs text-amber-600 mt-0.5">⚠️ {item.allergens.length} allergène(s)</p>
      )}
      <div className="flex gap-1 mt-1">
        {item.isVegan && <Badge className="text-[10px] px-1 py-0">V</Badge>}
        {item.isGlutenFree && <Badge variant="outline" className="text-[10px] px-1 py-0">SG</Badge>}
      </div>
    </button>
  )
}
