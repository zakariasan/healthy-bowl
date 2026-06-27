import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        estimatedReadyAt: true,
        actualReadyAt: true,
        prepStartedAt: true,
        total: true,
        createdAt: true,
        fulfillmentType: true,
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, message: "Commande introuvable." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    console.error("[ORDER STATUS]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
