import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Globe, ShoppingBag, Utensils, Home, Bike, Phone, MessageCircle, Gift, Info, Users, ArrowRight, Zap } from 'lucide-react';

export default function Donation({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  
  const inKindItems = [
    { icon: Utensils, label: 'Nourriture', color: 'bg-orange-100 text-orange-600', sub: 'Kits alimentaires' },
    { icon: ShieldCheck, label: 'Matériel Médical', color: 'bg-emerald-100 text-emerald-600', sub: 'Gants, pansements...' },
    { icon: ShoppingBag, label: 'Habillements', color: 'bg-sky-100 text-sky-600', sub: 'Vêtements, linge' },
    { icon: Bike, label: 'Mobilité', color: 'bg-purple-100 text-purple-600', sub: 'Vélos, matériel' },
    { icon: Home, label: 'Meubles', color: 'bg-amber-100 text-amber-600', sub: 'Petit mobilier' },
    { icon: Info, label: 'Hygiène', color: 'bg-blue-100 text-blue-600', sub: 'Savons, seaux' },
  ];

  const whyDonate = [
    { text: "Vous sauvez des vies concrètement sur le terrain.", icon: ShieldCheck },
    { text: "Vous assurez une nutrition adéquate aux enfants vulnérables.", icon: Utensils },
    { text: "Vous soutenez une équipe de médiateurs dévoués.", icon: Users },
    { text: "Vous participez à un changement durable au Togo.", icon: Globe },
  ];

  return (
    <div className="space-y-16 pb-12">
      <section className="text-center space-y-8 max-w-4xl mx-auto py-10 px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 3 }}
          className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-orange-100"
        >
          <Heart size={40} fill="currentColor" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Soutenir notre <span className="text-sky-600">mission</span>
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed text-lg max-w-3xl mx-auto">
            Votre don permet de financer nos missions de dépistage, l'éducation des enfants de la rue et l'accompagnement des malades chroniques au Togo.
          </p>
        </div>
      </section>

      {/* Pourquoi faire un don ? */}
      <section className="bg-white rounded-[3rem] p-8 sm:p-14 border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Pourquoi nous soutenir ?</h3>
            <div className="space-y-6">
              {whyDonate.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <item.icon size={18} />
                  </div>
                  <p className="text-slate-600 font-medium leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl rotate-3">
              <span className="text-2xl font-black">100%</span>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Transparence</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-20">
        {/* In-Kind Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dons en nature</h3>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {inKindItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                  <item.icon size={24} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-sm tracking-tight leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-sky-50 p-8 rounded-[2.5rem] border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-600/20">
                <Info size={24} />
              </div>
              <p className="text-sky-900 font-bold leading-snug">
                Nous acceptons les dons de matériel médical, scolaire et de première nécessité. <br />
                <span className="text-xs text-sky-600 opacity-80 uppercase tracking-widest font-black">Nous organisons la logistique pour vous</span>
              </p>
            </div>
            <a 
              href="https://wa.me/22890000000?text=Bonjour, je souhaite proposer des dons en nature pour SEDUCEP."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20 whitespace-nowrap"
            >
              Organiser la collecte
            </a>
          </div>
        </section>

        {/* Secure Cash Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Canaux Sécurisés</h3>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <ShieldCheck size={32} className="text-sky-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">Dons en argent : Acheter du matériel médical & éducatif</h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-lg">
                    Pour garantir la traçabilité et la sécurité, veuillez contacter uniquement nos administrateurs officiels avant tout transfert.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <Zap size={18} className="text-orange-400" /> T-Money / Flooz
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <Globe size={18} className="text-sky-400" /> Cartes & SWIFT
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-[3rem] border border-white/10 space-y-8 flex flex-col items-center">
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-black italic tracking-tight">Contactez l'administration</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Étape obligatoire avant tout transfert</p>
                </div>
                
                <div className="w-full space-y-4">
                  <a 
                    href="https://wa.me/22890000000?text=Bonjour, je souhaite obtenir les informations sécurisées pour un don financier (T-Money/Flooz/Carte)."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 px-4 rounded-[2rem] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/30 group"
                  >
                    <MessageCircle size={24} className="group-hover:scale-110 transition-transform" /> 
                    Par WhatsApp Direct
                  </a>
                  <a 
                    href="tel:+22890000000"
                    className="w-full bg-white text-slate-900 font-black py-6 px-4 rounded-[2rem] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl"
                  >
                    <Phone size={24} /> 
                    Appel Téléphonique
                  </a>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Administrateurs vérifiés disponibles</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          </motion.div>
        </section>

        {/* Skills & Partnerships */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 space-y-6">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Don de compétences</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Vous êtes médecin, enseignant, infirmier, psychologue, logisticien ou communicateur ? Votre expertise peut transformer des vies.
            </p>
            <button 
              onClick={() => setActiveTab('volunteer')}
              className="text-orange-600 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Devenir bénévole <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 space-y-6">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Globe size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Partenariat entreprise</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Devenez partenaire en parrainant une mission ou un village, en fournissant des équipements ou en participant à une campagne.
            </p>
            <button 
              onClick={() => window.open('tel:+22890000000')}
              className="text-emerald-700 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Nous contacter <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      <section className="bg-sky-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-sky-900/10">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tight">Transparence Totale</h3>
            <p className="text-sky-50 opacity-80 leading-relaxed font-medium">
              Chaque centime est investi directement dans nos missions sur le terrain. Nos rapports financiers sont accessibles à nos donateurs sur demande.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-sky-400" /> Sécurisé
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <Globe size={14} className="text-sky-400" /> International
              </div>
            </div>
          </div>
          <div className="bg-sky-800/50 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
            <h4 className="font-black text-lg mb-4">Impact estimé</h4>
            <div className="space-y-4">
              {[
                { label: '5.000 FCFA', desc: 'Une consultation pédiatrique' },
                { label: '15.000 FCFA', desc: 'Kit scolaire pour 3 enfants' },
                { label: '50.000 FCFA', desc: 'Campagne de vaccination' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="font-black text-sky-400">{item.label}</span>
                  <span className="font-medium opacity-80">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      <section className="text-center space-y-6 bg-slate-50 py-12 px-6 rounded-[3rem]">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Engagement Solidaire</p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200/50">
            <ShieldCheck size={20} className="text-sky-500" />
            <span className="text-sm font-bold text-slate-700">Audit Annuel Public</span>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200/50">
            <Heart size={20} className="text-orange-500" />
            <span className="text-sm font-bold text-slate-700">Impact Direct</span>
          </div>
        </div>
      </section>
    </div>
  );
}
