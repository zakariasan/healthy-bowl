import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ingredientSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["BASE", "PROTEIN", "TOPPING", "SAUCE", "ADDON", "JUICE_BASE", "SNACK"]),
  kcal: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative().default(0),
  pricePerUnit: z.number().nonnegative(),
  stock: z.number().nonnegative().default(0),
  minStock: z.number().nonnegative().default(500),
  allergens: z.array(z.string()).default([]),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  supplierId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER", "STAFF"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const ingredients = await prisma.ingredient.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: { supplier: { select: { id: true, name: true } } },
    })

    return NextResponse.json({ success: true, data: ingredients })
  } catch (err) {
    console.error("[ADMIN INGREDIENTS GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const body = await req.json()
    const data = ingredientSchema.parse(body)

    const ingredient = await prisma.ingredient.create({
      data: {
        name: data.name,
        category: data.category,
        kcal: data.kcal,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        fiber: data.fiber,
        pricePerUnit: data.pricePerUnit,
        stock: data.stock,
        minStock: data.minStock,
        allergens: data.allergens as never[],
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
        isAvailable: data.isAvailable,
        supplierId: data.supplierId,
      },
    })

    return NextResponse.json({ success: true, data: ingredient }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[ADMIN INGREDIENTS POST]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
