import React from 'react';
import { Info, ExternalLink, Handshake } from 'lucide-react';
import { motion } from 'motion/react';

const PARTNERS = [
  { name: 'Ministère de la Santé Togo', type: 'Institutionnel', logo: 'MS' },
  { name: 'Hôpital de Référence Lomé', type: 'Médical', logo: 'HR' },
  { name: 'ONG Santé Pour Tous', type: 'Associatif', logo: 'ST' },
  { name: 'Fondation Diaspora', type: 'Soutien', logo: 'FD' },
];

export default function Partners() {
  return (
    <div className="px-6 py-8 space-y-12">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center">
          <Info size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Espace Partenaires</h2>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Ils nous font confiance et nous aident à réaliser nos missions sur le terrain.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PARTNERS.map((partner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col items-center text-center gap-4 shadow-sm"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl border border-slate-100">
              {partner.logo}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{partner.name}</h3>
              <span className="text-[9px] uppercase tracking-widest font-black text-emerald-500">{partner.type}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-[40px] border-2 border-dashed border-emerald-200 bg-emerald-50/30 text-center space-y-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-sm border border-emerald-100">
          <Handshake size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Devenir Partenaire</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Vous représentez une institution, une entreprise ou une autre ONG ? Écrivons ensemble l'avenir de la santé au Togo.
          </p>
        </div>
        <button className="text-emerald-700 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
          Nous contacter <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
