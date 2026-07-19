import FichesCalculsDoses from '../fiches'

export const metadata = {
  title: 'Concentration en % : X g pour 100 ml (G5%, NaCl 0,9 %)',
  description: 'Comprendre les concentrations en pourcentage : combien de grammes dans un G5% ou une poche de NaCl 0,9 % ? Méthode et exercices corrigés.',
}

export default function PageConcentrationPourcentage() {
  return <FichesCalculsDoses actif={3} />
}
