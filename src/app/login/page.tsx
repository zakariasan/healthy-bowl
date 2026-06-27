"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Leaf, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"
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


interface LoginForm {
  email: string
  password: string
}

const GOOGLE_READY = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleGoogle() {
    if (!GOOGLE_READY) {
      setError("Google OAuth n'est pas encore configuré. Connectez-vous avec email/mot de passe.")
      return
    }
    signIn("google", { callbackUrl: "/compte" })
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.")
      return
    }
    router.push("/compte")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: brand visual ── */}
      <div className="hidden lg:flex lg:w-[45%] gradient-green noise relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-brand-glow/10 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Healthy Bowl</span>
          </Link>
        </div>

        {/* Center hero */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
          {/* Floating bowl */}
          <div className="text-center mb-10">
            <div
              className="inline-block animate-float glow-green text-[7rem] leading-none select-none"
              aria-hidden="true"
            >
              🥗
            </div>
          </div>

          <h2 className="text-[2.6rem] font-black text-white leading-tight mb-3">
            Manger mieux,<br />
            <span className="text-brand-glow">aujourd&apos;hui.</span>
          </h2>
          <p className="text-green-200 text-base leading-relaxed mb-10 max-w-xs">
            Des bowls frais et personnalisés, prêts en moins de 7 minutes. Votre corps vous remerciera.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3">
            {[
              "100% ingrédients frais, sourcés localement",
              "Macros et allergènes sur chaque bowl",
              "Personnalisable selon votre profil nutritionnel",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="shrink-0 h-6 w-6 rounded-full bg-brand-glow/20 border border-brand-glow/30 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-glow" />
                </span>
                <span className="text-green-100 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof pill */}
        <div className="relative z-10">
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex -space-x-2 shrink-0">
              {["🧑‍💼", "👩‍🎓", "👨‍💻"].map((emoji, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center text-sm border-2 border-white/40"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">+2 000 clients satisfaits</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★★★★★</span>
                <span className="text-green-200 text-xs">4.9 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream">
        <div className="w-full max-w-[420px] animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Leaf className="h-6 w-6 text-brand-green" />
              <span className="text-2xl font-black text-brand-green">Healthy Bowl</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-charcoal mb-1.5">Bon retour&nbsp;! 👋</h1>
            <p className="text-muted text-sm">Connectez-vous pour accéder à vos bowls favoris.</p>
          </div>

          {/* Social buttons */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-btn h-12 font-medium text-charcoal text-sm transition-all"
            >
              <GoogleLogo />
              Continuer avec Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted whitespace-nowrap">ou continuer avec email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Credentials form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-btn px-4 py-3 animate-fade-in">
                {error}
              </div>
            )}

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

            {/* Password with show/hide toggle */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-btn border text-sm transition-colors border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  {...register("password", { required: "Le mot de passe est requis." })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link
                href="/mot-de-passe-oublie"
                className="text-sm text-brand-green hover:underline font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full group">
              Se connecter
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-brand-green font-semibold hover:underline">
              Créer un compte gratuit
            </Link>
          </p>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-muted">
            <span>🔒 Connexion sécurisée</span>
            <span>🛡️ Données protégées RGPD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
