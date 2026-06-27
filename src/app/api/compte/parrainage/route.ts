import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateReferralCode } from "@/lib/utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 })
    }

    // Find or create referral code for this user
    let myReferral = await prisma.referral.findFirst({
      where: { referrerId: session.user.id, status: "COMPLETED", refereeId: session.user.id },
    })

    if (!myReferral) {
      const code = generateReferralCode(session.user.id)
      myReferral = await prisma.referral.create({
        data: {
          referrerId: session.user.id,
          refereeEmail: session.user.email ?? "",
          refereeId: session.user.id,
          code,
          status: "COMPLETED",
          rewardGranted: false,
        },
      })
    }

    // Find all referrals made BY this user (not self-referral)
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: session.user.id,
        NOT: { refereeId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        refereeEmail: true,
        status: true,
        rewardGranted: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        code: myReferral.code,
        referrals,
      },
    })
  } catch (err) {
    console.error("[PARRAINAGE GET]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
