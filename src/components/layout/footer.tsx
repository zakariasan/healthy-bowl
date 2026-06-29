import Link from "next/link";
import { Leaf, MapPin, Phone, Mail } from "lucide-react";

const LINKS = {
  menu: [
    { href: "/menu/salades", label: "Salades" },
    { href: "/menu/bowls", label: "Bowls" },
    { href: "/menu/jus-smoothies", label: "Jus & Smoothies" },
    { href: "/menu/snacks", label: "Snacks" },
  ],
  info: [
    { href: "/concept", label: "Notre concept" },
    { href: "/nutrition", label: "Nutrition" },
    { href: "/durabilite", label: "Durabilité" },
    { href: "/partenaires", label: "Partenaires" },
    { href: "/a-propos", label: "À propos" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "CGV" },
    { href: "/cgu", label: "CGU" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-gray-300 mt-auto">
      {/* Newsletter */}
      <div className="bg-brand-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">
                Restez inspiré 🥗
              </h3>
              <p className="text-green-100 text-sm">
                Recettes, conseils nutrition, offres exclusives — directs dans votre boîte mail.
              </p>
            </div>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="bonjour@healthy-bowl.com"
                required
                className="flex-1 md:w-64 px-4 py-2.5 rounded-btn text-sm text-charcoal focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-brand-green font-semibold rounded-btn text-sm hover:bg-cream transition-colors"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Leaf className="h-5 w-5 text-brand-leaf" />
              Healthy Bowl
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Manger mieux sans sacrifier le temps ni le plaisir. Bowls frais, préparés en moins de 7 minutes.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-leaf shrink-0" />
                <span>Rue Amerchich, Marrakech 40000, Marrakech</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-leaf shrink-0" />
                <span>+212 524-446235</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-leaf shrink-0" />
                <span>hello@healthybowl.ma</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              {LINKS.menu.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-brand-leaf transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/builder"
                  className="text-sm text-brand-leaf hover:text-brand-leaf/80 transition-colors font-medium"
                >
                  Composer mon bowl →
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              {LINKS.info.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-brand-leaf transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              {LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-brand-leaf transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com/healthybowlma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-leaf transition-colors text-sm"
                aria-label="Instagram"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Healthy Bowl. Tous droits réservés.</p>
          <p>Made with 💚 au Maroc · #MyHealthyBowl</p>
        </div>
      </div>
    </footer>
  );
}
