import React, { useState } from 'react';

export const SafetyGate = ({ onSafe }: { onSafe: () => void }) => {
  const [checks, setChecks] = useState({ gate: false, drain: false, bio: false });
  const allClear = checks.gate && checks.drain && checks.bio;

  const toggle = (k: keyof typeof checks) => setChecks(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border-t-8 border-orange-500">
        
        <div className="p-8 text-center bg-slate-800 text-white">
          <h1 className="text-3xl font-black uppercase tracking-widest text-orange-500">
            <i className="fa-solid fa-lock mr-2"></i> Safety Check
          </h1>
        </div>

        <div className="p-6 space-y-4">
          <button onClick={() => toggle('gate')} className={`w-full p-6 rounded-xl border-4 text-left flex items-center gap-4 transition-all ${checks.gate ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
            <i className={`fa-solid fa-door-open text-3xl ${checks.gate ? 'text-emerald-500' : 'text-slate-300'}`}></i>
            <div>
              <span className="block font-black text-xl text-slate-900">Entry Secure?</span>
              <span className="text-xs text-slate-500 font-bold uppercase">Gate Latched / Door Locked</span>
            </div>
          </button>

          <button onClick={() => toggle('drain')} className={`w-full p-6 rounded-xl border-4 text-left flex items-center gap-4 transition-all ${checks.drain ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
            <i className={`fa-solid fa-circle-check text-3xl ${checks.drain ? 'text-emerald-500' : 'text-slate-300'}`}></i>
            <div>
               <span className="block font-black text-xl text-slate-900">Main Drain?</span>
               <span className="text-xs text-slate-500 font-bold uppercase">Visible & Secure</span>
            </div>
          </button>
          
           <button onClick={() => toggle('bio')} className={`w-full p-6 rounded-xl border-4 text-left flex items-center gap-4 transition-all ${checks.bio ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
            <i className={`fa-solid fa-water text-3xl ${checks.bio ? 'text-emerald-500' : 'text-slate-300'}`}></i>
            <div>
               <span className="block font-black text-xl text-slate-900">Water Clear?</span>
               <span className="text-xs text-slate-500 font-bold uppercase">No Biohazards</span>
            </div>
          </button>
        </div>

        <div className="p-6 bg-slate-50">
          <button disabled={!allClear} onClick={onSafe} className={`w-full py-6 rounded-xl font-black text-2xl uppercase tracking-widest shadow-xl transition-all ${allClear ? 'bg-emerald-600 text-white hover:scale-105' : 'bg-slate-300 text-slate-400'}`}>
            {allClear ? "Enter Flight Deck" : "Complete Checks"}
          </button>
        </div>

      </div>
    </div>
  );
};