import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Megaphone, ShieldCheck, ZoomIn, ZoomOut, ArrowRight, Maximize2 } from 'lucide-react';

interface AwarenessModalProps {
  bannerImage?: string;
  fallbackImage?: string;
  autoCloseSeconds?: number;
}

export default function AwarenessModal({
  bannerImage = '/images/publications/bannier/sensibilisation.jpg',
  fallbackImage = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
  autoCloseSeconds = 5
}: AwarenessModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [imgSrc, setImgSrc] = useState(bannerImage);
  const [countdown, setCountdown] = useState(autoCloseSeconds);

  useEffect(() => {
    // Check if splash ad was already shown in this session
    const hasBeenShown = sessionStorage.getItem('seducep_splash_ad_seen');
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('seducep_splash_ad_seen', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Countdown timer when splash ad is open (paused if zoomed in full screen)
  useEffect(() => {
    if (!isOpen || isFullscreenZoom) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isFullscreenZoom]);

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreenZoom(false);
    setZoomScale(1);
  };

  const toggleZoom = () => {
    setIsFullscreenZoom(!isFullscreenZoom);
    setZoomScale(1);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCountdown(autoCloseSeconds);
            setIsOpen(true);
          }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-emerald-500/40 hover:bg-slate-800 transition-all cursor-pointer group"
          title="Afficher le message de sensibilisation"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Megaphone size={16} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black uppercase tracking-wider">Flash Santé</span>
        </motion.button>
      )}

      {/* Fullscreen App Open Splash Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700/80 cursor-default flex flex-col max-h-[92vh]"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <ShieldCheck size={14} /> SEDUCEP Togo
                  </span>
                  <span className="text-xs font-extrabold text-white hidden sm:inline-block">
                    Sensibilisation & Éducation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {countdown > 0 && !isFullscreenZoom && (
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                      Fermeture dans {countdown}s
                    </span>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all cursor-pointer"
                    title="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Main Banner Image Display */}
              <div 
                onClick={toggleZoom}
                className="relative flex-1 bg-slate-950 overflow-hidden cursor-pointer group flex items-center justify-center min-h-[300px]"
              >
                <img
                  src={imgSrc}
                  alt="Bannière de Sensibilisation SEDUCEP Togo"
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-full object-contain transition-transform duration-300 group-hover:scale-102"
                  onError={() => setImgSrc(fallbackImage)}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleZoom();
                  }}
                  className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Maximize2 size={15} /> Afficher en Grand
                </button>
              </div>

              {/* Compact Splash Footer */}
              <div className="p-4 sm:px-6 sm:py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={toggleZoom}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ZoomIn size={16} /> Cliquez pour Agrandir l'Affiche
                </button>

                <button
                  onClick={handleClose}
                  className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Continuer vers le site <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      <AnimatePresence>
        {isFullscreenZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreenZoom(false)}
            className="fixed inset-0 z-[110] bg-slate-950/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 cursor-zoom-out"
          >
            {/* Lightbox Controls Header */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center justify-between z-20 w-full max-w-5xl mx-auto bg-slate-900/90 p-3 sm:px-6 rounded-2xl border border-slate-800"
            >
              <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm uppercase tracking-wider">
                <ShieldCheck className="text-emerald-400" size={18} />
                Affiche Officielle SEDUCEP Togo
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale(prev => Math.min(prev + 0.4, 2.5))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Zoomer"
                >
                  <ZoomIn size={16} /> <span className="hidden sm:inline">Zoom</span>
                </button>
                <button
                  onClick={() => setZoomScale(prev => Math.max(prev - 0.4, 0.8))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Dézoomer"
                >
                  <ZoomOut size={16} /> <span className="hidden sm:inline">Réduire</span>
                </button>
                <button
                  onClick={() => setIsFullscreenZoom(false)}
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ml-2"
                >
                  <X size={18} /> Fermer
                </button>
              </div>
            </div>

            {/* Lightbox Main Image Display with Scroll & Scale */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex-1 w-full overflow-auto flex items-center justify-center p-2 sm:p-6 my-2 scrollbar-thin"
            >
              <motion.img
                src={imgSrc}
                alt="Affiche Agrandie SEDUCEP Togo"
                referrerPolicy="no-referrer"
                animate={{ scale: zoomScale }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800/50 cursor-grab active:cursor-grabbing"
                onError={() => setImgSrc(fallbackImage)}
              />
            </div>

            {/* Lightbox Footer Note */}
            <div className="text-center text-xs text-slate-400 font-semibold z-20">
              Astuce : Utilisez les boutons de zoom ou défilez pour lire tous les détails de l'affiche.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


