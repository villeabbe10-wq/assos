import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

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
              case 'home': return <Home setActiveTab={setActiveTab} />;
              case 'events': return <Events />;
              case 'actions': return <Actions setActiveTab={setActiveTab} />;
              case 'volunteer': return <Volunteer />;
              case 'resources': return <Resources />;
              case 'about': return <About setActiveTab={setActiveTab} />;
              case 'faq': return <FAQ />;
              case 'sponsorship': return <Sponsorship />;
              case 'partners': return <Partners setActiveTab={setActiveTab} />;
              case 'messages': return <Messages onOpenAdmin={() => setActiveTab('admin')} />;
              case 'admin': return <Admin onBack={() => setActiveTab('messages')} />;
              case 'donation': return <Donation setActiveTab={setActiveTab} />;
              default: return <Home setActiveTab={setActiveTab} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <LanguageProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <AwarenessModal />
    </LanguageProvider>
  );
}
