import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const menuItemSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  baseMacros: z.object({
    kcal: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number().optional(),
  }),
  allergens: z.array(z.string()).default([]),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isHighProtein: z.boolean().default(false),
  customizable: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const items = await prisma.menuItem.findMany({
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      include: { category: { select: { name: true, slug: true } } },
    })

    return NextResponse.json({ success: true, data: items })
  } catch (err) {
    console.error("[ADMIN MENU GET]", err)
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
    const data = menuItemSchema.parse(body)

    const item = await prisma.menuItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        baseMacros: data.baseMacros,
        allergens: data.allergens as never[],
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
        isHighProtein: data.isHighProtein,
        customizable: data.customizable,
        isAvailable: data.isAvailable,
      },
    })

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[ADMIN MENU POST]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
