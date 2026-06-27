import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const componentSchema = z.object({
  ingredientId: z.string(),
  quantity: z.number().positive(),
  step: z.string(),
  portionSize: z.enum(["SMALL", "MEDIUM", "LARGE"]).default("MEDIUM"),
})

const saveBowlSchema = z.object({
  name: z.string().min(1).max(100),
  components: z.array(componentSchema).min(1),
  totalKcal: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const bowls = await prisma.savedBowl.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        components: {
          include: {
            ingredient: {
              select: { id: true, name: true, category: true, kcal: true, protein: true, carbs: true, fat: true },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: bowls })
  } catch (err) {
    console.error("[BOWLS GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const body = await req.json()
    const data = saveBowlSchema.parse(body)

    const bowl = await prisma.savedBowl.create({
      data: {
        userId: session.user.id,
        name: data.name,
        totalKcal: data.totalKcal,
        totalPrice: data.totalPrice,
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
        components: {
          create: data.components.map((c) => ({
            ingredientId: c.ingredientId,
            quantity: c.quantity,
            step: c.step,
            portionSize: c.portionSize,
          })),
        },
      },
      include: { components: true },
    })

    return NextResponse.json({ success: true, data: bowl }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[BOWLS POST]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
