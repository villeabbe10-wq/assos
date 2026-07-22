import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword, 
  getFriendlyAuthErrorMessage 
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFriendlyAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        if (!password) {
          setErrorMsg("Veuillez saisir votre mot de passe.");
          setLoading(false);
          return;
        }
        await loginWithEmail(email.trim(), password);
        onClose();
      } else if (tab === 'forgot') {
        await resetPassword(email.trim());
        setSuccessMsg("Un e-mail de réinitialisation vous a été envoyé si le compte existe.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8"
        >
          {/* Header Close */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Title Banner */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Espace Réservé Aux Membres
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
              Cet espace est exclusivement réservé aux membres de l'équipe et administrateurs SEDUCEP-CONSEILS.
            </p>
          </div>

          {/* Messages feedback */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Google Quick Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 size={18} className="animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Connexion Rapide avec Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-100 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest absolute">
                ou par identifiant
              </span>
            </div>
          </div>

          {/* Form Email / Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Adresse E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[10px] font-bold text-sky-600 hover:underline"
                  >
                    Oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : tab === 'login' ? (
                <>
                  <LogIn size={16} />
                  Se Connecter
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  Réinitialiser Le Mot De Passe
                </>
              )}
            </button>

            {tab === 'forgot' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
