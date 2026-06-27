import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const profileSchema = z.object({
  goal: z.enum(["PERTE_DE_POIDS", "PRISE_DE_MASSE", "MAINTIEN", "ENERGIE"]),
  tastePrefs: z.array(z.enum(["SALE", "ACIDULE", "EPICE", "DOUX"])),
  defaultPortion: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  sauceFatLevel: z.enum(["LIGHT", "MEDIUM", "FULL"]),
  defaultSauceType: z.string().optional(),
  allergens: z.array(
    z.enum([
      "GLUTEN","LACTOSE","OEUFS","ARACHIDES","FRUITS_A_COQUE",
      "SOJA","POISSON","CRUSTACES","CELERI","MOUTARDE",
      "SESAME","SULFITES","LUPIN","MOLLUSQUES",
    ])
  ).default([]),
  excludedIngredientIds: z.array(z.string()).default([]),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const profile = await prisma.dietaryProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        exclusionRules: {
          include: { ingredient: { select: { id: true, name: true } } },
        },
      },
    })

    return NextResponse.json({ success: true, data: profile })
  } catch (err) {
    console.error("[PROFIL GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const body = await req.json()
    const data = profileSchema.parse(body)

    const profile = await prisma.$transaction(async (tx) => {
      const updated = await tx.dietaryProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          goal: data.goal,
          tastePrefs: data.tastePrefs,
          defaultPortion: data.defaultPortion,
          sauceFatLevel: data.sauceFatLevel,
          defaultSauceType: data.defaultSauceType,
        },
        update: {
          goal: data.goal,
          tastePrefs: data.tastePrefs,
          defaultPortion: data.defaultPortion,
          sauceFatLevel: data.sauceFatLevel,
          defaultSauceType: data.defaultSauceType,
        },
      })

      // Replace exclusion rules
      await tx.exclusionRule.deleteMany({ where: { profileId: updated.id } })

      if (data.allergens.length > 0) {
        await tx.exclusionRule.createMany({
          data: data.allergens.map((allergen) => ({
            profileId: updated.id,
            allergen,
            type: "allergen",
          })),
        })
      }

      if (data.excludedIngredientIds.length > 0) {
        await tx.exclusionRule.createMany({
          data: data.excludedIngredientIds.map((ingredientId) => ({
            profileId: updated.id,
            ingredientId,
            type: "ingredient",
          })),
        })
      }

      return updated
    })

    return NextResponse.json({ success: true, data: profile })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[PROFIL PUT]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
