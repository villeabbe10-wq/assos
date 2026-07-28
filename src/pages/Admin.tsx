import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType, storage } from '../lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'motion/react';
import { Plus, LayoutDashboard, FileText, Calendar, Loader2, CheckCircle, Users, Mail, Phone, Briefcase, ArrowLeft, BriefcaseMedical, UserPlus, Shield, Trash2, Sparkles, Wand2, LogIn, CheckSquare, Clock, AlertCircle, ListTodo, UserCheck, MessageSquare } from 'lucide-react';
import AuthModal from '../components/AuthModal';

interface AdminProps {
  onBack?: () => void;
}

export default function Admin({ onBack }: AdminProps) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'post' | 'event' | 'volunteers' | 'resources' | 'pharmacies' | 'beneficiaries' | 'activity' | 'admins' | 'partners' | 'founders' | 'settings' | 'tasks'>('tasks');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [founders, setFounders] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedToEmail: '',
    assignedToName: '',
    priority: 'Moyenne' as 'Haute' | 'Moyenne' | 'Basse',
    deadline: ''
  });
  const [settings, setSettings] = useState({ logoUrl: '', associationName: 'SEDUCEP', phone: '+228 97682466', email: 'seduceconseil@gmail.com', facebook: '', whatsapp: '', instagram: '' });
  const [isAuthorized, setIsAuthorized] = useState(user?.email === 'seduceconseil@gmail.com');
  const [activity, setActivity] = useState<{ proposals: any[], reviews: any[], campaigns: any[] }>({ proposals: [], reviews: [], campaigns: [] });

  // Form states
  const [post, setPost] = useState({ title: '', content: '', category: 'Sensibilisation', author: 'SEDUCEP Team', imageUrl: '', gallery: [] as string[], videoUrl: '' });
  const [event, setEvent] = useState({ title: '', description: '', location: '', type: 'mission', date: '', imageUrl: '', gallery: [] as string[], videoUrl: '' });
  const [resource, setResource] = useState({ title: '', description: '', type: 'kit', contact: '', documentUrl: '' });
  const [pharmacy, setPharmacy] = useState({ title: '', content: '' });
  const [rawPharmacyText, setRawPharmacyText] = useState('');
  const [pharmacyFormat, setPharmacyFormat] = useState<'name-address-phone' | 'name-phone-address'>('name-address-phone');

  const parseAndFormatPharmacyLine = (line: string, format: 'name-address-phone' | 'name-phone-address') => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';

    let phone = '';
    let textWithoutPhone = trimmedLine;

    // 1. Detect Telephone Number
    // Check for ☎ symbol first
    const iconMatch = trimmedLine.match(/☎\s*([^\t\n,|–—-]+)/);
    if (iconMatch) {
      phone = iconMatch[1].trim();
      textWithoutPhone = trimmedLine.replace(iconMatch[0], ' ').trim();
    } else {
      // Check for Tél/Tel/Phone prefix
      const telMatch = trimmedLine.match(/(?:Tél\.?|Tel\.?|TÉL\.?|phone|contact)\s*:?\s*([^\t\n,|–—-]+)/i);
      if (telMatch) {
        phone = telMatch[1].trim();
        textWithoutPhone = trimmedLine.replace(telMatch[0], ' ').trim();
      } else {
        // Check for 8+ digits or O/o letters as zero (e.g. 92 01 11 OO or 22 21 29 64)
        const numberMatch = trimmedLine.match(/(?:\+?228[\s.-]*)?(?:[0-9oO]{2}[\s.-]?[0-9oO]{2}[\s.-]?[0-9oO]{2}[\s.-]?[0-9oO]{2})/);
        if (numberMatch) {
          phone = numberMatch[0].trim();
          textWithoutPhone = trimmedLine.replace(numberMatch[0], ' ').trim();
        }
      }
    }

    // Clean telephone string: convert letter O/o to 0
    if (phone) {
      phone = phone.replace(/[oO]/g, '0');
      phone = phone.replace(/^[-,\s☎\:\t’']+|[-,\s☎\:\t’']+$/g, '').trim();
      // Format 8-digit Togo phone number nicely with spaces e.g. "92011100" -> "92 01 11 00"
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length === 8) {
        phone = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 4)} ${digitsOnly.slice(4, 6)} ${digitsOnly.slice(6, 8)}`;
      }
    }

    // 2. Separate remaining text into Name and Address
    let name = '';
    let address = '';

    // Case A: Tabs (\t)
    if (textWithoutPhone.includes('\t')) {
      const parts = textWithoutPhone.split('\t').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        name = parts[0];
        address = parts.slice(1).join(', ');
      } else if (parts.length === 1) {
        name = parts[0];
      }
    } 
    // Case B: Separated by " - " or " – " or " | "
    else if (/\s+[-–—|]\s+/.test(textWithoutPhone)) {
      const parts = textWithoutPhone.split(/\s+[-–—|]\s+/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        name = parts[0];
        address = parts.slice(1).join(' - ');
      } else if (parts.length === 1) {
        name = parts[0];
      }
    } 
    // Case C: Separated by multiple spaces (3 or more)
    else if (/ {3,}/.test(textWithoutPhone)) {
      const parts = textWithoutPhone.split(/ {3,}/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        name = parts[0];
        address = parts.slice(1).join(', ');
      } else if (parts.length === 1) {
        name = parts[0];
      }
    } 
    // Case D: Fallback comma or dash split
    else {
      const cleanText = textWithoutPhone.replace(/^[-–—,\s]+|[-–—,\s]+$/g, '').trim();
      const firstSepIndex = cleanText.search(/[,-]/);
      if (firstSepIndex !== -1) {
        name = cleanText.substring(0, firstSepIndex).trim();
        address = cleanText.substring(firstSepIndex + 1).trim();
      } else {
        name = cleanText;
        address = '';
      }
    }

    name = name.replace(/^[-–—,\s’'\t]+|[-–—,\s’'\t]+$/g, '').trim();
    address = address.replace(/^[-–—,\s☎\:\t’']+|[-–—,\s☎\:\t’']+$/g, '').trim();

    if (!phone && !address) {
      return trimmedLine;
    }

    if (name.toUpperCase().startsWith('PHARMACIE')) {
      name = name.toUpperCase();
    } else if (name) {
      name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }

    if (!address) address = 'Lomé';
    if (!phone) phone = 'Non spécifié';

    if (format === 'name-address-phone') {
      return `${name} - ${address} - ${phone}`;
    } else {
      return `${name} - ${phone} - ${address}`;
    }
  };

  const changePharmacyFormat = (newFormat: 'name-address-phone' | 'name-phone-address') => {
    setPharmacyFormat(newFormat);
    
    // Automatically convert existing content lines to the newly selected format
    if (pharmacy.content.trim()) {
      const reformatted = pharmacy.content
        .split('\n')
        .map(line => parseAndFormatPharmacyLine(line, newFormat))
        .filter(Boolean)
        .join('\n');
      
      setPharmacy(prev => ({ ...prev, content: reformatted }));
    }
  };

  const handleAutoOrganizePharmacies = () => {
    if (!rawPharmacyText.trim()) return;

    const lines = rawPharmacyText.split('\n');
    const resultLines = lines
      .map(line => parseAndFormatPharmacyLine(line, pharmacyFormat))
      .filter(Boolean);

    if (resultLines.length > 0) {
      const formattedResult = resultLines.join('\n');
      setPharmacy(prev => ({
        ...prev,
        content: prev.content ? prev.content + '\n' + formattedResult : formattedResult
      }));
      setRawPharmacyText('');
    }
  };
  const [beneficiary, setBeneficiary] = useState({ name: '', detail: '', location: '', type: 'scolarite' });
  const [adminForm, setAdminForm] = useState({ email: '', role: 'Admin' });
  const [partnerForm, setPartnerForm] = useState({ name: '', logoUrl: '', description: '', website: '' });
  const [founderForm, setFounderForm] = useState({ name: '', role: 'Fondateur', bio: '', imageUrl: '', order: 0 });

  const uploadToStorage = async (file: File, folder: string) => {
    setUploading(true);
    try {
      if (storage) {
        try {
          const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          if (url) return url;
        } catch (stErr) {
          console.warn("Firebase Storage non configuré ou indisponible, conversion locale en image Data URL:", stErr);
        }
      }

      // Convert local file to Base64 Data URL so choosing a local photo always works!
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erreur lors de la sélection du fichier photo.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'post' | 'partner' | 'founder' | 'event' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadToStorage(file, 'images');
      if (url) {
        if (target === 'post') setPost({ ...post, imageUrl: url });
        else if (target === 'partner') setPartnerForm({ ...partnerForm, logoUrl: url });
        else if (target === 'founder') setFounderForm({ ...founderForm, imageUrl: url });
        else if (target === 'event') setEvent({ ...event, imageUrl: url });
        else if (target === 'logo') {
          const updatedSettings = { ...settings, logoUrl: url };
          setSettings(updatedSettings);
          try {
            await setDoc(doc(db, 'config', 'general'), updatedSettings, { merge: true });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } catch (err) {
            console.error("Error auto-saving logo settings:", err);
          }
        }
      }
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'post' | 'event') => {
    const file = e.target.files?.[0];
    if (file) {
      // Pour les vidéos, on peut être plus généreux avec Storage
      if (file.size > 20 * 1024 * 1024) {
        alert("La vidéo est trop volumineuse (max 20Mo).");
        return;
      }
      const url = await uploadToStorage(file, 'videos');
      if (url) {
        if (target === 'post') setPost({ ...post, videoUrl: url });
        else if (target === 'event') setEvent({ ...event, videoUrl: url });
      }
    }
  };

  const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadToStorage(file, 'documents');
      if (url) {
        setResource({ ...resource, documentUrl: url });
      }
    }
  };

  const isPrimaryAdmin = user?.email?.trim().toLowerCase() === 'seduceconseil@gmail.com';

  useEffect(() => {
    if (user?.email) {
      const emailLower = user.email.trim().toLowerCase();
      if (emailLower === 'seduceconseil@gmail.com') {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          const docRef = doc(db, 'system_admins', emailLower);
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
      case 'partners': fetchPartners(); break;
      case 'founders': fetchFounders(); break;
      case 'settings': fetchSettings(); break;
      case 'tasks': fetchTasks(); fetchAdmins(); fetchVolunteers(); break;
    }
  }, [mode, isAuthorized]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'team_tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'team_tasks'), {
        ...taskForm,
        assignedToEmail: taskForm.assignedToEmail.trim().toLowerCase() || 'tous',
        assignedToName: taskForm.assignedToName.trim() || 'Équipe Collective',
        status: 'à faire',
        createdAt: Timestamp.now(),
        createdBy: user?.email || 'Admin',
        updates: []
      });
      setSuccess(true);
      setTaskForm({
        title: '',
        description: '',
        assignedToEmail: '',
        assignedToName: '',
        priority: 'Moyenne',
        deadline: ''
      });
      fetchTasks();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'team_tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'team_tasks', taskId), { status: newStatus }, { merge: true });
      fetchTasks();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'team_tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Voulez-vous supprimer cette tâche ?')) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, 'team_tasks', taskId));
        fetchTasks();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'team_tasks');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'general'));
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    } catch (error) { 
      handleFirestoreError(error, OperationType.GET, 'config/general'); 
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'config', 'general'), settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) { handleFirestoreError(error, OperationType.UPDATE, 'config/general'); } finally { setLoading(false); }
  };

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'partners'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      setPartners(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchFounders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'founders'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      setFounders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'partners'), partnerForm);
      setSuccess(true);
      setPartnerForm({ name: '', logoUrl: '', description: '', website: '' });
      fetchPartners();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) { handleFirestoreError(error, OperationType.CREATE, 'partners'); } finally { setLoading(false); }
  };

  const handleAddFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'founders'), founderForm);
      setSuccess(true);
      setFounderForm({ name: '', role: 'Fondateur', bio: '', imageUrl: '', order: founders.length });
      fetchFounders();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) { handleFirestoreError(error, OperationType.CREATE, 'founders'); } finally { setLoading(false); }
  };

  const handleDeleteDoc = async (collPath: string, id: string, fetchFn: () => void) => {
    if (confirm('Supprimer cet élément ?')) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, collPath, id));
        fetchFn();
      } catch (error) { handleFirestoreError(error, OperationType.DELETE, collPath); } finally { setLoading(false); }
    }
  };

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

  const handleUpdateAdminRole = async (email: string, newRole: string) => {
    if (!isPrimaryAdmin) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'system_admins', email), { 
        role: newRole 
      }, { merge: true });
      fetchAdmins();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'system_admins');
    } finally {
      setLoading(false);
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

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (!user || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
          <LayoutDashboard size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          {!user ? "Connexion Requise" : "Accès Refusé"}
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          {!user 
            ? "Veuillez vous connecter avec votre compte administrateur (seduceconseil@gmail.com) pour accéder à cette console."
            : `Le compte connecté (${user.email}) n'a pas les droits administrateur de SEDUCEP-CONSEILS.`}
        </p>
        <button
          onClick={() => setIsAuthOpen(true)}
          className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10 cursor-pointer transition-all"
        >
          <LogIn size={16} />
          Se Connecter / Changer De Compte
        </button>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanGallery = post.gallery.filter(url => url.trim() !== '');
      await addDoc(collection(db, 'blogPosts'), {
        ...post,
        gallery: cleanGallery,
        publishedAt: Timestamp.now(),
        featured: false
      });
      setSuccess(true);
      setPost({ title: '', content: '', category: 'Sensibilisation', author: 'SEDUCEP Team', imageUrl: '', gallery: [], videoUrl: '' });
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
      const cleanGallery = event.gallery.filter(url => url.trim() !== '');
      await addDoc(collection(db, 'events'), {
        ...event,
        gallery: cleanGallery,
        date: Timestamp.fromDate(new Date(event.date))
      });
      setSuccess(true);
      setEvent({ title: '', description: '', location: '', type: 'mission', date: '', imageUrl: '', gallery: [], videoUrl: '' });
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
      setResource({ title: '', description: '', type: 'kit', contact: '', documentUrl: '' });
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
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'post', label: 'Publication (Blog)' },
            { id: 'event', label: 'Événement (Actions)' },
            { id: 'tasks', label: 'Tâches Membres' },
            { id: 'beneficiaries', label: 'Bénéficiaires' },
            { id: 'resources', label: 'Ressources' },
            { id: 'pharmacies', label: 'Pharmacies' },
            { id: 'partners', label: 'Partenaires' },
            { id: 'founders', label: 'Fondateurs' },
            { id: 'volunteers', label: 'Volontaires' },
            { id: 'activity', label: 'Activité' },
            { id: 'admins', label: 'Membres Team' },
            { id: 'settings', label: 'Paramètres' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === item.id ? 'bg-white shadow-md text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'post')}
                      className="hidden"
                      id="post-image-upload"
                    />
                    <label 
                      htmlFor="post-image-upload"
                      className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all font-bold text-slate-400 hover:text-sky-600"
                    >
                      {post.imageUrl && post.imageUrl.includes('firebasestorage') ? (
                        <div className="flex items-center gap-3 w-full truncate">
                          <img src={post.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                          <span className="truncate text-xs">Image Firebase</span>
                        </div>
                      ) : (
                        <>
                          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                          <span className="text-xs uppercase tracking-widest">{uploading ? 'Upload Firebase' : 'Choisir une image'}</span>
                        </>
                      )}
                    </label>
                  </div>
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Ou chemin local (ex: /images/publications/photo.jpg)"
                    value={post.imageUrl || ''}
                    onChange={e => setPost({...post, imageUrl: e.target.value})}
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic ml-2">Note: Les fichiers locaux doivent être placés dans le dossier "public".</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Vidéo (Optionnel)</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoChange(e, 'post')}
                      className="hidden"
                      id="post-video-upload"
                    />
                    <label 
                      htmlFor="post-video-upload"
                      className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all font-bold text-slate-400 hover:text-sky-600"
                    >
                      {post.videoUrl && post.videoUrl.includes('firebasestorage') ? (
                        <div className="flex items-center gap-3 w-full truncate">
                          <span className="truncate text-xs">Vidéo Firebase</span>
                        </div>
                      ) : (
                        <>
                          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                          <span className="text-xs uppercase tracking-widest">{uploading ? 'Upload Firebase' : 'Ajouter Vidéo'}</span>
                        </>
                      )}
                    </label>
                  </div>
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Ou chemin local / lien (ex: /videos/pub.mp4)"
                    value={post.videoUrl || ''}
                    onChange={e => setPost({...post, videoUrl: e.target.value})}
                  />
                </div>
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
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Galerie d'images (Optionnel)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.gallery.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none"
                    placeholder="Chemin ou URL"
                    value={img}
                    onChange={e => {
                      const newGallery = [...post.gallery];
                      newGallery[idx] = e.target.value;
                      setPost({...post, gallery: newGallery});
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newGallery = post.gallery.filter((_, i) => i !== idx);
                      setPost({...post, gallery: newGallery});
                    }}
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={() => setPost({...post, gallery: [...post.gallery, '']})}
              className="text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2 hover:bg-sky-50 p-3 rounded-xl w-fit"
            >
              <Plus size={16} /> Ajouter une image à la galerie
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Image de l'événement</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'event')}
                      className="hidden"
                      id="event-image-upload"
                    />
                    <label 
                      htmlFor="event-image-upload"
                      className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-50 hover:bg-sky-50 transition-all font-bold text-slate-400"
                    >
                      {event.imageUrl && event.imageUrl.includes('firebasestorage') ? (
                        <div className="flex items-center gap-3 w-full truncate text-sky-600">
                          <img src={event.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                          <span className="truncate text-xs">Image Firebase</span>
                        </div>
                      ) : (
                        <>
                          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                          <span className="text-xs uppercase tracking-widest">{uploading ? 'Envoi...' : 'Upload Image'}</span>
                        </>
                      )}
                    </label>
                  </div>
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Ou chemin local (ex: /images/events/pic.jpg)"
                    value={event.imageUrl || ''}
                    onChange={e => setEvent({...event, imageUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Vidéo (Optionnel)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoChange(e, 'event')}
                    className="hidden"
                    id="event-video-upload"
                  />
                  <label 
                    htmlFor="event-video-upload"
                    className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-50 hover:bg-sky-50 transition-all font-bold text-slate-400"
                  >
                    {event.videoUrl && event.videoUrl.includes('firebasestorage') ? (
                      <span className="text-xs text-sky-600 font-black">Vidéo Firebase</span>
                    ) : (
                      <>
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        <span className="text-xs uppercase tracking-widest">Upload Vidéo</span>
                      </>
                    )}
                  </label>
                </div>
                <input 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Ou chemin local / lien"
                  value={event.videoUrl || ''}
                  onChange={e => setEvent({...event, videoUrl: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Galerie d'images (Optionnel)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.gallery.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none"
                    placeholder="Chemin ou URL"
                    value={img}
                    onChange={e => {
                      const newGallery = [...event.gallery];
                      newGallery[idx] = e.target.value;
                      setEvent({...event, gallery: newGallery});
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newGallery = event.gallery.filter((_, i) => i !== idx);
                      setEvent({...event, gallery: newGallery});
                    }}
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={() => setEvent({...event, gallery: [...event.gallery, '']})}
              className="text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2 hover:bg-sky-50 p-3 rounded-xl w-fit"
            >
              <Plus size={16} /> Ajouter une image à la galerie
            </button>
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
            <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Document / Guide (PDF)</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="file"
                        accept=".pdf"
                        onChange={handleDocumentChange}
                        className="hidden"
                        id="document-upload"
                      />
                      <label 
                        htmlFor="document-upload"
                        className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 transition-all font-bold text-slate-400"
                      >
                        {resource.documentUrl && resource.documentUrl.includes('firebasestorage') ? (
                          <span className="text-xs text-emerald-600 font-black">PDF Firebase Envoyé</span>
                        ) : (
                          <>
                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            <span className="text-xs uppercase tracking-widest">{uploading ? 'Envoi...' : 'Upload Firebase'}</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-sky-500 font-medium text-xs"
                    placeholder="Ou chemin local (ex: /documents/guide.pdf)"
                    value={resource.documentUrl || ''}
                    onChange={e => setResource({...resource, documentUrl: e.target.value})}
                  />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic ml-2">Note: Les fichiers locaux doivent être placés dans le dossier "public".</p>
                </div>
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

          {/* Assistant de formatage intelligent */}
          <div className="p-6 bg-gradient-to-br from-sky-50/60 to-indigo-50/40 border-2 border-dashed border-sky-100/80 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-sky-700">
              <Sparkles size={18} className="animate-pulse" />
              <h4 className="text-sm font-black uppercase tracking-wider">Assistant d'organisation intelligent</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Collez ici des lignes de pharmacies brutes ou en désordre (depuis WhatsApp, Excel, etc.). L'assistant va automatiquement extraire le nom, l'adresse et le numéro pour les formater proprement.
            </p>
            
            <div className="space-y-2">
              <textarea 
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-medium text-xs placeholder:text-slate-300 resize-none"
                placeholder="Exemple en désordre :&#10;PHARMACIE MATTHIA  ☎22 21 29 64  1048, Avenue de la Libération...&#10;PHARMACIE DE L'UNION - Boulevard de la Paix - Tél : 22 21 34 56"
                value={rawPharmacyText}
                onChange={e => setRawPharmacyText(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Format de sortie :</span>
                <div className="flex bg-white p-1 rounded-xl border border-slate-100 gap-1 text-[10px] font-black uppercase">
                  <button
                    type="button"
                    onClick={() => changePharmacyFormat('name-address-phone')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      pharmacyFormat === 'name-address-phone'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Nom - Adresse - Numéro
                  </button>
                  <button
                    type="button"
                    onClick={() => changePharmacyFormat('name-phone-address')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      pharmacyFormat === 'name-phone-address'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Nom - Numéro - Adresse
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoOrganizePharmacies}
                disabled={!rawPharmacyText.trim()}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                <Wand2 size={16} />
                Organiser et insérer
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Liste finale des pharmacies (Prête pour publication)</label>
              {pharmacy.content.trim() && (
                <button
                  type="button"
                  onClick={() => changePharmacyFormat(pharmacyFormat)}
                  className="text-[10px] font-black uppercase text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 size={12} /> Re-formater au format sélectionné
                </button>
              )}
            </div>
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
      ) : mode === 'partners' ? (
        <div className="space-y-8">
          <form onSubmit={handleAddPartner} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Ajouter un Partenaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom</label>
                <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Site Web</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={partnerForm.website} onChange={e => setPartnerForm({...partnerForm, website: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Logo</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e, 'partner')} 
                      className="hidden"
                      id="partner-logo-upload"
                    />
                    <label 
                      htmlFor="partner-logo-upload"
                      className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 transition-all font-bold text-slate-400"
                    >
                      {partnerForm.logoUrl && partnerForm.logoUrl.includes('firebasestorage') ? (
                        <span className="text-xs text-sky-600 font-black">Logo Firebase</span>
                      ) : (
                        <>
                          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                          <span className="text-xs uppercase tracking-widest">Upload Firebase</span>
                        </>
                      )}
                    </label>
                  </div>
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none text-xs" 
                    placeholder="Ou chemin local (ex: /partners/logo.png)"
                    value={partnerForm.logoUrl || ''}
                    onChange={e => setPartnerForm({...partnerForm, logoUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Description courte</label>
              <textarea rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none resize-none" value={partnerForm.description} onChange={e => setPartnerForm({...partnerForm, description: e.target.value})} />
            </div>
            <button disabled={loading} className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all font-bold">
              {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Valider Partenaire</>}
            </button>
          </form>
          <div className="grid gap-4">
            {partners.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.logoUrl && <img src={p.logoUrl} className="w-10 h-10 rounded-lg object-contain" alt="" />}
                  <span className="font-bold">{p.name}</span>
                </div>
                <button onClick={() => handleDeleteDoc('partners', p.id, fetchPartners)} className="text-rose-500 p-2"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      ) : mode === 'founders' ? (
        <div className="space-y-8">
          <form onSubmit={handleAddFounder} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Ajouter un Membre Fondateur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom Complet</label>
                <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={founderForm.name} onChange={e => setFounderForm({...founderForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Rôle / Titre</label>
                <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={founderForm.role} onChange={e => setFounderForm({...founderForm, role: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Photo</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e, 'founder')} 
                      className="hidden"
                      id="founder-photo-upload"
                    />
                    <label 
                      htmlFor="founder-photo-upload"
                      className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-sky-500 transition-all font-bold text-slate-400"
                    >
                      {founderForm.imageUrl && founderForm.imageUrl.includes('firebasestorage') ? (
                        <span className="text-xs text-sky-600 font-black">Photo Firebase</span>
                      ) : (
                        <>
                          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                          <span className="text-xs uppercase tracking-widest">Upload Firebase</span>
                        </>
                      )}
                    </label>
                  </div>
                  <input 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none text-xs" 
                    placeholder="Ou chemin local (ex: /founders/photo.jpg)"
                    value={founderForm.imageUrl || ''}
                    onChange={e => setFounderForm({...founderForm, imageUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Biographie</label>
              <textarea rows={4} required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none resize-none font-medium text-sm" value={founderForm.bio} onChange={e => setFounderForm({...founderForm, bio: e.target.value})} />
            </div>
            <button disabled={loading} className="w-full bg-sky-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all font-bold">
              {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Enregistrer Fondateur</>}
            </button>
          </form>
          <div className="grid gap-4">
            {founders.map(f => (
              <div key={f.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {f.imageUrl && <img src={f.imageUrl} className="w-10 h-10 rounded-full object-cover" alt="" />}
                  <div>
                    <span className="font-bold block">{f.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">{f.role}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteDoc('founders', f.id, fetchFounders)} className="text-rose-500 p-2"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      ) : mode === 'settings' ? (
        <div className="space-y-8">
          <form onSubmit={handleSaveSettings} className="space-y-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Paramètres Généraux de l'Association</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block">Logo Principal</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-contain rounded-2xl" /> : <Plus className="text-slate-300" />}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, 'logo')} 
                        className="hidden"
                        id="logo-upload"
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all"
                      >
                        {uploading ? 'Upload...' : 'Choisir Fichier'}
                      </label>
                    </div>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-sky-500" 
                      placeholder="Ou lien / chemin local"
                      value={settings.logoUrl || ''}
                      onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nom de l'association</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none font-bold" value={settings.associationName} onChange={e => setSettings({...settings, associationName: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Email de contact</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Téléphone / WhatsApp</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lien Facebook</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none text-xs" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lien Instagram</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none text-xs" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lien WhatsApp Direct</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none text-xs" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all">
              {loading ? <Loader2 className="animate-spin" /> : 'Enregistrer les Paramètres'}
            </button>
          </form>
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
                    <select 
                      disabled={!isPrimaryAdmin || loading}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full outline-none appearance-none cursor-pointer border-none ${adm.role === 'Fondateur' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}
                      value={adm.role}
                      onChange={(e) => handleUpdateAdminRole(adm.id, e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Fondateur">Fondateur</option>
                    </select>
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
      ) : mode === 'tasks' ? (
        <div className="space-y-8">
          {/* Form to Assign Task */}
          <form onSubmit={handleAddTask} className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <CheckSquare size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Attribuer une Tâche Collective</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Travail collectif assigné aux membres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Intitulé de la Tâche</label>
                <input 
                  required
                  placeholder="Ex: Préparation des fournitures médicales"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-800"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Assigner à un Membre / Équipe</label>
                <div className="flex gap-2">
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    value={taskForm.assignedToEmail}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'tous') {
                        setTaskForm({ ...taskForm, assignedToEmail: 'tous', assignedToName: 'Tous les Membres' });
                      } else {
                        const foundAdmin = admins.find(a => a.email === val);
                        const foundVol = volunteers.find(v => v.email === val);
                        const name = foundAdmin?.email?.split('@')[0] || foundVol?.name || val;
                        setTaskForm({ ...taskForm, assignedToEmail: val, assignedToName: name });
                      }
                    }}
                  >
                    <option value="">-- Sélectionner un destinataire --</option>
                    <option value="tous">🌐 Tous les membres (Collectif)</option>
                    <optgroup label="Membres Admin / Team">
                      {admins.map(a => (
                        <option key={a.id} value={a.email}>👤 {a.email} ({a.role})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Volontaires">
                      {volunteers.map(v => (
                        <option key={v.id} value={v.email}>🤝 {v.name} ({v.email})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Instructions / Détail du travail</label>
              <textarea 
                rows={3}
                placeholder="Précisez ce que le membre doit réaliser, les consignes et les livrables attendus..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 resize-none"
                value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Niveau de Priorité</label>
                <div className="flex gap-2">
                  {(['Basse', 'Moyenne', 'Haute'] as const).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setTaskForm({ ...taskForm, priority: p })}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        taskForm.priority === p 
                          ? p === 'Haute' ? 'bg-rose-500 text-white shadow-md' : p === 'Moyenne' ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Date d'échéance (Optionnel)</label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={taskForm.deadline}
                  onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 cursor-pointer transition-all w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Assigner la Tâche
            </button>
          </form>

          {/* List of Tasks */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ListTodo size={20} className="text-indigo-600" />
              <span>Tâches en cours & Historique ({tasks.length})</span>
            </h4>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-sky-600" size={32} />
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                Aucune tâche attribuée pour le moment
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map(t => (
                  <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-black text-base text-slate-900">{t.title}</h5>
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
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{t.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          className="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none cursor-pointer"
                          value={t.status}
                          onChange={e => handleUpdateTaskStatus(t.id, e.target.value)}
                        >
                          <option value="à faire">À faire</option>
                          <option value="en cours">En cours</option>
                          <option value="terminée">Terminée</option>
                        </select>

                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Supprimer la tâche"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-50">
                      <span className="flex items-center gap-1 text-indigo-600 font-black">
                        <UserCheck size={12} /> Assigné : {t.assignedToName || t.assignedToEmail}
                      </span>
                      {t.deadline && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={12} /> Échéance : {t.deadline}
                        </span>
                      )}
                      <span>Créé par {t.createdBy}</span>
                    </div>

                    {/* Member Updates / Notes */}
                    {t.updates && t.updates.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                          <MessageSquare size={12} /> Notes d'avancement des membres :
                        </p>
                        {t.updates.map((u: any, idx: number) => (
                          <div key={idx} className="text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <span className="font-black text-slate-900">{u.author} : </span>
                            <span>{u.text}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5 italic">{new Date(u.createdAt).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
