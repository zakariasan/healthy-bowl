import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Programme fidélité — Healthy Bowl",
}

const REWARDS = [
  { points: 100, label: "Jus offert", emoji: "🥤", desc: "Échangez contre n'importe quel jus" },
  { points: 200, label: "Réduction 20 MAD", emoji: "💰", desc: "Sur votre prochaine commande" },
  { points: 500, label: "Repas offert", emoji: "🥣", desc: "Bowl personnalisé au choix" },
  { points: 1000, label: "Mois gratuit", emoji: "⭐", desc: "Un mois d'abonnement Starter" },
]

export default async function FidelitePage() {
  const session = await getServerSession(authOptions)

  let loyalty: { points: number; lifetime: number } | null = null
  let transactions: Array<{
    id: string
    points: number
    description: string
    createdAt: Date
  }> = []

  try {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { userId: session!.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    })
    if (account) {
      loyalty = { points: account.points, lifetime: account.lifetime }
      transactions = account.transactions
    }
  } catch {}

  const points = loyalty?.points ?? 0
  const lifetime = loyalty?.lifetime ?? 0
  const levelInfo = points >= 1000
    ? { label: "Or", emoji: "🥇", next: null, nextPoints: null }
    : points >= 500
    ? { label: "Argent", emoji: "🥈", next: "Or", nextPoints: 1000 }
    : points >= 200
    ? { label: "Bronze", emoji: "🥉", next: "Argent", nextPoints: 500 }
    : { label: "Débutant", emoji: "🌱", next: "Bronze", nextPoints: 200 }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Programme fidélité</h1>
        <p className="text-gray-600 mt-1">Gagnez des points à chaque commande et échangez-les contre des récompenses.</p>
      </div>

      {/* Loyalty card */}
      <div className="bg-gradient-to-r from-brand-green to-brand-leaf rounded-card p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-brand-light text-sm">Niveau actuel</p>
            <p className="text-2xl font-black">{levelInfo.emoji} {levelInfo.label}</p>
          </div>
          <div className="text-right">
            <p className="text-brand-light text-sm">Points disponibles</p>
            <p className="text-4xl font-black">{points}</p>
          </div>
        </div>
        {levelInfo.nextPoints && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-brand-light mb-1">
              <span>{points} pts</span>
              <span>{levelInfo.nextPoints} pts → {levelInfo.next}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${Math.min(100, (points / levelInfo.nextPoints) * 100)}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-xs text-brand-light mt-3">{lifetime} points gagnés à vie</p>
      </div>

      {/* How to earn */}
      <Card>
        <CardHeader><CardTitle>Comment gagner des points</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { action: "Chaque commande", points: "1 pt / 10 MAD", emoji: "🛍️" },
            { action: "Parrainage", points: "50 pts", emoji: "👥" },
            { action: "Inscription newsletter", points: "20 pts", emoji: "📧" },
          ].map((item) => (
            <div key={item.action} className="bg-brand-light rounded-btn p-4 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-sm font-semibold text-charcoal">{item.action}</p>
              <p className="text-brand-green font-bold">{item.points}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Redemption options */}
      <Card>
        <CardHeader><CardTitle>Récompenses disponibles</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REWARDS.map((reward) => {
            const canRedeem = points >= reward.points
            return (
              <div
                key={reward.label}
                className={`p-4 rounded-btn border-2 flex items-center gap-4 transition-all ${
                  canRedeem ? "border-brand-green bg-brand-light" : "border-gray-100 opacity-60"
                }`}
              >
                <span className="text-3xl">{reward.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal text-sm">{reward.label}</p>
                  <p className="text-xs text-gray-500">{reward.desc}</p>
                  <p className="text-xs text-brand-green font-bold mt-0.5">{reward.points} points</p>
                </div>
                <Button
                  size="sm"
                  disabled={!canRedeem}
                  variant={canRedeem ? "primary" : "outline"}
                >
                  {canRedeem ? "Échanger" : `−${reward.points - points} pts`}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader><CardTitle>Historique des points</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Aucune transaction pour l&apos;instant.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                  <div>
                    <p className="text-charcoal">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`font-bold ${tx.points > 0 ? "text-brand-green" : "text-red-500"}`}>
                    {tx.points > 0 ? "+" : ""}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
