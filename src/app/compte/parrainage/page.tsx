"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

interface ReferralData {
  code: string
  referrals: Array<{
    id: string
    refereeEmail: string
    status: string
    rewardGranted: boolean
    createdAt: string
  }>
}

export default function ParrainagePage() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/compte/parrainage")
      .then((r) => r.json())
      .then((json) => { if (json.success) setData(json.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const referralUrl = data?.code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${data.code}`
    : ""

  const copyLink = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    COMPLETED: "Complété",
    REWARDED: "Récompensé",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Parrainage</h1>
        <p className="text-gray-600 mt-1">
          Invitez vos amis et gagnez 50 points de fidélité par parrainage réussi !
        </p>
      </div>

      {/* How it works */}
      <Card className="bg-brand-light border-brand-green/20">
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: "1", label: "Partagez votre lien", emoji: "🔗" },
              { step: "2", label: "Votre ami s'inscrit", emoji: "👤" },
              { step: "3", label: "Vous gagnez 50 points", emoji: "🎁" },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                  {s.step}
                </div>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <p className="text-sm font-medium text-charcoal">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral link */}
      <Card>
        <CardHeader><CardTitle>Votre lien de parrainage</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded-btn" />
          ) : data?.code ? (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-btn text-sm bg-gray-50 text-gray-700"
                />
                <Button onClick={copyLink} variant={copied ? "secondary" : "primary"} size="sm">
                  {copied ? "✓ Copié !" : "Copier"}
                </Button>
              </div>
              <div className="flex gap-2">
                <p className="text-xs text-gray-500">Code : <strong className="text-brand-green">{data.code}</strong></p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Lien non disponible. Connectez-vous pour accéder à votre lien.</p>
          )}
        </CardContent>
      </Card>

      {/* Referred friends */}
      <Card>
        <CardHeader><CardTitle>Amis parrainés</CardTitle></CardHeader>
        <CardContent>
          {!data || data.referrals.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Aucun parrainage pour l'instant"
              description="Partagez votre lien pour commencer à gagner des points !"
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {data.referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{ref.refereeEmail}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ref.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ref.status === "REWARDED"
                        ? "bg-green-100 text-green-700"
                        : ref.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {STATUS_LABELS[ref.status] ?? ref.status}
                    </span>
                    {ref.rewardGranted && (
                      <span className="text-xs text-brand-green font-bold">+50 pts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
