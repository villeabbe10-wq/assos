import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Star, Mail, Phone, ArrowRight, Users, Briefcase } from 'lucide-react';

export default function Volunteer() {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-emerald-100/50 mx-auto"
        >
          <Heart size={40} fill="currentColor" />
        </motion.div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
          S'engager avec <span className="text-emerald-500">SEDUCEP</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          Rejoignez une équipe passionnée et aidez-nous à transformer le paysage de la santé. Découvrez les deux façons de vous impliquer à nos côtés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Bénévolat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-emerald-200 transition-colors"
        >
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
            <Users size={32} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Devenir Bénévole</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            Vous souhaitez donner de votre temps de façon ponctuelle ou régulière sur le terrain ? Nos bénévoles participent activement aux campagnes de sensibilisation, à la logistique des dépistages et aux événements communautaires.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <ShieldCheck size={18} className="text-emerald-500" /> Missions sur le terrain
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <ShieldCheck size={18} className="text-emerald-500" /> Actions de prévention
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <ShieldCheck size={18} className="text-emerald-500" /> Événements et tournois
            </li>
          </ul>
        </motion.div>

        {/* Intégrer l'équipe (Bureau) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="w-16 h-16 bg-slate-800 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10">
            <Briefcase size={32} />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight relative z-10">Intégrer l'Équipe</h3>
          <p className="text-slate-400 font-medium leading-relaxed mb-6 relative z-10">
            Vous désirez un engagement plus structurel ? Intégrez notre équipe administrative, nos pôles de coordination (Togo ou International) pour structurer nos projets, trouver des partenaires et bâtir l'avenir de SEDUCEP.
          </p>
          <ul className="space-y-3 mb-8 relative z-10">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <Star size={18} className="text-emerald-400" /> Engagement sur le long terme
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <Star size={18} className="text-emerald-400" /> Organisation & Stratégie
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <Star size={18} className="text-emerald-400" /> Pôles Togo / Diaspora
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Contacts Section */}
      <div className="bg-emerald-50/50 rounded-[4rem] p-8 sm:p-16 border border-emerald-100 mt-16 max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Prêt(e) à nous rejoindre ?</h3>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Que ce soit pour être bénévole terrain ou intégrer notre équipe dirigeante, envoyez-nous un message en précisant vos motivations. Nous vous guiderons pour votre adhésion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="https://wa.me/22897682466?text=Bonjour SEDUCEP, je souhaite vous rejoindre (adhésion/bénévolat)."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-5 sm:p-6 rounded-3xl flex items-center justify-start gap-5 transition-all shadow-lg shadow-emerald-500/20 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-inner">
              <Phone size={24} />
            </div>
            <div className="text-left">
              <span className="block font-black text-lg sm:text-xl tracking-tight">WhatsApp (Togo)</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-widest">+228 97 68 24 66</span>
            </div>
          </a>

          <a 
            href="https://wa.me/32465796529?text=Bonjour SEDUCEP, je souhaite vous rejoindre (adhésion/bénévolat)."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-5 sm:p-6 rounded-3xl flex items-center justify-start gap-5 transition-all shadow-lg shadow-emerald-600/20 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-inner">
              <Phone size={24} />
            </div>
            <div className="text-left">
              <span className="block font-black text-lg sm:text-xl tracking-tight">WhatsApp (Intl)</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-widest">+32 465 79 65 29</span>
            </div>
          </a>

          <a 
            href="mailto:seduceconseil@gmail.com?subject=Demande d'adhésion à SEDUCEP"
            className="md:col-span-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 p-5 sm:p-6 rounded-3xl flex items-center justify-start gap-5 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-inner">
              <Mail size={24} />
            </div>
            <div className="text-left">
              <span className="block font-black text-lg sm:text-xl tracking-tight">Par E-mail</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">seduceconseil@gmail.com</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
