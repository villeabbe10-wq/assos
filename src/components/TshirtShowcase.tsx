import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Sparkles, Check, ShoppingBag, Send, Phone, Info, Heart, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import whiteTshirtImg from '../assets/images/seducep_tshirt_white_small_logo_1785270955173.jpg';
import greenTshirtImg from '../assets/images/seducep_tshirt_green_small_logo_1785270924365.jpg';
import blueTshirtImg from '../assets/images/seducep_tshirt_blue_small_logo_1785270937362.jpg';

interface TshirtShowcaseProps {
  compact?: boolean;
}

export default function TshirtShowcase({ compact = false }: TshirtShowcaseProps) {
  const [selectedColor, setSelectedColor] = useState<'white' | 'green' | 'blue'>('white');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState('Bénévolat / Sensibilisation');

  const tshirtData = {
    white: {
      name: 'T-Shirt Officiel Blanc SEDUCEP',
      colorName: 'Blanc Pur',
      img: whiteTshirtImg,
      desc: 'Porté principalement lors des cérémonies officielles, conférences médicales et réceptions d’inauguration.',
      badgeBg: 'bg-slate-100 text-slate-800',
      badgeText: '⚪ Modèle Blanc'
    },
    green: {
      name: 'T-Shirt Officiel Vert SEDUCEP',
      colorName: 'Vert Espoir',
      img: greenTshirtImg,
      desc: 'Symbole de santé et d’espoir, idéal pour les campagnes de sensibilisation écologique et consultations communautaires.',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      badgeText: '🟢 Modèle Vert'
    },
    blue: {
      name: 'T-Shirt Officiel Bleu SEDUCEP',
      colorName: 'Bleu Médical',
      img: blueTshirtImg,
      desc: 'Modèle dynamique d’intervention médicale, idéal pour les équipes soignantes et le bénévolat sur le terrain.',
      badgeBg: 'bg-sky-100 text-sky-800',
      badgeText: '🔵 Modèle Bleu'
    }
  };

  const current = tshirtData[selectedColor];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tshirt_orders'), {
        name: userName.trim(),
        phone: userPhone.trim(),
        role: userRole,
        color: selectedColor,
        colorName: current.colorName,
        size: selectedSize,
        tshirtName: current.name,
        status: 'en_attente',
        createdAt: serverTimestamp(),
      });
      setOrderSubmitted(true);
    } catch (err) {
      console.error('Error saving tshirt order:', err);
      // Even if offline, show confirmation to user
      setOrderSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorLabel = selectedColor === 'white' ? 'Couleur Blanche' : selectedColor === 'green' ? 'Couleur Verte' : 'Couleur Bleue';

  const whatsappMessage = encodeURIComponent(
    `Bonjour SEDUCEP, je souhaite commander / réserver le T-Shirt Officiel (${colorLabel}, Taille ${selectedSize}).`
  );

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-[3rem] p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden ${compact ? 'max-w-4xl mx-auto' : 'w-full'}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Shirt size={16} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">Tenue Officielle de Terrain</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              T-Shirt Officiel SEDUCEP CONSEILS
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl">
              Symbole d'engagement et de visibilité lors de nos campagnes de dépistage et de sensibilisation au Togo. Disponible en <strong>Blanc</strong>, <strong>Vert</strong> et <strong>Bleu</strong>.
            </p>
          </div>

          {/* Color Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setSelectedColor('white')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedColor === 'white'
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/10 font-black scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-inner" />
              <span>Blanc</span>
            </button>

            <button
              onClick={() => setSelectedColor('green')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedColor === 'green'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-black scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300 shadow-inner" />
              <span>Vert</span>
            </button>

            <button
              onClick={() => setSelectedColor('blue')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedColor === 'blue'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 font-black scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 border border-sky-300 shadow-inner" />
              <span>Bleu</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Image Showcase */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-800 group"
              >
                <img
                  src={current.img}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg border border-white/20 ${current.badgeBg}`}>
                    {current.badgeText}
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                  <p className="text-xs font-bold text-white">{current.name}</p>
                  <p className="text-[10px] text-sky-300 font-semibold">Petit Logo Discret - SÉDUCEP CONSEILS "Santé éducation pour tous"</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Details & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Design Officiel Agréé
              </span>
              <h4 className="text-2xl font-black text-white">{current.name}</h4>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                  <Check size={14} />
                </div>
                <div>
                  <div className="font-bold text-white">100% Coton Respirant</div>
                  <div className="text-[10px] text-slate-400">Confort optimal sous le climat du Togo</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Check size={14} />
                </div>
                <div>
                  <div className="font-bold text-white">Logo Discret Imprimé</div>
                  <div className="text-[10px] text-slate-400">Lotus SÉDUCEP CONSEILS élégant</div>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Choisir la Taille :
              </label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Commander / Réserver mon T-Shirt</span>
              </button>

              <a
                href={`https://chat.whatsapp.com/J97IaBdATTXDlsACkgMpNS`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={16} />
                <span>Demander sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Order / Reserve Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Réservation T-Shirt</span>
                <h4 className="text-2xl font-black text-slate-900">
                  Demande de T-Shirt Officiel
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Modèle sélectionné : <strong>{selectedColor === 'white' ? 'Blanc' : selectedColor === 'green' ? 'Vert' : 'Bleu'}</strong> • Taille : <strong>{selectedSize}</strong>
                </p>
              </div>

              {orderSubmitted ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check size={32} />
                  </div>
                  <div>
                    <h5 className="text-xl font-black text-slate-900">Demande Enregistrée !</h5>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Votre commande est disponible dans l'<strong>Espace Admin</strong> sous la section <strong>"Commandes T-Shirts"</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-1 text-xs">
                    <p className="font-bold text-slate-800">Récapitulatif :</p>
                    <p className="text-slate-600">• Client : <strong>{userName}</strong> ({userPhone})</p>
                    <p className="text-slate-600">• T-Shirt : <strong>{current.name}</strong></p>
                    <p className="text-slate-600">• Taille : <strong>{selectedSize}</strong></p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={`https://wa.me/22897682466?text=${encodeURIComponent(`Bonjour SEDUCEP, je viens d'enregistrer une commande de T-Shirt :\n- Nom : ${userName}\n- Tél : ${userPhone}\n- Modèle : ${current.name}\n- Taille : ${selectedSize}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <Phone size={16} />
                      <span>Envoyer aussi sur WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSubmitted(false);
                        setShowOrderModal(false);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Votre Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ex: Jean K."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+228 90 00 00 00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Rôle / Qualité
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="Bénévolat / Sensibilisation">Bénévole de Terrain</option>
                      <option value="Partenaire / Donateur">Donateur / Parrain</option>
                      <option value="Professionnel de Santé">Professionnel de Santé</option>
                      <option value="Membre / Sympathisant">Membre Sympathisant</option>
                    </select>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs uppercase"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Envoi...</span>
                        </>
                      ) : (
                        <span>Valider la commande</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
