"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Copy, Check, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "hb_welcomed_v1"

export function WelcomeModal() {
  const [visible, setVisible] = useState(false)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setVisible(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  async function copy() {
    await navigator.clipboard.writeText("BIENVENUE20")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!visible) return null

  return (
    <div className="modal-backdrop animate-fade-in" onClick={dismiss}>
      <div
        className="w-full max-w-md animate-modal-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.25)]">
          {/* Header strip */}
          <div className="gradient-green p-8 pb-10 text-center relative noise overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-white/10 blur-[60px]" />
            </div>
            <div className="relative z-10">
              <div className="text-6xl mb-3 drop-shadow-lg">🎁</div>
              <h2 className="text-2xl font-black text-white leading-tight">
                Bienvenue chez<br />Healthy Bowl !
              </h2>
              <p className="text-emerald-100 text-sm mt-2">Votre premier bowl à prix spécial</p>
            </div>
          </div>

          {/* Offer body */}
          <div className="p-7 -mt-5 bg-white relative z-10">
            <div className="bg-brand-light rounded-2xl p-5 text-center mb-6 border border-brand-green/20">
              <p className="text-sm text-brand-dark font-medium mb-3">
                Utilisez ce code à la caisse et obtenez
              </p>
              <div className="text-5xl font-black text-brand-green mb-1">-20%</div>
              <p className="text-xs text-muted mb-4">sur votre première commande</p>

              <button
                onClick={copy}
                className="flex items-center gap-2 mx-auto bg-brand-green hover:bg-brand-dark text-white rounded-pill px-6 py-2.5 font-mono font-black text-sm tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-glow-sm"
              >
                BIENVENUE20
                {copied
                  ? <Check className="h-4 w-4 shrink-0" />
                  : <Copy className="h-4 w-4 shrink-0" />
                }
              </button>
              {copied && <p className="text-xs text-brand-green mt-2 font-semibold">✓ Copié !</p>}
            </div>

            {/* Social proof mini row */}
            <div className="flex items-center justify-center gap-4 mb-6 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />4.9/5
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-brand-green" />Prêt en 7 min
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span>2 000+ clients</span>
            </div>

            <Link href="/builder" onClick={dismiss}>
              <Button size="lg" className="w-full bg-brand-green hover:bg-brand-dark text-white font-black shadow-glow-sm">
                Composer mon premier bowl
              </Button>
            </Link>
            <button
              onClick={dismiss}
              className="w-full mt-3 text-xs text-muted hover:text-navy transition-colors py-2"
            >
              Non merci, continuer sans réduction
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
