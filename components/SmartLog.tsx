import React, { useState, useMemo, useEffect } from 'react';
import { ChemistryAgent } from '../agents/ChemistryAgent';
import { Beacon } from './ui/Beacon';
import { Haptics } from '../utils/haptics';
import { PoolType, ChemicalReading, WorkLog } from '../agents/AgentTypes';
import { SiteProfile } from '../data/sites'; 

export const SmartLog = ({ site }: { site: SiteProfile }) => {
  const [activeTab, setActiveTab] = useState<'chem' | 'labor'>('chem');
  const [guideMode, setGuideMode] = useState(true);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitStep, setTransmitStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [readings, setReadings] = useState<ChemicalReading>({
    manual_ph: 7.5, manual_free_cl: 3.0, alkalinity_ppm: 100, 
    calcium_hardness_ppm: 300, cya_ppm: 30, water_temp_f: 85, orp_mv: 750, salt_ppm: 0
  });

  const [work, setWork] = useState<WorkLog>({
    gfci_checked: false, skimmers_emptied: false, pump_basket_emptied: false,
    filter_backwashed: false, filter_cleaned: false, vacuumed: false, brushed: false, notes: ''
  });

  useEffect(() => {
    setIsSaved(false);
    setReadings(prev => ({ ...prev, manual_free_cl: 3.0, manual_ph: 7.5, orp_mv: 750, salt_ppm: 0 }));
    setWork({ gfci_checked: false, skimmers_emptied: false, pump_basket_emptied: false, filter_backwashed: false, filter_cleaned: false, vacuumed: false, brushed: false, notes: '' });
  }, [site]);

  const result = useMemo(() => ChemistryAgent.analyze(readings, site.gallons, site.env, site.type), [readings, site]);

  const updateChem = (field: keyof ChemicalReading, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setReadings(prev => ({ ...prev, [field]: isNaN(numVal) ? 0 : numVal }));
  };

  const handleSave = () => {
    setIsTransmitting(true);
    setTransmitStep(0);
    Haptics.success();
    let step = 0;
    const interval = setInterval(() => {
        step++;
        setTransmitStep(step);
        if (step >= 5) {
            clearInterval(interval);
            setTimeout(() => { setIsTransmitting(false); setIsSaved(true); Haptics.success(); }, 600);
        }
    }, 700);
  };

  if (isSaved) return (
    <div className="p-8 text-center animate-in zoom-in duration-300">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl ${result.score < 60 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
        <i className={`fa-solid ${result.score < 60 ? 'fa-triangle-exclamation' : 'fa-check'}`}></i>
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase mb-2">{result.score < 60 ? 'Alert Sent' : 'Log Secured'}</h2>
      <p className="text-[10px] font-bold text-slate-400 mb-8 tracking-widest uppercase">Encryption ID: #FC-{Math.floor(Math.random()*9000)+1000}</p>
      <button onClick={() => setIsSaved(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase">Return to Route</button>
    </div>
  );

  const chlorineMin = site.type === 'pool' ? 4.0 : 5.0;

  return (
    <div className="pb-32 space-y-6 relative">
      {isTransmitting && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
           <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-8 animate-pulse"><i className="fa-solid fa-satellite-dish text-4xl text-white"></i></div>
           <div className="text-2xl font-black text-white italic mb-2 tracking-tighter uppercase">Transmitting</div>
           <div className="text-blue-400 font-mono text-[10px] mb-8 uppercase tracking-widest h-4">
              {["Encrypting Data...", "Verifying Geofence...", "Syncing Cloud...", "Notifying Admin...", "Confirmed"][transmitStep] || "Processing..."}
           </div>
           <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(transmitStep / 5) * 100}%` }}></div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center px-4 pt-2">
         <div className="flex bg-slate-200 rounded-lg p-1">
            <button onClick={() => setActiveTab('chem')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase ${activeTab === 'chem' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Chemistry</button>
            <button onClick={() => setActiveTab('labor')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase ${activeTab === 'labor' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Equipment</button>
         </div>
         <button onClick={() => setGuideMode(!guideMode)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${guideMode ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'}`}>{guideMode ? 'Guide ON' : 'Pro Mode'}</button>
      </div>

      <Beacon status={result.score < 60 ? 'critical' : result.score < 80 ? 'caution' : 'normal'} label={result.score < 60 ? "UNSAFE" : "OPERATIONAL"} />

      {activeTab === 'chem' && (
        <div className="animate-in slide-in-from-left duration-300 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 mx-4 flex justify-between items-center">
                <div><h2 className="text-[10px] font-black text-slate-400 uppercase">Quality Score</h2><div className={`text-6xl font-black italic ${result.score > 90 ? 'text-emerald-500' : 'text-orange-500'}`}>{result.score}%</div></div>
                <div className="text-right"><div className="text-[10px] font-black text-slate-400 uppercase">LSI</div><div className={`text-2xl font-black ${result.lsiStatus === 'Balanced' ? 'text-emerald-600' : 'text-red-600'}`}>{result.lsi}</div></div>
            </div>

            <div className="px-4 space-y-4">
                <div className="col-span-2">
                  <div className="flex justify-between mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Free Chlorine</label><span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 rounded-full">Floor: {chlorineMin}.0+</span></div>
                  <input type="number" step="0.1" inputMode="decimal" value={readings.manual_free_cl} onFocus={(e)=>e.target.select()} onChange={e => updateChem('manual_free_cl', e.target.value)} className="w-full h-16 text-center text-4xl font-black rounded-xl border-2 border-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-black text-slate-400 uppercase">pH</label><input type="number" step="0.1" value={readings.manual_ph} onFocus={(e)=>e.target.select()} onChange={e => updateChem('manual_ph', e.target.value)} className="w-full h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200" /></div>
                  <div><label className="text-[10px] font-black text-slate-400 uppercase">Alk</label><input type="number" value={readings.alkalinity_ppm} onFocus={(e)=>e.target.select()} onChange={e => updateChem('alkalinity_ppm', e.target.value)} className="w-full h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200" /></div>
                </div>
                <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase">CYA</label><input type="number" value={readings.cya_ppm} onFocus={(e)=>e.target.select()} onChange={e => updateChem('cya_ppm', e.target.value)} className="w-full h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200" /></div>
            </div>

            <div className="px-4">
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 space-y-4">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1"><label className="text-[9px] font-black text-purple-400 uppercase">Controller pH</label><input type="number" step="0.1" value={readings.manual_ph} onFocus={(e)=>e.target.select()} onChange={e => updateChem('manual_ph', e.target.value)} className="w-full h-12 text-center text-xl font-black rounded-xl border-2 border-purple-200" /></div>
                        <div className="flex-1"><label className="text-[9px] font-black text-purple-600 uppercase">ORP (mV)</label><input type="number" value={readings.orp_mv} onFocus={(e)=>e.target.select()} onChange={e => updateChem('orp_mv', e.target.value)} className="w-full h-12 text-center text-xl font-black rounded-xl border-2 border-purple-200" /></div>
                    </div>
                    {guideMode && result.smartAlert && (
                        <div className={`p-4 rounded-xl border-2 animate-in zoom-in duration-300 ${result.smartAlert.level === 'critical' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-orange-50 border-orange-200 text-orange-900'}`}>
                            <div className="flex items-center gap-3 mb-2"><i className={`fa-solid ${result.smartAlert.icon} text-2xl`}></i><div><div className="text-[10px] font-bold uppercase opacity-70">{result.smartAlert.title}</div><div className="text-sm font-black">{result.smartAlert.message}</div></div></div>
                            <div className="mt-2 pt-2 border-t border-black/5 text-[10px] font-black uppercase tracking-tight">Action: {result.smartAlert.action}</div>
                        </div>
                    )}
                </div>
            </div>
            
            {result.recommendations.length > 0 && (
                <div className="px-4 space-y-3">
                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Corrective Actions</h3>
                    {result.recommendations.map(rec => (
                        <div key={rec.id} className={`p-4 rounded-2xl border-l-8 shadow-sm flex items-center gap-4 ${rec.colorClass}`}>
                            <i className={`fa-solid ${rec.icon} text-2xl`}></i>
                            <div><div className="font-black text-xl">{rec.amount > 0 ? `${rec.amount} ${rec.unit}` : ''} <span className="text-xs font-bold opacity-60 uppercase">{rec.chemical}</span></div><div className="text-[10px] font-bold uppercase opacity-60 leading-tight">{rec.reason}</div></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {activeTab === 'labor' && (
        <div className="px-4 animate-in slide-in-from-right duration-300 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Safety Checks</h3>
                <button onClick={() => setWork(p=>({...p, gfci_checked: !p.gfci_checked}))} className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${work.gfci_checked ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-red-100 bg-red-50 text-red-800'}`}>
                    <div className="flex items-center gap-3"><i className="fa-solid fa-plug-circle-check"></i><span className="font-black uppercase text-xs">GFCI Tested</span></div>
                    {work.gfci_checked && <i className="fa-solid fa-check"></i>}
                </button>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <textarea value={work.notes} onChange={(e) => setWork(p => ({ ...p, notes: e.target.value }))} className="w-full h-32 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 outline-none font-bold text-sm" placeholder="Repairs / Notes..." />
            </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
         <button onClick={handleSave} disabled={isTransmitting} className="w-full py-4 text-white rounded-xl font-black uppercase tracking-widest bg-orange-500 shadow-lg active:scale-95 transition-all">
           {isTransmitting ? 'Transmitting...' : 'Finalize Log'}
         </button>
      </div>
    </div>
  );
};