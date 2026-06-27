import { NextRequest, NextResponse } from "next/server"
import { verifyCMICallback } from "@/lib/cmi"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const body: Record<string, string> = {}
  for (const [k, v] of formData.entries()) body[k] = String(v)

  if (!verifyCMICallback(body)) {
    return new NextResponse("FAILURE", { status: 400 })
  }

  const orderId      = body.oid
  const responseCode = body.ProcReturnCode ?? ""
  const paid         = responseCode === "00"

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data:  { status: paid ? "EN_PREPARATION" : "ANNULEE" },
    })
    if (paid) await grantLoyaltyPoints(orderId)
  }

  if (paid) {
    return new NextResponse("ACTION=POSTAUTH", { headers: { "Content-Type": "text/plain" } })
  }

  const failUrl = process.env.CMI_FAIL_URL ?? `${process.env.NEXT_PUBLIC_APP_URL}/paiement/echec`
  return NextResponse.redirect(failUrl)
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
      data: { accountId: account.id, points: pts, description: `CMI · #${orderId.slice(-6).toUpperCase()}`, orderId },
    }),
  ])
}
