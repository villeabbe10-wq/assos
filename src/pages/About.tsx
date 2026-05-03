import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Target, 
  Heart, 
  ShieldCheck, 
  Users, 
  Activity, 
  Baby, 
  Droplets,
  HeartHandshake,
  Quote
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function About({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { t } = useTranslation();

  const achievements = [
    { label: 'Sauver des vies', desc: 'Par l’éducation et la prévention' },
    { label: 'Inégalités', desc: 'Réduire les disparités d’accès à la santé' },
    { label: 'Solidarité', desc: 'Promouvoir une aide durable et locale' }
  ];

  const engagements = [
    { title: 'Sensibilisation', icon: Users, color: 'bg-blue-50 text-blue-600', desc: 'Comprendre les enjeux des maladies.' },
    { title: 'Education', icon: Baby, color: 'bg-indigo-50 text-indigo-600', desc: 'Prévention de la délinquance.' },
    { title: 'Prévention', icon: Activity, color: 'bg-emerald-50 text-emerald-600', desc: 'Aides professionnelles de santé.' },
    { title: 'Vaccination', icon: ShieldCheck, color: 'bg-orange-50 text-orange-600', desc: 'Soutien au programme PEV.' },
    { title: 'Accompagnement', icon: HeartHandshake, color: 'bg-rose-50 text-rose-600', desc: 'Soutien psychosocial.' },
    { title: 'Assainissement', icon: Droplets, color: 'bg-sky-50 text-sky-600', desc: 'Hygiène des zones reculées.' }
  ];

  const testimonials = [
    {
      name: t('story_1_role'),
      title: "Une vie transformée",
      text: t('story_1'),
      img: 'https://i.pravatar.cc/150?img=32'
    },
    {
      name: t('story_2_role'),
      title: "Un soutien humain et réel",
      text: t('story_2'),
      img: 'https://i.pravatar.cc/150?img=12'
    },
    {
      name: t('story_3_role'),
      title: "Un partenaire de confiance",
      text: t('story_3'),
      img: 'https://i.pravatar.cc/150?img=44'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero / Intro */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-6 py-2 rounded-full border border-sky-100"
        >
          <Target size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Le savoir et la prévention</span>
        </motion.div>
        
        <h2 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
          S'engager pour le <br /> <span className="text-sky-500">bien-être</span> de tous.
        </h2>
        
        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Une association caritative basée au Togo, engagée avec conviction à améliorer la santé et le bien-être des populations les plus vulnérables.
        </p>
      </section>

      {/* Historique */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-16 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100">
            <History size={32} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">Historique</h3>
          <p className="text-slate-500 font-medium leading-relaxed text-lg">
            Les membres fondateurs, dévoués à améliorer la qualité de vie des personnes vulnérables, défavorisées et promouvoir de la santé dans les communautés rurales.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover grayscale opacity-80" />
          </div>
          <div className="aspect-square bg-sky-500 rounded-[2.5rem] p-8 flex flex-col justify-end text-white">
            <span className="text-4xl font-black mb-2">2026</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Fondation</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Engagement */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Notre Engagement</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Axes prioritaires d'intervention</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {engagements.map((eng, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col gap-4 group hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${eng.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                <eng.icon size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900">{eng.title}</h4>
                <p className="text-slate-500 text-sm font-medium">{eng.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Support Us */}
      <section className="bg-slate-900 rounded-[4rem] p-10 sm:p-20 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">Pourquoi nous <br /> <span className="text-sky-400 font-serif italic font-normal">soutenir ?</span></h3>
            <p className="text-slate-400 text-lg font-medium">Parce que chaque geste compte. En nous rejoignant ou en faisant un don, vous contribuez à un impact réel.</p>
            <div className="space-y-6">
              {achievements.map((ach, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <h5 className="font-black text-white">{ach.label}</h5>
                    <p className="text-slate-400 text-sm">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('donation')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-sky-500/20 transition-all uppercase tracking-widest text-xs"
            >
              Agir maintenant
            </button>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-800 rounded-[3rem] overflow-hidden rotate-2">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2.5rem] shadow-2xl rotate--3 max-w-[200px]">
              <Heart size={32} className="text-orange-500 mb-4" fill="currentColor" />
              <p className="text-slate-900 font-black text-sm tracking-tight">Solidarité durable et locale</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
      </section>

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('stories_title')}</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">{t('stories_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col gap-6 relative shadow-sm hover:shadow-xl transition-all group"
            >
              <Quote size={40} className="text-sky-100 absolute top-8 right-8 group-hover:text-sky-200 transition-colors" />
              <div className="relative z-10 space-y-4 pt-4">
                <h4 className="font-black text-sky-600 text-sm uppercase tracking-widest">{t.title}</h4>
                <p className="text-slate-600 font-medium italic leading-relaxed">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-slate-50 shadow-sm" />
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 uppercase tracking-widest text-[10px] leading-tight">{t.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="text-center py-20 bg-sky-600 rounded-[4rem] text-white space-y-8 shadow-2xl shadow-sky-600/20">
        <h3 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none px-4">
          REJOIGNEZ-NOUS DANS NOTRE MISSION <br className="hidden sm:block" /> POUR UN MONDE EN BONNE SANTÉ
        </h3>
        <p className="text-sky-100 font-medium opacity-80 uppercase tracking-widest text-xs">Agissez maintenant pour soutenir notre cause et améliorer des vies.</p>
        <button 
          onClick={() => setActiveTab('volunteer')}
          className="bg-white text-sky-600 font-black py-6 px-12 rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
        >
          Nous rejoindre
        </button>
      </section>
    </div>
  );
}
