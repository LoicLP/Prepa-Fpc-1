// Hub des fiches de calculs : une page d'aperçu qui mène aux 4 fiches (SEO)
import { THEMES } from './themes'

export const metadata = {
  title: 'Calculs de doses infirmier : les 4 méthodes pour le concours FPC',
  description: "4 fiches gratuites avec exercices corrigés : produit en croix, débit de perfusion en gouttes/min, conversions g/mg/µg et concentrations en %.",
}

const DESCRIPTIONS = [
  "La méthode pour passer des mg aux ml et réussir n'importe quel calcul de dose.",
  'La formule des gouttes par minute, avec tableau de référence ×20 et ×60.',
  'g, mg, µg (mcg) : la méthode de la virgule qui saute 3 rangs.',
  'X % = X g pour 100 ml : lire une étiquette G5% ou NaCl 0,9 %.',
]

export default function CalculsDosesHub() {
  return (
    <>
      <section className="relative px-5 pt-[110px] md:pt-[150px] pb-4 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08]">
            Maîtrisez les <span className="surligne">calculs du concours</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-black/55 font-medium leading-relaxed">
            Les 4 notions indispensables pour l&apos;épreuve de calculs, expliquées simplement — avec exercices corrigés.
          </p>
        </div>
      </section>

      <section className="px-5 pt-10 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          {THEMES.map((t, i) => (
            <a
              key={t.slug}
              href={`/maquette/calculs-doses/${t.slug}`}
              className="group relative bg-white ring-1 ring-black/[0.07] rounded-[24px] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-5 shadow-md" style={{background: t.grad, boxShadow: `0 8px 18px ${t.couleur}35`}}>{i + 1}</div>
              <h2 className="text-lg font-extrabold tracking-tight mb-2">{t.titre}</h2>
              <p className="text-sm text-black/55 font-medium leading-relaxed mb-5">{DESCRIPTIONS[i]}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors" style={{color: t.couleur}}>
                Ouvrir la fiche
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
