import FichesCalculsDoses from '../fiches'

export const metadata = {
  title: 'Formule des gouttes par minute : calculer un débit de perfusion',
  description: '1 ml = 20 gouttes : la formule du débit de perfusion en gouttes/min, un tableau de référence et des exercices corrigés (tubulure standard et pédiatrique).',
}

export default function PageDebitPerfusion() {
  return <FichesCalculsDoses actif={1} />
}
