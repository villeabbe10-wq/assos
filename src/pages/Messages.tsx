import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Settings, 
  LayoutDashboard, 
  MessageSquare, 
  Rocket, 
  Star, 
  Lightbulb, 
  CheckCircle2,
  ChevronRight,
  Smile,
  Megaphone,
  CheckSquare,
  Clock,
  AlertCircle,
  ListTodo,
  UserCheck,
  Plus,
  CheckCircle
} from 'lucide-react';
import { collection, query, orderBy, limit, addDoc, onSnapshot, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: any;
}

interface MessagesProps {
  onOpenAdmin: () => void;
}

type Section = 'my_tasks' | 'campaign' | 'review' | 'proposal' | 'chat';

export default function Messages({ onOpenAdmin }: MessagesProps) {
  const [user, authLoading] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('my_tasks');
  const [messages, setMessages] = useState<Message[]>([]);
  const [memberTasks, setMemberTasks] = useState<any[]>([]);
  const [taskNoteInput, setTaskNoteInput] = useState<{ [key: string]: string }>({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form states
  const [campaignForm, setCampaignForm] = useState({ name: '', engagement: '' });
  const [reviewForm, setReviewForm] = useState({ content: '' });
  const [proposalForm, setProposalForm] = useState({ title: '', description: '', targets: '' });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'team_tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const userEmail = user.email?.toLowerCase().trim();
      const filtered = allTasks.filter((t: any) => {
        const assigned = (t.assignedToEmail || '').toLowerCase().trim();
        return assigned === userEmail || assigned === 'tous' || assigned === '' || isAuthorized;
      });
      setMemberTasks(filtered);
    }, (error) => {
      console.error("Tasks snapshot error:", error);
    });

    return () => unsubscribe();
  }, [user, isAuthorized]);

  const handleMemberTaskStatus = async (taskId: string, newStatus: string) => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'team_tasks', taskId), { status: newStatus }, { merge: true });
      showSuccess(`Statut de la tâche mis à jour : ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'team_tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberTaskNote = async (taskId: string) => {
    const text = taskNoteInput[taskId];
    if (!text?.trim() || !user) return;
    setLoading(true);
    try {
      const taskRef = doc(db, 'team_tasks', taskId);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        const existingUpdates = taskSnap.data().updates || [];
        const newUpdate = {
          author: user.email?.split('@')[0] || 'Membre',
          authorEmail: user.email,
          text: text.trim(),
          createdAt: new Date().toISOString()
        };
        await setDoc(taskRef, {
          updates: [...existingUpdates, newUpdate]
        }, { merge: true });
        setTaskNoteInput({ ...taskNoteInput, [taskId]: '' });
        showSuccess("Rapport d'avancement ajouté !");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'team_tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      const emailLower = user.email.trim().toLowerCase();
      const allowedEmails = ['seduceconseil@gmail.com'];
      if (allowedEmails.includes(emailLower)) {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          try {
            const docRef = doc(db, 'system_admins', emailLower);
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
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'admin_messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, (error) => {
      // Only handle error if we are still signed in
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.GET, 'admin_messages');
      }
    });

    return () => unsubscribe();
  }, [user]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;
    try {
      await addDoc(collection(db, 'admin_messages'), {
        text: newMessage,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email?.split('@')[0] || 'Membre',
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'admin_messages');
    }
  };

  const submitAction = async (collectionName: string, data: any) => {
    setLoading(true);
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      showSuccess("Votre demande a été transmise avec succès !");
      // Reset forms
      setCampaignForm({ name: '', engagement: '' });
      setReviewForm({ content: '' });
      setProposalForm({ title: '', description: '', targets: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, collectionName);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'my_tasks', label: 'Mes Tâches & Travail', icon: CheckSquare, color: 'text-indigo-500' },
    { id: 'campaign', label: 'Campagnes', icon: Megaphone, color: 'text-orange-500' },
    { id: 'review', label: 'Laisser un avis', icon: Star, color: 'text-yellow-500' },
    { id: 'proposal', label: 'Proposer', icon: Lightbulb, color: 'text-emerald-500' },
    { id: 'chat', label: 'Discussion', icon: MessageSquare, color: 'text-sky-500' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-14rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
              <Smile size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">Espace Membre</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gérer vos actions</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeSection === item.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                  : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} className={activeSection === item.id ? 'text-white' : item.color} />
                {item.label}
              </button>
            ))}
          </nav>

          {isAuthorized && (
            <div className="pt-4 border-t border-slate-50">
               <button 
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <LayoutDashboard size={16} />
                Console Admin
              </button>
            </div>
          )}
        </div>

        <div className="bg-sky-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 italic">Note des fondateurs</p>
            <p className="font-bold text-sm leading-relaxed">
              « Chaque clic, chaque proposition nous rapproche d'un Togo en meilleure santé. »
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl flex flex-col relative">
        {success && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 inset-x-0 z-20 bg-emerald-500 text-white py-5 px-6 text-center text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
          >
            <CheckCircle2 size={18} />
            {success}
          </motion.div>
        )}

        <div className="p-6 sm:p-10 lg:p-20 flex-1 overflow-y-auto w-full no-scrollbar relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeSection === 'my_tasks' && (
              <motion.section 
                key="my_tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center border border-indigo-100 shadow-inner">
                    <CheckSquare size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                      Mes Tâches & <span className="text-indigo-600">Travail Collectif</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Missions et responsabilités attribuées par l'administration
                    </p>
                  </div>
                </div>

                {memberTasks.length === 0 ? (
                  <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 text-center space-y-3">
                    <CheckCircle className="mx-auto text-emerald-500" size={48} />
                    <h4 className="font-black text-base text-slate-800">Toutes vos tâches sont à jour !</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
                      Aucune nouvelle tâche collective ne vous est actuellement attribuée. Revenez régulièrement pour consulter vos nouvelles missions.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {memberTasks.map(t => (
                      <div key={t.id} className="bg-slate-50 p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-black text-lg text-slate-900">{t.title}</h4>
                              <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                t.priority === 'Haute' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                t.priority === 'Moyenne' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              }`}>
                                Priorité {t.priority}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                t.status === 'terminée' ? 'bg-emerald-500 text-white' :
                                t.status === 'en cours' ? 'bg-sky-500 text-white' :
                                'bg-slate-200 text-slate-700'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed pt-1">
                              {t.description}
                            </p>
                          </div>

                          {/* Quick Status Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {t.status !== 'en cours' && t.status !== 'terminée' && (
                              <button
                                onClick={() => handleMemberTaskStatus(t.id, 'en cours')}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                              >
                                Démarrer
                              </button>
                            )}
                            {t.status !== 'terminée' && (
                              <button
                                onClick={() => handleMemberTaskStatus(t.id, 'terminée')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle size={14} /> Terminer
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-200/60">
                          <span className="flex items-center gap-1 text-indigo-600 font-black">
                            <UserCheck size={12} /> Destinataire : {t.assignedToName || 'Équipe Collective'}
                          </span>
                          {t.deadline && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock size={12} /> Échéance : {t.deadline}
                            </span>
                          )}
                        </div>

                        {/* Existing Updates / Notes */}
                        {t.updates && t.updates.length > 0 && (
                          <div className="bg-white p-4 rounded-xl space-y-2 border border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                              <MessageSquare size={12} /> Historique des notes d'avancement :
                            </p>
                            {t.updates.map((u: any, idx: number) => (
                              <div key={idx} className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-black text-slate-900">{u.author} : </span>
                                <span>{u.text}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5 italic">{new Date(u.createdAt).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Progress Note Input */}
                        <div className="flex gap-2 pt-2">
                          <input 
                            type="text"
                            placeholder="Écrire un rapport d'avancement ou une question pour l'admin..."
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                            value={taskNoteInput[t.id] || ''}
                            onChange={e => setTaskNoteInput({ ...taskNoteInput, [t.id]: e.target.value })}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleAddMemberTaskNote(t.id);
                            }}
                          />
                          <button
                            onClick={() => handleAddMemberTaskNote(t.id)}
                            disabled={!taskNoteInput[t.id]?.trim() || loading}
                            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all disabled:opacity-40 cursor-pointer shrink-0"
                          >
                            Envoyer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {activeSection === 'campaign' && (
              <motion.section 
                key="campaign"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-6">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[2rem] flex items-center justify-center border border-orange-100 shadow-inner"
                  >
                    <Megaphone size={40} />
                  </motion.div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] max-w-sm">Participer à une <span className="text-orange-500">campagne.</span></h3>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nom de la campagne</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Don de sang Djidjolé" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-orange-500/5 outline-none transition-all font-bold text-lg shadow-inner"
                      value={campaignForm.name}
                      onChange={e => setCampaignForm({...campaignForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Votre engagement</label>
                    <textarea 
                      rows={5} 
                      placeholder="Comment souhaitez-vous aider ?" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-orange-500/5 outline-none transition-all font-bold text-lg resize-none shadow-inner"
                      value={campaignForm.engagement}
                      onChange={e => setCampaignForm({...campaignForm, engagement: e.target.value})}
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => submitAction('campaign_joins', campaignForm)}
                    disabled={loading}
                    className="bg-orange-500 text-white w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 disabled:bg-slate-200 flex items-center justify-center gap-3"
                  >
                    {loading ? 'Soumission...' : 'Soumettre mon engagement'}
                    <Send size={16} />
                  </motion.button>
                </div>
              </motion.section>
            )}

            {activeSection === 'review' && (
              <motion.section 
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-6 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-[2rem] flex items-center justify-center border border-yellow-100 shadow-inner"
                  >
                    <Smile size={40} />
                  </motion.div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] max-w-sm">Laisser un <span className="text-yellow-500 italic">avis.</span></h3>
                  <p className="text-slate-500 font-medium italic text-lg opacity-80">Votre retour est précieux pour améliorer nos actions.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Votre avis complet</label>
                    <textarea 
                      rows={8} 
                      placeholder="Comment avez-vous trouvé nos dernières actions ?" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-yellow-500/5 outline-none transition-all font-bold text-lg resize-none shadow-inner"
                      value={reviewForm.content}
                      onChange={e => setReviewForm({ content: e.target.value })}
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => submitAction('member_reviews', reviewForm)}
                    disabled={loading}
                    className="bg-yellow-500 text-white w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-yellow-600 transition-all shadow-2xl shadow-yellow-500/20 disabled:bg-slate-200 flex items-center justify-center gap-3"
                  >
                    {loading ? 'Envoi...' : 'Envoyer mon avis'}
                    <Send size={16} />
                  </motion.button>
                </div>
              </motion.section>
            )}

            {activeSection === 'proposal' && (
              <motion.section 
                key="proposal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-6">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center border border-emerald-100 shadow-inner"
                  >
                    <Lightbulb size={40} />
                  </motion.div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] max-w-sm">Proposer un <span className="text-emerald-500">projet.</span></h3>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Titre du projet</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Campagne d'hygiène à Aného" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-lg shadow-inner"
                        value={proposalForm.title}
                        onChange={e => setProposalForm({...proposalForm, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Bénéficiaires</label>
                      <input 
                        type="text" 
                        placeholder="Qui allons-nous aider ?" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-lg shadow-inner"
                        value={proposalForm.targets}
                        onChange={e => setProposalForm({...proposalForm, targets: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Description complète</label>
                    <textarea 
                      rows={5} 
                      placeholder="Détaillez votre idée..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-lg resize-none shadow-inner"
                      value={proposalForm.description}
                      onChange={e => setProposalForm({...proposalForm, description: e.target.value})}
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => submitAction('activity_proposals', proposalForm)}
                    disabled={loading}
                    className="bg-emerald-600 text-white w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20 disabled:bg-slate-200 flex items-center justify-center gap-3"
                  >
                    {loading ? 'Soumission...' : 'Soumettre le projet'}
                    <Send size={16} />
                  </motion.button>
                </div>
              </motion.section>
            )}

            {activeSection === 'chat' && (
              <motion.section 
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full max-h-[800px]"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50">
                      <MessageSquare size={64} strokeWidth={1} />
                      <p className="font-black text-xs uppercase tracking-widest">Aucun message pour le moment</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.userId === auth.currentUser?.uid ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-[1.5rem] p-4 text-sm font-medium shadow-sm ${
                          msg.userId === auth.currentUser?.uid 
                          ? 'bg-sky-500 text-white rounded-tr-none' 
                          : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-black uppercase text-slate-300 mt-1 px-2">
                          {msg.userName} • {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Votre message ici..."
                      className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                    />
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      disabled={!newMessage.trim()}
                      className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                    >
                      <Send size={20} />
                    </motion.button>
                  </form>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

