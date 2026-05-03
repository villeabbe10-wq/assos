import React, { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, Calendar, Users, HandHeart, Info, LogIn, LogOut, MessageSquare, LayoutDashboard, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink, Activity, Handshake, HelpCircle, Heart, BriefcaseMedical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithGoogle, logout, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from '../lib/i18n';
import PharmacyModal from './PharmacyModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const { language, setLanguage, t } = useTranslation();

  const [isAuthorized, setIsAuthorized] = useState(false);

  const isAdmin = user?.email === 'seduceconseil@gmail.com';

  useEffect(() => {
    if (user?.email) {
      if (user.email === 'seduceconseil@gmail.com') {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const docRef = doc(db, 'system_admins', user.email!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setIsAuthorized(true);
            else setIsAuthorized(false);
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
  }, [user]);

  // Smart redirect on login
  React.useEffect(() => {
    if (user && isAuthorized && activeTab === 'home') {
      setActiveTab('admin');
    } else if (user && activeTab === 'home') {
      setActiveTab('messages');
    }
  }, [user, isAuthorized]);

  const navItems = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'blog', label: t('nav_blog'), icon: BookOpen },
    { id: 'actions', label: t('nav_actions') || 'Actions', icon: Activity },
    { id: 'events', label: t('nav_events'), icon: Calendar },
    { id: 'volunteer', label: t('nav_volunteer'), icon: Users },
    { id: 'resources', label: t('nav_resources'), icon: HandHeart },
    { id: 'about', label: t('nav_about') || 'À Savoir', icon: Info },
    { id: 'faq', label: t('nav_faq') || 'FAQ', icon: HelpCircle },
    { id: 'sponsorship', label: t('nav_sponsorship') || 'Parrainage', icon: Heart },
    { id: 'partners', label: t('nav_partners'), icon: Handshake },
    ...(user ? [{ id: 'messages', label: t('mem_title') || 'Dashboard', icon: MessageSquare }] : []),
    ...(isAuthorized ? [{ id: 'admin', label: 'Console Admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50">
      {/* Sleek Header - Glass Morphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-sky-500 opacity-20" />
              <span className="text-white font-black text-xl relative z-10">S</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none text-slate-900">SEDUCEP</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 -mt-0.5">Conseils</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
              <button 
                onClick={() => setLanguage('fr')}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${language === 'fr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >FR</button>
              <button 
                onClick={() => setLanguage('ewe')}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${language === 'ewe' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >EWÉ</button>
            </div>
            
            {!user ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signInWithGoogle()}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline uppercase tracking-widest">Login</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(isAuthorized ? 'admin' : 'messages')}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full border-2 border-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                    {isAuthorized ? 'Dash' : 'Membre'}
                  </span>
                </motion.button>
                <motion.button 
                  whileHover={{ rotate: 15 }}
                  onClick={() => logout()}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100 transition-colors md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-sky-950/60 backdrop-blur-sm z-40"
            />
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl p-8 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs uppercase tracking-widest font-black text-sky-600">Exploration</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-sky-500 text-white shadow-xl shadow-sky-200 ring-2 ring-sky-500 ring-offset-2' 
                    : 'text-slate-600 hover:bg-sky-50 font-medium'
                  }`}
                >
                  <item.icon size={22} />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}

              <div className="mt-auto pt-8 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setActiveTab('donation');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 mb-6 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  <HandHeart size={18} /> {t('nav_donate')}
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">© 2026 SEDUCEP-CONSEILS</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 bg-slate-50/50 pb-20 sm:pb-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* WhatsApp Floating Action Button */}
      <motion.a
        href="https://wa.me/22892004436?text=Bonjour SEDUCEP-CONSEILS, j'ai une question."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#25D366] text-white p-4 rounded-2xl shadow-2xl shadow-green-500/30 flex items-center justify-center group"
      >
        <MessageSquare size={24} fill="currentColor" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm ml-0 group-hover:ml-2">
          Aide
        </span>
      </motion.a>

      {/* Pharmacy Floating Button */}
      <motion.button
        onClick={() => setIsPharmacyModalOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-40 right-6 sm:bottom-28 sm:right-8 z-40 bg-sky-600 text-white p-4 rounded-2xl shadow-2xl shadow-sky-600/30 flex items-center justify-center group"
      >
        <BriefcaseMedical size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm ml-0 group-hover:ml-2">
          Pharmacies de garde
        </span>
      </motion.button>

      <PharmacyModal 
        isOpen={isPharmacyModalOpen} 
        onClose={() => setIsPharmacyModalOpen(false)} 
      />

      {/* Sleek Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-24 sm:pb-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8 mb-16">
          {/* About Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500 p-1.5 rounded-lg">
                <div className="w-8 h-8 text-white flex items-center justify-center font-black">S</div>
              </div>
              <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">SEDUCEP</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">{t('footer_links')}</h4>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => setActiveTab(item.id)}
                    className="text-sm text-slate-500 hover:text-sky-600 font-bold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 scale-0 group-hover:scale-100 transition-transform" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">{t('footer_support')}</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => setActiveTab('donation')}
                  className="text-sm text-slate-500 hover:text-sky-600 font-bold transition-colors"
                >
                  {t('btn_donate')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('volunteer')}
                  className="text-sm text-slate-500 hover:text-sky-600 font-bold transition-colors"
                >
                  Devenir Volontaire
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-sky-600 font-bold transition-colors">
                  Nos Rapports
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">{t('footer_contact')}</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 text-sky-600"><MapPin size={18} /></div>
                <p className="text-sm text-slate-500 font-medium leading-snug">Lomé, Quartier Adidogomé-Avenou, Togo</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-sky-600"><Phone size={18} /></div>
                <p className="text-sm text-slate-500 font-medium">+228 92004436 / +33 663940084</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-sky-600"><Mail size={18} /></div>
                <p className="text-sm text-slate-500 font-medium">seduceconseils@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Banner */}
        <div className="max-w-6xl mx-auto pt-12 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 grayscale opacity-50 contrast-125">
              <div className="font-bold italic text-xs tracking-tighter text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-[8px] text-white not-italic font-black">TG</div>
                MINISTÈRE DE LA SANTÉ
              </div>
              <div className="font-bold italic text-xs tracking-tighter text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white not-italic font-black">WHO</div>
                OMS TOGO
              </div>
              <div className="font-bold italic text-xs tracking-tighter text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-[8px] text-white not-italic font-black">UC</div>
                UNICEF
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                © 2026 SEDUCEP-CONSEILS • {t('footer_rights')}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-sky-600">
                <span>TOGO</span>
                <div className="relative w-5 h-3 flex flex-col overflow-hidden rounded-[1px] border-[0.5px] border-slate-200">
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="flex-1 bg-[#ffce00]" />
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="flex-1 bg-[#ffce00]" />
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="absolute top-0 left-0 w-[40%] h-[60%] bg-[#d21034] flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full scale-[0.6]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Nav */}
      <motion.nav 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around px-2 py-3 z-30 sm:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
      >
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-sky-500 scale-110' : 'text-slate-400'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center gap-1 transition-all text-slate-400`}
        >
          <Menu size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Plus</span>
        </button>
      </motion.nav>
    </div>
  );
}
