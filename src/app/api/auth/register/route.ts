import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { generateReferralCode } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
  isStudent: z.boolean().default(false),
  referralCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Cet email est déjà utilisé." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          isStudent: data.isStudent,
          role: "CUSTOMER",
        },
      })

      // Create loyalty account
      await tx.loyaltyAccount.create({
        data: { userId: newUser.id, points: 0, lifetime: 0 },
      })

      // Create dietary profile
      await tx.dietaryProfile.create({
        data: {
          userId: newUser.id,
          goal: "MAINTIEN",
          defaultPortion: "MEDIUM",
          sauceFatLevel: "MEDIUM",
        },
      })

      // Create referral code for new user
      const code = generateReferralCode(newUser.id)
      await tx.referral.create({
        data: {
          referrerId: newUser.id,
          refereeEmail: data.email,
          refereeId: newUser.id,
          code,
          status: "COMPLETED",
          rewardGranted: false,
        },
      })

      // Handle incoming referral
      if (data.referralCode) {
        const referral = await tx.referral.findFirst({
          where: { code: data.referralCode, status: "PENDING" },
        })
        if (referral) {
          await tx.referral.update({
            where: { id: referral.id },
            data: { refereeId: newUser.id, refereeEmail: data.email, status: "COMPLETED" },
          })
          // Reward referrer with 50 points
          const referrerLoyalty = await tx.loyaltyAccount.findUnique({
            where: { userId: referral.referrerId },
          })
          if (referrerLoyalty) {
            await tx.loyaltyAccount.update({
              where: { id: referrerLoyalty.id },
              data: { points: { increment: 50 }, lifetime: { increment: 50 } },
            })
            await tx.loyaltyTransaction.create({
              data: {
                accountId: referrerLoyalty.id,
                points: 50,
                description: `Bonus parrainage — ${data.name} a rejoint Healthy Bowl`,
              },
            })
          }
        }
      }

      return newUser
    })

    return NextResponse.json(
      { success: true, message: "Compte créé avec succès.", userId: user.id },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.issues }, { status: 400 })
    }
    console.error("[REGISTER]", err)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
