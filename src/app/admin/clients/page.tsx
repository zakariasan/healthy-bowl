import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Clients — Admin Healthy Bowl",
}

export default async function ClientsPage() {
  let clients: Array<{
    id: string
    name: string
    email: string
    role: string
    isStudent: boolean
    createdAt: Date
    loyaltyAccount: { points: number } | null
    _count: { orders: number; subscriptions: number }
  }> = []

  try {
    clients = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        loyaltyAccount: { select: { points: true } },
        _count: { select: { orders: true, subscriptions: true } },
      },
    })
  } catch {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Clients</h1>
        <p className="text-gray-500 mt-1">{clients.length} client(s) enregistrés</p>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="search"
            placeholder="Rechercher par nom ou email…"
            className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Commandes</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Abonnement</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Points fidélité</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Inscription</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Étudiant</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Aucun client pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">
                      {client._count.orders}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        client._count.subscriptions > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {client._count.subscriptions > 0 ? "Abonné" : "Non abonné"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-brand-green">
                      {client.loyaltyAccount?.points ?? 0} pts
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {client.isStudent ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🎓 Oui</span>
                      ) : (
                        <span className="text-xs text-gray-400">Non</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
