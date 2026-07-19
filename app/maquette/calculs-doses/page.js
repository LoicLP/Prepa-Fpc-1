'use client'
import { useState, useEffect } from 'react'

// Fond quadrillé « papier à petits carreaux » des fiches
const QUADRILLAGE = {
  backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
  backgroundSize: '16px 16px'
}

// ==================== FICHE 1 — PRODUIT EN CROIX ====================
function FicheProduitEnCroix() {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le principe en une phrase</p>
      <div className="bg-red-50 border border-slate-200 rounded-2xl p-5 mb-7 text-sm text-slate-700 leading-relaxed">
        Tu connais <strong className="text-red-600">3 valeurs sur 4</strong> dans un tableau. Tu veux trouver la 4e.<br/>Tu <strong className="text-red-600">multiplies en diagonale</strong>, puis tu <strong className="text-red-600">divises par la valeur restante</strong>.
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La méthode en 3 étapes</p>
      <div className="space-y-3 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">1</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Pose ton tableau</strong> — à gauche ce que tu as, à droite ce que tu cherches. Vérifie que les <mark className="bg-red-100 text-inherit px-1 rounded">unités correspondent</mark> ligne par ligne.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">2</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Multiplie en diagonale</strong> — les deux valeurs qui se font face (celles que tu connais).</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">3</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Divise par la valeur restante</strong> — celle qui est seule dans son coin.</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le tableau en croix</p>
      <div className="flex flex-col items-center gap-3 mb-7">
        <div className="grid grid-cols-2 rounded-2xl overflow-hidden border-2 border-slate-200 w-full max-w-72 bg-white">
          <div className="bg-slate-50 p-2.5 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border border-slate-200">Quantité</div>
          <div className="bg-slate-50 p-2.5 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border border-slate-200">Volume</div>
          <div className="p-4 text-center font-bold text-slate-900 border border-slate-200">500 mg</div>
          <div className="p-4 text-center font-bold text-slate-900 border border-slate-200">5 ml</div>
          <div className="p-4 text-center font-bold text-slate-900 border border-slate-200">750 mg</div>
          <div className="p-4 text-center font-black text-red-700 text-lg bg-slate-50 border border-slate-200">? ml</div>
        </div>
        <p className="text-xs text-slate-500 font-semibold text-center">On multiplie <span className="text-red-600 font-extrabold">750 × 5</span> (diagonale connue) puis on divise par <span className="text-slate-900 font-extrabold">500</span></p>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 1 — Amoxicilline</p>
      <div className="bg-red-50 border border-slate-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-red-700 font-extrabold">750 mg</span> d&apos;amoxicilline. Disponible : flacon de <span className="text-red-700 font-extrabold">500 mg / 5 ml</span>.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 1 — Je pose mon tableau</p>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 w-full max-w-fit mx-auto mb-4 bg-white">
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200"></div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Quantité</div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Volume</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je sais</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">500 mg</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">5 ml</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je cherche</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">750 mg</div>
          <div className="p-2.5 px-4 text-center font-black text-red-700 bg-red-100 border border-slate-200">?</div>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 2 &amp; 3 — Diagonale / restante</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          (750 × 5) / 500 = 3 750 / 500 = <span className="text-red-700 font-black text-base">7,5 ml</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 2 — Paracétamol</p>
      <div className="bg-red-50 border border-slate-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-red-700 font-extrabold">200 mg</span> de paracétamol. Disponible : sirop <span className="text-red-700 font-extrabold">120 mg / 5 ml</span>.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 1 — Je pose mon tableau</p>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 w-full max-w-fit mx-auto mb-4 bg-white">
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200"></div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Quantité</div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Volume</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je sais</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">120 mg</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">5 ml</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je cherche</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">200 mg</div>
          <div className="p-2.5 px-4 text-center font-black text-red-700 bg-red-100 border border-slate-200">?</div>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 2 &amp; 3 — Diagonale / restante</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          (200 × 5) / 120 = 1 000 / 120 ≈ <span className="text-red-700 font-black text-base">8,3 ml</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 3 — Piège unités !</p>
      <div className="bg-red-50 border border-slate-200 rounded-2xl p-5 mb-7">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-red-700 font-extrabold">0,5 g</span> de médicament. Disponible : ampoule de <span className="text-red-700 font-extrabold">250 mg / 2 ml</span>.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 1 — Je convertis d&apos;abord !</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> 0,5 g = 0,5 x 1 000 = <strong>500 mg</strong></p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 2 — Je pose mon tableau</p>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 w-full max-w-fit mx-auto mb-4 bg-white">
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200"></div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Quantité</div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Volume</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je sais</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">250 mg</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">2 ml</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je cherche</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">500 mg</div>
          <div className="p-2.5 px-4 text-center font-black text-red-700 bg-red-100 border border-slate-200">?</div>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 mb-2">Étape 3 — Diagonale / restante</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          (500 x 2) / 250 = 1 000 / 250 = <span className="text-red-700 font-black text-base">4 ml</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Pièges fréquents</p>
      <div className="bg-red-50 border border-slate-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Unités différentes</strong> — Si la prescription est en g et le flacon en mg, convertis d&apos;abord ! (1 g = 1 000 mg)</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Valeurs inversées</strong> — Assure-toi que mg est avec mg et ml avec ml, sur la même colonne.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Résultat aberrant ?</strong> — Si tu trouves 75 ml de sirop pour un enfant, c&apos;est probablement faux. Vérifie toujours !</span></div>
      </div>
    </>
  )
}

// ==================== FICHE 2 — DÉBIT EN GOUTTES/MIN ====================
function FicheDebit() {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le principe en une phrase</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-7 text-sm text-slate-700 leading-relaxed">
        Tu connais le <strong className="text-slate-700">volume à perfuser</strong> et le <strong className="text-slate-700">temps prévu</strong>.<br/>Tu calcules combien de <strong className="text-slate-700">gouttes par minute</strong> doivent tomber pour que la perfusion se termine à temps.
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La clé : le type de tubulure</p>
      <div className="grid grid-cols-2 gap-3 mb-7">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Standard</p>
          <p className="text-3xl font-black text-slate-700 mb-1">x20</p>
          <p className="text-xs font-semibold text-slate-500">1 ml = 20 gouttes</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Pédiatrique</p>
          <p className="text-3xl font-black text-slate-700 mb-1">x60</p>
          <p className="text-xs font-semibold text-slate-500">1 ml = 60 gouttes</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La méthode en 3 étapes</p>
      <div className="space-y-3 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">1</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Repère tes données</strong> — le volume en ml et le temps en heures. Note le type de tubulure (<mark className="bg-slate-100 text-inherit px-1 rounded">x20</mark> ou <mark className="bg-slate-100 text-inherit px-1 rounded">x60</mark>).</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">2</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Au numérateur</strong> — multiplie le volume par le facteur de gouttes (20 ou 60). C&apos;est le <mark className="bg-slate-100 text-inherit px-1 rounded">nombre total de gouttes</mark>.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">3</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Au dénominateur</strong> — convertis le temps en minutes (heures x 60). Puis divise. <mark className="bg-slate-100 text-inherit px-1 rounded">Arrondi à l&apos;entier</mark> !</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La formule décomposée</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-7 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <div className="text-center"><div className="bg-slate-200 text-slate-900 font-black text-base sm:text-lg px-3 sm:px-4 py-2 rounded-xl">?</div><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Débit</p></div>
        <span className="text-xl sm:text-2xl font-black text-slate-300">=</span>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 sm:gap-2 pb-2">
            <div className="text-center"><div className="bg-slate-100 text-slate-800 font-black text-base sm:text-lg px-2.5 sm:px-4 py-2 rounded-xl">Vol</div><p className="text-[10px] font-bold text-slate-400 mt-1">en ml</p></div>
            <span className="text-lg sm:text-xl font-black text-slate-300">x</span>
            <div className="text-center"><div className="bg-slate-100 text-slate-800 font-black text-base sm:text-lg px-2.5 sm:px-4 py-2 rounded-xl">20</div><p className="text-[10px] font-bold text-slate-400 mt-1">gttes/ml</p></div>
          </div>
          <div className="w-full h-[3px] bg-slate-400 rounded"></div>
          <div className="flex items-center gap-1.5 sm:gap-2 pt-2">
            <div className="text-center"><div className="bg-slate-100 text-slate-800 font-black text-sm sm:text-lg px-2 sm:px-4 py-2 rounded-xl">Heures</div><p className="text-[10px] font-bold text-slate-400 mt-1">durée</p></div>
            <span className="text-lg sm:text-xl font-black text-slate-300">x</span>
            <div className="text-center"><div className="bg-slate-100 text-slate-800 font-black text-base sm:text-lg px-2.5 sm:px-4 py-2 rounded-xl">60</div><p className="text-[10px] font-bold text-slate-400 mt-1">min/h</p></div>
          </div>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 1 — Perfusion standard</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-slate-800 font-extrabold">1 000 ml</span> de NaCl en <span className="text-slate-800 font-extrabold">6 heures</span>. Tubulure standard x20.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Étape 1 — Je repère mes données</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> Volume = 1 000 ml</p>
          <p><span className="text-slate-400 mr-1">.</span> Temps = 6 h = 6 x 60 = 360 min</p>
          <p><span className="text-slate-400 mr-1">.</span> Tubulure standard = 20 gttes/ml</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Étape 2 &amp; 3 — Je calcule</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> Numérateur : 1 000 x 20 = 20 000 gouttes</p>
          <p><span className="text-slate-400 mr-1">.</span> Dénominateur : 6 x 60 = 360 minutes</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> 20 000 / 360 ≈ <span className="text-slate-800 font-black text-base">56 gouttes/min</span></p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 2 — Formule simplifiée</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-slate-800 font-extrabold">250 ml</span> en <span className="text-slate-800 font-extrabold">2 heures</span>. Tubulure standard x20.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Astuce : 20 / 60 = 1/3</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> (Vol x 20) / (Heures x 60) = Vol / (Heures x 3)</p>
          <p><span className="text-slate-400 mr-1">.</span> = 250 / (2 x 3) = 250 / 6</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> ≈ <span className="text-slate-800 font-black text-base">42 gouttes/min</span></p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 3 — Perfusion pédiatrique</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-7">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-slate-200">Prescription : <span className="text-slate-800 font-extrabold">100 ml</span> de G5% en <span className="text-slate-800 font-extrabold">4 heures</span>. Tubulure pédiatrique x60.</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Calcul avec tubulure pédiatrique</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> Numérateur : 100 x 60 = 6 000 gouttes</p>
          <p><span className="text-slate-400 mr-1">.</span> Dénominateur : 4 x 60 = 240 minutes</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> 6 000 / 240 = <span className="text-slate-800 font-black text-base">25 gouttes/min</span></p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Pièges fréquents</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Standard ou pédiatrique ?</strong> — Confondre x20 et x60 change complètement le résultat.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Heures ≠ minutes</strong> — Si on te donne 6h, convertis : 6 x 60 = 360 min. Si c&apos;est déjà en minutes, ne multiplie pas !</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Toujours arrondir à l&apos;entier</strong> — Une goutte ne se coupe pas en deux. 41,6 → 42 gouttes/min.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Résultat aberrant ?</strong> — Un débit &gt; 150 ou &lt; 5 gttes/min devrait te mettre la puce à l&apos;oreille.</span></div>
      </div>
    </>
  )
}

// ==================== FICHE 3 — CONVERSIONS DE MASSE ====================
function FicheConversions() {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le principe en une phrase</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-7 text-sm text-slate-700 leading-relaxed">
        En pharmacie, les doses s&apos;expriment en <strong className="text-yellow-700">g</strong>, <strong className="text-yellow-700">mg</strong> ou <strong className="text-yellow-700">µg</strong>.<br/>Pour passer d&apos;une unité à l&apos;autre, on <strong className="text-yellow-700">multiplie ou divise par 1 000</strong>. La virgule se déplace de <strong className="text-yellow-700">3 rangs</strong>.
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">L&apos;échelle des unités</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-0 mb-7 flex-wrap">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center w-full sm:w-36">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-1">Gramme</p>
          <p className="text-2xl font-black text-yellow-700">1 g</p>
        </div>
        <div className="flex flex-col items-center px-2 py-1 sm:py-0">
          <p className="text-[10px] font-extrabold text-yellow-600 hidden sm:block">x 1 000 →</p>
          <p className="text-[10px] font-extrabold text-yellow-500 hidden sm:block">← / 1 000</p>
          <p className="text-[10px] font-extrabold text-yellow-600 sm:hidden">↕ x 1 000</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center w-full sm:w-36">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-1">Milligramme</p>
          <p className="text-2xl font-black text-yellow-700">1 000 mg</p>
        </div>
        <div className="flex flex-col items-center px-2 py-1 sm:py-0">
          <p className="text-[10px] font-extrabold text-yellow-600 hidden sm:block">x 1 000 →</p>
          <p className="text-[10px] font-extrabold text-yellow-500 hidden sm:block">← / 1 000</p>
          <p className="text-[10px] font-extrabold text-yellow-600 sm:hidden">↕ x 1 000</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center w-full sm:w-36">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-1">Microgramme</p>
          <p className="text-xl font-black text-yellow-700">1 000 000 µg</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le truc à retenir</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-7 space-y-3">
        <div className="flex items-center gap-3">
          <span className="bg-yellow-200 text-yellow-800 font-extrabold text-xs px-3 py-1 rounded-lg shrink-0">→ Droite</span>
          <p className="text-sm text-slate-700">Vers une unité <strong>plus petite</strong> (g → mg → µg) : <mark className="bg-yellow-100 text-inherit px-1 rounded">x 1 000</mark></p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-yellow-200 text-yellow-800 font-extrabold text-xs px-3 py-1 rounded-lg shrink-0">← Gauche</span>
          <p className="text-sm text-slate-700">Vers une unité <strong>plus grande</strong> (µg → mg → g) : <mark className="bg-yellow-100 text-inherit px-1 rounded">/ 1 000</mark></p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La méthode en 2 étapes</p>
      <div className="space-y-3 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-yellow-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">1</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Dans quel sens je vais ?</strong> — De g vers mg = unité plus petite → je multiplie. De µg vers mg = unité plus grande → je divise.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-yellow-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">2</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Je déplace la virgule de 3 rangs</strong> — vers la droite si x 1 000, vers la gauche si / 1 000. S&apos;il manque des chiffres, j&apos;ajoute des zéros.</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 1 — Gramme vers milligramme</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-yellow-300">Convertir <span className="text-yellow-700 font-extrabold">0,075 g</span> en <span className="text-yellow-700 font-extrabold">mg</span></p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 1 — Dans quel sens ?</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> g vers mg = unité plus petite → je <strong>multiplie</strong> par 1 000</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 2 — Je déplace la virgule</p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center mb-3">
          <p className="text-2xl font-black text-slate-900 tracking-widest">0<span className="text-yellow-600">,</span>075</p>
          <p className="text-xs font-bold text-yellow-600 my-2">virgule → 3 rangs vers la droite</p>
          <p className="text-2xl font-black text-slate-900 tracking-widest">0<span className="text-yellow-600">75</span><span className="text-yellow-600">,</span>0</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          0,075 g = 0,075 x 1 000 = <span className="text-yellow-700 font-black text-base">75 mg</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 2 — Microgramme vers milligramme</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-yellow-300">Convertir <span className="text-yellow-700 font-extrabold">2 500 µg</span> en <span className="text-yellow-700 font-extrabold">mg</span></p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 1 — Dans quel sens ?</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> µg vers mg = unité plus grande → je <strong>divise</strong> par 1 000</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 2 — Je déplace la virgule</p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center mb-3">
          <p className="text-2xl font-black text-slate-900 tracking-widest">2500<span className="text-yellow-600">,</span>0</p>
          <p className="text-xs font-bold text-yellow-600 my-2">virgule ← 3 rangs vers la gauche</p>
          <p className="text-2xl font-black text-slate-900 tracking-widest">2<span className="text-yellow-600">,</span><span className="text-yellow-600">500</span></p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          2 500 µg = 2 500 / 1 000 = <span className="text-yellow-700 font-black text-base">2,5 mg</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 3 — Double saut : g vers µg</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-7">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-yellow-300">Convertir <span className="text-yellow-700 font-extrabold">0,003 g</span> en <span className="text-yellow-700 font-extrabold">µg</span></p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 1 — Deux paliers à franchir</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> g → µg = 2 paliers → x 1 000 x 1 000 = <strong>x 1 000 000</strong></p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600 mb-2">Étape 2 — Virgule : 6 rangs vers la droite</p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center mb-3">
          <p className="text-2xl font-black text-slate-900 tracking-widest">0<span className="text-yellow-600">,</span>003000</p>
          <p className="text-xs font-bold text-yellow-600 my-2">virgule → 6 rangs vers la droite</p>
          <p className="text-2xl font-black text-slate-900 tracking-widest"><span className="text-yellow-600">3000</span><span className="text-yellow-600">,</span>0</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center font-bold text-sm text-slate-700">
          0,003 g = 0,003 x 1 000 000 = <span className="text-yellow-700 font-black text-base">3 000 µg</span>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Pièges fréquents</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Virgule dans le mauvais sens</strong> — Plus petit = droite (x), plus grand = gauche (/). Pense à l&apos;escalier.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Convertir AVANT de calculer</strong> — Si la prescription est en g et le flacon en mg, convertis d&apos;abord. Puis fais le produit en croix.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>mg ≠ µg → facteur 1 000 !</strong> — Confondre = donner 1 000 fois trop ou pas assez. Risque de <mark className="bg-yellow-100 text-inherit px-1 rounded">surdosage</mark>.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Zéros manquants</strong> — Si la virgule se déplace au-delà des chiffres, ajoute des zéros ! 5 mg → µg = 5 000 µg.</span></div>
      </div>
    </>
  )
}

// ==================== FICHE 4 — CONCENTRATION EN % ====================
function FicheConcentration() {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Le principe en une phrase</p>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-7 text-sm text-slate-700 leading-relaxed">
        Quand un produit est dosé en <strong className="text-violet-600">pourcentage</strong>, c&apos;est un nombre de <strong className="text-violet-600">grammes pour 100 ml</strong>.<br/>Si tu connais le volume total, tu peux calculer la <strong className="text-violet-600">masse de principe actif</strong>.
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La règle d&apos;or</p>
      <div className="bg-violet-200 border border-violet-300 rounded-2xl p-6 text-center mb-7">
        <p className="text-2xl font-black text-violet-900">X % = X g pour 100 ml</p>
        <p className="text-sm font-bold text-violet-700 mt-2">Le % TE DONNE directement le nombre de grammes. Il suffit de lire le chiffre !</p>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Traduction concrète</p>
      <div className="space-y-2 mb-7">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 font-black text-lg text-violet-600 shrink-0">G5%</div>
          <div className="text-slate-400 px-2">→</div>
          <div className="px-4 py-3 text-sm font-bold text-slate-700 bg-white flex-1"><span className="text-violet-600 font-extrabold">5 g</span> de glucose dans 100 ml</div>
        </div>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 font-black text-lg text-violet-600 shrink-0">Bétadine 10%</div>
          <div className="text-slate-400 px-2">→</div>
          <div className="px-4 py-3 text-sm font-bold text-slate-700 bg-white flex-1"><span className="text-violet-600 font-extrabold">10 g</span> de povidone iodée dans 100 ml</div>
        </div>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 font-black text-lg text-violet-600 shrink-0">NaCl 0,9%</div>
          <div className="text-slate-400 px-2">→</div>
          <div className="px-4 py-3 text-sm font-bold text-slate-700 bg-white flex-1"><span className="text-violet-600 font-extrabold">0,9 g</span> de chlorure de sodium dans 100 ml</div>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">La méthode en 3 étapes</p>
      <div className="space-y-3 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">1</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Lis le %</strong> — c&apos;est le nombre de grammes pour 100 ml. Ex : G5% → <mark className="bg-violet-100 text-inherit px-1 rounded">5 g / 100 ml</mark>.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">2</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Regarde le volume réel</strong> — le flacon fait combien de ml ? Si c&apos;est en litres, convertis d&apos;abord (<mark className="bg-violet-100 text-inherit px-1 rounded">1 L = 1 000 ml</mark>).</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">3</div>
          <p className="text-sm text-slate-700"><strong className="text-slate-900">Produit en croix</strong> — si c&apos;est 100 ml, lis directement. Sinon, pose le tableau et calcule.</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 1 — G5%, flacon 500 ml</p>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-violet-200">Combien de grammes de glucose dans un flacon de <span className="text-violet-600 font-extrabold">G5%</span> de <span className="text-violet-600 font-extrabold">500 ml</span> ?</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 1 — Je traduis le %</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> G5% = 5 g de glucose pour 100 ml</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 2 — Je pose mon tableau</p>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 w-full max-w-fit mx-auto mb-3 bg-white">
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200"></div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Masse</div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Volume</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je sais</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">5 g</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">100 ml</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je cherche</div>
          <div className="p-2.5 px-4 text-center font-black text-violet-600 bg-violet-50 border border-slate-200">?</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">500 ml</div>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 3 — Produit en croix</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> (5 x 500) / 100 = 2 500 / 100</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> = <span className="text-violet-600 font-black text-base">25 g</span> de glucose</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 2 — Bétadine 10%, flacon 125 ml</p>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-violet-200">Combien de grammes dans un flacon de <span className="text-violet-600 font-extrabold">Bétadine 10%</span> de <span className="text-violet-600 font-extrabold">125 ml</span> ?</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Calcul</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> 10% = 10 g pour 100 ml</p>
          <p><span className="text-slate-400 mr-1">.</span> (10 x 125) / 100 = 1 250 / 100</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> = <span className="text-violet-600 font-black text-base">12,5 g</span> de povidone iodée</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Exemple 3 — NaCl 0,9%, poche 1 L (piège !)</p>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-7">
        <p className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-dashed border-violet-200">Combien de grammes de NaCl dans une poche de <span className="text-violet-600 font-extrabold">NaCl 0,9%</span> de <span className="text-violet-600 font-extrabold">1 L</span> ?</p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 1 — Je traduis le %</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> 0,9% = <strong>0,9 g</strong> pour 100 ml (pas 9 g !)</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 2 — Je convertis les litres</p>
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-600">
          <p><span className="text-slate-400 mr-1">.</span> 1 L = <strong>1 000 ml</strong></p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-2">Étape 3 — Produit en croix</p>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 w-full max-w-fit mx-auto mb-3 bg-white">
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200"></div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Masse</div>
          <div className="bg-slate-50 p-2 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Volume</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je sais</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">0,9 g</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">100 ml</div>
          <div className="bg-slate-50 p-2 px-3 text-center text-[9px] font-extrabold uppercase text-slate-400 border border-slate-200">Je cherche</div>
          <div className="p-2.5 px-4 text-center font-black text-violet-600 bg-violet-50 border border-slate-200">?</div>
          <div className="p-2.5 px-4 text-center font-bold text-sm border border-slate-200">1 000 ml</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><span className="text-slate-400 mr-1">.</span> (0,9 x 1 000) / 100 = 900 / 100</p>
          <p className="pt-2 border-t border-dashed border-slate-200 font-bold text-slate-900"><span className="text-slate-400 mr-1">.</span> = <span className="text-violet-600 font-black text-base">9 g</span> de NaCl</p>
        </div>
      </div>

      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Pièges fréquents</p>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>0,9% ≠ 9 g pour 100 ml</strong> — Le chiffre du % EST le nombre de grammes. 0,9% = 0,9 g. Lis tel quel !</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>Litres → millilitres</strong> — Le % est défini pour 100 ml. Si l&apos;énoncé donne des litres, convertis d&apos;abord.</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>% ≠ g/L</strong> — 5% = 5 g pour 100 ml = 50 g/L. Ne confonds pas, le facteur est de 10 !</span></div>
        <div className="flex items-start gap-2.5 text-sm text-slate-700"><span className="shrink-0 font-bold">.</span><span><strong>100 ml pile ?</strong> — Pas besoin de calcul ! G5% en 100 ml = 5 g, point.</span></div>
      </div>
    </>
  )
}

// Les 4 thèmes du sélecteur
const THEMES = [
  { titre: 'Le Produit en croix', court: 'Produit en croix', couleur: '#dc2626', bord: '#fca5a5' },
  { titre: 'Débit en gouttes / min', court: 'Débit gouttes/min', couleur: '#334155', bord: '#94a3b8' },
  { titre: 'Conversions de masse', court: 'Conversions', couleur: '#ca8a04', bord: '#fde047' },
  { titre: 'Concentration en %', court: 'Concentration %', couleur: '#7c3aed', bord: '#c4b5fd' },
]

export default function MaquetteCalculsDosesPage() {
  const [actif, setActif] = useState(0)

  // Fade-in au scroll (même mécanique que la page d'accueil)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const theme = THEMES[actif]

  return (
    <>
      {/* ===================== EN-TÊTE ===================== */}
      <section className="relative px-5 pt-[110px] md:pt-[150px] pb-4 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08]">
            Maîtrisez les <span className="surligne">calculs du concours</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-black/55 font-medium leading-relaxed">
            Les 4 fiches de révision indispensables pour l&apos;épreuve de calculs.
          </p>
        </div>
      </section>

      {/* ===================== SÉLECTEUR + FICHE ===================== */}
      <section className="relative px-5 pt-8 pb-16 sm:pb-24">
        {/* Décorations */}
        <div aria-hidden="true" className="absolute top-40 -left-24 w-80 h-64 bg-red-500/[0.06] rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute bottom-24 -right-20 w-72 h-56 bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-2xl mx-auto">
          {/* Les 4 interrupteurs de thème */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 bg-black/[0.04] rounded-3xl sm:rounded-full p-2 mb-10 max-w-fit mx-auto">
            {THEMES.map((t, i) => (
              <button
                key={i}
                onClick={() => setActif(i)}
                className="px-4 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                style={actif === i
                  ? { backgroundColor: t.couleur, color: '#ffffff', boxShadow: `0 6px 16px ${t.couleur}55` }
                  : { color: 'rgba(0,0,0,0.5)' }}
              >{t.court}</button>
            ))}
          </div>

          {/* La fiche active */}
          <div key={actif} className="slide-in bg-white rounded-[28px] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.07)]" style={{...QUADRILLAGE, border: `2px solid ${theme.bord}`}}>
            <div className="relative mb-7 text-center">
              <span className="absolute left-0 -top-1 w-9 h-9 rounded-full border-2 flex items-center justify-center font-extrabold text-base" style={{borderColor: theme.couleur, color: theme.couleur}}>{actif + 1}</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{theme.titre}</h2>
            </div>
            {actif === 0 && <FicheProduitEnCroix />}
            {actif === 1 && <FicheDebit />}
            {actif === 2 && <FicheConversions />}
            {actif === 3 && <FicheConcentration />}
          </div>
        </div>
      </section>

      {/* ===================== APPEL À L'ACTION ===================== */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 sm:py-20 px-5 fade-in-up">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-[28rem] h-[20rem] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white mb-4">Prêt à passer à la pratique&nbsp;?</h2>
          <p className="text-white/55 font-medium leading-relaxed mb-8">Inscrivez-vous et entraînez-vous sur des exercices illimités, avec correction détaillée à chaque question.</p>
          <a href="/maquette/auth?mode=signup" className="btn-shine inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition shadow-lg shadow-red-600/25 group">
            Commencer à m&apos;entraîner
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </>
  )
}
