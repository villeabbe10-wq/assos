import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  GraduationCap, 
  Stethoscope, 
  Home, 
  ExternalLink,
  Upload,
  Send,
  CheckCircle2,
  Table as TableIcon,
  Search,
  MapPin,
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, orderBy } from 'firebase/firestore';

interface Beneficiary {
  id: string;
  name: string;
  detail: string;
  location: string;
  type: string;
}

export default function Sponsorship() {
  const [selectedType, setSelectedType] = useState('scolarite');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    beneficiaryChoice: '',
    message: ''
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const q = query(collection(db, 'beneficiaries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Beneficiary));
      setBeneficiaries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const scolarite = beneficiaries.filter(b => b.type === 'scolarite');
  const medical = beneficiaries.filter(b => b.type === 'medical');
  const orphelinat = beneficiaries.filter(b => b.type === 'orphelin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'sponsorships'), {
        ...formData,
        type: selectedType,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'sponsorships');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-20 text-center space-y-8 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-sky-600/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Merci pour votre engagement</h2>
          <p className="text-slate-500 font-medium">Votre demande de parrainage a été reçue. Un administrateur de SEDUCEP vous contactera très prochainement pour finaliser les détails.</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl"
        >
          Retour au formulaire
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="text-center space-y-10 max-w-4xl mx-auto py-10 px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-rose-100"
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
        
        <div className="space-y-6">
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
            Appel à <br /> <span className="text-rose-600 font-serif italic font-normal">l’engagement</span>.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed text-xl max-w-3xl mx-auto italic">
            « Par votre soutien, vous devenez bien plus qu’un donateur : vous devenez un protecteur, un espoir, un guide pour ceux qui n’ont rien demandé d’autre qu’une chance de vivre dignement. Joignons-vous à nous. Parrainons ensemble l’humanité. »
          </p>
        </div>
      </section>

      {/* Tables Section */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Bénéficiaires en attente de parrainage</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Histoires réelles, besoins urgents</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Table: Scolarisation */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 bg-indigo-50 border-b border-indigo-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">1. Scolarisation</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-60">Éducation</p>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profil</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Situation</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center"><Loader2 className="animate-spin inline-block text-slate-300" /></td></tr>
                  ) : scolarite.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">En cours de mise à jour</td></tr>
                  ) : scolarite.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-800 text-sm">{b.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{b.detail}</td>
                      <td className="px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                        <MapPin size={12} className="text-indigo-400" /> {b.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Soins médicaux */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 bg-emerald-50 border-b border-emerald-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Stethoscope size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">2. Soins médicaux</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-60">Santé</p>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profil</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Situation</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center"><Loader2 className="animate-spin inline-block text-slate-300" /></td></tr>
                  ) : medical.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">En cours de mise à jour</td></tr>
                  ) : medical.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-800 text-sm">{b.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{b.detail}</td>
                      <td className="px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                        <MapPin size={12} className="text-emerald-400" /> {b.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Orphelinat */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 bg-rose-50 border-b border-rose-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <Home size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">3. Orphelinat</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 opacity-60">Social</p>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profil</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Situation</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center"><Loader2 className="animate-spin inline-block text-slate-300" /></td></tr>
                  ) : orphelinat.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">En cours de mise à jour</td></tr>
                  ) : orphelinat.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-800 text-sm">{b.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{b.detail}</td>
                      <td className="px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                        <MapPin size={12} className="text-rose-400" /> {b.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-slate-900 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden">
        <div className="relative z-10 space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black text-white tracking-tight">Parrainer une Vie, Soutenir un Avenir</h3>
            <p className="text-sky-400 font-bold uppercase text-xs tracking-widest">Devenez partenaire solidaire</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Parrainage scolaire",
                desc: "Soutenez un enfant non scolarisé pour lui permettre d’accéder à l’éducation (frais, fournitures, uniforme).",
                icon: GraduationCap,
                color: "text-blue-400"
              },
              {
                title: "Prise en charge médicale",
                desc: "Financer les soins d’une personne malade n’ayant pas accès aux traitements essentiels (consultations, médicaments, transport).",
                icon: Stethoscope,
                color: "text-emerald-400"
              },
              {
                title: "Adopter à distance un orphelin",
                desc: "Contribuez au bien-être et à la réinsertion d’un orphelin démuni (logement, alimentation, éducation).",
                icon: Home,
                color: "text-rose-400"
              }
            ].map((p, i) => (
              <div key={i} className="space-y-6">
                <p.icon size={40} className={p.color} />
                <h4 className="text-xl font-black text-white">{p.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{p.desc}</p>
                <button 
                  onClick={() => {
                    const formElement = document.getElementById('sponsorship-form');
                    formElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2 hover:border-white transition-all inline-flex items-center gap-2"
                >
                  Remplir le formulaire <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Form Section */}
      <section id="sponsorship-form" className="max-w-4xl mx-auto space-y-12 bg-white p-10 sm:p-20 rounded-[4rem] border border-slate-100 shadow-2xl relative">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-50">
            <Info size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Formulaire de Parrainage</h3>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-loose">
              📄 La liste des bénéficiaires à parrainer est disponible ci-dessus
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            {/* Type Choice */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type de parrainage</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['scolarite', 'medical', 'orphelin'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-6 rounded-3xl border-2 font-black text-xs uppercase tracking-widest transition-all ${selectedType === type ? 'border-sky-600 bg-sky-50 text-sky-600 ring-4 ring-sky-600/5' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    {type === 'scolarite' ? 'Scolarité' : type === 'medical' ? 'Santé' : 'Orphelinat'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Votre nom complet</label>
                <input 
                  required
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-sky-600 outline-none transition-all font-bold text-slate-700"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Votre adresse e-mail</label>
                <input 
                  required
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-sky-600 outline-none transition-all font-bold text-slate-700"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom du bénéficiaire choisi + Précisions (facultatif)</label>
              <textarea 
                rows={4}
                placeholder="Ex: Je souhaite parrainer Abla K. pour sa scolarité."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-sky-600 outline-none transition-all font-bold text-slate-700 resize-none"
                value={formData.beneficiaryChoice}
                onChange={e => setFormData({...formData, beneficiaryChoice: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Télécharger un justificatif (engagement, pièce ID, etc.)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-slate-300" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-600">No file chosen</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cliquez pour ajouter un fichier</p>
                </div>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-3xl py-8 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-sky-600 transition-all shadow-2xl shadow-sky-600/10 disabled:bg-slate-200"
          >
            {loading ? 'Envoi en cours...' : (
              <>
                Envoyer le parrainage <Send size={20} />
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
