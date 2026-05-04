import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Search, 
  HelpCircle, 
  Clock, 
  Phone, 
  MapPin, 
  Settings, 
  CreditCard,
  ChevronRight,
  HeartPlus,
  Zap,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  title: string;
  icon: any;
  items: FAQItem[];
  color: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>("cat0-item0");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: FAQCategory[] = [
    {
      title: "Santé & Missions",
      icon: HeartPlus,
      color: "emerald",
      items: [
        {
          question: "Qu'est-ce que SEDUCEP ?",
          answer: "SEDUCEP est une association à but non lucratif dédiée à la lutte contre les maladies mortelles (Drépanocytose, Cancers, etc.) et à l'éducation des enfants vulnérables par la culture."
        },
        {
          question: "Comment aidez-vous les enfants de la rue ?",
          answer: "Nous utilisons la culture comme vecteur de réinsertion. Nos programmes incluent des ateliers artistiques, des cours de soutien et un accompagnement vers la scolarisation formelle."
        },
        {
          question: "Sensibilisez-vous sur la Drépanocytose ?",
          answer: (
            <div className="space-y-4">
              <p>Oui, c'est l'un de nos piliers majeurs. Nos actions incluent :</p>
              <div className="grid grid-cols-1 gap-2">
                {["Dépistage précoce en zone rurale", "Soutien aux familles pour l'accès aux soins", "Campagnes d'information pour briser les tabous génétiques"].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Organisation & Contact",
      icon: MessageCircle,
      color: "sky",
      items: [
        {
          question: "Comment puis-je vous contacter ?",
          answer: (
            <div className="space-y-6">
              <p className="text-slate-500">Nos équipes sont disponibles via plusieurs canaux directs :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="tel:+22892004436" className="flex items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 hover:border-sky-200 transition-colors group">
                  <div className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</span>
                    <span className="text-sm font-black text-slate-800 tracking-tight">+228 92004436</span>
                  </div>
                </a>
                <a href="mailto:seduceconseils@gmail.com" className="flex items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 hover:border-sky-200 transition-colors group">
                  <div className="w-10 h-10 bg-slate-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</span>
                    <span className="text-sm font-black text-slate-800 tracking-tight">seduceconseils@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>
          )
        },
        {
          question: "Où se trouve votre siège social ?",
          answer: "Notre siège social est situé à Lomé, précisément à Adidogomé-Wonyomé. Nous avons également des antennes régionales dans les principales villes du Togo pour une action au plus proche des populations."
        }
      ]
    },
    {
      title: "Participation & Dons",
      icon: CreditCard,
      color: "orange",
      items: [
        {
          question: "Quels sont vos modes de paiement acceptés ?",
          answer: (
            <div className="flex flex-wrap gap-3">
              {['Virement', 'Flooz', 'T-Money', 'Cards'].map(m => (
                <span key={m} className="bg-orange-50 text-orange-600 px-6 py-3 rounded-[1.5rem] border border-orange-100 text-xs font-black uppercase tracking-widest">
                  {m}
                </span>
              ))}
            </div>
          )
        },
        {
          question: "Comment devenir bénévole ?",
          answer: "Nous recherchons en permanence des profils médicaux, éducateurs et logisticiens. Contactez-nous pour recevoir notre charte du volontaire et le calendrier des prochaines missions."
        }
      ]
    }
  ];

  const toggleItem = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="space-y-24 pb-32">
      {/* HEADER SECTION */}
      <header className="text-center space-y-16 max-w-4xl mx-auto py-12 px-4">
        <div className="space-y-8">
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/30"
          >
            <HelpCircle size={48} />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8]">
              Questions & <br /><span className="text-emerald-600 font-serif italic font-normal text-6xl sm:text-8xl block mt-4">Réponses</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-xl max-w-2xl mx-auto">
              Comprendre notre impact, rejoindre nos missions ou nous soutenir : nous répondons à vos interrogations essentielles.
            </p>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Rechercher une action, un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-[3rem] py-8 pl-20 pr-10 text-lg font-black tracking-tight focus:outline-none focus:ring-8 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all shadow-3xl shadow-slate-200"
          />
        </div>
      </header>

      {/* CATEGORIES SECTION */}
      <div className="max-w-4xl mx-auto space-y-20">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div className="flex items-center gap-6 px-4">
              <div className={`p-4 bg-${cat.color}-100 text-${cat.color}-600 rounded-3xl`}>
                <cat.icon size={28} />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">{cat.title}</h3>
                <div className={`h-1.5 w-12 bg-${cat.color}-400 rounded-full`} />
              </div>
            </div>

            <div className="grid gap-4">
              {cat.items.map((item, itemIdx) => {
                const id = `cat${catIdx}-item${itemIdx}`;
                const isOpen = openIndex === id;
                const accentColor = cat.color === 'emerald' ? 'emerald' : cat.color === 'sky' ? 'sky' : 'orange';

                return (
                  <motion.div 
                    key={id}
                    initial={false}
                    className={`bg-white rounded-[3.5rem] border transition-all duration-500 group ${
                      isOpen 
                      ? `border-${accentColor}-500 ring-8 ring-${accentColor}-600/5` 
                      : 'border-slate-100 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <button 
                      onClick={() => toggleItem(id)}
                      className="w-full text-left p-10 sm:p-12 flex items-center justify-between gap-6"
                    >
                      <span className={`font-black tracking-tighter text-2xl transition-colors ${
                        isOpen ? `text-${accentColor}-700` : 'text-slate-800'
                      }`}>
                        {item.question}
                      </span>
                      <div className={`w-12 h-12 shrink-0 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                        isOpen ? `bg-${accentColor}-600 text-white rotate-180` : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'
                      }`}>
                        {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className={`px-10 pb-12 sm:px-12 border-t border-${accentColor}-50 pt-10`}>
                            <div className="text-slate-500 font-medium leading-relaxed text-xl max-w-3xl">
                              {item.answer}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CALL-TO-ACTION */}
      <section className="bg-slate-900 rounded-[6rem] p-16 sm:p-32 text-center text-white relative overflow-hidden shadow-4xl group">
        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="w-24 h-24 bg-white/10 rounded-[3rem] flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10"
          >
            <Phone size={48} className="text-emerald-400" strokeWidth={1.5} />
          </motion.div>
          <div className="space-y-6">
            <h3 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none italic font-serif">Vous avez une question <br /><span className="text-emerald-400 not-italic font-sans">particulière ?</span></h3>
            <p className="text-slate-400 font-medium text-2xl leading-relaxed max-w-2xl mx-auto opacity-80 italic">
              « Une oreille attentive peut changer le destin d'un malade. Notre équipe de médiateurs est là pour vous 24h/24. »
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('tel:+22892004436')}
            className="bg-emerald-600 text-white font-black py-8 px-16 rounded-[2.5rem] shadow-4xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center mx-auto gap-4"
          >
            Parler à un Médiateur <ChevronRight size={24} />
          </motion.button>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-1000" />
      </section>
    </div>
  );
}
