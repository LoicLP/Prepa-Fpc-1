import "./globals.css";

const siteUrl = "https://prepa-fpc.vercel.app";
const siteName = "Prépa FPC";
const description = "Préparez le concours FPC infirmier (passerelle IFSI) avec des QCM de maths, calculs de doses, simulations d'oral et cours de culture sanitaire et sociale. La plateforme de référence pour les aides-soignants et auxiliaires de puériculture.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prépa FPC — Préparation au concours infirmier passerelle IFSI",
    template: "%s | Prépa FPC",
  },
  description,
  keywords: [
    "concours FPC infirmier",
    "passerelle IFSI",
    "préparation concours infirmier",
    "concours aide-soignant infirmier",
    "concours auxiliaire puériculture infirmier",
    "QCM concours infirmier",
    "calculs de doses IFSI",
    "oral concours FPC",
    "formation professionnelle continue infirmier",
    "reconversion infirmier",
    "annales concours FPC",
    "exercices maths concours infirmier",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName,
    title: "Prépa FPC — Préparation au concours infirmier passerelle IFSI",
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prépa FPC - Préparation concours infirmier FPC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prépa FPC — Préparation au concours infirmier passerelle IFSI",
    description,
    images: ["/og-image.png"],
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
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='18' fill='%23dc2626'/><text x='50' y='70' font-size='42' font-weight='900' font-family='Arial,sans-serif' fill='white' text-anchor='middle'>FPC</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
