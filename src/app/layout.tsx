import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WelcomeModal } from "@/components/ui/welcome-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Healthy Bowl — Manger mieux, sans sacrifier le plaisir",
    template: "%s | Healthy Bowl",
  },
  description:
    "Bowls et salades frais, personnalisés en moins de 7 min. Commandez en ligne, dîner sur place ou click & collect. Abonnements mensuels disponibles.",
  keywords: ["healthy food", "bowl", "salade", "nutrition", "Marrakech", "abonnement repas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WelcomeModal />
        </Providers>
      </body>
    </html>
  );
}
