import { NextRequest, NextResponse } from "next/server"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent
      const orderId = intent.metadata?.orderId
      if (orderId) {
        await prisma.order.update({ where: { id: orderId }, data: { status: "EN_PREPARATION" } })
        await grantLoyaltyPoints(orderId)
      }
      break
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent
      const orderId = intent.metadata?.orderId
      if (orderId) {
        await prisma.order.update({ where: { id: orderId }, data: { status: "ANNULEE" } })
      }
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}

async function grantLoyaltyPoints(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { userId: true, total: true } })
  if (!order?.userId) return
  const pts = Math.floor(order.total)
  const account = await prisma.loyaltyAccount.findUnique({ where: { userId: order.userId } })
  if (!account) return
  await prisma.$transaction([
    prisma.loyaltyAccount.update({ where: { userId: order.userId }, data: { points: { increment: pts } } }),
    prisma.loyaltyTransaction.create({
      data: { accountId: account.id, points: pts, description: `Commande #${orderId.slice(-6).toUpperCase()}`, orderId },
    }),
  ])
}
