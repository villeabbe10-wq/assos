import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ewe';

interface Translations {
  [key: string]: {
    fr: string;
    ewe: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_home: { fr: 'Accueil', ewe: 'Aƒeme' },
  nav_blog: { fr: 'Conseils', ewe: 'Nuxxlɔ̃ame' },
  nav_events: { fr: 'Agenda', ewe: 'Kpɔɖenyu' },
  nav_volunteer: { fr: 'Bénévolat', ewe: 'Dɔwɔlawo' },
  nav_resources: { fr: 'Aides', ewe: 'Kpekpeɖeŋu' },
  nav_partners: { fr: 'Partenaires', ewe: 'Habɔbɔwo' },
  nav_donate: { fr: 'Faire un don', ewe: 'Na nuna' },
  nav_actions: { fr: 'Actions', ewe: 'Dɔwɔwɔwo' },
  nav_about: { fr: 'À Savoir', ewe: 'Mí ŋutinya' },
  nav_faq: { fr: 'FAQ', ewe: 'FAQ' },
  nav_sponsorship: { fr: 'Parrainage', ewe: 'Parrainage' },
  
  // Hero
  hero_tag: { fr: 'Mission en cours • Région Maritime', ewe: 'Mɔzɔzɔ • Maritime nutome' },
  hero_title_1: { fr: 'Sensibilisation', ewe: 'Sanitaire' },
  hero_title_2: { fr: 'Sanitaire', ewe: 'dzraɖoɖo' },
  hero_title_3: { fr: '& Action Communautaire.', ewe: '& Habɔbɔ dɔwɔwɔ.' },
  hero_desc: { 
    fr: "SEDUCEP-CONSEILS œuvre pour un Togo en meilleure santé par l'éducation médicale, le soutien aux enfants démunis et la mobilisation citoyenne.",
    ewe: "SEDUCEP-CONSEILS le dɔ wɔm na Togo nyui de nu tso dɔkɔta nyawo kpakple kpekpeɖeŋu na ɖeviwo."
  },
  btn_join: { fr: 'Rejoindre la mission', ewe: 'Wɔ dɔ kpli mí' },
  btn_support: { fr: 'Soutenir l\'action', ewe: 'Kpɛ ɖe mí ŋu' },
  don_kind_title: { fr: 'Dons en Nature', ewe: 'Nunawo' },
  don_kind_desc: { fr: 'Nourriture, vêtements, meubles, vélos... Tout ce qui peut aider.', ewe: 'Nuɖuɖu, awuwo kple nu bubuwo.' },
  don_mission_detailed: { fr: 'SEDUCEP est une association humanitaire engagée dans les zones rurales du Togo, là où l’accès à la santé, à l’éducation et à l’information est très limité. Nous agissons auprès des enfants non scolarisés, des familles isolées et des populations sans accès aux soins, en menant des campagnes de sensibilisation et de prévention contre les maladies.', ewe: 'SEDUCEP le Togo nutome dɔ wɔm.' },
  don_why_title: { fr: 'Pourquoi faire un don ?', ewe: 'Nu ka ta nàna nu?' },
  don_why_1: { fr: 'Financer les campagnes d’information et de prévention sanitaire.', ewe: 'Ga dodo na kpekpeɖeŋu.' },
  don_why_2: { fr: 'Offrir des soins de base et du matériel d’hygiène aux communautés défavorisées.', ewe: 'Ga dodo na kpekpeɖeŋu.' },
  don_why_3: { fr: 'Soutenir la scolarisation et l’intégration sociale des enfants vulnérables.', ewe: 'Ga dodo na kpekpeɖeŋu.' },
  don_why_4: { fr: 'Renforcer nos actions de proximité dans les zones reculées.', ewe: 'Ga dodo na kpekpeɖeŋu.' },
  don_cash_secure_title: { fr: 'Dons en Espèces (Sécurisé)', ewe: 'Ga nuna' },
  don_contact_admin: { fr: 'Contacter l\'Administration', ewe: 'Yi nanyi gbɔ' },
  don_security_notice: { fr: 'Pour votre sécurité, les informations de transfert (T-Money, Flooz, Coordonnées Bancaires) sont transmises uniquement après contact direct.', ewe: 'Míana kpekpeɖeŋu wo tso ga dodo ŋu.' },
  global_movement: { fr: 'Rejoignez le mouvement mondial', ewe: 'Wɔ ɖeka kple xexeame katã' },
  don_intl_title: { fr: 'Dons Internationaux', ewe: 'Xexeame nunawo' },
  don_local_title: { fr: 'Dons Locaux (Afrique)', ewe: 'Afrika nunawo' },
  don_bank_title: { fr: 'Virement Bancaire (SWIFT)', ewe: 'Ga dodo tso banki' },

  // Stats
  stat_lives: { fr: 'Vies Sauvées', ewe: 'Agbe' },
  stat_campaigns: { fr: 'Campagnes', ewe: 'Dɔwɔwɔwo' },
  stat_beneficiaries: { fr: 'Bénéficiaires', ewe: 'Xɔnametɔwo' },
  stat_volunteers: { fr: 'Bénévoles', ewe: 'Volunteer-wo' },

  // Sections
  focus_tag: { fr: 'Priorité 2026', ewe: 'Dɔ vevi 2026' },
  focus_title: { fr: 'Soutenir les enfants en situation de précarité.', ewe: 'Kpekpeɖeŋu na ɖevi siwo le hiã me.' },
  focus_desc: { 
    fr: 'Nous identifions les enfants démunis dans les zones reculées pour leur fournir un accès aux soins, des kits scolaires et un suivi nutritionnel.',
    ewe: 'Míele ɖevi siwo le hiã me dim le kɔƒewo me be míana dɔkɔta kpekpeɖeŋu wo.'
  },
  btn_donate: { fr: 'Faire un don ou aider', ewe: 'Na nu alo kpe ɖe mí ŋu' },
  
  // Home Sections
  impact_title: { fr: "Indicateurs d'Impact 2026", ewe: 'Dɔwɔwɔ ƒe ɖaseɖiɖi' },
  stories_title: { fr: 'Ils témoignent de l’impact de SEDUCEP', ewe: 'Woa ɖe fia tso SEDUCEP ŋu' },
  stories_desc: { fr: 'Découvrez comment nos actions transforment des vies chaque jour', ewe: 'Kpɔ ale si míewɔa dɔe.' },
  
  // Testimonials
  story_1: { fr: "Grâce à l’aide de SEDUCEP, mon enfant a pu retourner à l’école avec tous les fournitures nécessaires. Nous n’avions aucun moyen. Merci de tout cœur !", ewe: "SEDUCEP kpe ɖe vinye ŋu wòtrɔ yi suku." },
  story_1_role: { fr: 'Aïcha, mère de famille à Sokodé', ewe: 'Aïcha, Vidada le Sokodé' },
  story_2: { fr: "Je vivais seul et malade dans mon quartier. Les bénévoles de SEDUCEP m’ont accompagné chaque semaine, moralement et médicalement. Je ne me sens plus abandonné.", ewe: "Nyemegava nɔ nye ɖelɛ o." },
  story_2_role: { fr: 'Komi, retraité', ewe: 'Komi, Dzudzɔxɔla' },
  story_3: { fr: "En tant que médecin volontaire, j’ai été impressionné par l’organisation et la dévotion des équipes sur le terrain. SEDUCEP agit là où peu osent aller.", ewe: "Atikewɔla" },
  story_3_role: { fr: 'Dr. Baza, Médecin bénévole', ewe: 'Dr. Baza, Atikewɔla' },
  
  // Prevention
  prev_palu: { fr: 'Prévention Paludisme', ewe: 'Agbatidɔ dodo' },
  prev_palu_desc: { fr: "Conseils pratiques sur l'utilisation des moustiquaires.", ewe: "Nuxxlɔ̃ame tso emu-ɖɔ zãzã ŋu." },
  prev_maternelle: { fr: 'Santé Maternelle', ewe: 'Vidada kple vi' },
  prev_maternelle_desc: { fr: "Accompagnement des femmes enceintes : nutrition et suivi médical.", ewe: "Kpekpeɖeŋu na fufɔlawo kple nuɖuɖu nyui ŋuti nyawo." },
  
  // Agenda
  agenda_title: { fr: 'Agenda Terrain', ewe: 'Dɔwɔnawo' },
  agenda_view_all: { fr: 'Voir tout', ewe: 'Kpɔ wo katã' },
  agenda_ev1_title: { fr: 'Clinique Mobile : Kpalimé', ewe: 'Dɔkɔta ʋu: Kpalimé' },
  agenda_ev1_desc: { fr: 'Dépistage gratuit HTA/Diabète', ewe: 'Aʋidɔ kple ʋusɔgbɔdɔ dodo' },
  agenda_ev2_title: { fr: 'Formation Bénévoles', ewe: 'Dɔwɔlawo ƒe heehe' },
  agenda_ev2_desc: { fr: 'Lomé, Centre Communautaire', ewe: 'Lomé, Habɔbɔƒe' },

  // Aides
  aides_brand: { fr: 'Aides Disponibles', ewe: 'Kpekpeɖeŋu siwo li' },
  aides_item1: { fr: 'Bourses de stage hospitalier', ewe: 'Sukudede kpekpeɖeŋu' },
  aides_item2: { fr: 'Consultations mères-enfants', ewe: 'Vidada kple vi dɔléle dodo' },
  aides_item3: { fr: 'Distribution de kits d\'hygiène', ewe: 'Dzadzraɖo nuwo mama' },
  btn_guide: { fr: 'Consulter le guide complet', ewe: 'Kpɔ mɔɖuɖu katã' },

  // Footer
  footer_about: { fr: 'À propos', ewe: 'Tso mía ŋu' },
  footer_desc: { 
    fr: 'SEDUCEP-CONSEILS est une organisation à but non lucratif dédiée à l\'amélioration de la santé communautaire au Togo.',
    ewe: 'SEDUCEP-CONSEILS nye habɔbɔ si kpena ɖe amewo ŋu le Togo.'
  },
  footer_links: { fr: 'Navigation', ewe: 'Mɔnyanya' },
  footer_support: { fr: 'Soutien', ewe: 'Kpekpeɖeŋu' },
  footer_contact: { fr: 'Contact', ewe: 'Kaƒu' },
  footer_rights: { fr: 'Tous droits réservés.', ewe: 'Míetɔe nye esia.' },
  footer_partners: { fr: 'Partenaires Officiels', ewe: 'Habɔbɔ siwo kple míewɔa dɔ' },

  // Volunteer Page
  vol_title: { fr: 'Rejoignez l\'Aventure', ewe: 'Wɔ dɔ kpli mí' },
  vol_desc: { 
    fr: 'Que vous soyez professionnel de santé ou simplement motivé par l\'aide humanitaire, votre énergie peut sauver des vies au Togo.',
    ewe: 'Ne dɔkɔtae nènye alo amesi lɔ̃ dɔwɔwɔ koe nènye la, wò dɔwɔwɔ ate ŋu axɔ agbe geɖewo le Togo.'
  },
  vol_form_name: { fr: 'Nom complet', ewe: 'Ŋkɔ katã' },
  vol_form_email: { fr: 'Email', ewe: 'Messenger-mɔ' },
  vol_form_phone: { fr: 'Téléphone (WhatsApp)', ewe: 'Kaƒu' },
  vol_form_type: { fr: 'Type de soutien', ewe: 'Dɔwɔwɔ ƒomevi' },
  vol_form_profession: { fr: 'Profession', ewe: 'Dɔwɔwɔ' },
  vol_form_avail: { fr: 'Disponibilité', ewe: 'Ɣeyiɣi' },
  vol_form_interest: { fr: 'Domaines d\'intérêt', ewe: 'Nusiwo nè lɔ̃' },
  vol_btn_send: { fr: 'Envoyer ma candidature', ewe: 'Ɖoe ɖa' },
  vol_thanks: { fr: 'Merci !', ewe: 'Akpe !' },
  vol_success: { fr: 'Votre candidature a été reçue. Notre équipe vous contactera.', ewe: 'Míexɔ wò dɔbiafia la. Míafa ka na wò kpuie.' },

  // Donation Page
  don_title: { fr: 'Soutenir notre action', ewe: 'Kpekpeɖeŋu na míaƒe dɔ' },
  don_desc: { 
    fr: 'Chaque don contribue directement à l\'achat de médicaments et de kits scolaires pour les enfants démunis.',
    ewe: 'Nuna ɖesiaɖe kpena ɖe mía ŋu be míadzra atikewo kple suku nuwo na ɖeviwo.'
  },
  don_transparency: { fr: 'Transparence Totale', ewe: 'Ɖaseɖiɖi' },
  don_transparency_desc: { fr: '100% de vos dons sont alloués aux projets terrain.', ewe: 'Míezãa nunawo katã na dɔwɔwɔ le kɔƒewo me.' },

  // Blog Page
  blog_title: { fr: 'Santé & Conseils', ewe: 'Lãmesẽ kple Nuxxlɔ̃ame' },
  blog_desc: { fr: 'Informations fiables et accessibles.', ewe: 'Nuxxlɔ̃ame nyuiwo na amesiame.' },
  blog_search: { fr: 'Rechercher un sujet...', ewe: 'Di nyatia...' },
  blog_no_results: { fr: 'Aucun article trouvé', ewe: 'Míekpɔ nyati aɖeke o' },
  blog_cat_all: { fr: 'Tous', ewe: 'Wo katã' },
  blog_cat_prev: { fr: 'Prévention', ewe: 'Ɖiaɖeɖe' },
  blog_cat_hyg: { fr: 'Hygiène', ewe: 'Dzadzraɖo' },
  blog_cat_nut: { fr: 'Nutrition', ewe: 'Nuɖuɖu' },
  blog_cat_mat: { fr: 'Santé Maternelle', ewe: 'Vidada' },

  // Resources Page
  res_title: { fr: 'Centre de Ressources', ewe: 'Nuŋlɔɖiƒe' },
  res_desc: { fr: 'Accédez à nos guides, rapports et outils communautaires.', ewe: 'Kpɔ míaƒe mɔɖuɖuwo kple nyatakakawo.' },
  res_guide_palu: { fr: 'Guide Anti-Palu', ewe: 'Agbatidɔ nuxxlɔ̃ame' },
  res_guide_nut: { fr: 'Nutrition Infantile', ewe: 'Ɖeviwo ƒe nuɖuɖu' },
  res_report_2025: { fr: 'Rapport Annuel 2025', ewe: '2025 ƒe dɔwɔwɔ nyatakaka' },
  res_download: { fr: 'Télécharger (PDF)', ewe: 'Ɖoe ɖe wò mɔ̃ me' },

  // Member Space
  mem_title: { fr: 'Espace Membre', ewe: 'Membrewo ƒe nɔƒe' },
  mem_desc: { fr: 'Gérez vos actions et échangez avec l’équipe.', ewe: 'Kpɔ wò dɔwɔwɔwo eye nàƒo nu kple mí.' },
  mem_campaigns: { fr: 'Campagnes', ewe: 'Dɔwɔnawo' },
  mem_review: { fr: 'Laisser un avis', ewe: 'Ɖe fia' },
  mem_propose: { fr: 'Proposer', ewe: 'Susue' },
  mem_admin_console: { fr: 'Console Admin', ewe: 'Admin dɔwɔƒe' },
  mem_welcome: { fr: 'Bienvenue', ewe: 'Woezɔ' },

  // Sponsorship
  spon_title: { fr: 'Parrainage', ewe: 'Parrainage' },
  spon_call: { fr: 'Appel à l’engagement', ewe: 'Nuxxlɔ̃ame' },
  spon_desc: { fr: 'Par votre soutien, devenez un protecteur.', ewe: 'Kpe ɖe amewo ŋu.' },
  spon_scol: { fr: 'Scolarisation', ewe: 'Sukudede' },
  spon_health: { fr: 'Santé', ewe: 'Lãmesẽ' },
  spon_social: { fr: 'Social', ewe: 'Social' },
  spon_form: { fr: 'Formulaire de Parrainage', ewe: 'Parrainage agbalẽ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
