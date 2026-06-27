import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Commande confirmée — Healthy Bowl",
}

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<string, string> = {
  RECUE: "Commande reçue",
  EN_PREPARATION: "En préparation",
  PRETE: "Prête",
  RECUPEREE: "Récupérée",
  ANNULEE: "Annulée",
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params

  let order = null
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { menuItem: { select: { name: true } } },
        },
      },
    })
  } catch {
    // DB may not be available
  }

  const shortId = id.slice(-6).toUpperCase()
  const estimatedTime = order?.estimatedReadyAt
    ? new Date(order.estimatedReadyAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "~15 min"

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
            ✅
          </div>
          <h1 className="text-3xl font-black text-charcoal mb-2">Commande confirmée !</h1>
          <p className="text-gray-600">
            Merci pour votre commande. Nous la préparons avec soin.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Numéro de commande</span>
              <span className="font-bold text-brand-green text-lg">#{shortId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Statut</span>
              <span className="bg-brand-light text-brand-green text-sm font-semibold px-3 py-1 rounded-full">
                {order ? STATUS_LABELS[order.status] ?? order.status : "Reçue"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Prêt estimé à</span>
              <span className="font-bold text-charcoal">⏱️ {estimatedTime}</span>
            </div>
            {order && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 text-sm">Total payé</span>
                <span className="font-bold text-charcoal">{formatMAD(order.total)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps preview */}
        <Card className="mb-6">
          <CardContent>
            <h3 className="font-semibold text-charcoal mb-4">Suivi de commande</h3>
            <div className="space-y-3">
              {["Commande reçue", "En préparation", "Prête à récupérer", "Récupérée"].map(
                (step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        i === 0 ? "bg-brand-green text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {i === 0 ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        i === 0 ? "text-charcoal font-semibold" : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href={`/suivi/${id}`}>
            <Button size="lg" className="w-full">
              Suivre ma commande en direct →
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline" size="lg" className="w-full">
              Retour au menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
