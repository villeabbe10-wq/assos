import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Quote,
  LayoutDashboard,
  Award,
  Sparkles,
  Phone,
  Facebook,
  ExternalLink,
  Share2,
  Search,
  Copy,
  Check,
  UserPlus,
  X,
  QrCode,
  Stethoscope,
  Megaphone,
  UserCheck,
  Compass,
  Send
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import TshirtShowcase from '../components/TshirtShowcase';

export default function About({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [founders, setFounders] = useState<any[]>([]);
  const [customHonorees, setCustomHonorees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState<'whatsapp' | 'facebook' | 'tiktok' | null>(null);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBadge, setFormBadge] = useState('Acteur Clé');

  const defaultHonorees = [
    {
      id: 'h1',
      name: "Dr SEHONOU",
      role: "Promotion & Encadrement Médical",
      desc: "Remerciements chaleureux pour sa promotion constante et son rôle déterminant dans la conduite des campagnes de sensibilisation médicale.",
      badge: "Acteur Clé",
      category: "Médecins"
    },
    {
      id: 'h2',
      name: "Dr AJAVON",
      role: "Prévention & Sensibilisation",
      desc: "Gratitude infinie pour son engagement sur le terrain et sa contribution active à l'éducation sanitaire des populations.",
      badge: "Ambassadeur Santé",
      category: "Médecins"
    },
    {
      id: 'h3',
      name: "M. EZA",
      role: "Coordination & Mobilisation",
      desc: "Hommage appuyé pour sa grande disponibilité, son animation communautaire et sa promotion des actions de terrain.",
      badge: "Promoteur Social",
      category: "Cadres & Coordinateurs"
    },
    {
      id: 'h4',
      name: "Dr DJETABA",
      role: "Expertise & Plaidoyer Sanitaire",
      desc: "Reconnaissance sincère pour ses conseils d'expert, son soutien précieux et son accompagnement scientifique des missions.",
      badge: "Soutien Médical",
      category: "Médecins"
    },
    {
      id: 'h5',
      name: "M. BRUCE KUASSI Ahlin K.",
      role: "Mobilisation & Organisation",
      desc: "Remerciements appuyés pour son dynamisme remarquable, sa présence active et son appui logistique aux campagnes.",
      badge: "Acteur de Terrain",
      category: "Acteurs de Terrain"
    }
  ];

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const q = query(collection(db, 'founders'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setFounders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) { console.error(e); }
    };

    const fetchHonorees = async () => {
      try {
        const q = query(collection(db, 'honorees'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setCustomHonorees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        // Fallback silently if collection doesn't exist yet
      }
    };

    fetchFounders();
    fetchHonorees();
  }, []);

  const allHonorees = [...customHonorees, ...defaultHonorees];

  const filteredHonorees = allHonorees.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'Tous') return matchesSearch;
    if (selectedCategory === 'Médecins') return matchesSearch && (item.category === 'Médecins' || item.name.toLowerCase().includes('dr'));
    if (selectedCategory === 'Cadres') return matchesSearch && (item.category === 'Cadres & Coordinateurs' || item.role.toLowerCase().includes('coordinat'));
    if (selectedCategory === 'Terrain') return matchesSearch && (item.category === 'Acteurs de Terrain' || item.role.toLowerCase().includes('terrain') || item.role.toLowerCase().includes('mobilis'));
    return matchesSearch;
  });

  const handleCopyLink = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleAddHonoree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRole) return;
    setSuggestLoading(true);

    try {
      await addDoc(collection(db, 'honorees'), {
        name: formName,
        role: formRole,
        desc: formDesc || "Hommage et remerciements particuliers pour sa participation active aux campagnes SEDUCEP.",
        badge: formBadge || "Acteur Clé",
        category: formName.toLowerCase().startsWith('dr') ? 'Médecins' : 'Acteurs de Terrain',
        createdAt: serverTimestamp()
      });

      // Update local state directly
      setCustomHonorees(prev => [
        {
          id: Date.now().toString(),
          name: formName,
          role: formRole,
          desc: formDesc || "Hommage et remerciements particuliers pour sa participation active aux campagnes SEDUCEP.",
          badge: formBadge || "Acteur Clé",
          category: formName.toLowerCase().startsWith('dr') ? 'Médecins' : 'Acteurs de Terrain'
        },
        ...prev
      ]);

      setSuggestSubmitted(true);
      setFormName('');
      setFormRole('');
      setFormDesc('');
      setTimeout(() => {
        setSuggestSubmitted(false);
        setShowSuggestModal(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSuggestLoading(false);
    }
  };

  const socialLinks = [
    {
      key: 'whatsapp',
      title: 'Groupe WhatsApp Officiel',
      subTitle: 'Communauté & Echanges Directs',
      desc: 'Discutez en direct avec nos bénévoles, recevez les alertes de dépistage et posez vos questions en toute confidentialité.',
      url: 'https://chat.whatsapp.com/J97IaBdATTXDlsACkgMpNS',
      badge: 'Groupe Actif • WhatsApp',
      bgColor: 'from-emerald-600 to-teal-700',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400',
      icon: Phone,
      qrText: 'Lien d\'invitation groupe WhatsApp SEDUCEP'
    },
    {
      key: 'facebook',
      title: 'Page Facebook SEDUCEP',
      subTitle: 'Actualités & Photos de Terrain',
      desc: 'Découvrez nos reportages photos, nos témoignages vidéo et les bilans de nos campagnes de sensibilisation au Togo.',
      url: 'https://www.facebook.com/share/p/14rENM7EWSB/',
      badge: 'Page Officielle • Facebook',
      bgColor: 'from-sky-600 to-blue-800',
      btnColor: 'bg-sky-500 hover:bg-sky-400',
      icon: Facebook,
      qrText: 'Page Facebook Officielle SEDUCEP CONSEIL'
    },
    {
      key: 'tiktok',
      title: 'Compte TikTok Officiel',
      subTitle: 'Vidéos Courtes & Astuces Santé',
      desc: 'Capsules éducatives, vidéos explicatives sur les maladies chroniques et moments forts de nos descentes communautaires.',
      url: 'https://www.tiktok.com/@seducep',
      badge: 'Sensibilisation Vidéo • TikTok',
      bgColor: 'from-slate-900 via-slate-800 to-zinc-900',
      btnColor: 'bg-pink-600 hover:bg-pink-500',
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.88c.28 0 .54.04.79.12V9.3a6.34 6.34 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.28 8.28 0 0 0 4.88 1.58V7.02a4.84 4.84 0 0 1-1.12-.33z"/>
        </svg>
      ),
      qrText: 'Compte TikTok SEDUCEP'
    }
  ];

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
      name: "Koffi M.",
      title: "Bénéficiaire Lomé",
      text: "Grâce à SEDUCEP, ma maladie chronique est mieux suivie et j'ai reçu les kits nécessaires.",
      img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: "Amenvi P.",
      title: "Volontaire Médical",
      text: "Leur engagement sur le terrain est exemplaire. Les populations isolées ont enfin un accès au conseil.",
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: "Sika G.",
      title: "Veuve Accompagnée",
      text: "Un parrainage qui a changé la vie de mes enfants. Merci pour tout ce que vous faites.",
      img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200'
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
        
        <h1 className="text-3xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
          S'engager pour le <br /> <span className="text-sky-500">bien-être</span> de tous.
        </h1>
        
        <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Une association caritative basée au Togo, engagée avec conviction à améliorer la santé et le bien-être des populations les plus vulnérables.
        </p>
      </section>

      {/* Historique */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center bg-white p-8 sm:p-16 rounded-[3rem] sm:rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 text-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100">
            <History size={32} />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Historique</h3>
          <p className="text-slate-500 font-medium leading-relaxed text-base sm:text-lg">
            Les membres fondateurs, dévoués à améliorer la qualité de vie des personnes vulnérables, défavorisées et promouvoir de la santé dans les communautés rurales.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="aspect-square bg-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover grayscale opacity-80" />
          </div>
          <div className="aspect-square bg-sky-500 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-end text-white">
            <span className="text-3xl sm:text-4xl font-black mb-2">2026</span>
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

      {/* Remerciements Spécial aux Acteurs des Campagnes */}
      <section className="space-y-8 bg-gradient-to-b from-slate-50/50 via-white to-amber-50/30 p-6 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10 border-b border-slate-100 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-800 px-4 py-1.5 rounded-full border border-amber-300/60 shadow-sm">
              <Award size={16} className="text-amber-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Hommages & Reconstitution</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Remerciements aux Acteurs de Sensibilisation
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Un hommage appuyé aux personnalités remarquables qui ont promu, encadré et financé nos campagnes de santé publique au Togo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-amber-100 text-amber-900 text-xs font-black px-4 py-3 rounded-2xl border border-amber-200/80 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              <span>{allHonorees.length} Personnalités Honores</span>
            </div>
          </div>
        </div>

        {/* Category Chips Filter */}
        <div className="flex items-center justify-end gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none relative z-10">
          {['Tous', 'Médecins', 'Cadres', 'Terrain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Honorees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pt-2">
          {filteredHonorees.map((item, idx) => {
            const isDoctor = item.name.toLowerCase().startsWith('dr');
            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white p-7 rounded-[2.5rem] border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all relative overflow-hidden flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border shadow-inner transition-transform group-hover:scale-110 ${
                      isDoctor 
                        ? 'bg-sky-50 text-sky-700 border-sky-200/80' 
                        : 'bg-amber-50 text-amber-700 border-amber-200/80'
                    }`}>
                      {isDoctor ? <Stethoscope size={22} className="text-sky-600" /> : <Megaphone size={22} className="text-amber-600" />}
                    </div>
                    <span className="bg-slate-900 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {item.badge || 'Acteur Clé'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block mt-0.5">
                      {item.role}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium pt-3 border-t border-slate-100">
                    "{item.desc}"
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1 text-slate-500">
                    <UserCheck size={12} className="text-emerald-500" /> SEDUCEP Togo
                  </span>
                  <span className="text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <Heart size={11} className="fill-current text-amber-500" /> Merci
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredHonorees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
            <p className="text-slate-500 text-sm font-bold">Aucune personnalité trouvée pour "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Tous'); }}
              className="text-xs text-sky-600 font-black underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Galerie des Personnalités */}
        <div className="pt-16 mt-8 relative z-10">
          <div className="text-center space-y-4 mb-12">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Galerie d'Honneur</h4>
            <p className="text-amber-600 font-bold uppercase text-[10px] tracking-[0.3em]">Visages de nos soutiens</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              '/images/remerciements/personnalite.png',
              '/images/remerciements/personnalite1.png',
              '/images/remerciements/personnalite2.png',
              '/images/remerciements/personnalite3.png',
              '/images/remerciements/personnalite4.png',
              '/images/remerciements/personnalite5.png',
              '/images/remerciements/personnalite6.png',
              '/images/remerciements/personnalite7.png',
              '/images/remerciements/personnalitea.png',
              '/images/remerciements/personnaliteb.png',
              '/images/remerciements/personnalitec.png',
            ].map((src, idx) => (
              <div 
                key={idx} 
                className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-lg shadow-amber-900/5 border border-amber-200/50 group relative"
              >
                <img 
                  src={src} 
                  alt={`Personnalité ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget.parentNode as HTMLDivElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenue Officielle & T-Shirts de Sensibilisation */}
      <section>
        <TshirtShowcase />
      </section>

      {/* Nos Réseaux Sociaux & Communauté */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white rounded-[3.5rem] p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 space-y-10 max-w-5xl mx-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <Share2 size={16} className="text-sky-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">Communauté & Canaux Officiels</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Rejoignez nos Réseaux Sociaux
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Suivez les bilans de terrain, accédez aux alertes médicales et échangez avec notre équipe de bénévoles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialLinks.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bgColor} flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-105 transition-transform`}>
                        <IconComp />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight">{item.title}</h4>
                      <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mt-0.5">
                        {item.subTitle}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full ${item.btnColor} text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <span>Rejoindre Directement</span>
                      <ExternalLink size={14} />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(item.url, item.key)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/5"
                      >
                        {copiedKey === item.key ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400 font-black">Lien Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copier le Lien</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowQrModal(item.key as any)}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 p-2.5 rounded-xl transition-all cursor-pointer border border-white/5"
                        title="Afficher le QR Code"
                      >
                        <QrCode size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Suggestion / Add Honoree Modal */}
      <AnimatePresence>
        {showSuggestModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuggestModal(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative z-10 border border-slate-100"
            >
              <button
                onClick={() => setShowSuggestModal(false)}
                className="absolute top-6 right-6 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Ajouter un Hommage</h3>
                  <p className="text-xs text-slate-500 font-medium">Remercier un médecin, encadrant ou bénévole</p>
                </div>
              </div>

              {suggestSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Hommage Enregistré !</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                    Le nom a été directement ajouté à la liste des personnes honorées par SEDUCEP Togo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddHonoree} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Nom complet & Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Dr KOUADIO, M. GABIN..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Rôle / Fonction *
                    </label>
                    <input
                      type="text"
                      required
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="Ex: Médecin Référent, Parrain, Coordinateur..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Titre de la distinction / Badge
                    </label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="Acteur Clé">Acteur Clé</option>
                      <option value="Ambassadeur Santé">Ambassadeur Santé</option>
                      <option value="Promoteur Social">Promoteur Social</option>
                      <option value="Soutien Médical">Soutien Médical</option>
                      <option value="Acteur de Terrain">Acteur de Terrain</option>
                      <option value="Bienfaiteur">Bienfaiteur</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Message de Remerciement
                    </label>
                    <textarea
                      rows={3}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Remerciements pour sa contribution aux campagnes de dépistage..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={suggestLoading}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {suggestLoading ? (
                        <span>Enregistrement...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Publier l'Hommage</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 text-center space-y-6"
            >
              <button
                onClick={() => setShowQrModal(null)}
                className="absolute top-5 right-5 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Flash & Scan</span>
                <h4 className="text-xl font-black text-slate-900">
                  {showQrModal === 'whatsapp' && 'QR Code Groupe WhatsApp'}
                  {showQrModal === 'facebook' && 'QR Code Page Facebook'}
                  {showQrModal === 'tiktok' && 'QR Code Chaîne TikTok'}
                </h4>
              </div>

              {/* Generated QR visual preview */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl mx-auto w-48 h-48 flex flex-col items-center justify-center gap-3">
                <QrCode size={96} className="text-slate-800" />
                <span className="text-[10px] font-bold text-slate-400">Scannez avec votre téléphone</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  {showQrModal === 'whatsapp' && 'https://chat.whatsapp.com/J97IaBdATTXDlsACkgMpNS'}
                  {showQrModal === 'facebook' && 'https://www.facebook.com/share/p/14rENM7EWSB/'}
                  {showQrModal === 'tiktok' && 'https://www.tiktok.com/@seducep'}
                </p>

                <button
                  onClick={() => {
                    const url = showQrModal === 'whatsapp' ? 'https://chat.whatsapp.com/J97IaBdATTXDlsACkgMpNS' : showQrModal === 'facebook' ? 'https://www.facebook.com/share/p/14rENM7EWSB/' : 'https://www.tiktok.com/@seducep';
                    handleCopyLink(url, showQrModal);
                  }}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedKey === showQrModal ? 'Lien Copié !' : 'Copier le Lien'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {founders.length > 0 && (
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nos Fondateurs</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Une vision partagée pour la santé</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {founders.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-10 items-center md:items-start group hover:border-sky-200 transition-colors"
              >
                <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-slate-100 shrink-0 shadow-2xl shadow-slate-200 group-hover:rotate-3 transition-transform">
                  {f.imageUrl ? (
                    <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Users size={64} />
                    </div>
                  )}
                </div>
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{f.name}</h4>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-sky-600 block mt-1">{f.role}</span>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed italic">
                    "{f.bio}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

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
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Témoignages</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">Découvrez l'impact de nos actions à travers ceux qui les vivent.</p>
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
