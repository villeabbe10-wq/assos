import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Baby, 
  HeartHandshake, 
  Droplets,
  BookOpen,
  ArrowRight,
  Stethoscope,
  Globe,
  GraduationCap,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function Actions({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { t } = useTranslation();

  const missions = [
    {
      title: "Sensibiliser sur les maladies mortelles",
      desc: "Lutter contre la drépanocytose, les cancers et maladies tropicales négligées par l'information.",
      icon: Stethoscope,
      color: "bg-rose-50 text-rose-600",
      points: [
        "Mettre en lumière les maladies oubliées ou taboues",
        "Lutter contre la stigmatisation des malades",
        "Connaissances accessibles en langage simple et adapté"
      ]
    },
    {
      title: "Éduquer pour prévenir",
      desc: "La connaissance est un outil de santé publique. Beaucoup de pathologies graves peuvent être évitées.",
      icon: GraduationCap,
      color: "bg-indigo-50 text-indigo-600",
      points: [
        "Ateliers pédagogiques pour jeunes et femmes",
        "Vidéos, brochures et podcasts en langues locales",
        "Interventions scolaires et communautaires"
      ]
    },
    {
      title: "Programmes de santé durables",
      desc: "Collaborer avec les pros et ONG pour construire des programmes de prévention sur le long terme.",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600",
      points: [
        "Séances de dépistage gratuites et ponctuelles",
        "Formation des agents de santé communautaires",
        "Création de fiches de référence médicale simplifiée"
      ]
    }
  ];

  const actions = [
    {
      title: "Sensibilisation communautaire",
      desc: "Faire comprendre les enjeux de santé publique à toutes les couches de la population.",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      items: [
        "Sessions d’information dans les villages, marchés, écoles",
        "Supports visuels en langues locales (affiches, BD, vidéos)",
        "Témoignages d’anciens malades pour briser les tabous"
      ]
    },
    {
      title: "Prévention et mobilisation",
      desc: "Renforcer la coordination entre les acteurs de la promotion de la santé.",
      icon: Activity,
      color: "bg-emerald-100 text-emerald-600",
      items: [
        "Collaboration avec les structures sanitaires locales",
        "Mobilisation de professionnels pour dépistages gratuits",
        "Formations de leaders communautaires"
      ]
    },
    {
      title: "Campagnes de vaccination",
      desc: "Soutenir le Programme Élargi de Vaccination (PEV) pour tous.",
      icon: ShieldCheck,
      color: "bg-orange-100 text-orange-600",
      items: [
        "Mobilisation avant les campagnes nationales",
        "Relais d’information sur les calendriers vaccinaux",
        "Sensibilisation contre la méfiance vaccinale"
      ]
    },
    {
      title: "Soutien psychosocial",
      desc: "Offrir une écoute aux personnes isolées et fragiles.",
      icon: HeartHandshake,
      color: "bg-rose-100 text-rose-600",
      items: [
        "Visites à domicile ou en centre de soins",
        "Distribution de produits de première nécessité",
        "Activités de réinsertion sociale"
      ]
    },
    {
      title: "Éducation des enfants de la rue",
      desc: "Favoriser l’intégration par l’éducation et la culture.",
      icon: Baby,
      color: "bg-indigo-100 text-indigo-600",
      items: [
        "Ateliers éducatifs et artistiques",
        "Parrainage scolaire pour la réinsertion",
        "Suivi social individualisé"
      ]
    },
    {
      title: "Assainissement et hygiène",
      desc: "Améliorer la qualité de vie sanitaire en zones rurales.",
      icon: Droplets,
      color: "bg-sky-100 text-sky-600",
      items: [
        "Construction de latrines écologiques",
        "Distribution de savons et filtres à eau",
        "Gestion des déchets domestiques"
      ]
    }
  ];

  return (
    <div className="space-y-24 pb-20 text-slate-900">
      {/* MISSION HEADER */}
      <header className="text-center space-y-10 max-w-4xl mx-auto py-10 px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 3 }}
          className="w-20 h-20 bg-sky-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-sky-600/20"
        >
          <HeartPulse size={40} />
        </motion.div>
        
        <div className="space-y-6">
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
            Notre <span className="text-sky-600">Mission</span>, <br /> 
            votre <span className="text-orange-500 font-serif italic font-normal">avenir</span>.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed text-xl max-w-3xl mx-auto">
            "La santé est un droit fondamental qui commence par la connaissance. Nous transformons la peur en compréhension et l'isolement en solidarité."
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setActiveTab('donation')}
            className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl"
          >
            Soutenir la mission
          </button>
          <button 
            onClick={() => setActiveTab('volunteer')}
            className="bg-white border border-slate-200 text-slate-700 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Devenir volontaire
          </button>
        </div>
      </header>

      {/* MISSION PILLARS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {missions.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
          >
            <div className={`w-14 h-14 ${m.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
              <m.icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{m.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{m.desc}</p>
            
            <ul className="space-y-3">
              {m.points.map((p, pi) => (
                <li key={pi} className="flex gap-3 text-xs font-bold text-slate-400 items-start italic">
                  <Sparkles size={14} className="shrink-0 mt-0.5 text-sky-400" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* THE APPROACH */}
      <section className="bg-sky-50 rounded-[4rem] p-8 sm:p-20 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-sky-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              L'Approche SEDUCEP
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Éduquer pour prévenir, pas seulement pour soigner.
            </h3>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              Beaucoup de pathologies graves peuvent être évitées si les populations sont informées des facteurs de risque, des symptômes précoces et des bonnes pratiques.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-sky-100">
                <h4 className="font-black text-sky-600 text-xs uppercase tracking-widest mb-2">Langues Locales</h4>
                <p className="text-slate-500 text-sm font-bold leading-snug">Connaissances adaptées à la culture pour un impact réel.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-sky-100">
                <h4 className="font-black text-sky-600 text-xs uppercase tracking-widest mb-2">Ancrage Local</h4>
                <p className="text-slate-500 text-sm font-bold leading-snug">Collaboration étroite avec les chefs et leaders locaux.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-200 rounded-[4rem] overflow-hidden rotate-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-[280px] -rotate-3">
              <HeartPulse size={40} className="text-rose-500 mb-6" />
              <p className="text-slate-800 font-bold leading-relaxed text-sm italic">
                "Nous transformons l'ignorance en prévention et la peur en compréhension."
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* ACTIONS GRID */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nos Axes d’Intervention</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Résultats concrets sur le terrain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actions.map((action, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 shrink-0 ${action.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform`}>
                  <action.icon size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                  {action.title}
                </h3>
              </div>
              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 flex-1">
                {action.desc}
              </p>

              <div className="space-y-2 pt-4 border-t border-slate-50">
                {action.items.map((item, i) => (
                  <div key={i} className="flex gap-2 text-[10px] font-black uppercase tracking-tight text-slate-400 items-start">
                    <div className="w-1 h-1 rounded-full bg-sky-200 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-slate-900 rounded-[4rem] p-10 sm:p-20 text-center space-y-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-md">
            <Gift size={40} className="text-sky-300" />
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Faites une différence <span className="text-sky-400">aujourd’hui</span>.
            </h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              « SEDUCEP, c’est une voix qui s’élève pour les oubliés de la santé. Une force collective qui agit avec et pour les populations. »
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setActiveTab('donation')}
              className="bg-sky-600 hover:bg-sky-700 text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-sky-600/20 w-full sm:w-auto transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              Faire un don <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('volunteer')}
              className="bg-white/10 hover:bg-white/20 text-white font-black py-6 px-12 rounded-2xl backdrop-blur-md w-full sm:w-auto transition-all uppercase tracking-widest text-xs"
            >
              Rejoindre l'équipe
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </section>
    </div>
  );
}

const Gift = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);
