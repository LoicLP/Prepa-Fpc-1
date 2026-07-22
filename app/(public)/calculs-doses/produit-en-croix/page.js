import FichesCalculsDoses from '../fiches'

export const metadata = {
  title: 'Produit en croix : convertir mg en ml (calcul de doses infirmier)',
  description: 'La méthode du produit en croix pas à pas pour vos calculs de doses : tableau, 3 étapes et exercices corrigés du concours infirmier FPC.',
}

export default function PageProduitEnCroix() {
  return <FichesCalculsDoses actif={0} />
}
