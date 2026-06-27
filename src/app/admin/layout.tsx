import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", emoji: "📊" },
  { href: "/admin/cuisine", label: "Tableau cuisine", emoji: "👨‍🍳" },
  { href: "/admin/commandes", label: "Commandes", emoji: "📋" },
  { href: "/admin/menu", label: "Menu", emoji: "🥗" },
  { href: "/admin/ingredients", label: "Ingrédients", emoji: "🥬" },
  { href: "/admin/clients", label: "Clients", emoji: "👥" },
  { href: "/admin/abonnements", label: "Abonnements", emoji: "⭐" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || !["ADMIN", "MANAGER", "STAFF"].includes(session.user.role ?? "")) {
    redirect("/login?redirect=/admin")
  }

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gray-900 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin">
            <span className="text-xl font-black text-white">Healthy Bowl</span>
            <span className="block text-xs text-gray-500 mt-0.5">Administration</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors",
                "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session.user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.role}</p>
            </div>
          </div>
          <Link href="/" className="block mt-3 text-xs text-gray-500 hover:text-white transition-colors">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto bg-gray-100">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
