// Données des 4 thèmes de calculs — module neutre, importable côté serveur
// (métadonnées, hub) comme côté client (fiches interactives).
export const THEMES = [
  { slug: 'produit-en-croix', court: 'Produit en croix', titre: 'Le produit en croix', h1avant: 'Maîtrisez le ', h1marque: 'produit en croix', couleur: '#dc2626', marqueur: '#ef4444', clair: 'rgba(239,68,68,0.06)', grad: 'linear-gradient(145deg, #ef4444, #dc2626)' },
  { slug: 'debit-perfusion', court: 'Débit gouttes/min', titre: 'Débit en gouttes / min', h1avant: 'Calculez un débit en ', h1marque: 'gouttes par minute', couleur: '#2563eb', marqueur: '#3b82f6', clair: 'rgba(59,130,246,0.06)', grad: 'linear-gradient(145deg, #3b82f6, #2563eb)' },
  { slug: 'conversions-unites', court: 'Conversions', titre: 'Conversions de masse', h1avant: 'Convertissez ', h1marque: 'g, mg et µg (mcg)', couleur: '#ca8a04', marqueur: '#eab308', clair: 'rgba(234,179,8,0.08)', grad: 'linear-gradient(145deg, #eab308, #ca8a04)' },
  { slug: 'concentration-pourcentage', court: 'Concentration %', titre: 'Concentration en %', h1avant: 'Maîtrisez les ', h1marque: 'concentrations en %', couleur: '#7c3aed', marqueur: '#8b5cf6', clair: 'rgba(139,92,246,0.06)', grad: 'linear-gradient(145deg, #8b5cf6, #7c3aed)' },
]
