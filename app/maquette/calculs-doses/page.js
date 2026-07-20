// /calculs-doses mène directement à la première fiche (le produit en croix).
// À la bascule : transformer en redirection permanente (308) dans next.config
// pour transmettre l'autorité SEO de l'ancienne URL vers la fiche.
import { redirect } from 'next/navigation'

export default function CalculsDosesIndex() {
  redirect('/maquette/calculs-doses/produit-en-croix')
}
