import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Users, ArrowRight, Activity, Calendar as CalendarIcon, MapPin, Globe } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function Home({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { t } = useTranslation();
  const [latestEvents, setLatestEvents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLatestEvents(events);
    });

    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-20"
    >
      {/* Hero Section - Editorial Polish */}
      <motion.section 
        variants={itemVariants}
        className="bg-white rounded-[3rem] p-8 sm:p-16 border border-slate-200/60 shadow-xl shadow-slate-200/20 relative overflow-hidden group"
      >
        <div className="relative z-10 max-w-4xl">
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-400/20">
              {t('hero_tag')}
            </span>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i} 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm"
                >
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[8px] text-white font-black shadow-lg shadow-emerald-500/30"
              >
                +1K
              </motion.div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('global_movement')}</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-5xl sm:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-600 relative">
              {t('hero_title_2')}
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-2 bg-emerald-500/20 rounded-full"
              />
            </span> <br />
            <span className="text-slate-400">{t('hero_title_3')}</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-slate-500 text-lg sm:text-xl mb-12 leading-relaxed font-medium max-w-2xl">
            {t('hero_desc')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('volunteer')}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 uppercase tracking-widest"
            >
              {t('btn_join')} <ArrowRight size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('donation')}
              className="bg-white border-2 border-slate-100 text-slate-700 px-10 py-5 rounded-2xl font-black text-sm hover:border-emerald-500/30 hover:text-emerald-600 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              <Heart size={18} className="fill-current" />
              {t('btn_support')}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none">
          <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px]" />
        </div>
      </motion.section>

      {/* Impact Dashboard - Technical Grid Style */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-black text-3xl text-slate-900 tracking-tight">{t('impact_title')}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Indicateurs temps réel</p>
          </div>
          <div className="hidden sm:block h-[1px] flex-1 bg-slate-200 mx-10"></div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/10" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('stat_lives'), value: '1.2k', progress: 75, color: '#10b981', symbol: <Activity size={16} /> },
            { label: t('stat_campaigns'), value: '42', progress: 90, color: '#f59e0b', symbol: <Globe size={16} /> },
            { label: t('stat_beneficiaries'), value: '15k', progress: 60, color: '#0ea5e9', symbol: <Users size={16} /> },
            { label: t('stat_volunteers'), value: '380', progress: 85, color: '#8b5cf6', symbol: <Heart size={16} /> },
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]" 
                style={{ background: `radial-gradient(circle at center, ${item.color} 0%, transparent 70%)` }}
              />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span style={{ color: item.color }}>{item.symbol}</span>
                  {item.label}
                </span>
                <span className="text-[10px] font-black text-slate-300">0{i+1}</span>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{item.value}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progression</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full rounded-full shadow-lg"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}33` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Association Discovery - Modern Split */}
      <motion.section 
        variants={itemVariants}
        className="bg-white rounded-[3rem] p-8 sm:p-20 border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-full border border-emerald-100 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Découvrez SEDUCEP</span>
              </motion.div>
              <motion.h3 variants={itemVariants} className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                La sensibilisation médicale <br /> 
                <span className="text-emerald-500 italic">dans les zones les plus isolées.</span>
              </motion.h3>
            </div>
            
            <div className="space-y-6">
              <motion.p variants={itemVariants} className="text-slate-500 text-xl font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
                "Le soutien aux orphelins et malades isolés. Le parrainage scolaire. Les programmes de santé, et bien plus encore."
              </motion.p>
              <motion.p variants={itemVariants} className="text-slate-500 font-medium leading-relaxed max-w-lg">
                Dans un monde où l’information peut sauver, protéger, et éduquer, chaque clic compte. Notre site est plus qu'une vitrine : c’est un pont entre ceux qui veulent aider et ceux qui en ont besoin.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 pt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('about')}
                className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                Notre Vision
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('donation')}
                className="bg-slate-50 border border-slate-200 text-slate-600 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all"
              >
                Impact 2026
              </motion.button>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="aspect-[4/5] bg-slate-100 rounded-[4rem] overflow-hidden rotate-2 shadow-2xl transition-transform group-hover:rotate-0 duration-700">
              <motion.img 
                whileHover={{ scale: 1.1 }}
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" 
                alt="Association mission" 
                className="w-full h-full object-cover grayscale opacity-90 transition-all group-hover:grayscale-0"
              />
            </div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl border border-white/10 max-w-[280px] -rotate-3 hover:rotate-1 transition-transform"
            >
              <ShieldCheck size={40} className="text-emerald-400 mb-6" />
              <p className="font-black text-lg leading-tight text-white mb-2 tracking-tight">Pacte de Solidarité</p>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Intervention directe et transparente sur le terrain. 100% de vos dons vont aux actions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Highlights - High Energy */}
      <motion.section 
        variants={itemVariants}
        className="bg-orange-500 rounded-[4rem] p-10 sm:p-20 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-50" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.span variants={itemVariants} className="bg-white/10 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border border-white/20 backdrop-blur-md">
              Focus Populations Vulnérables
            </motion.span>
            <motion.h3 variants={itemVariants} className="text-4xl sm:text-6xl font-black leading-[0.95] tracking-tighter">
              Aidez-nous à protéger <br /> ceux qui n'ont rien.
            </motion.h3>
            <motion.p variants={itemVariants} className="text-orange-50 text-xl font-medium opacity-90 leading-relaxed">
              Nous intervenons spécifiquement auprès des orphelins, des veuves isolées et des malades chroniques sans moyens financiers.
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('donation')}
              className="bg-white text-orange-600 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-950/20 active:scale-95 transition-all"
            >
              Soutenir l'action
            </motion.button>
          </div>
          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur-2xl -rotate-6" />
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600" 
              alt="Helping children" 
              className="relative rounded-[3rem] shadow-2xl rotate-3 w-full h-[400px] object-cover border-8 border-white/10"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stories - Minimal Premium */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <motion.h3 variants={itemVariants} className="text-4xl font-black text-slate-900 tracking-tight">Voix du Terrain</motion.h3>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Découvrez l'impact de vos actions à travers les témoignages de ceux que nous accompagnons au quotidien.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              text: t('story_1'),
              author: "Koffi M.",
              role: t('story_1_role'),
              bg: "bg-emerald-50",
              dot: "bg-emerald-500"
            },
            {
              text: t('story_2'),
              author: "Amenvi P.",
              role: t('story_2_role'),
              bg: "bg-sky-50",
              dot: "bg-sky-500"
            },
            {
              text: t('story_3'),
              author: "Sika G.",
              role: t('story_3_role'),
              bg: "bg-orange-50",
              dot: "bg-orange-500"
            }
          ].map((story, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`p-10 rounded-[3rem] border border-white shadow-sm flex flex-col justify-between relative overflow-hidden group ${story.bg}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart size={40} className="fill-current text-slate-900" />
              </div>
              <p className="relative z-10 text-slate-700 italic font-medium leading-relaxed mb-8 text-lg">
                "{story.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-900 shadow-sm border border-slate-100">
                  {story.author[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm tracking-tight">{story.author}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${story.dot}`} />
                    {story.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Awareness Grid - Grid Recipe */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">{t('prev_palu')}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Le paludisme reste la première cause de mortalité infantile au Togo. Nos guides vous apportent les clés de la prévention.
          </p>
          <motion.button 
            whileHover={{ x: 5 }}
            onClick={() => setActiveTab('blog')}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group shadow-lg shadow-slate-900/10"
          >
            Lire le guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 text-orange-500 shadow-inner">
            <Heart size={32} />
          </div>
          <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">Santé Maternelle</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Accompagner les futures mères dans l'accès aux soins prénataux et postnataux essentiels pour la survie de l'enfant.
          </p>
          <motion.button 
            whileHover={{ x: 5 }}
            onClick={() => setActiveTab('resources')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group shadow-lg shadow-orange-500/20"
          >
            Nos ressources <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* Agenda & Aid Grid - Technical Dashboard Style */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 bg-slate-900 rounded-[4rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div className="space-y-1">
              <h3 className="font-black text-3xl tracking-tight">Focus Missions 2026</h3>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Calendrier des interventions</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('events')}
              className="text-[10px] text-white font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              Explorer l'agenda
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {latestEvents.length > 0 ? latestEvents.map((ev, idx) => (
              <motion.div 
                key={ev.id} 
                whileHover={{ x: 5 }}
                className="flex items-start gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="bg-emerald-500 text-white text-center py-3 px-5 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <span className="block text-2xl font-black leading-none mb-1">
                    {ev.date?.toDate ? ev.date.toDate().getDate() : '12'}
                  </span>
                  <span className="block text-[8px] uppercase font-black tracking-widest opacity-80">
                    {ev.date?.toDate ? ev.date.toDate().toLocaleString('default', { month: 'short' }) : 'SEP'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black leading-tight tracking-tight">{ev.title}</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={12} /> {ev.location}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] py-16 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                Mises à jour du calendrier en cours...
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 bg-emerald-50 rounded-[4rem] p-10 border border-emerald-100 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <h3 className="font-black text-3xl text-emerald-900 tracking-tight leading-none">Aides <br /> Spécifiques</h3>
            <ul className="space-y-4">
              {[
                "Kits Scolaires Orphelins",
                "Consultations Itinérantes",
                "Distribution Moustiquaires"
              ].map((aid, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-xs font-black text-emerald-800 uppercase tracking-widest bg-white/60 p-4 rounded-2xl border border-white shadow-sm"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {aid}
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('resources')}
            className="w-full mt-10 bg-white text-emerald-600 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/5 hover:shadow-emerald-600/20 transition-all border border-emerald-100"
          >
            Tous nos guides
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
}
