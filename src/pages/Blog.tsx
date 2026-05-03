import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BlogPost } from '../types';
import { Calendar, User, ArrowLeft, Share2, BookOpen, Search, ArrowRight, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../lib/i18n';

// ... (MOCK_POSTS unchanged but could be translated if needed, for now focusing on UI)
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Journée de dépistage gratuit',
    content: `### Journée de sensibilisation et dépistage.

SEDUCEP a une fois de plus démontré son engagement profond pour la santé communautaire à travers une journée de sensibilisation exceptionnelle, organisée ce vendredi 6 septembre 2024, à l’EPL MAGNIFICAT à Dagué Assévénou.

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
  <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" alt="Entrée" className="rounded-3xl shadow-lg w-full h-48 object-cover" />
  <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800" alt="Consultation" className="rounded-3xl shadow-lg w-full h-48 object-cover" />
</div>

Cette rencontre ouverte à tous a permis de démystifier des pathologies qui menacent notre bien-être quotidien :

- **Le diabète** : comprendre les signes précoces et éviter les dérives.
- **L’AVC** : comment l’éviter et reconnaître les symptômes à temps.
- **Le glaucome et ses complications** : la menace silencieuse de la cécité.
- **Les allergies oculaires et la cataracte** : mieux les vivre et les prévenir.
- **L’impact des écrans** : sur les yeux, chez les jeunes comme chez les adultes.

### Une ambiance fraternelle et éducative
Parents, jeunes, enseignants et responsables communautaires se sont réunis dans une atmosphère conviviale et participative. Les échanges ont été enrichissants, les questions nombreuses, et les réponses données par des spécialistes de la santé ont touché le cœur de chacun.

Des conseils pratiques, des explications simples… La journée fut un véritable temps de grâce pour la santé oculaire et générale.`,
    author: 'Equipe SEDUCEP',
    category: 'Dépistage',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    publishedAt: Timestamp.fromDate(new Date('2024-09-06')),
    featured: true
  },
  {
    id: '2',
    title: 'Tournoi don de sang',
    content: `### Tournoi de Football « Le Foot du Don de Sang » au CEG Djidjolé : Une jeunesse engagée pour la vie !

Le 11 Juin 2024, le terrain du CEG Djidjolé s’est transformé en une véritable arène de fraternité, de sport et de solidarité. À travers le tournoi « Le Foot du Don de Sang », des dizaines de jeunes se sont rassemblés pour défendre les couleurs de leurs équipes, mais surtout, pour porter haut un message vital : **donner son sang, c’est sauver des vies**.

<div className="flex flex-col sm:flex-row gap-6 my-8 items-center bg-slate-50 p-6 rounded-[2.5rem]">
  <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" alt="Joueur" className="w-full sm:w-1/3 rounded-3xl shadow-lg border-4 border-white" />
  <p className="flex-1 text-slate-600 font-medium italic leading-relaxed">
    Le sport comme vecteur de solidarité. Les jeunes du quartier se sont mobilisés en nombre pour cette cause noble, prouvant que la passion du football peut servir à sauver des vies.
  </p>
</div>

### Un tournoi engagé et inspirant
Sur un sol rouge de passion et d’effort, les équipes locales se sont affrontées dans un esprit de fair-play exemplaire. L’événement, soutenu par SEDUCEP (Santé, Éducation, Dépistage Universel et Engagement pour la Prévention), visait à sensibiliser la jeunesse à l’importance du don de sang volontaire. Chaque but, chaque passe, chaque victoire était une célébration de la vie.

> « Le sang ne se fabrique pas. C’est le don qui sauve. Aujourd’hui, ces jeunes nous montrent qu’on peut jouer pour quelque chose de grand. » - **Dr SEHONOU**.

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
  <div className="bg-slate-100 rounded-2xl h-32 animate-pulse flex items-center justify-center text-[10px] font-black p-2 text-center text-slate-300">Photo medailles</div>
  <div className="bg-slate-100 rounded-2xl h-32 animate-pulse flex items-center justify-center text-[10px] font-black p-2 text-center text-slate-300">Photo ambiance</div>
  <div className="bg-slate-100 rounded-2xl h-32 animate-pulse flex items-center justify-center text-[10px] font-black p-2 text-center text-slate-300">Photo public</div>
  <div className="bg-slate-100 rounded-2xl h-32 animate-pulse flex items-center justify-center text-[10px] font-black p-2 text-center text-slate-300">Photo match</div>
</div>

### Une victoire pour tous
Au-delà des médailles remises aux finalistes, c’est toute une communauté qui est sortie gagnante. L’ambiance festive, la fierté des participants, les sourires après chaque coup de sifflet final : tout témoignait d’un événement réussi, où sport et humanité ont marché main dans la main.

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-8">
  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" />
  <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" />
  <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac248e?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" />
  <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" />
</div>

### Quand la jeunesse devient actrice du changement
L’événement a permis de mobiliser des élèves, enseignants, habitants du quartier et volontaires de la santé. Il a également servi de tremplin pour encourager l’inscription de nouveaux donneurs et futurs bénévoles à travers la plateforme de SEDUCEP.

Ce tournoi n’est que le début d’une série d’actions communautaires autour de la santé préventive, l’éducation et la citoyenneté. D’autres activités sportives, culturelles et de dépistage sont prévues dans les mois à venir.`,
    author: 'Dr SEHONOU',
    category: 'Actions',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    publishedAt: Timestamp.fromDate(new Date('2024-06-11')),
  },
  {
    id: '3',
    title: 'Hygiène des mains',
    content: `### L’hygiène des mains en 5 étapes : un geste simple qui sauve des vies
Laver ses mains peut sembler banal. Pourtant, ce geste simple et rapide peut prévenir jusqu’à **80 % des infections**. En ces temps où les maladies infectieuses circulent rapidement (grippe, gastro, COVID-19, variole etc.), adopter une bonne hygiène des mains est une barrière essentielle.

Mais encore faut-il bien le faire. Voici les 5 étapes clés pour un lavage de mains efficace :

1. **Mouillez vos mains** : Commencez par mouiller complètement vos mains avec de l’eau propre, de préférence tiède. Cela prépare la peau à recevoir le savon et facilite le délogement des microbes.
![Etape 1](https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400)

2. **Appliquez du savon** : Prenez une quantité suffisante de savon pour recouvrir toute la surface des mains. Le savon est essentiel : il détache les germes de la peau, même ceux invisibles à l’œil nu.
![Etape 2](https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=400)

3. **Frottez pendant 30 secondes** : C’est l’étape cruciale. Frottez toutes les surfaces : paumes, dos des mains, entre les doigts, le bout des doigts et sous les ongles, les pouces, les poignets.
![Etape 3](https://images.unsplash.com/photo-1583209814683-c023dd2f3ca5?auto=format&fit=crop&q=80&w=400)

4. **Rincez abondamment** : Rincez à l’eau propre jusqu’à ce qu’il ne reste aucune trace de savon. Ce rinçage entraîne les germes décollés par le savon vers l’évacuation.

5. **Séchez avec soin** : Séchez vos mains avec une serviette propre ou un essuie-main jetable. Évitez les tissus humides ou partagés. Des mains mal séchées favorisent la prolifération de nouvelles bactéries.
![Etape 5](https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400)

<div className="bg-sky-50 p-8 rounded-[2.5rem] my-12 border border-sky-100">
  <h4 className="text-sky-900 font-black mb-4">Une hygiène des mains régulière est un réflexe de santé publique !</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
    <div className="space-y-3">
      <p className="font-black text-sky-700">Pourquoi c’est important ?</p>
      <ul className="list-disc pl-4 space-y-1 text-slate-600 font-medium">
        <li>Les mains sont le vecteur principal de transmission.</li>
        <li>Les enfants et seniors sont les plus vulnérables.</li>
        <li>Évite les infections nosocomiales.</li>
      </ul>
    </div>
    <div className="space-y-3">
      <p className="font-black text-sky-700">À quel moment se laver les mains ?</p>
      <ul className="list-disc pl-4 space-y-1 text-slate-600 font-medium">
        <li>Avant de manger ou cuisiner.</li>
        <li>Après les toilettes.</li>
        <li>En rentrant chez soi.</li>
      </ul>
    </div>
  </div>
</div>`,
    author: 'Service Prévention',
    category: 'Hygiène',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    publishedAt: Timestamp.fromDate(new Date('2025-06-10')),
  },
  {
    id: '4',
    title: 'Prévention de paludisme',
    content: `### Prévention du Paludisme : Une Approche Multiforme
Le paludisme est une maladie grave mais évitable. La prévention repose sur plusieurs piliers essentiels visant à réduire le risque de piqûres de moustiques et à empêcher la propagation du parasite.

### 1. Protection Contre les Piqûres de Moustiques
Les moustiques vecteurs du paludisme (anophèles) piquent principalement entre le coucher et le lever du soleil.
- **Moustiquaires imprégnées :** Dormir sous une moustiquaire traitée avec un insecticide est extrêmement efficace.
- **Répulsifs cutanés :** Appliquer des répulsifs sur la peau exposée.
- **Vêtements protecteurs :** Porter des vêtements longs de couleur claire le soir et la nuit.
- **Protection de l’habitat :** Utiliser des moustiquaires aux fenêtres et des ventilateurs.

### 2. Chimioprophylaxie (Médicaments Préventifs)
Pour les personnes voyageant dans des zones à risque, la prise de médicaments antipaludiques peut prévenir l’infection. Il est impératif de consulter un médecin.

### 3. Gestion de l’Environnement
- **Élimination des gîtes larvaires :** Vider ou couvrir les récipients d’eau stagnante.
- **Pulvérisation d’insecticides :** Sur les surfaces intérieures des habitations.
- **Larvicides :** Dans les points d’eau où ils se développent.

### 4. Diagnostic et Traitement Précoces
Un diagnostic rapide empêche l’évolution vers des formes graves et réduit la transmission.

> **Tu veux participer à la prochaine édition ?**
> Contacte-nous pour devenir volontaire !`,
    author: 'Dr. Mensah',
    category: 'Prévention',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800',
    publishedAt: Timestamp.fromDate(new Date('2025-06-09')),
  }
];

export default function Blog() {
  const { t, language } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(t('blog_cat_all'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } as any }
  };

  const categories = [
    t('blog_cat_all'), 
    t('blog_cat_prev'), 
    t('blog_cat_hyg'), 
    t('blog_cat_nut'), 
    t('blog_cat_mat')
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        
        const data = fetchedPosts.length === 0 ? MOCK_POSTS : fetchedPosts;
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        setPosts(MOCK_POSTS);
        setFilteredPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (activeCategory !== t('blog_cat_all')) {
      result = result.filter(p => p.category === activeCategory || (activeCategory === t('blog_cat_prev') && p.category === 'Prévention'));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q)
      );
    }
    setFilteredPosts(result);
  }, [searchQuery, activeCategory, posts, t]);

  if (selectedPost) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-slate-50 min-h-screen"
      >
        <div className="relative h-[50vh] sm:h-[70vh] overflow-hidden bg-slate-900 group">
          {selectedPost.videoUrl ? (
            <video 
              src={selectedPost.videoUrl} 
              className="w-full h-full object-contain" 
              controls
              autoPlay
            />
          ) : (
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={selectedPost.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173599bd14e?auto=format&fit=crop&q=60&w=800'} 
              className="w-full h-full object-cover opacity-80" 
              alt={selectedPost.title} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          <div className="absolute top-8 left-8">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: -90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPost(null)}
              className="p-4 bg-white/10 backdrop-blur-2xl rounded-full text-white border border-white/20 hover:bg-white/20 transition-all shadow-2xl"
            >
              <ArrowLeft size={24} />
            </motion.button>
          </div>
          
          <div className="absolute bottom-20 left-0 w-full px-8 sm:px-20 text-white max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">
                {selectedPost.category}
              </span>
              <h2 className="text-4xl sm:text-7xl font-black text-white leading-[0.9] tracking-tighter max-w-4xl">
                {selectedPost.title}
              </h2>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -60, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 bg-white rounded-t-[4rem] px-8 sm:px-20 pt-20 pb-32 space-y-12 max-w-5xl mx-auto shadow-2xl border-x border-slate-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-12 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                <User size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900 tracking-tight">{selectedPost.author}</p>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} className="text-emerald-500" /> 
                  {selectedPost.publishedAt instanceof Timestamp ? selectedPost.publishedAt.toDate().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB') : 'Date'}
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  SEDUCEP TEAM
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100 shadow-sm"
              >
                <Share2 size={24} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border border-slate-100 shadow-sm"
              >
                <Heart size={24} />
              </motion.button>
            </div>
          </div>

          <div className="markdown-body prose prose-slate prose-emerald max-w-none text-slate-600 font-medium leading-relaxed
            prose-p:text-lg prose-p:leading-[1.8]
            prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:leading-none
            prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:my-16
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-xl
            prose-strong:text-slate-900 prose-strong:font-black
          ">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{selectedPost.content}</ReactMarkdown>
          </div>
          
          <div className="pt-20 border-t border-slate-100 text-center space-y-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Fin de l'article</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedPost(null);
                window.scrollTo(0, 0);
              }}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20"
            >
              Retour au Blog
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-32"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full w-fit border border-emerald-100">
            <BookOpen size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Journal des Actions</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            {t('blog_title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium text-xl max-w-xl leading-relaxed italic">
            "{t('blog_desc')}"
          </motion.p>
        </div>
      </div>

      <motion.div variants={itemVariants} className="space-y-8 sticky top-20 z-20 pt-2">
        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
            <input 
              type="text" 
              placeholder={t('blog_search')} 
              className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-6 pl-16 pr-8 text-lg font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:mx-0 w-full lg:w-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20 overflow-hidden relative' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-300'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCat"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent"
                  />
                )}
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -12 }}
                onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo(0, 0);
                }}
                className="group bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col relative"
              >
                <div className="h-72 overflow-hidden relative">
                  <motion.img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173599bd14e?auto=format&fit=crop&q=60&w=800'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border border-white/10">
                      {post.category}
                    </span>
                  </div>
                  {post.videoUrl && (
                    <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-xl animate-pulse">
                        <Share2 size={16} /> 
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-10 flex-1 flex flex-col space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Calendar size={12} className="text-emerald-500" />
                      {post.publishedAt instanceof Timestamp ? post.publishedAt.toDate().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB') : 'Date'}
                    </div>
                    <span className="text-[10px] font-black text-slate-300">0{idx + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight group-hover:text-emerald-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-3 opacity-80 flex-1">
                    {post.content.replace(/[#*`]/g, '').substring(0, 160)}...
                  </p>
                  
                  <div className="pt-8 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 font-black text-[10px] border border-slate-100">
                        {post.author[0]}
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{post.author}</span>
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white transform group-hover:bg-emerald-600 transition-all duration-300 shadow-xl">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-40 text-center space-y-8"
            >
              <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                <BookOpen size={60} />
              </div>
              <div className="space-y-4">
                <p className="text-slate-900 font-black text-3xl tracking-tight">{t('blog_no_results')}</p>
                <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto">Nous n'avons trouvé aucun article correspondant à votre recherche.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(t('blog_cat_all'));
                }}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Réinitialiser les filtres
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
