import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CommunityEvent } from '../types';
import { Calendar, MapPin, Tag, Box, ArrowRight, Sparkles, Map, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Grande Campagne de Vaccination',
    description: 'Campagne nationale de vaccination contre les maladies infantiles dans les zones rurales d\'Atakpamé.',
    date: Timestamp.now(),
    location: 'Atakpamé, Togo',
    type: 'campaign'
  },
  {
    id: '2',
    title: 'Consultations Mobiles Gratuites',
    description: 'Une équipe de médecins bénévoles offrira des consultations générales aux habitants des quartiers périphériques.',
    date: Timestamp.now(),
    location: 'Lomé, Togo',
    type: 'mission'
  }
];

export default function Events() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityEvent));
        setEvents(fetched.length > 0 ? fetched : MOCK_EVENTS);
      } catch (error) {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-4 text-center space-y-8 overflow-hidden rounded-[4rem] bg-slate-900 text-white shadow-2xl">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10"
          >
            <Calendar size={40} className="text-sky-400" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none">
              Agenda des <span className="text-sky-400 font-serif italic font-normal">Actions</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Ne manquez pas nos prochaines interventions de terrain. Chaque événement est une opportunité de changer une vie.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">2 Événements confirmés</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="group bg-white p-2 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row gap-2"
          >
            {/* Date Card */}
            <div className={`sm:w-48 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-center transition-all ${
              event.type === 'campaign' ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'
            }`}>
              <span className="text-4xl font-black tracking-tighter leading-none">
                {event.date?.toDate ? event.date.toDate().getDate() : '?'}
              </span>
              <span className="text-sm font-black uppercase tracking-[0.2em] opacity-80">
                {event.date?.toDate ? event.date.toDate().toLocaleString('default', { month: 'long' }) : 'MAI'}
              </span>
              <div className="h-px w-10 bg-current/20 my-2" />
              <span className="text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
                <Bell size={12} /> {event.date?.toDate ? event.date.toDate().getFullYear() : '2026'}
              </span>
            </div>
            
            {/* Content Area */}
            <div className="p-8 sm:p-10 flex-1 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    event.type === 'campaign' ? 'border-orange-200 text-orange-600 bg-white' : 'border-sky-200 text-sky-600 bg-white'
                  }`}>
                    {event.type}
                  </span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${idx * 10 + i}`} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                      +12
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-sky-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <MapPin size={14} className="text-slate-300" /> {event.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] text-emerald-500 font-black uppercase tracking-widest animate-pulse">
                    <Sparkles size={14} /> Inscriptions ouvertes
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-100"
                >
                  Détails & Participation <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* FOOTER CTA */}
      <footer className="bg-emerald-50 rounded-[4rem] p-12 sm:p-20 text-center space-y-8 relative overflow-hidden border border-emerald-100">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vous souhaitez organiser une action ?</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            SEDUCEP accompagne les leaders communautaires et les professionnels de santé dans la mise en place d'actions de prévention locales.
          </p>
          <div className="pt-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest text-[10px]">
              Proposer un événement
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
