import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { NutritionLabel } from "@/components/ui/nutrition-label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatMAD } from "@/lib/utils"
import AddToCartButton from "./AddToCartButton"

interface PageProps {
  params: Promise<{ category: string; item: string }>
}

const ALLERGEN_LABELS: Record<string, string> = {
  GLUTEN: "Gluten",
  LACTOSE: "Lactose",
  OEUFS: "Œufs",
  ARACHIDES: "Arachides",
  FRUITS_A_COQUE: "Fruits à coque",
  SOJA: "Soja",
  POISSON: "Poisson",
  CRUSTACES: "Crustacés",
  CELERI: "Céleri",
  MOUTARDE: "Moutarde",
  SESAME: "Sésame",
  SULFITES: "Sulfites",
  LUPIN: "Lupin",
  MOLLUSQUES: "Mollusques",
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { item: itemId } = await params
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
      select: { name: true, description: true },
    })
    return {
      title: menuItem ? `${menuItem.name} — Healthy Bowl` : "Article — Healthy Bowl",
      description: menuItem?.description ?? undefined,
    }
  } catch {
    return { title: "Article — Healthy Bowl" }
  }
}

export default async function ItemPage({ params }: PageProps) {
  const { category, item: itemId } = await params

  let menuItem
  try {
    menuItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    })
  } catch {
    notFound()
  }

  if (!menuItem) notFound()

  const macros = menuItem.baseMacros as {
    kcal: number
    protein: number
    carbs: number
    fat: number
    fiber?: number
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/menu" className="hover:text-brand-green">Menu</Link>
          <span>/</span>
          <Link href={`/menu/${category}`} className="hover:text-brand-green capitalize">
            {menuItem.category.name}
          </Link>
          <span>/</span>
          <span className="text-charcoal">{menuItem.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: image + info */}
          <div>
            <div className="h-72 bg-brand-light rounded-card flex items-center justify-center text-8xl mb-6">
              🌿
            </div>

            <h1 className="text-3xl font-black text-charcoal mb-2">{menuItem.name}</h1>

            {menuItem.description && (
              <p className="text-gray-600 mb-4">{menuItem.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {menuItem.isVegan && <Badge variant="vegan" />}
              {menuItem.isGlutenFree && <Badge variant="gluten-free" />}
              {menuItem.isHighProtein && <Badge variant="high-protein" />}
            </div>

            {/* Allergens */}
            {menuItem.allergens.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-btn p-3 mb-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  ⚠️ Allergènes présents :
                </p>
                <div className="flex flex-wrap gap-1">
                  {menuItem.allergens.map((a) => (
                    <span key={a} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {ALLERGEN_LABELS[a] ?? a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between p-4 bg-white rounded-card shadow-card mb-6">
              <span className="text-gray-600">Prix</span>
              <span className="text-2xl font-black text-brand-green">
                {formatMAD(menuItem.basePrice)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <AddToCartButton
                item={{
                  id: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.basePrice,
                  menuItemId: menuItem.id,
                  macros: {
                    kcal: macros.kcal,
                    protein: macros.protein,
                    carbs: macros.carbs,
                    fat: macros.fat,
                  },
                }}
              />
              {menuItem.customizable && (
                <Link href="/builder">
                  <Button variant="outline" size="lg">
                    Personnaliser
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right: nutrition label */}
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-4">Informations nutritionnelles</h2>
            <div className="border-2 border-charcoal rounded p-4 max-w-xs">
              <NutritionLabel macros={macros} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
