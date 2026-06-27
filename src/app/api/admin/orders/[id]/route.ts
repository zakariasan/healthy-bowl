import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  status: z.enum(["RECUE", "EN_PREPARATION", "PRETE", "RECUPEREE", "ANNULEE"]).optional(),
  estimatedReadyAt: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER", "STAFF"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = patchSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (data.status) {
      updateData.status = data.status
      if (data.status === "EN_PREPARATION") updateData.prepStartedAt = new Date()
      if (data.status === "PRETE") updateData.actualReadyAt = new Date()
    }
    if (data.estimatedReadyAt) updateData.estimatedReadyAt = new Date(data.estimatedReadyAt)

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[ADMIN ORDER PATCH]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER", "STAFF"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            menuItem: true,
          },
        },
        location: true,
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, message: "Commande introuvable." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    console.error("[ADMIN ORDER GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
