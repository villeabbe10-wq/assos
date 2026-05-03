import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'motion/react';
import { Plus, LayoutDashboard, FileText, Calendar, Loader2, CheckCircle, Users, Mail, Phone, Briefcase, ArrowLeft, BriefcaseMedical, UserPlus, Shield, Trash2 } from 'lucide-react';

interface AdminProps {
  onBack?: () => void;
}

export default function Admin({ onBack }: AdminProps) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'post' | 'event' | 'volunteers' | 'resources' | 'pharmacies' | 'beneficiaries' | 'activity' | 'admins'>('post');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(user?.email === 'seduceconseil@gmail.com');
  const [activity, setActivity] = useState<{ proposals: any[], reviews: any[], campaigns: any[] }>({ proposals: [], reviews: [], campaigns: [] });

  // Form states
  const [post, setPost] = useState({ title: '', content: '', category: 'Sensibilisation', author: 'SEDUCEP Team', imageUrl: '', videoUrl: '' });
  const [event, setEvent] = useState({ title: '', description: '', location: '', type: 'mission', date: '' });
  const [resource, setResource] = useState({ title: '', description: '', type: 'kit', contact: '' });
  const [pharmacy, setPharmacy] = useState({ title: '', content: '' });
  const [beneficiary, setBeneficiary] = useState({ name: '', detail: '', location: '', type: 'scolarite' });
  const [adminForm, setAdminForm] = useState({ email: '', role: 'Admin' });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 2Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost({ ...post, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { // Firestore limit is 1MB, let's keep it safe
        alert("La vidéo est trop volumineuse pour être stockée ainsi (max 800Ko). Pour les vidéos plus longues, utilisez un lien YouTube/Direct.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost({ ...post, videoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isPrimaryAdmin = user?.email === 'seduceconseil@gmail.com';

  useEffect(() => {
    if (user?.email) {
      if (user.email === 'seduceconseil@gmail.com') {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          const docRef = doc(db, 'system_admins', user.email!);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setIsAuthorized(true);
        };
        checkAuth();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthorized) return;
    
    switch (mode) {
      case 'volunteers': fetchVolunteers(); break;
      case 'resources': fetchResources(); break;
      case 'beneficiaries': fetchBeneficiaries(); break;
      case 'activity': fetchActivity(); break;
      case 'admins': fetchAdmins(); break;
    }
  }, [mode, isAuthorized]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'system_admins'), orderBy('addedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setAdmins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrimaryAdmin) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'system_admins', adminForm.email.toLowerCase()), {
        email: adminForm.email.toLowerCase(),
        role: adminForm.role,
        addedAt: Timestamp.now()
      });
      setSuccess(true);
      setAdminForm({ email: '', role: 'Admin' });
      fetchAdmins();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'system_admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!isPrimaryAdmin) return;
    if (confirm('Supprimer cet administrateur ?')) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, 'system_admins', email));
        fetchAdmins();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'system_admins');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setVolunteers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'resources'), orderBy('title', 'asc'));
      const querySnapshot = await getDocs(q);
      setResources(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'beneficiaries'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      setBeneficiaries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const pQ = query(collection(db, 'activity_proposals'), orderBy('createdAt', 'desc'));
      const rQ = query(collection(db, 'member_reviews'), orderBy('createdAt', 'desc'));
      const cQ = query(collection(db, 'campaign_joins'), orderBy('createdAt', 'desc'));
      
      const [pSnap, rSnap, cSnap] = await Promise.all([getDocs(pQ), getDocs(rQ), getDocs(cQ)]);
      
      setActivity({
        proposals: pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        reviews: rSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        campaigns: cSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <LayoutDashboard size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Accès Refusé</h2>
        <p className="text-slate-500">Cette section est réservée aux administrateurs de SEDUCEP-CONSEILS.</p>
      </div>
    );
  }

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        ...post,
        publishedAt: Timestamp.now(),
        featured: false
      });
      setSuccess(true);
      setPost({ title: '', content: '', category: 'Sensibilisation', author: 'SEDUCEP Team', imageUrl: '', videoUrl: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'blogPosts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'events'), {
        ...event,
        date: Timestamp.fromDate(new Date(event.date))
      });
      setSuccess(true);
      setEvent({ title: '', description: '', location: '', type: 'mission', date: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'resources'), {
        ...resource
      });
      setSuccess(true);
      setResource({ title: '', description: '', type: 'kit', contact: '' });
      fetchResources();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'resources');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'beneficiaries'), {
        ...beneficiary,
        createdAt: Timestamp.now()
      });
      setSuccess(true);
      setBeneficiary({ name: '', detail: '', location: '', type: 'scolarite' });
      fetchBeneficiaries();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePharmacies = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'pharmacies'), {
        ...pharmacy,
        updatedAt: Timestamp.now()
      });
      setSuccess(true);
      setPharmacy({ title: '', content: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pharmacies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit flex-wrap gap-1">
          {[
            { id: 'post', label: 'Publication' },
            { id: 'event', label: 'Événement' },
            { id: 'beneficiaries', label: 'Bénéficiaires' },
            { id: 'resources', label: 'Ressources' },
            { id: 'pharmacies', label: 'Pharmacies' },
            { id: 'volunteers', label: 'Volontaires' },
            { id: 'activity', label: 'Activité' },
            { id: 'admins', label: 'Membres Team' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className={`px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${mode === item.id ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-sky-50 border border-sky-100 text-sky-700 p-4 rounded-2xl flex items-center gap-3 font-bold"
        >
          <CheckCircle size={20} /> Opération réussie !
        </motion.div>
      )}

      {!isAuthorized ? (
        <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs min-h-[40vh] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem]">
          Vérification des autorisations...
        </div>
      ) : mode === 'post' ? (
        <form onSubmit={handleAddPost} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Titre de la Publication</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
              value={post.title}
              onChange={e => setPost({...post, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Type / Catégorie</label>
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                value={post.category}
                onChange={e => setPost({...post, category: e.target.value})}
              >
                <option>Sensibilisation</option>
                <option>Conseils</option>
                <option>Actualité</option>
                <option>Prévention</option>
                <option>Nutrition</option>
                <option>Autre</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Auteur</label>
              <input 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                value={post.author}
                onChange={e => setPost({...post, author: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Image de couverture</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="post-image-upload"
                  />
                  <label 
                    htmlFor="post-image-upload"
                    className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all font-bold text-slate-400 hover:text-sky-600"
                  >
                    {post.imageUrl ? (
                      <div className="flex items-center gap-3 w-full truncate">
                        <img src={post.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="truncate text-xs">Image sélectionnée</span>
                      </div>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span className="text-xs uppercase tracking-widest">Choisir une image</span>
                      </>
                    )}
                  </label>
                </div>
                {post.imageUrl && (
                  <button 
                    type="button" 
                    onClick={() => setPost({ ...post, imageUrl: '' })}
                    className="text-xs font-black text-rose-500 uppercase tracking-widest p-2"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Vidéo (Optionnel)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="post-video-upload"
                  />
                  <label 
                    htmlFor="post-video-upload"
                    className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all font-bold text-slate-400 hover:text-sky-600"
                  >
                    {post.videoUrl ? (
                      <div className="flex items-center gap-3 w-full truncate">
                        <video src={post.videoUrl} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="truncate text-xs">Vidéo chargée</span>
                      </div>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span className="text-xs uppercase tracking-widest">Ajouter Vidéo</span>
                      </>
                    )}
                  </label>
                </div>
                <input 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none"
                  placeholder="Ou lien Vidéo (YouTube/URL)"
                  value={post.videoUrl.startsWith('data:') ? '' : post.videoUrl}
                  onChange={e => setPost({...post, videoUrl: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Contenu (Markdown)</label>
            <textarea 
              required
              rows={8}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none font-medium text-sm"
              value={post.content}
              onChange={e => setPost({...post, content: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all disabled:bg-slate-300 shadow-lg shadow-sky-600/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Publier</>}
          </button>
        </form>
      ) : mode === 'event' ? (
        <form onSubmit={handleAddEvent} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom de l'événement</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              value={event.title}
              onChange={e => setEvent({...event, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Date</label>
              <input 
                type="date"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium text-sm"
                value={event.date}
                onChange={e => setEvent({...event, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lieu</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                placeholder="Ex: Lomé, Atakpamé"
                value={event.location}
                onChange={e => setEvent({...event, location: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Description courte</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none resize-none font-medium"
              value={event.description}
              onChange={e => setEvent({...event, description: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all disabled:bg-slate-300 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Calendar size={20} /> Programmer</>}
          </button>
        </form>
      ) : mode === 'resources' ? (
        <div className="space-y-8">
          <form onSubmit={handleAddResource} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom de la Ressource / Aide</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                value={resource.title}
                onChange={e => setResource({...resource, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                  value={resource.type}
                  onChange={e => setResource({...resource, type: e.target.value})}
                >
                  <option value="kit">Kit de Santé</option>
                  <option value="consultation">Consultation</option>
                  <option value="nutrition">Aide Alimentaire</option>
                  <option value="education">Matériel Éducatif</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Contact pour accèder</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                  placeholder="Numéro ou Email"
                  value={resource.contact}
                  onChange={e => setResource({...resource, contact: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Description</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none resize-none font-medium"
                value={resource.description}
                onChange={e => setResource({...resource, description: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Ajouter la ressource</>}
            </button>
          </form>

          <div className="grid gap-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">Ressources Actives</h3>
            {resources.map((res) => (
              <div key={res.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{res.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{res.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-sky-600">{res.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : mode === 'pharmacies' ? (
        <form onSubmit={handleUpdatePharmacies} className="space-y-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
              <BriefcaseMedical size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Mettre à jour les pharmacies de garde</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Période (Titre)</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold"
              placeholder="Ex: Semaine du 23 au 29 Juin 2025"
              value={pharmacy.title}
              onChange={e => setPharmacy({...pharmacy, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Liste des pharmacies (Copier-Coller ici)</label>
            <textarea 
              required
              rows={12}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-medium text-sm resize-none"
              placeholder="PHARMACIE ABRAHAM - 22 50 10 00..."
              value={pharmacy.content}
              onChange={e => setPharmacy({...pharmacy, content: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-600 transition-all disabled:bg-slate-200 shadow-xl shadow-slate-900/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Mettre à jour la liste</>}
          </button>
        </form>
      ) : mode === 'beneficiaries' ? (
        <div className="space-y-8">
          <form onSubmit={handleAddBeneficiary} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom complet du bénéficiaire</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                value={beneficiary.name}
                onChange={e => setBeneficiary({...beneficiary, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Catégorie</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                  value={beneficiary.type}
                  onChange={e => setBeneficiary({...beneficiary, type: e.target.value as any})}
                >
                  <option value="scolarite">Scolarité</option>
                  <option value="medical">Santé</option>
                  <option value="orphelin">Orphelinat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Localisation (Ville)</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-medium"
                  placeholder="Ex: Lomé"
                  value={beneficiary.location}
                  onChange={e => setBeneficiary({...beneficiary, location: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Détails / Situation</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none resize-none font-medium"
                value={beneficiary.detail}
                onChange={e => setBeneficiary({...beneficiary, detail: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Ajouter le bénéficiaire</>}
            </button>
          </form>

          <div className="grid gap-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">Bénéficiaires Actuels</h3>
            {beneficiaries.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{b.name}</h4>
                  <p className="text-[10px] text-sky-600 font-bold uppercase">{b.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : mode === 'activity' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Proposals */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-black">P</div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Propositions de Projets</h3>
            </div>
            <div className="space-y-4">
              {activity.proposals.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900">{p.title}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-1 rounded uppercase">{p.category}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{p.content}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Par {p.userName}</span>
                    <span className="text-[10px] font-bold text-slate-300">{p.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {activity.proposals.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucune proposition</p>}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-black">R</div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Avis & Témoignages</h3>
            </div>
            <div className="space-y-4">
              {activity.reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < r.rating ? 'bg-amber-400' : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 font-medium italic">"{r.content}"</p>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{r.userName}</span>
                    <span className="text-[10px] font-bold text-slate-300">{r.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {activity.reviews.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun avis</p>}
            </div>
          </div>

          {/* Campaigns */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center font-black">C</div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Inscriptions aux Campagnes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activity.campaigns.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{c.name}</h4>
                      <span className="text-[9px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded">INSCRIT</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium italic">« {c.engagement} »</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{c.userEmail?.split('@')[0]}</span>
                      <span className="text-[9px] text-slate-300 font-bold">{c.userEmail}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">{c.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {activity.campaigns.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucune inscription</p>}
          </div>
        </div>
      ) : mode === 'admins' ? (
        <div className="space-y-8">
          {isPrimaryAdmin && (
            <form onSubmit={handleAddAdmin} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Email du membre</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      placeholder="email@gmail.com"
                      value={adminForm.email}
                      onChange={e => setAdminForm({...adminForm, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Rôle</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 outline-none font-medium appearance-none"
                      value={adminForm.role}
                      onChange={e => setAdminForm({...adminForm, role: e.target.value})}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Fondateur">Fondateur</option>
                    </select>
                  </div>
                </div>
              </div>
              <button 
                disabled={loading}
                className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Ajouter à la Team</>}
              </button>
            </form>
          )}

          <div className="grid gap-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">Équipe SEDUCEP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Admin Card */}
              <div className="bg-slate-900 p-6 rounded-3xl text-white flex flex-col justify-between h-40 border-4 border-sky-500 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield size={80} />
                </div>
                <div>
                  <h4 className="font-black text-lg">Fondateur Principal</h4>
                  <p className="text-xs text-sky-400 font-bold">seduceconseil@gmail.com</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full w-fit">Accès Racine</span>
              </div>

              {admins.map((adm) => (
                <div key={adm.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 group hover:border-sky-100 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-slate-900 truncate">{adm.email.split('@')[0]}</h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{adm.email}</p>
                    </div>
                    {isPrimaryAdmin && (
                      <button 
                        onClick={() => handleDeleteAdmin(adm.id)}
                        className="text-slate-200 hover:text-rose-500 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${adm.role === 'Fondateur' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
                      {adm.role}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300">{adm.addedAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {admins.length === 0 && !loading && (
              <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun autre membre ajouté</p>
            )}
          </div>
        </div>
      ) : mode === 'volunteers' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-sky-600" size={40} />
            </div>
          ) : (
            <div className="grid gap-4">
              {volunteers.map((vol) => (
                <div key={vol.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-slate-900">{vol.name}</h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100">
                        {vol.supportType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Mail size={12} /> {vol.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {vol.phone}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {vol.profession}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase text-slate-300">Intérêt</p>
                      <p className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{vol.interests}</p>
                    </div>
                    <a href={`mailto:${vol.email}`} className="bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              ))}
              {volunteers.length === 0 && (
                <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Aucun volontaire enregistré
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
          Sélectionnez un mode
        </div>
      )}
    </div>
  );
}
