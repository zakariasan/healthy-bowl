"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Ingredient {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  pricePerUnit: number
  isAvailable: boolean
  kcal: number
  protein: number
  carbs: number
  fat: number
  supplier: { name: string } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  BASE: "Base", PROTEIN: "Protéine", TOPPING: "Topping",
  SAUCE: "Sauce", ADDON: "Add-on", JUICE_BASE: "Jus/Base", SNACK: "Snack",
}

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", category: "TOPPING", kcal: "", protein: "", carbs: "", fat: "",
    pricePerUnit: "", stock: "", minStock: "500", isVegan: false, isGlutenFree: false,
  })

  const fetchIngredients = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ingredients")
      const json = await res.json()
      if (json.success) setIngredients(json.data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchIngredients() }, [fetchIngredients])

  const handleSave = async () => {
    if (!form.name || !form.category) return
    setSaving(true)
    try {
      await fetch("/api/admin/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          kcal: parseFloat(form.kcal) || 0,
          protein: parseFloat(form.protein) || 0,
          carbs: parseFloat(form.carbs) || 0,
          fat: parseFloat(form.fat) || 0,
          pricePerUnit: parseFloat(form.pricePerUnit) || 0,
          stock: parseFloat(form.stock) || 0,
          minStock: parseFloat(form.minStock) || 500,
          isVegan: form.isVegan,
          isGlutenFree: form.isGlutenFree,
        }),
      })
      setShowForm(false)
      await fetchIngredients()
    } catch {}
    finally { setSaving(false) }
  }

  const lowStock = ingredients.filter((i) => i.stock < i.minStock)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Ingrédients</h1>
          {lowStock.length > 0 && (
            <p className="text-red-600 text-sm mt-1 font-medium">
              ⚠️ {lowStock.length} ingrédient{lowStock.length > 1 ? "s" : ""} en rupture de stock
            </p>
          )}
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Ajouter"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-card shadow-card p-6 mb-6">
          <h2 className="font-bold text-lg text-charcoal mb-4">Nouvel ingrédient</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Nom *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-charcoal">Catégorie *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <Input label="Kcal" type="number" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: e.target.value })} />
            <Input label="Protéines (g)" type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
            <Input label="Glucides (g)" type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
            <Input label="Lipides (g)" type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
            <Input label="Prix/unité (MAD)" type="number" value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} />
            <Input label="Stock (g)" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <Input label="Stock min (g)" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
          </div>
          <Button onClick={handleSave} loading={saving}>Enregistrer</Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Ingrédient</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Catégorie</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Stock</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Min Stock</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Macros (100g)</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Aucun ingrédient. Lancez le seed pour démarrer.
                  </td>
                </tr>
              ) : (
                ingredients.map((ing) => {
                  const isLow = ing.stock < ing.minStock
                  return (
                    <tr key={ing.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isLow ? "bg-red-50/50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {ing.name}
                        {isLow && <span className="ml-2 text-xs text-red-600">⚠️ Stock bas</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{CATEGORY_LABELS[ing.category] ?? ing.category}</td>
                      <td className={`px-4 py-3 text-right font-bold ${isLow ? "text-red-600" : "text-gray-900"}`}>
                        {Math.round(ing.stock)}g
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">{Math.round(ing.minStock)}g</td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {Math.round(ing.kcal)} kcal · P{Math.round(ing.protein)}g
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isLow ? "bg-red-100 text-red-600" : ing.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {isLow ? "Rupture" : ing.isAvailable ? "OK" : "Désactivé"}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
