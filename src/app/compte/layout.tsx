import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/compte", label: "Tableau de bord", emoji: "🏠" },
  { href: "/compte/profil-alimentaire", label: "Profil alimentaire", emoji: "🥗" },
  { href: "/compte/commandes", label: "Mes commandes", emoji: "📋" },
  { href: "/compte/abonnement", label: "Abonnement", emoji: "⭐" },
  { href: "/compte/fidelite", label: "Fidélité", emoji: "🎯" },
  { href: "/compte/parrainage", label: "Parrainage", emoji: "👥" },
  { href: "/builder", label: "Créer un bowl", emoji: "🥣" },
]

export default async function CompteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login?redirect=/compte")
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-card shadow-card p-4 mb-4">
              <div className="flex items-center gap-3 p-2 mb-2">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-card shadow-card overflow-hidden">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-brand-light hover:text-brand-green",
                    "border-b border-gray-50 last:border-0 text-charcoal"
                  )}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
