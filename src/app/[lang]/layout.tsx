import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import PromoToast from "@/components/PromoToast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "@/components/CookieConsent";
import PushNotificationManager from "@/components/PushNotificationManager";
import "./../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HacooUltra — Los Mejores Enlaces y Cupones Hacoo 2026",
    template: "%s | Hacoo Ultra"
  },
  description:
    "Descubre los mejores productos de Hacoo con enlaces actualizados diariamente. Cupones de descuento exclusivos, ofertas flash y guía de compra para Hacoo. Usa el código ULTRA14 para un 14% extra.",
  metadataBase: new URL("https://hacoo-ultra.vercel.app/"), // Ajustar si el dominio es diferente
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/LOGO.png",
    apple: "/LOGO.png",
  },
  keywords: [
    "Hacoo",
    "Hacoo links",
    "Hacoo Ultra",
    "enlaces Hacoo",
    "cupones Hacoo",
    "descuentos Hacoo",
    "Hacoo 2026",
    "Hacoo España",
    "ULTRA14",
    "Hacoo app links",
  ],
  authors: [{ name: "Hacoo Ultra Team" }],
  creator: "Hacoo Ultra",
  openGraph: {
    title: "HacooUltra — Los Mejores Enlaces y Cupones Hacoo",
    description: "Los mejores productos de Hacoo al precio más bajo. Actualizado diariamente con nuevos enlaces y cupones exclusivos.",
    url: "https://hacooultra.com",
    siteName: "Hacoo Ultra",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/LOGO.png",
        width: 1200,
        height: 630,
        alt: "Hacoo Ultra Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HacooUltra — Enlaces y Cupones Hacoo",
    description: "Accede a los mejores links de Hacoo y ahorra con nuestros cupones exclusivos.",
    images: ["/LOGO.png"],
  },
  verification: {
    google: "ZbpTCx9Qqiaft36wwg0v3BzFPKMVc0h8RoH20qyin5Q",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Hacoo Ultra",
  "url": "https://hacooultra.com",
  "description": "Plataforma líder en enlaces y cupones para Hacoo.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://hacooultra.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "es";
  
  return (
    <html lang={lang} data-theme="dark" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <LanguageProvider initialLang={lang as any}>
                <ThemeProvider>
                  <div className="main-wrapper">
                    <Header />
                    <main id="main-content" className="pb-24 md:pb-0">
                      {children}
                    </main>

                    <Footer />
                    <MobileNavbar />
                    <PromoToast />
                    <PushNotificationManager />
                  </div>
                </ThemeProvider>
              </LanguageProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
