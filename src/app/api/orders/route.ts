import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderItemSchema = z.object({
  menuItemId: z.string().optional(),
  savedBowlId: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  customization: z.record(z.string(), z.unknown()).optional(),
  computedMacros: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
})

const createOrderSchema = z.object({
  fulfillmentType: z.enum(["DINE_IN", "TAKEAWAY", "CLICK_COLLECT", "DELIVERY"]),
  timeSlot: z.string().optional(),
  locationId: z.string(),
  items: z.array(orderItemSchema).min(1),
  promoCode: z.string().optional(),
  specialInstructions: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const body = await req.json()
    const data = createOrderSchema.parse(body)

    // Resolve locationId — checkout sends "default-location" as placeholder;
    // fall back to the first location in the DB.
    let resolvedLocationId = data.locationId
    const locationExists = await prisma.location.findUnique({ where: { id: data.locationId }, select: { id: true } })
    if (!locationExists) {
      const first = await prisma.location.findFirst({ select: { id: true } })
      if (!first) {
        return NextResponse.json({ success: false, message: "Aucun point de vente configuré." }, { status: 400 })
      }
      resolvedLocationId = first.id
    }

    // Validate promo code if provided
    let promoDiscount = 0
    if (data.promoCode) {
      const promo = await prisma.promo.findFirst({
        where: {
          code: data.promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validTo: { gte: new Date() },
        },
      })
      if (promo) {
        const subtotalCalc = data.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        )
        if (promo.type === "PERCENT") {
          promoDiscount = (subtotalCalc * promo.value) / 100
        } else if (promo.type === "FIXED_MAD") {
          promoDiscount = Math.min(promo.value, subtotalCalc)
        }
        await prisma.promo.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } },
        })
      }
    }

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )
    const total = Math.max(0, subtotal - promoDiscount)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        locationId: resolvedLocationId,
        fulfillmentType: data.fulfillmentType,
        timeSlot: data.timeSlot ? new Date(data.timeSlot) : undefined,
        status: "RECUE",
        subtotal,
        promoDiscount,
        total,
        promoCode: data.promoCode,
        specialInstructions: data.specialInstructions,
        estimatedReadyAt: new Date(Date.now() + 15 * 60 * 1000),
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            savedBowlId: item.savedBowlId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            customization: (item.customization ?? null) as any,
            computedMacros: (item.computedMacros ?? null) as any,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Award loyalty points (1 point per 10 MAD)
    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
    })
    if (loyaltyAccount) {
      const points = Math.floor(total / 10)
      if (points > 0) {
        await prisma.loyaltyAccount.update({
          where: { userId: session.user.id },
          data: { points: { increment: points }, lifetime: { increment: points } },
        })
        await prisma.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            points,
            description: `Points gagnés — Commande #${order.id.slice(-6).toUpperCase()}`,
            orderId: order.id,
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[ORDERS POST]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") ?? "1", 10)
    const limit = parseInt(searchParams.get("limit") ?? "10", 10)
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              menuItem: { select: { name: true } },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({ success: true, data: orders, total, page, limit })
  } catch (err) {
    console.error("[ORDERS GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
