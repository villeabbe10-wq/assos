import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// If the database ID matches the AI Studio sandbox database pattern but the project is custom,
// we fall back to '(default)' because custom user projects use the default database.
const databaseId = (firebaseConfig.firestoreDatabaseId && 
  firebaseConfig.firestoreDatabaseId.includes('ai-studio-') && 
  !firebaseConfig.projectId.includes('ai-studio-'))
    ? '(default)'
    : firebaseConfig.firestoreDatabaseId || '(default)';

export const db = (databaseId && databaseId !== '(default)')
  ? getFirestore(app, databaseId)
  : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Offline and connection helper
export const isFirestoreAvailable = async () => {
  try {
    const docRef = doc(db, 'config', 'status');
    await getDocFromServer(docRef);
    return true;
  } catch (error) {
    return false;
  }
};

export const getFriendlyAuthErrorMessage = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return "La méthode de connexion sélectionnée n'est pas activée dans votre console Firebase (Authentication -> Sign-in method). Veuillez l'activer ou utiliser un e-mail/mot de passe.";
    case 'auth/unauthorized-domain':
      return "Ce domaine n'est pas autorisé pour la connexion dans votre projet Firebase. Ajoutez votre domaine dans Firebase Console -> Authentication -> Settings -> Authorized Domains.";
    case 'auth/invalid-action-code':
      return "L'action demandée ou le code de confirmation est invalide ou a expiré. Veuillez réessayer.";
    case 'auth/user-not-found':
      return "Aucun compte trouvé avec cet e-mail.";
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "Identifiant ou mot de passe incorrect.";
    case 'auth/invalid-email':
      return "Adresse e-mail invalide.";
    case 'auth/email-already-in-use':
      return "Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter.";
    case 'auth/weak-password':
      return "Le mot de passe doit contenir au moins 6 caractères.";
    case 'auth/popup-closed-by-user':
      return "La fenêtre de connexion a été fermée avant la finalisation.";
    case 'auth/popup-blocked':
      return "La fenêtre contextuelle de connexion a été bloquée par votre navigateur.";
    default:
      return error?.message || "Une erreur de connexion est survenue. Veuillez réessayer.";
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return res.user;
  } catch (error) {
    console.error("Error signing in with Email", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, pass: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    return res.user;
  } catch (error) {
    console.error("Error registering with Email", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
