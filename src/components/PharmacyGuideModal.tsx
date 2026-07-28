import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  MapPin, 
  Smartphone, 
  Monitor, 
  HelpCircle, 
  Compass, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  BriefcaseMedical,
  Sparkles,
  Clipboard,
  PhoneCall,
  Share2
} from 'lucide-react';

interface PharmacyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPharmacyModal: (initialSearch?: string) => void;
}

export default function PharmacyGuideModal({
  isOpen,
  onClose,
  onOpenPharmacyModal,
}: PharmacyGuideModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [deviceType, setDeviceType] = useState<'pc' | 'mobile'>('pc');
  const [simulatedSearch, setSimulatedSearch] = useState<string>('Adidogomé');

  const totalSteps = 4;

  const mockPharmacies = [
    { name: 'Pharmacie de l\'Union', quartier: 'Adidogomé', distance: '1.2 km', tel: '+228 90 00 11 22', status: 'De garde' },
    { name: 'Pharmacie Saint Joseph', quartier: 'Tokoin', distance: '3.5 km', tel: '+228 90 22 33 44', status: 'De garde' },
    { name: 'Pharmacie Bè-Kpota', quartier: 'Bè', distance: '4.1 km', tel: '+228 91 55 66 77', status: 'De garde' },
    { name: 'Pharmacie des Lys', quartier: 'Agoè', distance: '5.0 km', tel: '+228 92 88 99 00', status: 'De garde' },
  ];

  const filteredMock = mockPharmacies.filter(p => 
    p.name.toLowerCase().includes(simulatedSearch.toLowerCase()) || 
    p.quartier.toLowerCase().includes(simulatedSearch.toLowerCase())
  );

  const handleFinishGuide = (searchQuery?: string) => {
    onClose();
    onOpenPharmacyModal(searchQuery || simulatedSearch);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 border border-slate-100"
          >
            {/* Top Bar / Progress */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white relative shrink-0">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                  <Compass size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">Guide Interactif</span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Retrouver une Pharmacie de Garde
                  </h3>
                </div>
              </div>

              {/* Step indicator pills */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="space-y-1">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        stepNum <= currentStep ? 'bg-sky-400 shadow-sm shadow-sky-400/50' : 'bg-white/20'
                      }`}
                    />
                    <span className="text-[9px] font-bold text-white/60 block text-center uppercase tracking-wider">
                      Étape {stepNum}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
                        <Sparkles size={14} /> Étape 1 : Choisir votre appareil
                      </div>
                      <h4 className="text-xl font-black text-slate-900">
                        Où se trouve le bouton « Pharmacies » ?
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Le bouton d'accès direct s'adapte automatiquement selon que vous naviguer depuis un ordinateur ou un smartphone.
                      </p>
                    </div>

                    {/* Device Selector Switch */}
                    <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2">
                      <button
                        onClick={() => setDeviceType('pc')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          deviceType === 'pc' ? 'bg-white text-sky-700 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Monitor size={16} /> sur Ordinateur (PC)
                      </button>
                      <button
                        onClick={() => setDeviceType('mobile')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          deviceType === 'mobile' ? 'bg-white text-sky-700 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone size={16} /> sur Mobile / Tablette
                      </button>
                    </div>

                    {/* Interactive visual preview */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/80 relative overflow-hidden">
                      {deviceType === 'pc' ? (
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">S</div>
                              <span className="font-black text-xs">SEDUCEP</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-sky-50 p-1.5 rounded-lg border border-sky-200 animate-pulse">
                              <BriefcaseMedical size={14} className="text-sky-600" />
                              <span className="text-[10px] font-black text-sky-700 uppercase">PHARMACIES</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 text-center font-medium">
                            👉 Sur PC : Cliquez directement sur l'onglet bleu <strong>« PHARMACIES »</strong> dans la barre de navigation tout en haut.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative h-28 flex flex-col justify-end">
                            <div className="text-[11px] font-bold text-slate-400">Écran du téléphone...</div>
                            <div className="absolute bottom-3 right-3 flex flex-col gap-2 items-end">
                              <div className="bg-sky-600 text-white p-3 rounded-xl shadow-lg flex items-center gap-1.5 border border-sky-400 animate-bounce">
                                <BriefcaseMedical size={18} />
                                <span className="text-[10px] font-black uppercase">Pharmacies</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 text-center font-medium">
                            👉 Sur Mobile : Une bulle bleue avec l'icône médicale 💊 flotte en bas à droite de votre écran.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <Search size={14} /> Étape 2 : Essayez la recherche interactive
                      </div>
                      <h4 className="text-xl font-black text-slate-900">
                        Filtrer par quartier ou par nom
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Tapez le nom de votre quartier de Lomé ci-dessous pour tester le filtre instantané.
                      </p>
                    </div>

                    {/* Interactive Input Simulation */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <label className="text-xs font-black text-slate-700 block uppercase tracking-wider">
                        Testez la recherche en direct :
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={simulatedSearch}
                          onChange={(e) => setSimulatedSearch(e.target.value)}
                          placeholder="Saisissez un quartier (ex: Adidogomé, Bè, Tokoin, Agoè)..."
                          className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm"
                        />
                      </div>

                      {/* Quick chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold self-center">Suggestions :</span>
                        {['Adidogomé', 'Bè', 'Tokoin', 'Agoè', 'Hedzranawoé'].map((q) => (
                          <button
                            key={q}
                            onClick={() => setSimulatedSearch(q)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                              simulatedSearch.toLowerCase() === q.toLowerCase()
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      {/* Simulated Output list */}
                      <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                        {filteredMock.length > 0 ? (
                          filteredMock.map((pharm, i) => (
                            <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                              <div>
                                <div className="font-bold text-slate-800">{pharm.name}</div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} className="text-sky-500" /> {pharm.quartier} • {pharm.distance}
                                </div>
                              </div>
                              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold">
                                {pharm.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic text-center py-4">
                            Aucune pharmacie de simulation trouvée pour "{simulatedSearch}".
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                        <Clipboard size={14} /> Étape 3 : Copier & Partager
                      </div>
                      <h4 className="text-xl font-black text-slate-900">
                        Copier la liste complète ou la partager
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Un bouton <strong>« Copier Tout »</strong> vous permet de récupérer l'ensemble de la garde en 1 clic pour l'envoyer à un proche via WhatsApp ou SMS.
                      </p>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-slate-400">Fenêtre Pharmacies de Garde</span>
                        <div className="bg-sky-500/20 text-sky-400 border border-sky-400/30 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Clipboard size={12} /> Copier Tout
                        </div>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                        <p className="text-emerald-400 font-bold">📋 LISTE DE GARDE DE LA SEMAINE :</p>
                        <p>1. PHARMACIE DE L'UNION - ADIDOGOMÉ (+228 90 00 11 22)</p>
                        <p>2. PHARMACIE SAINT JOSEPH - TOKOIN (+228 90 22 33 44)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        💡 Conseil : La liste est régulièrement mise à jour par les pharmaciens agréés partenaires de SEDUCEP CONSEILS.
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                      <Check size={32} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900">
                        Vous êtes prêt !
                      </h4>
                      <p className="text-slate-600 text-sm max-w-md mx-auto">
                        Vous pouvez maintenant consulter la liste des pharmacies de garde réelles mises à jour pour cette semaine.
                      </p>
                    </div>

                    {simulatedSearch && (
                      <div className="p-3 bg-sky-50 text-sky-800 rounded-xl text-xs font-bold border border-sky-100 max-w-md mx-auto">
                        Filtre prêt : « {simulatedSearch} » sera pré-rempli dans la recherche !
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={() => handleFinishGuide(simulatedSearch)}
                        className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-sky-600/30 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
                      >
                        <BriefcaseMedical size={18} />
                        <span>Ouvrir les Pharmacies de Garde</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} /> Précédent
                </button>
              ) : (
                <button
                  onClick={() => handleFinishGuide('')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Passer le guide
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Suivant <ArrowRight size={16} />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
