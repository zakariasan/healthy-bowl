"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const GOALS = [
  { id: "PERTE_DE_POIDS", label: "Perte de poids", emoji: "📉" },
  { id: "PRISE_DE_MASSE", label: "Prise de masse", emoji: "💪" },
  { id: "MAINTIEN", label: "Maintien", emoji: "⚖️" },
  { id: "ENERGIE", label: "Énergie", emoji: "⚡" },
]

const TASTE_PREFS = [
  { id: "SALE", label: "Salé" },
  { id: "ACIDULE", label: "Acidulé" },
  { id: "EPICE", label: "Épicé" },
  { id: "DOUX", label: "Doux" },
]

const ALLERGENS = [
  { id: "GLUTEN", label: "Gluten" },
  { id: "LACTOSE", label: "Lactose" },
  { id: "OEUFS", label: "Œufs" },
  { id: "ARACHIDES", label: "Arachides" },
  { id: "FRUITS_A_COQUE", label: "Fruits à coque" },
  { id: "SOJA", label: "Soja" },
  { id: "POISSON", label: "Poisson" },
  { id: "CRUSTACES", label: "Crustacés" },
  { id: "CELERI", label: "Céleri" },
  { id: "MOUTARDE", label: "Moutarde" },
  { id: "SESAME", label: "Sésame" },
  { id: "SULFITES", label: "Sulfites" },
  { id: "LUPIN", label: "Lupin" },
  { id: "MOLLUSQUES", label: "Mollusques" },
]

interface ProfileForm {
  goal: string
  tastePrefs: string[]
  defaultPortion: "SMALL" | "MEDIUM" | "LARGE"
  sauceFatLevel: "LIGHT" | "MEDIUM" | "FULL"
  allergens: string[]
  excludedIngredients: string
}

export default function ProfilAlimentairePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [excludedTags, setExcludedTags] = useState<string[]>([])

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      goal: "MAINTIEN",
      tastePrefs: [],
      defaultPortion: "MEDIUM",
      sauceFatLevel: "MEDIUM",
      allergens: [],
      excludedIngredients: "",
    },
  })

  useEffect(() => {
    fetch("/api/compte/profil")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const p = json.data
          reset({
            goal: p.goal,
            tastePrefs: p.tastePrefs ?? [],
            defaultPortion: p.defaultPortion,
            sauceFatLevel: p.sauceFatLevel,
            allergens: p.exclusionRules?.filter((r: { type: string }) => r.type === "allergen").map((r: { allergen: string }) => r.allergen) ?? [],
            excludedIngredients: "",
          })
          setExcludedTags(
            p.exclusionRules?.filter((r: { type: string }) => r.type === "ingredient").map((r: { ingredient: { name: string } }) => r.ingredient?.name ?? "") ?? []
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [reset])

  const addTag = () => {
    const val = tagInput.trim()
    if (val && !excludedTags.includes(val)) {
      setExcludedTags([...excludedTags, val])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => setExcludedTags(excludedTags.filter((t) => t !== tag))

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/compte/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, excludedIngredientIds: [] }),
      })
      const json = await res.json()
      if (json.success) setSuccess(true)
    } catch {}
    finally { setSaving(false) }
  }

  const currentAllergens = watch("allergens") ?? []
  const currentTastePrefs = watch("tastePrefs") ?? []
  const currentGoal = watch("goal")
  const currentPortion = watch("defaultPortion")
  const currentFat = watch("sauceFatLevel")

  const toggleArr = (field: "allergens" | "tastePrefs", value: string) => {
    const current = field === "allergens" ? currentAllergens : currentTastePrefs
    const next = current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]
    setValue(field, next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Profil alimentaire</h1>
        <p className="text-gray-600 mt-1">
          Vos préférences sont appliquées automatiquement lors de la création de vos bowls.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Goal */}
        <Card>
          <CardHeader><CardTitle>Objectif nutritionnel</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setValue("goal", g.id)}
                  className={cn(
                    "p-4 rounded-card border-2 text-center transition-all",
                    currentGoal === g.id
                      ? "border-brand-green bg-brand-light"
                      : "border-gray-200 hover:border-brand-green/50"
                  )}
                >
                  <div className="text-2xl mb-1">{g.emoji}</div>
                  <div className="text-sm font-semibold text-charcoal">{g.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Taste prefs */}
        <Card>
          <CardHeader><CardTitle>Préférences gustatives</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {TASTE_PREFS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleArr("tastePrefs", t.id)}
                  className={cn(
                    "px-4 py-2 rounded-btn border-2 text-sm font-medium transition-all",
                    currentTastePrefs.includes(t.id)
                      ? "border-brand-green bg-brand-light text-brand-green"
                      : "border-gray-200 text-charcoal hover:border-brand-green/50"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portion */}
        <Card>
          <CardHeader><CardTitle>Portion par défaut</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["SMALL", "MEDIUM", "LARGE"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setValue("defaultPortion", p)}
                  className={cn(
                    "py-3 rounded-btn border-2 text-center text-sm font-medium transition-all",
                    currentPortion === p
                      ? "border-brand-green bg-brand-light text-brand-green"
                      : "border-gray-200 text-charcoal hover:border-brand-green/50"
                  )}
                >
                  {p === "SMALL" ? "Petit (S)" : p === "MEDIUM" ? "Moyen (M)" : "Grand (L)"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sauce fat level */}
        <Card>
          <CardHeader><CardTitle>Niveau de sauce par défaut</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["LIGHT", "MEDIUM", "FULL"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setValue("sauceFatLevel", f)}
                  className={cn(
                    "py-3 rounded-btn border-2 text-center text-sm font-medium transition-all",
                    currentFat === f
                      ? "border-brand-green bg-brand-light text-brand-green"
                      : "border-gray-200 text-charcoal hover:border-brand-green/50"
                  )}
                >
                  {f === "LIGHT" ? "🥄 Légère" : f === "MEDIUM" ? "🥄🥄 Normale" : "🥄🥄🥄 Généreuse"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Allergens */}
        <Card>
          <CardHeader><CardTitle>Allergènes à exclure</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALLERGENS.map((a) => (
                <label key={a.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentAllergens.includes(a.id)}
                    onChange={() => toggleArr("allergens", a.id)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <span className="text-sm text-charcoal">{a.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Excluded ingredients */}
        <Card>
          <CardHeader><CardTitle>Ingrédients à exclure</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                placeholder="Ex : coriandre, avocat…"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {excludedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
              {excludedTags.length === 0 && (
                <p className="text-sm text-gray-400">Aucun ingrédient exclu.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" loading={saving}>
            Enregistrer mon profil
          </Button>
          {success && (
            <span className="text-green-600 text-sm font-medium">
              ✓ Profil enregistré avec succès !
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
