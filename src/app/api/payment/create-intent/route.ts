import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, madToCentimes } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const Schema = z.object({ orderId: z.string().cuid() })

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const body = await req.json()
  const parse = Schema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: "orderId invalide" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: parse.data.orderId },
    include: { items: true },
  })
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 })
  }
  if (order.status === "RECUPEREE") {
    return NextResponse.json({ error: "Commande déjà traitée" }, { status: 409 })
  }

  const intent = await stripe.paymentIntents.create({
    amount:   madToCentimes(order.total),
    currency: "mad",
    metadata: { orderId: order.id, userId: session.user.id },
    receipt_email: session.user.email ?? undefined,
    automatic_payment_methods: { enabled: true },
  })

  return NextResponse.json({ clientSecret: intent.client_secret })
}
