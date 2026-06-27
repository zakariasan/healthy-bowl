import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatMAD } from "@/lib/utils"

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const slug = category.toUpperCase().replace("-", "_")
  return {
    title: `${slug.charAt(0) + slug.slice(1).toLowerCase()} — Healthy Bowl`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const slug = category.toUpperCase().replace("-", "_")

  let menuCategory
  try {
    menuCategory = await prisma.menuCategory.findUnique({
      where: { slug: slug as never },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })
  } catch {
    notFound()
  }

  if (!menuCategory) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/menu" className="text-brand-light hover:text-white text-sm mb-4 inline-block">
            ← Retour au menu
          </Link>
          <h1 className="text-4xl font-black">{menuCategory.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCategory.items.map((item) => {
            const macros = item.baseMacros as { kcal: number; protein: number; carbs: number; fat: number }
            return (
              <Card key={item.id} hover>
                <div className="h-36 bg-brand-light rounded-t-card flex items-center justify-center text-5xl">
                  🌿
                </div>
                <CardContent>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-charcoal">{item.name}</h3>
                    <span className="text-brand-green font-bold">{formatMAD(item.basePrice)}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                  )}
                  <div className="flex gap-2 text-xs text-gray-600 mb-3 bg-gray-50 rounded px-2 py-1">
                    <span className="font-semibold">{Math.round(macros.kcal)} kcal</span>
                    <span>P {Math.round(macros.protein)}g</span>
                    <span>G {Math.round(macros.carbs)}g</span>
                    <span>L {Math.round(macros.fat)}g</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.isVegan && <Badge variant="vegan" />}
                    {item.isGlutenFree && <Badge variant="gluten-free" />}
                    {item.isHighProtein && <Badge variant="high-protein" />}
                  </div>
                  <Link href={`/menu/${category}/${item.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Voir les détails
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
