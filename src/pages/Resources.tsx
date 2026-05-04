import React from 'react';
import { HandHeart, Phone, MapPin, ExternalLink, ShieldPlus, FileText, Download, HeartHandshake, ArrowRight, Sparkles, BriefcaseMedical } from 'lucide-react';
import { motion } from 'motion/react';

export default function Resources() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  const GUIDES = [
    { title: 'Guide Prévention Paludisme', size: '2.4 MB', type: 'PDF', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Nutrition et Hygiène', size: '1.8 MB', type: 'PDF', color: 'bg-orange-50 text-orange-600' },
    { title: 'Rapport d\'Impact 2024', size: '3.1 MB', type: 'PDF', color: 'bg-sky-50 text-sky-600' },
  ];

  const CONTACTS = [
    { name: 'Sapeurs-Pompiers', value: '118', category: 'Urgences', icon: Sparkles },
    { name: 'Police Secours', value: '117', category: 'Sécurité', icon: ShieldPlus },
    { name: 'Gendarmerie Nationale', value: '172', category: 'Sécurité', icon: MapPin },
    { name: 'Allo Santé (Conseils)', value: '115', category: 'Santé', icon: BriefcaseMedical },
  ];

  return (
    <div className="space-y-24 pb-32">
      {/* HEADER SECTION */}
      <header className="space-y-8 max-w-3xl">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/20"
        >
          <HandHeart size={36} />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Ressources & Prévention
          </h2>
          <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl">
            Accédez à nos guides pratiques, rapports d'activité et numéros utiles pour votre santé au quotidien.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Guides Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
              <FileText size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Guides & Documents</h3>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid gap-4"
          >
            {GUIDES.map((guide, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${guide.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                    <Download size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-sky-600 transition-colors">{guide.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{guide.size} • {guide.type}</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Emergency Contacts */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <Phone size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Numéros d'Urgence</h3>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid gap-4"
          >
            {CONTACTS.map((contact, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group relative overflow-hidden"
              >
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{contact.category}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-xl">{contact.name}</h4>
                  <p className="text-4xl font-black text-orange-600 tracking-tighter mt-2">{contact.value}</p>
                </div>
                <a 
                  href={`tel:${contact.value}`} 
                  className="w-16 h-16 bg-orange-600 text-white rounded-[2rem] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-orange-600/30 relative z-10"
                >
                  <Phone size={28} />
                </a>
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-50 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* CALL TO ACTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[4rem] p-12 sm:p-20 text-center space-y-10 text-white relative overflow-hidden shadow-4xl"
      >
        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10"
          >
            <HeartHandshake size={36} className="text-sky-300" />
          </motion.div>
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">Besoin d'un accompagnement personnalisé ?</h3>
            <p className="text-slate-400 font-medium leading-relaxed text-xl">
              Nos médiateurs de santé sont à votre écoute pour vous orienter gratuitement vers les meilleures structures de soins.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <button className="bg-sky-600 hover:bg-sky-500 text-white font-black py-7 px-14 rounded-2xl shadow-3xl shadow-sky-600/30 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px]">
              Contactez un Médiateur <Phone size={20} />
            </button>
          </div>
        </div>
        {/* Decorative mask */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      </motion.div>
    </div>
  );
}
