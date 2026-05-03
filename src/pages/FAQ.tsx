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
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  title: string;
  icon: any;
  items: FAQItem[];
}

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>("cat0-item0");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: FAQCategory[] = [
    {
      title: "Général",
      icon: HelpCircle,
      items: [
        {
          question: "Quels sont vos horaires d’ouverture ?",
          answer: "Nos bureaux sont ouverts du lundi au vendredi de 9h00 à 17h00. Nous sommes fermés les week-end et jours fériés."
        },
        {
          question: "Comment puis-je vous contacter ?",
          answer: (
            <div className="space-y-4">
              <p>Vous pouvez nous contacter par plusieurs moyens :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={18} className="text-sky-500" />
                  <span className="text-xs font-bold">+228 92004436 / +33 663940084</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold">seduceconseils@gmail.com</span>
                </div>
              </div>
            </div>
          )
        },
        {
          question: "Où se trouve votre siège social ?",
          answer: "Notre siège social est situé à Lomé, précisément à Adidogomé-Wonyomé. Nous avons également des antennes régionales dans les principales villes du Togo."
        }
      ]
    },
    {
      title: "Services",
      icon: Settings,
      items: [
        {
          question: "Quels services proposez-vous ?",
          answer: (
            <div className="space-y-3">
              <p>Nous proposons une gamme complète de services incluant :</p>
              <ul className="space-y-2">
                {["Consultation et accompagnement", "Formations professionnelles", "Programme de sensibilisation communautaire", "Programme d’aide éducatifs", "Et bien d’autres services spécialisés"].map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )
        },
        {
          question: "Comment puis-je bénéficier de vos services ?",
          answer: (
            <div className="space-y-3">
              <p>Pour bénéficier de nos services, vous pouvez :</p>
              <ul className="space-y-2">
                {["Nous contacter directement par téléphone ou email", "Vous rendre dans l’une de nos agences", "Remplir notre formulaire de demande en ligne", "Participer à nos séances de sensibilisation"].map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <ChevronRight size={14} className="text-sky-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      ]
    },
    {
      title: "Paiements & Dons",
      icon: CreditCard,
      items: [
        {
          question: "Quels sont vos modes de paiement acceptés ?",
          answer: (
            <div className="flex flex-wrap gap-2">
              {['Espèces', 'Virements bancaires', 'Flooz / T-Money', 'Cartes bancaires'].map(m => (
                <span key={m} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight">
                  {m}
                </span>
              ))}
            </div>
          )
        },
        {
          question: "Proposez-vous des facilités de paiement ?",
          answer: "Oui, pour certains de nos services d’aides. Ces conditions sont établies au cas par cas selon la nature du service. Contactez-nous pour plus d’informations."
        }
      ]
    }
  ];

  const toggleItem = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="space-y-16 pb-20">
      <header className="text-center space-y-6 max-w-2xl mx-auto py-10 px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-20 h-20 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-sky-100"
        >
          <HelpCircle size={40} />
        </motion.div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
          Foire Aux Questions
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed text-lg">
          Trouvez rapidement des réponses à vos questions les plus fréquentes
        </p>

        <div className="relative mt-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher dans les questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-6 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <div className="flex items-center gap-4 px-4">
              <cat.icon size={20} className="text-sky-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{cat.title}</h3>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => {
                const id = `cat${catIdx}-item${itemIdx}`;
                const isOpen = openIndex === id;

                return (
                  <motion.div 
                    key={id}
                    initial={false}
                    className={`bg-white rounded-[2rem] border transition-all ${isOpen ? 'border-sky-500 ring-4 ring-sky-500/5' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => toggleItem(id)}
                      className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4"
                    >
                      <span className="font-black text-slate-800 tracking-tight text-lg">
                        {item.question}
                      </span>
                      <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-sky-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-8 sm:px-8 border-t border-slate-50 pt-6">
                            <div className="text-slate-500 font-medium leading-relaxed">
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

      <section className="bg-sky-900 rounded-[4rem] p-10 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
            <Phone size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black tracking-tight leading-none">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-sky-100 opacity-80 font-medium">Notre équipe est à votre disposition pour vous accompagner dans tous vos projets solidaires.</p>
          </div>
          <button 
            onClick={() => window.open('tel:+22892004436')}
            className="bg-white text-sky-900 font-black py-6 px-12 rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
          >
            Nous contacter en direct
          </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </section>
    </div>
  );
}
