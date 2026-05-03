import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Send, Mail, User, Phone, MessageSquare, Heart, ShieldCheck, Star } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function Volunteer() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    supportType: 'volontaire',
    availability: 'ponctuelle',
    interests: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'volunteers'), {
        ...form,
        status: 'pending',
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'volunteers');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="px-6 py-20 text-center space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('vol_thanks')}</h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">{t('vol_success')}</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all mt-8"
        >
          {t('nav_home')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Info Column */}
        <div className="space-y-10 lg:sticky lg:top-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-100/50"
            >
              <Heart size={32} fill="currentColor" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {t('vol_title')}
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
              {t('vol_desc')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold text-slate-600">{t('don_transparency')}</p>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                <Star size={20} />
              </div>
              <p className="text-xs font-bold text-slate-600">Impact Direct au Togo</p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_name')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Ex: Koffi Mensah"
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required
                      type="tel"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_type')}</label>
                  <select
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none font-bold text-slate-700"
                    value={form.supportType}
                    onChange={(e) => setForm({ ...form, supportType: e.target.value })}
                  >
                    <option value="volontaire">Volontaire Terrain</option>
                    <option value="donateur">Volontaire Donneur</option>
                    <option value="partenaire">Sponsor / Partenaire</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_profession')}</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                    value={form.profession}
                    onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('vol_form_interest')}</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-slate-300" size={18} />
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none font-medium"
                    value={form.interests}
                    onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('vol_btn_send')} <Send size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
