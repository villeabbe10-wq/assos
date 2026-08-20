import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Handshake, Star, Building2, Globe2, Heart, ArrowRight, ShieldCheck, Sparkles, Layout, Lock } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Partners({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, authLoading] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user?.email) {
      const allowedEmails = ['seduceconseil@gmail.com'];
      if (allowedEmails.includes(user.email)) {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          try {
            const docRef = doc(db, 'system_admins', user.email!);
            const docSnap = await getDoc(docRef);
            setIsAuthorized(docSnap.exists());
          } catch (e) {
            console.error(e);
            setIsAuthorized(false);
          }
        };
        checkAuth();
      }
    } else {
      setIsAuthorized(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const q = query(collection(db, 'partners'), orderBy('name', 'asc'));
        const snap = await getDocs(q);
        setPartners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  const partnerCategories = [
    {
      title: "Institutions Publiques",
      icon: Building2,
      desc: "Collaboration étroite avec les ministères et structures de santé nationales.",
      partners: ["Ministère de la Santé", "Services Sociaux", "CNLS Togo"]
    },
    {
      title: "Partenaires Privés",
      icon: Star,
      desc: "Entreprises engagées dans la RSE pour le développement sanitaire.",
      partners: ["Laboratoires Bio", "Groupes Pharmaceutiques", "Tech4Health"]
    },
    {
      title: "Société Civile & ONG",
      icon: Globe2,
      desc: "Synergie avec les acteurs de terrain et associations locales.",
      partners: ["ONG Solidarité", "Croix-Rouge", "Collectifs Jeunes"]
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* HERO SECTION */}
      <header className="relative py-24 px-4 text-center space-y-12 overflow-hidden rounded-[5rem] bg-slate-900 shadow-4xl">
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 5 }}
            className="w-24 h-24 bg-sky-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/30"
          >
            <Handshake size={48} />
          </motion.div>
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-8xl font-black text-white tracking-tighter leading-[0.8]">
              Synergie & <br /><span className="text-sky-400 font-serif italic font-normal text-6xl sm:text-8xl block mt-4 tracking-normal">Impact Collectif</span>
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-2xl mx-auto">
              Nous croyons en la force du collectif. Ensemble, nous multiplions l'impact pour une santé accessible à tous.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className="inline-flex items-center gap-3 bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">+25 Partenaires engagés</span>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </header>

      {/* CATEGORIES GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {partnerCategories.map((cat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="group bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-3xl transition-all duration-700 relative overflow-hidden flex flex-col"
          >
            <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-sky-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                <cat.icon size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{cat.title}</h3>
              <p className="text-slate-500 text-base font-medium leading-relaxed mb-10">{cat.desc}</p>
              
              <div className="space-y-4 pt-10 border-t border-slate-50">
                {cat.partners.map((p, pi) => (
                  <div key={pi} className="flex items-center gap-3 text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                    <ShieldCheck size={16} className="text-sky-400 opacity-60" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-50 transition-colors" />
          </motion.div>
        ))}
      </section>

      {/* WHY PARTNER SECTION */}
      <section className="bg-sky-50/80 rounded-[5rem] p-12 sm:p-24 relative overflow-hidden ring-1 ring-sky-100/50">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="inline-block bg-sky-600 text-white px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-600/20">
              Pourquoi s'engager ?
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Amplifier votre <br /><span className="text-sky-600">mission sociale</span> <br />à nos côtés.
            </h3>
            <p className="text-slate-600 text-xl font-medium leading-relaxed">
              Nous offrons à nos partenaires une transparence totale et un ancrage terrain unique pour garantir l'efficacité de chaque action menée conjointement.
            </p>
            <div className="grid gap-6">
              {[
                { title: "Expertise Terrain", desc: "Plus de 10 ans d'action continue au Togo." },
                { title: "Transparence Radicale", desc: "Rapports financiers et d'impact trimestriels." }
              ].map((benefit, bi) => (
                <div key={bi} className="flex gap-6 items-start bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles size={24} className="text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg mb-1">{benefit.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.div 
              initial={{ rotate: -5, scale: 0.95 }}
              whileInView={{ rotate: 0, scale: 1 }}
              className="aspect-[4/5] bg-slate-200 rounded-[5rem] overflow-hidden shadow-4xl relative z-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800" 
                alt="Action sur le terrain" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className="absolute -bottom-12 -right-12 bg-white p-12 rounded-[4rem] shadow-4xl border border-slate-100 max-w-[320px] rotate-3 z-30">
              <Heart size={48} className="text-rose-500 mb-8" strokeWidth={1.5} fill="currentColor" />
              <p className="text-slate-800 font-bold leading-relaxed text-lg italic tracking-tight">
                "Le partenariat est le moteur de notre transformation sanitaire."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie des Partenaires (Images Locales) */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nos Soutiens Institutionnels & Privés</h3>
          <p className="text-sky-600 font-bold uppercase text-[10px] tracking-[0.3em]">Instituts publics, partenaires privés, ONG</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            '/images/partenaires/partenaire.png',
            '/images/partenaires/partenaire1.png',
            '/images/partenaires/partenaire2.png',
            '/images/partenaires/partenaire3.png',
            '/images/partenaires/partenaire4.png',
            '/images/partenaires/partenaire5.png',
            '/images/partenaires/partenaire6.png',
            '/images/partenaires/partenaire7.png',
            '/images/partenaires/partenaire8.png',
            '/images/partenaires/partenaire9.png',
            '/images/partenaires/partenaire10.png',
            '/images/partenaires/partenaire11.png',
            '/images/partenaires/partenairea.png',
            '/images/partenaires/partenaireb.png',
            '/images/partenaires/partenairec.png',
          ].map((src, idx) => (
            <div 
              key={idx} 
              className="aspect-video bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all flex items-center justify-center group"
            >
              <img 
                src={src} 
                alt={`Partenaire ${idx + 1}`}
                className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                onError={(e) => {
                  (e.currentTarget.parentNode as HTMLDivElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Partners Grid (From Database) */}
      {partners.length > 0 && (
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nos Partenaires de Confiance</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Ils nous accompagnent au quotidien</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {partners.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-2xl p-3 group-hover:bg-white transition-colors flex items-center justify-center">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <Layout className="text-slate-300 w-10 h-10" />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">{p.name}</span>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="bg-slate-900 rounded-[5rem] p-12 sm:p-24 text-center space-y-12 text-white relative overflow-hidden shadow-4xl">
        <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10">
            <ArrowRight size={48} className="text-sky-400 -rotate-45" strokeWidth={1.5} />
          </div>
          <div className="space-y-8">
            <h3 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.8]">
              Devenez un acteur <br /><span className="text-sky-400 italic font-serif font-normal text-5xl sm:text-7xl block mt-4 tracking-normal">du changement</span>.
            </h3>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-2xl mx-auto italic opacity-80">
              « Chaque nouveau partenariat est une porte qui s'ouvre pour des milliers de personnes privées de soins. »
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 pt-4">
            <motion.button 
              whileHover={isAuthorized ? { scale: 1.05, y: -5 } : {}}
              whileTap={isAuthorized ? { scale: 0.95 } : {}}
              onClick={() => isAuthorized && setActiveTab('messages')}
              className={`font-black py-8 px-16 rounded-[2.5rem] shadow-3xl transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 ${
                isAuthorized 
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              {isAuthorized ? (
                <>Initier une collaboration <ArrowRight size={24} /></>
              ) : (
                <>Accès réservé aux membres <Lock size={20} /></>
              )}
            </motion.button>
            {!isAuthorized && (
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Connectez-vous en tant que fondateur pour accéder à cet espace
              </p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      </section>
    </div>
  );
}
