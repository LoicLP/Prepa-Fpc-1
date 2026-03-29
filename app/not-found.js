import Link from 'next/link'

export const metadata = { title: 'Page introuvable' }

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eceef1] flex items-center justify-center px-4" style={{fontFamily: "'Nunito', sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <span className="text-[150px] sm:text-[200px] font-black text-slate-200 leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Page introuvable</h1>
        <p className="text-slate-500 font-medium mb-8">Cette page n'existe pas ou a été déplacée. Pas de panique, retournez à l'accueil pour continuer vos révisions !</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl transition shadow-lg text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
            Retour à l'accueil
          </Link>
          <Link href="/dashboard" className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2">
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}
