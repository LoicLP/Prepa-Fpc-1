export const metadata = {
  title: "Blog",
  description: "Articles, témoignages et conseils pratiques pour réussir le concours FPC infirmier. Dates des concours, préparation écrit et oral, retours d'expérience de candidats admis en IFSI.",
  keywords: ["blog concours FPC", "témoignages concours infirmier", "conseils concours IFSI", "dates concours FPC", "préparation oral infirmier"],
  openGraph: {
    title: "Blog | Prépa FPC",
    description: "Articles, témoignages et conseils pratiques pour réussir le concours FPC infirmier.",
    type: "website",
  },
  alternates: {
    canonical: "https://www.prepa-fpc.fr/blog",
  },
}

export default function BlogLayout({ children }) {
  return children
}
