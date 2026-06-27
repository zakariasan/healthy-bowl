import { Suspense } from "react"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import MenuClientView from "./MenuClientView"

export const metadata: Metadata = {
  title: "Notre Menu — Healthy Bowl Marrakech",
  description:
    "Découvrez nos salades, bowls personnalisables, jus & smoothies et snacks sains préparés avec des ingrédients locaux.",
}

async function getMenuData() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return categories
  } catch {
    return []
  }
}

export default async function MenuPage() {
  const categories = await getMenuData()

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Notre Menu</h1>
          <p className="text-brand-light text-lg max-w-2xl mx-auto">
            Des ingrédients locaux, des saveurs authentiques, une nutrition sur-mesure.
          </p>
        </div>
      </div>

      <Suspense fallback={<MenuSkeleton />}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <MenuClientView categories={categories as any} />
      </Suspense>
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 animate-pulse rounded-btn" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-card h-64" />
        ))}
      </div>
    </div>
  )
}
