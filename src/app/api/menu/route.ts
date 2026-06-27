import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })

    return NextResponse.json({ success: true, data: categories })
  } catch (err) {
    console.error("[MENU GET]", err)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération du menu." },
      { status: 500 }
    )
  }
}
