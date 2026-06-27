"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Leaf, ArrowRight, Eye, EyeOff, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#ffffff"
      />
    </svg>
  )
}

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  isStudent: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>()

  const password = watch("password")

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          isStudent: data.isStudent,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.message ?? "Erreur lors de la création du compte.")
        return
      }
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2500)
    } catch {
      setError("Erreur réseau. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-9 w-9 bg-brand-green rounded-xl flex items-center justify-center group-hover:bg-brand-leaf transition-colors">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black text-brand-green">Healthy Bowl</span>
          </Link>
          <h1 className="text-2xl font-black text-charcoal mt-4 mb-1">
            Créez votre compte gratuit
          </h1>
          <p className="text-muted text-sm">Rejoignez +2 000 personnes qui mangent mieux chaque jour.</p>
        </div>

        {/* Welcome offer banner */}
        <div className="mb-6 flex items-start gap-3 bg-gradient-to-r from-brand-light to-emerald-50 border border-brand-leaf/20 rounded-card px-4 py-3.5">
          <Gift className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-brand-green">Offre de bienvenue</p>
            <p className="text-xs text-muted leading-relaxed">
              Créez votre compte et recevez le code{" "}
              <span className="font-mono font-black text-brand-green bg-white px-1.5 py-0.5 rounded border border-brand-leaf/20">
                BIENVENUE20
              </span>{" "}
              — -20% sur votre 1ère commande.
            </p>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-card px-6 py-8 text-center animate-scale-in">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-black text-lg">Compte créé avec succès !</p>
            <p className="text-sm mt-1.5">
              Votre code <strong>BIENVENUE20</strong> a été envoyé par email.
            </p>
            <p className="text-xs text-green-600 mt-2">Redirection vers la connexion…</p>
          </div>
        ) : (
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
            {/* Social signup */}
            <div className="space-y-3 mb-5">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/compte" })}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-btn h-12 font-medium text-charcoal text-sm transition-all"
              >
                <GoogleLogo />
                S&apos;inscrire avec Google
              </button>

              <button
                type="button"
                onClick={() => signIn("facebook", { callbackUrl: "/compte" })}
                className="w-full flex items-center justify-center gap-3 rounded-btn h-12 font-medium text-white text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#1877F2" }}
              >
                <FacebookLogo />
                S&apos;inscrire avec Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-muted whitespace-nowrap">ou avec email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Credentials form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-btn px-4 py-3 animate-fade-in">
                  {error}
                </div>
              )}

              <Input
                id="name"
                label="Nom complet"
                type="text"
                placeholder="Votre prénom et nom"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Le nom est requis.",
                  minLength: { value: 2, message: "Minimum 2 caractères." },
                })}
              />

              <Input
                id="email"
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "L'email est requis.",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide." },
                })}
              />

              {/* Password with toggle */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-btn border text-sm transition-colors border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    {...register("password", {
                      required: "Le mot de passe est requis.",
                      minLength: { value: 8, message: "Minimum 8 caractères." },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[0-9])/,
                        message: "Doit contenir une majuscule et un chiffre.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-xs text-danger">{errors.password.message}</p>
                ) : (
                  <p className="text-xs text-muted">8 caractères minimum, une majuscule et un chiffre.</p>
                )}
              </div>

              {/* Confirm password with toggle */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-btn border text-sm transition-colors border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    {...register("confirmPassword", {
                      required: "Veuillez confirmer votre mot de passe.",
                      validate: (val) =>
                        val === password || "Les mots de passe ne correspondent pas.",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    aria-label={showConfirm ? "Masquer" : "Afficher"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Student checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-btn border border-gray-100 hover:border-brand-leaf hover:bg-brand-light/50 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
                  {...register("isStudent")}
                />
                <div>
                  <span className="text-sm font-medium text-charcoal block">
                    Je suis étudiant(e)
                  </span>
                  <span className="text-xs text-muted">
                    Bénéficiez du tarif étudiant -15% permanent avec votre carte valide
                  </span>
                </div>
              </label>

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="w-full group font-black"
              >
                Créer mon compte gratuit
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-xs text-muted leading-relaxed">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/cgu" className="text-brand-green hover:underline">
                  CGU
                </Link>{" "}
                et notre{" "}
                <Link href="/confidentialite" className="text-brand-green hover:underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-brand-green font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
