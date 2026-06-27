import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Email invalide"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return NextResponse.json({ success: true, message: "Réabonnement confirmé." })
      }
      return NextResponse.json(
        { success: false, message: "Cet email est déjà inscrit." },
        { status: 409 }
      )
    }

    await prisma.newsletterSubscriber.create({
      data: { email, locale: "fr" },
    })

    return NextResponse.json(
      { success: true, message: "Inscription à la newsletter confirmée." },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[NEWSLETTER]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
