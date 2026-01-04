import React, { useState } from 'react';

interface LandingScreenProps {
  onLogin: (company: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'intro' | 'login' | 'loading'>('intro');
  const [code, setCode] = useState('');

  const handleConnect = () => {
    if (!code) return;
    setStep('loading');
    setTimeout(() => {
      onLogin(code);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4 text-white font-sans">
      
      {/* --- BACKGROUND FX: NEURAL NETWORK --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-transparent to-slate-900 pointer-events-none"></div>
      
      {/* Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>

      {/* --- MAIN GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl">
        
        {/* VIEW 1: THE AI PITCH */}
        {step === 'intro' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header */}
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 mb-6 shadow-lg shadow-orange-500/20">
                  <i className="fa-solid fa-brain text-3xl text-white"></i>
               </div>
               <h1 className="text-3xl font-black tracking-tight leading-tight mb-3">
                 With consistency comes <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">excellence.</span>
               </h1>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Experience the precision of AI-driven tools that transform effort into mastery, day after day.
               </p>
            </div>

            {/* The 3 Features */}
            <div className="space-y-4 mb-8">
               <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mt-1 shrink-0">
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-white">Adaptive Intelligence</h3>
                    <p className="text-xs text-slate-400 mt-1">Our engine learns your patterns, tailoring challenges to propel your growth.</p>
                  </div>
               </div>

               <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mt-1 shrink-0">
                    <i className="fa-solid fa-chart-pie"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-white">Unwavering Analysis</h3>
                    <p className="text-xs text-slate-400 mt-1">Gain deep, actionable insights powered by continuous, objective assessment.</p>
                  </div>
               </div>

               <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-white">Predictive Momentum</h3>
                    <p className="text-xs text-slate-400 mt-1">Stay ahead with forecasts that guide your path to peak performance.</p>
                  </div>
               </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setStep('login')}
              className="group w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/10 hover:shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              Harness Your AI Advantage <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        )}

        {/* VIEW 2: LOGIN */}
        {step === 'login' && (
          <div className="animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-black uppercase mb-1">Identify</h2>
            <p className="text-white/40 text-xs font-bold uppercase mb-6">Enter Company Access Code</p>
            
            <div className="space-y-4">
              <input 
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: FC-VEGAS"
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-center font-black text-xl text-white outline-none focus:border-orange-500 transition-colors uppercase placeholder:text-white/10"
              />
              
              <button 
                onClick={handleConnect}
                className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                Connect System
              </button>
            </div>
            
            <button onClick={() => setStep('intro')} className="w-full mt-4 text-xs font-bold text-white/30 uppercase hover:text-white">Back to Overview</button>
          </div>
        )}

        {/* VIEW 3: LOADING */}
        {step === 'loading' && (
          <div className="text-center py-12 animate-in fade-in duration-500">
             <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
             </div>
             <h3 className="text-lg font-black uppercase animate-pulse">Initializing AI Core...</h3>
             <p className="text-xs text-white/50 font-mono mt-2">Connecting to {code.toUpperCase()}</p>
          </div>
        )}

      </div>

      <div className="absolute bottom-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
        Powered by Gemini Intelligence
      </div>
    </div>
  );
};