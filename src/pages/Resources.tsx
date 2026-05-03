import React from 'react';
import { HandHeart, Phone, MapPin, ExternalLink, ShieldPlus, FileText, Download, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';

export default function Resources() {
  const { t } = useTranslation();

  const GUIDES = [
    { title: t('res_guide_palu'), size: '2.4 MB', type: 'PDF' },
    { title: t('res_guide_nut'), size: '1.8 MB', type: 'PDF' },
    { title: t('res_report_2025'), size: '3.1 MB', type: 'PDF' },
  ];

  const CONTACTS = [
    { name: 'Sapeurs-Pompiers', value: '118', category: 'Urgences' },
    { name: 'Police Secours', value: '117', category: 'Sécurité' },
    { name: 'Gendarmerie', value: '172', category: 'Sécurité' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-4 max-w-2xl">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-100/50"
        >
          <HandHeart size={32} />
        </motion.div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
          {t('res_title')}
        </h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          {t('res_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Guides Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="text-sky-600" />
            Guides & Documents
          </h3>
          <div className="grid gap-4">
            {GUIDES.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                    <Download size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{guide.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{guide.size} • {guide.type}</p>
                  </div>
                </div>
                <button className="text-sky-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  {t('res_download')}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Phone className="text-orange-600" />
            Numéros d'Urgence
          </h3>
          <div className="grid gap-4">
            {CONTACTS.map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{contact.category}</span>
                  <h4 className="font-bold text-slate-800">{contact.name}</h4>
                  <p className="text-2xl font-black text-orange-600 tracking-tighter">{contact.value}</p>
                </div>
                <a href={`tel:${contact.value}`} className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                  <Phone size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-14 text-center space-y-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
            <HeartHandshake size={32} className="text-sky-300" />
          </div>
          <h3 className="text-3xl font-black tracking-tight leading-tight">Besoin d'un accompagnement personnalisé ?</h3>
          <p className="text-slate-400 font-medium leading-relaxed">Nos médiateurs de santé sont à votre écoute pour vous orienter gratuitement.</p>
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-sky-600/20 w-full sm:w-auto transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
            Contactez un Médiateur <Phone size={20} />
          </button>
        </div>
        {/* Decorative mask */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}
