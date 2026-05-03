import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CommunityEvent } from '../types';
import { Calendar, MapPin, Tag, Box } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Grande Campagne de Vaccination',
    description: 'Campagne nationale de vaccination contre les maladies infantiles dans les zones rurales.',
    date: Timestamp.now(),
    location: 'Atakpamé, Togo',
    type: 'campaign'
  },
  {
    id: '2',
    title: 'Consultations Mobiles Gratuites',
    description: 'Une équipe de médecins bénévoles offrira des consultations générales aux habitants.',
    date: Timestamp.now(),
    location: 'Lomé, Togo',
    type: 'mission'
  }
];

export default function Events() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="px-6 py-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agenda des Actions</h2>
        <p className="text-slate-500 text-sm font-medium">Ne manquez pas nos prochaines interventions de terrain.</p>
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className={`w-16 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center font-black ${
              event.type === 'campaign' ? 'bg-orange-100 text-orange-600' : 'bg-sky-100 text-sky-600'
            }`}>
              <span className="text-lg">
                {event.date?.toDate ? event.date.toDate().getDate() : '?'}
              </span>
              <span className="text-[10px] uppercase">
                {event.date?.toDate ? event.date.toDate().toLocaleString('default', { month: 'short' }) : 'MAI'}
              </span>
            </div>
            
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                  event.type === 'campaign' ? 'border-orange-200 text-orange-600 bg-orange-50' : 'border-sky-200 text-sky-600 bg-sky-50'
                }`}>
                  {event.type}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 leading-tight truncate">{event.title}</h3>
              <p className="text-slate-400 text-xs line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  <MapPin size={12} className="text-slate-300" /> {event.location}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  <Calendar size={12} className="text-slate-300" /> Prochainement
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
