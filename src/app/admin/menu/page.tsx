"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

interface MenuItem {
  id: string
  name: string
  basePrice: number
  isAvailable: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isHighProtein: boolean
  customizable: boolean
  category: { name: string; slug: string }
  baseMacros: { kcal: number; protein: number; carbs: number; fat: number }
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", categoryId: "", basePrice: "", description: "",
    kcal: "", protein: "", carbs: "", fat: "",
    isVegan: false, isGlutenFree: false, isHighProtein: false, customizable: false,
  })

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/menu")
      const json = await res.json()
      if (json.success) setItems(json.data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.basePrice) return
    setSaving(true)
    try {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          categoryId: form.categoryId,
          basePrice: parseFloat(form.basePrice),
          description: form.description,
          baseMacros: {
            kcal: parseFloat(form.kcal) || 0,
            protein: parseFloat(form.protein) || 0,
            carbs: parseFloat(form.carbs) || 0,
            fat: parseFloat(form.fat) || 0,
          },
          isVegan: form.isVegan,
          isGlutenFree: form.isGlutenFree,
          isHighProtein: form.isHighProtein,
          customizable: form.customizable,
        }),
      })
      setShowForm(false)
      await fetchItems()
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Menu</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Ajouter un article"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <h2 className="font-bold text-lg text-charcoal mb-4">Nouvel article</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Nom de l'article *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex : Bowl Poulet Quinoa"
              />
              <Input
                label="ID Catégorie *"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                placeholder="ID de la catégorie"
              />
              <Input
                label="Prix (MAD) *"
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                placeholder="65"
              />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description du plat"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                { label: "Kcal", field: "kcal" },
                { label: "Protéines (g)", field: "protein" },
                { label: "Glucides (g)", field: "carbs" },
                { label: "Lipides (g)", field: "fat" },
              ].map((m) => (
                <Input
                  key={m.field}
                  label={m.label}
                  type="number"
                  value={form[m.field as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [m.field]: e.target.value })}
                />
              ))}
            </div>
            <div className="flex gap-4 mb-4">
              {[
                { label: "Vegan", field: "isVegan" },
                { label: "Sans gluten", field: "isGlutenFree" },
                { label: "Riche en protéines", field: "isHighProtein" },
                { label: "Personnalisable", field: "customizable" },
              ].map((c) => (
                <label key={c.field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[c.field as keyof typeof form] as boolean}
                    onChange={(e) => setForm({ ...form, [c.field]: e.target.checked })}
                    className="w-4 h-4 text-brand-green"
                  />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleSave} loading={saving}>
              Enregistrer l'article
            </Button>
          </CardContent>
        </Card>
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
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Article</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Catégorie</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Prix</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Macros</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Badges</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Aucun article dans le menu.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500">{item.category.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-brand-green">
                      {formatMAD(item.basePrice)}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {Math.round(item.baseMacros.kcal)} kcal
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        {item.isVegan && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">V</span>}
                        {item.isGlutenFree && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 rounded">SG</span>}
                        {item.isHighProtein && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded">HP</span>}
                        {item.customizable && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded">C</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {item.isAvailable ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
