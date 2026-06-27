import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        category: true,
        allergens: true,
        kcal: true,
        protein: true,
        carbs: true,
        fat: true,
        fiber: true,
        pricePerUnit: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        isSeasonal: true,
      },
    })

    return NextResponse.json({ success: true, data: ingredients })
  } catch (err) {
    console.error("[INGREDIENTS GET]", err)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des ingrédients." },
      { status: 500 }
    )
  }
}
