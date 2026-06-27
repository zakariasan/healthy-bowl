import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      ordersToday,
      revenueToday,
      activeSubscriptions,
      newCustomersToday,
      ordersByStatus,
      topItems,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: today, lt: tomorrow }, status: { not: "ANNULEE" } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow }, status: { not: "ANNULEE" } },
        _sum: { total: true },
      }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.groupBy({
        by: ["status"],
        where: { createdAt: { gte: today, lt: tomorrow } },
        _count: true,
      }),
      prisma.orderItem.groupBy({
        by: ["menuItemId"],
        where: { order: { createdAt: { gte: today, lt: tomorrow } } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ])

    // Enrich top items with names
    const topItemsWithNames = await Promise.all(
      topItems.map(async (item) => {
        if (!item.menuItemId) return null
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          select: { name: true },
        })
        return {
          menuItemId: item.menuItemId,
          name: menuItem?.name ?? "Inconnu",
          quantity: item._sum.quantity ?? 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        ordersToday,
        revenueToday: revenueToday._sum.total ?? 0,
        revenueTarget: 5000,
        activeSubscriptions,
        newCustomersToday,
        ordersByStatus,
        topItems: topItemsWithNames.filter(Boolean),
      },
    })
  } catch (err) {
    console.error("[ADMIN STATS]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
