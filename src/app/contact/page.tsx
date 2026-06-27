"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Nous contacter</h1>
          <p className="text-brand-light text-lg">Une question ? Une suggestion ? On vous répond sous 24h.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact form */}
        <div>
          {sent ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-charcoal mb-2">Message envoyé !</h2>
                <p className="text-gray-600">Nous vous répondrons dans les 24 heures.</p>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nom complet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Sujet"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-charcoal">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-btn text-sm focus:outline-none focus:border-brand-green resize-none"
                  placeholder="Votre message…"
                />
              </div>
              <Button type="submit" size="lg" loading={sending} className="w-full">
                Envoyer le message
              </Button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-card shadow-card p-6">
            <h3 className="font-bold text-charcoal mb-4">📍 Nous trouver</h3>
            <div className="bg-gray-100 h-48 rounded-btn flex items-center justify-center text-gray-400 text-sm mb-4">
              [Carte OpenStreetMap — Campus Université Cadi Ayyad, Marrakech]
            </div>
            <p className="text-sm text-gray-600">Campus Universitaire, Avenue Abdelkrim Al Khattabi, Marrakech 40000, Maroc</p>
          </div>

          <div className="bg-white rounded-card shadow-card p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-charcoal">📞 Téléphone</p>
              <p className="text-sm text-gray-600">+212 524 000 000</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">📧 Email</p>
              <p className="text-sm text-gray-600">bonjour@healthybowl.ma</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">🕐 Horaires</p>
              <p className="text-sm text-gray-600">Lundi – Vendredi : 11h – 21h</p>
              <p className="text-sm text-gray-600">Samedi : 11h – 17h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
