import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MapPin, Phone, MessageSquare, Clipboard, Check, ExternalLink, BriefcaseMedical } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface PharmacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PharmacyModal({ isOpen, onClose }: PharmacyModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ title: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchLatestList();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchLatestList = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'pharmacies'), orderBy('updatedAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setData(querySnapshot.docs[0].data() as any);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple parsing for display if it looks like a list
  const parseContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines;
  };

  const filteredLines = data ? parseContent(data.content).filter(line => 
    line.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100">
                  <BriefcaseMedical size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Pharmacies de garde</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Lomé • {data?.title || 'Chargement...'}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search & Actions */}
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 shrink-0">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher une pharmacie..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-sky-600'
                }`}
              >
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
                {copied ? 'Copié !' : 'Copier Tout'}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 overscroll-contain touch-pan-y">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Récupération de la liste...</p>
                </div>
              ) : data ? (
                <div className="space-y-3">
                  {filteredLines.length > 0 ? (
                    filteredLines.map((line, idx) => {
                      // Attempt to highlight pharmacy names (capitalized words at start)
                      const isHeader = line.toUpperCase() === line && line.length > 3;
                      return (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-2xl border transition-all ${
                            isHeader 
                            ? 'bg-sky-600 text-white border-sky-700 shadow-lg mt-6' 
                            : 'bg-white border-slate-100 hover:border-sky-100 hover:shadow-sm'
                          }`}
                        >
                          <p className={`text-sm tracking-tight ${isHeader ? 'font-black uppercase' : 'font-medium text-slate-700'}`}>
                            {line}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 space-y-4">
                      <div className="text-slate-300 mx-auto w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full">
                        <Search size={24} />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">Aucun résultat pour "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 font-bold">
                  Aucune liste disponible pour le moment.
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-end rounded-b-[2rem] shrink-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Source: SEDUCEP-CONSEILS</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
