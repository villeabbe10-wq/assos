import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Baby, 
  HeartHandshake, 
  Droplets,
  ArrowRight,
  Stethoscope,
  Globe,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Gift,
  Play
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function Actions({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [missionsFromDb, setMissionsFromDb] = useState<any[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const q = query(
          collection(db, 'events'), 
          where('type', '==', 'mission'),
          orderBy('date', 'desc')
        );
        const snap = await getDocs(q);
        setMissionsFromDb(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchMissions();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

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
    <div className="space-y-32 pb-32 text-slate-900">
      {/* MISSION HEADER */}
      <header className="text-center space-y-12 max-w-4xl mx-auto py-16 px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 3 }}
          className="w-24 h-24 bg-sky-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-600/30"
        >
          <HeartPulse size={48} />
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8]">
            Notre <span className="text-sky-600">Mission</span>, <br /> 
            votre <span className="text-orange-500 font-serif italic font-normal text-4xl sm:text-7xl lg:text-8xl block mt-4">avenir</span>.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium leading-relaxed text-base sm:text-xl max-w-3xl mx-auto">
            "La santé est un droit fondamental qui commence par la connaissance. Nous transformons la peur en compréhension et l'isolement en solidarité."
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('donation')}
            className="bg-slate-900 text-white font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-2xl shadow-slate-900/10 w-full sm:w-auto"
          >
            Soutenir la mission
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('volunteer')}
            className="bg-white border border-slate-200 text-slate-700 font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto"
          >
            Devenir volontaire
          </motion.button>
        </motion.div>
      </header>

      {/* MISSION PILLARS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
        {missions.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white p-10 sm:p-12 rounded-[3rem] sm:rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-3xl transition-all"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 ${m.color} rounded-2xl flex items-center justify-center mb-8 sm:mb-10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <m.icon size={28} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{m.title}</h3>
            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed mb-8 sm:mb-10">{m.desc}</p>
            
            <ul className="space-y-4">
              {m.points.map((p, pi) => (
                <li key={pi} className="flex gap-4 text-xs font-bold text-slate-400 items-start italic leading-snug">
                  <Sparkles size={16} className="shrink-0 mt-0.5 text-sky-400 opacity-60" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-slate-100 transition-colors" />
          </motion.div>
        ))}
      </section>

      {/* THE APPROACH */}
      <section className="bg-sky-50/80 rounded-[5rem] p-12 sm:p-24 relative overflow-hidden ring-1 ring-sky-100/50">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="inline-block bg-sky-600 text-white px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-600/20"
            >
              L'Approche SEDUCEP
            </motion.div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Éduquer pour <br />prévenir, <span className="text-sky-600">pas seulement</span> <br />pour soigner.
            </h3>
            <p className="text-slate-600 text-xl font-medium leading-relaxed">
              Beaucoup de pathologies graves peuvent être évitées si les populations sont informées des facteurs de risque, des symptômes précoces et des bonnes pratiques.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm">
                <h4 className="font-black text-sky-600 text-[11px] uppercase tracking-widest mb-3">Langues Locales</h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">Connaissances adaptées à la culture pour un impact réel et durable.</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm">
                <h4 className="font-black text-sky-600 text-[11px] uppercase tracking-widest mb-3">Ancrage Local</h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">Collaboration étroite avec les chefs traditionnels et leaders locaux.</p>
              </motion.div>
            </div>
          </div>
          <div className="relative">
            <motion.div 
              initial={{ rotate: 10, scale: 0.9, opacity: 0 }}
              whileInView={{ rotate: 2, scale: 1, opacity: 1 }}
              className="aspect-square bg-slate-200 rounded-[5rem] overflow-hidden shadow-4xl relative z-20"
            >
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" alt="Terrain activity" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent" />
            </motion.div>
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-12 -left-12 bg-white p-12 rounded-[4rem] shadow-4xl border border-slate-100 max-w-[320px] -rotate-3 z-30"
            >
              <HeartPulse size={48} className="text-rose-500 mb-8" strokeWidth={1.5} />
              <p className="text-slate-800 font-bold leading-relaxed text-lg italic tracking-tight">
                "Nous transformons l'ignorance en prévention et la peur en compréhension."
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Dynamic Missions from DB */}
      {missionsFromDb.length > 0 && (
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Récits de nos Missions</h3>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.4em] ml-1">Immersion sur le terrain</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {missionsFromDb.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-4xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  {mission.videoUrl ? (
                    <video 
                      src={mission.videoUrl} 
                      className="w-full h-full object-cover opacity-80"
                      controls
                    />
                  ) : mission.imageUrl ? (
                    <img src={mission.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Activity size={64} />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} className="text-orange-500" /> MISSION
                    </span>
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{mission.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{mission.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
                        <Users size={18} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{mission.location}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">{mission.date?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ACTIONS GRID */}
      <section className="space-y-20">
        <div className="text-center space-y-6">
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">Nos Axes d’Intervention</h3>
          <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.4em] ml-1">Résultats concrets sur le terrain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {actions.map((action, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-3xl transition-all group flex flex-col relative overflow-hidden"
            >
              <div className="flex items-start gap-6 mb-8 relative z-10">
                <div className={`w-14 h-14 shrink-0 ${action.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-all duration-500`}>
                  <action.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight pt-1">
                  {action.title}
                </h3>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-1 relative z-10">
                {action.desc}
              </p>

              <div className="space-y-4 pt-8 border-t border-slate-50 relative z-10">
                {action.items.map((item, i) => (
                  <div key={i} className="flex gap-3 text-[10px] font-black uppercase tracking-tight text-slate-400 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-200 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-slate-900 rounded-[5rem] p-12 sm:p-24 text-center space-y-12 text-white relative overflow-hidden shadow-4xl">
        <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10"
          >
            <Gift size={48} className="text-sky-300" strokeWidth={1.5} />
          </motion.div>
          <div className="space-y-8">
            <h3 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.8]">
              Faites une différence <br /><span className="text-sky-400 italic font-serif font-normal text-5xl sm:text-7xl block mt-4">maintenant</span>.
            </h3>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-2xl mx-auto italic opacity-80">
              « SEDUCEP, c’est une voice qui s’élève pour les oubliés de la santé. Une force collective qui agit avec et pour les populations. »
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('donation')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-black py-7 px-14 rounded-2xl shadow-3xl shadow-sky-600/30 w-full sm:w-auto transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px]"
            >
              Faire un don <ArrowRight size={22} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('volunteer')}
              className="bg-white/10 hover:bg-white/20 text-white font-black py-7 px-14 rounded-2xl backdrop-blur-xl w-full sm:w-auto transition-all uppercase tracking-[0.2em] text-[11px] border border-white/10"
            >
              Rejoindre l'équipe
            </motion.button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      </section>
    </div>
  );
}

