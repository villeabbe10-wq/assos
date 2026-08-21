import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Volunteer from './pages/Volunteer';
import Resources from './pages/Resources';
import Partners from './pages/Partners';
import Actions from './pages/Actions';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Sponsorship from './pages/Sponsorship';
import Admin from './pages/Admin';
import Donation from './pages/Donation';
import Messages from './pages/Messages';
import AwarenessModal from './components/AwarenessModal';
import { LanguageProvider } from './lib/i18n';
import { AnimatePresence, motion } from 'motion/react';

const VALID_TABS = [
  'home',
  'events',
  'actions',
  'volunteer',
  'resources',
  'about',
  'faq',
  'sponsorship',
  'partners',
  'messages',
  'admin',
  'donation',
];

export default function App() {
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_TABS.includes(hash)) {
        return hash;
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  // Function to change tab and push to browser history
  const handleTabChange = useCallback((tab: string) => {
    const targetTab = VALID_TABS.includes(tab) ? tab : 'home';
    setActiveTabState((current) => {
      if (current === targetTab) return current;
      if (typeof window !== 'undefined') {
        window.history.pushState({ tab: targetTab }, '', `#${targetTab}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return targetTab;
    });
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const hashTab = window.location.hash.replace('#', '').toLowerCase();
      const stateTab = event.state?.tab;
      const target = stateTab || (VALID_TABS.includes(hashTab) ? hashTab : 'home');
      setActiveTabState(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Replace current state on initial load if no state exists
    if (typeof window !== 'undefined' && !window.history.state?.tab) {
      window.history.replaceState({ tab: activeTab }, '', `#${activeTab}`);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {(() => {
            switch (activeTab) {
              case 'home': return <Home setActiveTab={handleTabChange} />;
              case 'events': return <Events />;
              case 'actions': return <Actions setActiveTab={handleTabChange} />;
              case 'volunteer': return <Volunteer />;
              case 'resources': return <Resources />;
              case 'about': return <About setActiveTab={handleTabChange} />;
              case 'faq': return <FAQ />;
              case 'sponsorship': return <Sponsorship />;
              case 'partners': return <Partners setActiveTab={handleTabChange} />;
              case 'messages': return <Messages onOpenAdmin={() => handleTabChange('admin')} />;
              case 'admin': return <Admin onBack={() => handleTabChange('messages')} />;
              case 'donation': return <Donation setActiveTab={handleTabChange} />;
              default: return <Home setActiveTab={handleTabChange} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <LanguageProvider>
      <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
        {renderContent()}
      </Layout>
      <AwarenessModal />
    </LanguageProvider>
  );
}

