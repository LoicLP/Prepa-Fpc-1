'use client'

const Stethoscope = ({className}) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>

export default function CGUPage() {
  const sections = [
    {
      title: "Article 1 — Mentions légales",
      content: `Le site www.prepa-fpc.fr (ci-après "la Plateforme") est édité par :

• Raison sociale : LP Labs, SAS au capital de 50 €
• Siège social : 20 route de la Rousserie, 50200 Monthuchon, France
• SIRET : 102 976 990 00014
• Directeur de la publication : Paul Debruinier
• Contact : support@prepa-fpc.fr

Hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.`
    },
    {
      title: "Article 2 — Objet",
      content: `Les présentes Conditions Générales d'Utilisation (CGU) définissent les conditions d'accès et d'utilisation de la Plateforme Prépa FPC, destinée à la préparation du concours FPC d'entrée en IFSI (Institut de Formation en Soins Infirmiers) pour les professionnels en reconversion (aides-soignants, auxiliaires de puériculture).

La Plateforme propose des outils d'entraînement : QCM de mathématiques, exercices de calculs de doses, sujets de rédaction, examens blancs, préparation à l'oral et articles de blog informatifs.`
    },
    {
      title: "Article 3 — Acceptation des CGU",
      content: `L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. LP Labs se réserve le droit de modifier les CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. La poursuite de l'utilisation de la Plateforme après modification vaut acceptation des nouvelles CGU.`
    },
    {
      title: "Article 4 — Accès à la Plateforme",
      content: `La Plateforme est accessible gratuitement pendant une période d'essai de 7 jours à compter de l'inscription. Au-delà, l'accès aux fonctionnalités premium nécessite la souscription d'un abonnement payant.

LP Labs s'efforce d'assurer la disponibilité de la Plateforme 24h/24 et 7j/7, mais ne saurait être tenue responsable des interruptions pour maintenance, mises à jour ou cas de force majeure.`
    },
    {
      title: "Article 5 — Création de compte",
      content: `L'inscription est ouverte à toute personne physique majeure ou âgée d'au moins 17 ans. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants de connexion.

Chaque utilisateur est responsable de toute activité réalisée depuis son compte. En cas d'utilisation non autorisée, l'utilisateur doit en informer immédiatement LP Labs à support@prepa-fpc.fr.`
    },
    {
      title: "Article 6 — Utilisation de la Plateforme",
      content: `L'utilisateur s'engage à utiliser la Plateforme de manière conforme à sa destination. Sont notamment interdits :

• La reproduction, copie ou extraction du contenu de la Plateforme
• L'utilisation de robots, scripts ou outils automatisés
• Le partage de son compte ou de ses identifiants avec des tiers
• Toute tentative de contournement des mesures de sécurité
• La revente ou redistribution du contenu pédagogique`
    },
    {
      title: "Article 7 — Propriété intellectuelle",
      content: `L'ensemble des contenus de la Plateforme (textes, exercices, algorithmes, design, logos, code source) est la propriété exclusive de LP Labs et est protégé par le droit de la propriété intellectuelle.

L'utilisateur bénéficie d'un droit d'utilisation personnel et non cessible dans le cadre de sa préparation au concours FPC. Toute reproduction ou diffusion non autorisée constitue une contrefaçon sanctionnée pénalement.`
    },
    {
      title: "Article 8 — Contenu pédagogique",
      content: `Les exercices, QCM, sujets de rédaction et examens blancs proposés sur la Plateforme sont des outils d'entraînement complémentaires. Ils ne se substituent pas à une formation officielle et ne garantissent pas la réussite au concours FPC.

Les sujets générés par intelligence artificielle sont calibrés sur les annales officielles du concours mais peuvent comporter des approximations.`
    },
    {
      title: "Article 9 — Abonnements et paiements",
      content: `La Plateforme propose des abonnements payants (mensuel et annuel) dont les tarifs sont indiqués sur la page Tarifs. Les paiements sont sécurisés par Stripe.

• Abonnement mensuel : sans engagement, résiliable à tout moment
• Abonnement annuel : paiement unique pour 12 mois d'accès

La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata ne sera effectué pour la période restante. Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après l'achat.`
    },
    {
      title: "Article 10 — Protection des données personnelles",
      content: `Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, LP Labs collecte et traite les données personnelles suivantes :

• Données d'inscription : prénom, adresse email
• Données d'utilisation : historique d'exercices, scores, progression
• Données techniques : adresse IP, données de navigation

Ces données sont nécessaires à la fourniture du service et ne sont jamais vendues à des tiers. L'utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données en contactant support@prepa-fpc.fr.

Durée de conservation : les données sont conservées pendant la durée du compte et supprimées 12 mois après la dernière connexion.`
    },
    {
      title: "Article 11 — Cookies",
      content: `La Plateforme utilise des cookies essentiels au fonctionnement du service (authentification, préférences). Des cookies analytiques peuvent être utilisés pour mesurer l'audience du site.

L'utilisateur peut configurer son navigateur pour refuser les cookies optionnels. Le refus des cookies essentiels peut empêcher l'utilisation de certaines fonctionnalités.`
    },
    {
      title: "Article 12 — Limitation de responsabilité",
      content: `LP Labs ne saurait être tenue responsable :

• Des interruptions de service pour maintenance ou raisons techniques
• Des résultats obtenus au concours FPC
• De l'utilisation faite par l'utilisateur des contenus pédagogiques
• Des dommages indirects liés à l'utilisation de la Plateforme
• Du contenu des sites tiers accessibles par des liens hypertextes`
    },
    {
      title: "Article 13 — Suspension et résiliation",
      content: `LP Labs se réserve le droit de suspendre ou de supprimer un compte utilisateur, sans préavis ni indemnité, en cas de violation des présentes CGU, notamment en cas de fraude, d'utilisation abusive ou de comportement nuisible.`
    },
    {
      title: "Article 14 — Droit applicable et litiges",
      content: `Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux compétents de Coutances (Manche) seront seuls compétents.`
    },
    {
      title: "Article 15 — Contact",
      content: `Pour toute question relative aux présentes CGU ou à l'utilisation de la Plateforme :

• Email : support@prepa-fpc.fr
• Formulaire de contact : www.prepa-fpc.fr/contact
• Adresse : LP Labs, 20 route de la Rousserie, 50200 Monthuchon`
    }
  ]

  return (
    <div className="min-h-screen bg-[#eceef1] text-slate-900" style={{fontFamily: "'Nunito', sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-2 rounded-xl shadow-sm"><Stethoscope className="w-7 h-7" /></div>
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-900 block leading-none">Prépa <span className="text-red-600">FPC</span></span>
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">La passerelle IFSI</span>
            </div>
          </a>
          <a href="/" className="text-slate-600 font-semibold hover:text-slate-900 transition text-sm">Retour à l'accueil</a>
        </div>
      </nav>

      {/* CONTENU */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">Conditions Générales d'Utilisation</h1>
          <p className="text-slate-500 font-medium">Dernière mise à jour : 1er avril 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 mb-4">{section.title}</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{section.content}</div>
            </section>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p>&copy; 2026 Prépa FPC (prepa-fpc.fr). Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
