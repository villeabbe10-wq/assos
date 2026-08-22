import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Star, Mail, MessageCircle, ArrowRight, Users, Briefcase } from 'lucide-react';

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
      <div className="bg-emerald-50/50 rounded-[4rem] p-8 sm:p-14 border border-emerald-100 mt-16 max-w-5xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Prêt(e) à nous rejoindre ?</h3>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Que ce soit pour être bénévole terrain ou intégrer notre équipe dirigeante, envoyez-nous un message en précisant vos motivations. Nous vous guiderons pour votre adhésion.
          </p>
        </div>

        {/* 3 Blocks: Stacked vertically on mobile, 3 columns on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {/* WhatsApp Togo */}
          <motion.a 
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://api.whatsapp.com/send?phone=22897682466&text=${encodeURIComponent("Bonjour SEDUCEP, je souhaite vous rejoindre (adhésion/bénévolat).")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-6 sm:p-7 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 transition-all shadow-xl shadow-[#25D366]/25 group cursor-pointer border border-[#25D366]/40"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
              <MessageCircle size={28} className="text-white fill-white/20" />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-base sm:text-lg tracking-tight">WhatsApp Togo</span>
              <span className="block text-xs sm:text-sm font-bold text-white/90 tracking-wide">Écrire à notre équipe</span>
              <span className="inline-block text-[10px] uppercase tracking-widest font-black text-emerald-950 bg-white/30 px-2.5 py-0.5 rounded-full mt-1">Direct Togo</span>
            </div>
          </motion.a>

          {/* WhatsApp International */}
          <motion.a 
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://api.whatsapp.com/send?phone=32465796529&text=${encodeURIComponent("Bonjour SEDUCEP, je souhaite vous rejoindre (adhésion/bénévolat).")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-700 hover:bg-emerald-800 text-white p-6 sm:p-7 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 transition-all shadow-xl shadow-emerald-800/25 group cursor-pointer border border-emerald-600/40"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
              <MessageCircle size={28} className="text-white fill-white/20" />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-base sm:text-lg tracking-tight">WhatsApp International</span>
              <span className="block text-xs sm:text-sm font-bold text-emerald-100 tracking-wide">Écrire à la coordination</span>
              <span className="inline-block text-[10px] uppercase tracking-widest font-black text-emerald-950 bg-emerald-200/40 px-2.5 py-0.5 rounded-full mt-1">International</span>
            </div>
          </motion.a>

          {/* Email */}
          <motion.a 
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:seduceconseil@gmail.com?subject=Demande d'adhésion à SEDUCEP"
            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 p-6 sm:p-7 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 transition-all shadow-lg shadow-slate-200/40 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
              <Mail size={28} />
            </div>
            <div className="space-y-1 w-full overflow-hidden">
              <span className="block font-black text-base sm:text-lg tracking-tight text-slate-900">Par E-mail</span>
              <span className="block text-xs sm:text-[11px] lg:text-xs font-bold text-slate-500 tracking-tight break-all">seduceconseil@gmail.com</span>
              <span className="inline-block text-[10px] uppercase tracking-widest font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1">Écrivez-nous</span>
            </div>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
