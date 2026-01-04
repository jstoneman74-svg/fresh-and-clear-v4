import React from 'react';

type BeaconStatus = 'normal' | 'caution' | 'critical';

export const Beacon = ({ status, label }: { status: BeaconStatus, label: string }) => {
  const styles = {
    normal: "bg-emerald-600 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]",
    caution: "bg-amber-500 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]",
    critical: "bg-red-600 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse"
  };

  const icons = {
    normal: "fa-check",
    caution: "fa-triangle-exclamation",
    critical: "fa-hand"
  };

  return (
    <div className={`w-full py-6 border-b-8 ${styles[status]} transition-all duration-300 flex items-center justify-center gap-4`}>
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl backdrop-blur-md border-2 border-white/30">
        <i className={`fa-solid ${icons[status]}`}></i>
      </div>
      <h2 className="text-white font-black uppercase tracking-[0.2em] text-2xl drop-shadow-md">
        {label}
      </h2>
    </div>
  );
};