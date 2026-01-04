import React, { useState, useEffect } from 'react';
import { SmartLog } from './components/SmartLog';
import { SITES } from './data/sites';

// --- LANDING PAGE (THE BOOT SEQUENCE) ---
const LandingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [bootStep, setBootStep] = useState(0);
  const [isBooting, setIsBooting] = useState(false);

  // The "Power Up" Sequence Messages
  const steps = [
    "Initializing Core Systems...",
    "Loading Site Geofences...",
    "Calibrating Chemistry Engine...",
    "Safety Protocols: ACTIVE",
    "AI Neural Network: ONLINE"
  ];

  const startBoot = () => {
    setIsBooting(true);
    let step = 0;
    
    // Run through the fake "loading" steps to show power
    const interval = setInterval(() => {
      step++;
      setBootStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800); // Wait a split second after "ONLINE" to launch
      }
    }, 600); // Speed of each message
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* BACKGROUND GLOW EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      {/* ICON */}
      <div className={`relative z-10 w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 transition-all duration-700 ${isBooting ? 'scale-110 shadow-blue-500/60 animate-pulse' : ''}`}>
         <i className="fa-solid fa-microchip text-5xl text-white"></i>
         {/* Little AI Dot */}
         <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-ping"></div>
      </div>

      {/* BRANDING */}
      <h1 className="relative z-10 text-4xl font-black text-white italic tracking-tighter mb-2">
        FRESH & CLEAR
      </h1>
      <div className="relative z-10 text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-12 border border-blue-500/30 px-4 py-1 rounded-full bg-blue-900/20 backdrop-blur-sm">
        AI-Enhanced Field Ops
      </div>

      {/* INTERACTIVE AREA */}
      <div className="relative z-10 h-24 flex flex-col items-center justify-center w-full max-w-xs">
        
        {!isBooting ? (
          // STATE 1: READY TO START
          <button 
            onClick={startBoot}
            className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 group hover:bg-blue-50"
          >
            <i className="fa-solid fa-power-off text-blue-600 group-hover:rotate-90 transition-transform duration-500"></i>
            <span>Initialize System</span>
          </button>
        ) : (
          // STATE 2: LOADING SEQUENCE (THE "VISUAL FLOW")
          <div className="w-full">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
               <div 
                 className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_#3b82f6]"
                 style={{ width: `${(bootStep / steps.length) * 100}%` }}
               ></div>
            </div>
            {/* Terminal Text */}
            <div className="text-xs font-mono font-bold text-blue-300 h-6 animate-pulse uppercase tracking-widest">
               {bootStep < steps.length ? steps[bootStep] : "SYSTEM READY"}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-8 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
        System v2.0 // Neural Engine Active
      </div>

    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSiteId, setCurrentSiteId] = useState(SITES[0].id);
  const currentSite = SITES.find(s => s.id === currentSiteId) || SITES[0];

  // If we haven't started, show the Boot Sequence
  if (!hasStarted) {
    return <LandingPage onComplete={() => setHasStarted(true)} />;
  }

  // Once started, show the Route Manager
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-in slide-in-from-bottom-5 fade-in duration-1000">
       
       {/* --- NAVIGATION HEADER --- */}
       <div className="bg-slate-900 p-4 pb-6 rounded-b-3xl shadow-2xl shadow-slate-900/20 mb-6 sticky top-0 z-50">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h1 className="text-white font-black text-xl italic tracking-tighter">FRESH & CLEAR</h1>
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Technician: John Stoneman
                </div>
             </div>
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-800">
                <i className="fa-solid fa-user-astronaut"></i>
             </div>
          </div>

          {/* SITE SWITCHER (SCROLLABLE) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {SITES.map(site => (
              <button
                key={site.id}
                onClick={() => setCurrentSiteId(site.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${
                  currentSiteId === site.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50 scale-105' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {/* Icons based on type */}
                {site.type === 'pool' 
                    ? <i className="fa-solid fa-person-swimming"></i> 
                    : <i className="fa-solid fa-hot-tub-person"></i>
                }
                {site.name}
              </button>
            ))}
          </div>
       </div>

       {/* --- THE BRAIN (Passed the selected site) --- */}
       <SmartLog site={currentSite} />
       
    </div>
  );
}

export default App;