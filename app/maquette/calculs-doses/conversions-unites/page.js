import FichesCalculsDoses from '../fiches'

export const metadata = {
  title: 'Convertir mg, g et µg (mcg) : méthode et tableau des unités',
  description: "mcg en mg, mg en g, µg en mg : l'escalier des unités et la méthode de la virgule en 2 étapes, avec exercices corrigés pour le concours infirmier.",
}

export default function PageConversionsUnites() {
  return <FichesCalculsDoses actif={2} />
}
