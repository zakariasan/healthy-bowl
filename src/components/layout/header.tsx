"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, Menu, X, Leaf } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavLink {
  href: string
  label: string
  highlight?: boolean
}

const NAV_LINKS: NavLink[] = [
  { href: "/menu", label: "Menu" },
  { href: "/builder", label: "Composer" },
  { href: "/groupes", label: "Groupes" },
  { href: "/abonnements", label: "Abonnements" },
  { href: "/promotions", label: "🔥 Promos", highlight: true },
]

export function Header() {
  const { data: session } = useSession()
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [promoVisible, setPromoVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "MANAGER" ||
    session?.user?.role === "STAFF"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40">
      {/* ── Promo bar (hides on scroll) ── */}
      {promoVisible && !scrolled && (
        <div className="bg-brand-green text-white text-xs py-1.5 flex items-center justify-center gap-2 animate-fade-in">
          <span className="text-center">
            🔥 Flash Deal actif — Code{" "}
            <span className="font-bold tracking-widest bg-white/20 px-1.5 py-0.5 rounded">
              FLASH20
            </span>{" "}
            pour&nbsp;-20%&nbsp;· Valable jusqu&apos;au dimanche
          </span>
          <button
            onClick={() => setPromoVisible(false)}
            className="ml-2 text-white/70 hover:text-white transition-colors shrink-0"
            aria-label="Fermer la bannière promotionnelle"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Main header ── */}
      <header
        className={cn(
          "bg-white/95 backdrop-blur border-b border-gray-100 transition-shadow",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-xl text-brand-green hover:text-brand-leaf transition-colors"
            >
              <div className="h-8 w-8 bg-brand-green rounded-lg flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span>Healthy Bowl</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-btn transition-colors",
                    link.highlight
                      ? "text-coral font-semibold hover:bg-red-50"
                      : "text-gray-600 hover:text-brand-green hover:bg-brand-light"
                  )}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                    Admin
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link href="/panier" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-medium animate-scale-in">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Auth */}
              {session ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/compte">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      {session.user.name?.split(" ")[0] ?? "Compte"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Connexion</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">S&apos;inscrire</Button>
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-brand-green transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-btn text-sm font-medium transition-colors",
                  link.highlight
                    ? "text-coral font-semibold hover:bg-red-50"
                    : "text-gray-700 hover:text-brand-green hover:bg-brand-light"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                {link.highlight && (
                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
                )}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
              {session ? (
                <>
                  <Link href="/compte" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-1" /> Mon compte
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">S&apos;inscrire</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
