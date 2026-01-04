import { ChemicalReading, TreatmentRecommendation, Environment, PoolType, SmartAlert } from './AgentTypes';

export class ChemistryAgent {
  static analyze(
    readings: ChemicalReading,
    volume: number,
    env: Environment,
    type: PoolType
  ): { 
      score: number; 
      recommendations: TreatmentRecommendation[]; 
      lsi: number; 
      lsiStatus: string; 
      orpTarget: number; 
      orpDiff: number;    
      smartAlert: SmartAlert | null; 
  } {
    
    const recs: TreatmentRecommendation[] = [];
    let score = 100;

    // --- 1. LSI CALCULATION ---
    const factorT = (readings.water_temp_f - 32) * 0.555;
    const factorpH = readings.manual_ph;
    const factorAlk = Math.log10(readings.alkalinity_ppm || 80); 
    const factorCa = Math.log10(readings.calcium_hardness_ppm || 200);
    const lsi = (factorpH + factorAlk + factorCa + factorT - 12.1 - (readings.cya_ppm * 0.03)); 
    const roundedLSI = parseFloat(lsi.toFixed(2));
    let lsiStatus = "Balanced";

    if (roundedLSI < -0.3) { lsiStatus = "Corrosive"; score -= 15; }
    if (roundedLSI > 0.3) { lsiStatus = "Scale Forming"; score -= 15; }

    // --- 2. ORP & CHLORINE INTELLIGENCE ---
    let orpTarget = 750;
    let smartAlert: SmartAlert | null = null;

    // ESTABLISH FRESH & CLEAR STANDARDS
    const minChlorine = type === 'pool' ? 4.0 : 5.0; 
    const healthDeptMin = type === 'pool' ? 2.0 : 3.0; 
    
    // LAYER 0: ENVIRONMENT CHECK (INDOOR CYA BAN)
    if (env === 'indoor' && readings.cya_ppm > 20) {
        orpTarget = 780; // Need massive ORP to overcome the stabilizer
        smartAlert = {
            level: 'critical',
            title: 'Indoor CYA Hazard',
            message: `CYA is ${readings.cya_ppm}ppm in an INDOOR pool. This reduces kill speed & increases chloramines.`,
            action: 'Stop stabilized tabs immediately. Dilute water.',
            icon: 'fa-triangle-exclamation'
        };
    }
    // LAYER 1: ALKALINITY
    else if (readings.alkalinity_ppm < 80 || readings.alkalinity_ppm > 120) {
        orpTarget = 750; 
        smartAlert = {
            level: 'critical',
            title: 'Unstable Foundation',
            message: 'Alkalinity is out of range. Fix this before adjusting Chlorine.',
            action: 'Adjust Alkalinity to 80-120 ppm.',
            icon: 'fa-scale-unbalanced'
        };
    } 
    // LAYER 2: pH
    else if (readings.manual_ph > 7.6) {
        orpTarget = 780; 
        smartAlert = {
            level: 'warning',
            title: 'High pH',
            message: 'Chlorine is sluggish due to high pH.',
            action: 'Lower pH to 7.4 to restore sanitization power.',
            icon: 'fa-arrow-down'
        };
    } 
    else if (readings.manual_ph < 7.2) {
        orpTarget = 700; 
        smartAlert = {
            level: 'warning',
            title: 'Low pH Risk',
            message: 'Water is acidic. ORP reading may be falsely high.',
            action: 'Raise pH to 7.4.',
            icon: 'fa-arrow-up'
        };
    }
    // LAYER 3: CHLORINE LEVEL
    else if (readings.manual_free_cl < minChlorine) {
        const isLegalRisk = readings.manual_free_cl < healthDeptMin;
        orpTarget = 780; 
        smartAlert = {
            level: isLegalRisk ? 'critical' : 'warning',
            title: isLegalRisk ? 'HEALTH DEPT VIOLATION' : 'Below Company Standard',
            message: `Chlorine is ${readings.manual_free_cl} (Floor: ${minChlorine}).`,
            action: isLegalRisk ? 'CLOSE POOL & SHOCK IMMEDIATELY.' : 'Increase Output to restore safety buffer.',
            icon: isLegalRisk ? 'fa-triangle-exclamation' : 'fa-shield-halved'
        };
    }
    else if (readings.manual_free_cl > 10.0) {
        smartAlert = {
            level: 'warning',
            title: 'High Chlorine',
            message: 'Chlorine is very high (>10ppm). ORP is suppressed.',
            action: 'Reduce Output significantly.',
            icon: 'fa-droplet'
        };
    }
    // LAYER 4: ORP FINE TUNING
    else {
         const gap = 750 - readings.orp_mv;
         if (gap > 50) {
             smartAlert = {
                 level: 'warning',
                 title: 'Weak Oxidation',
                 message: `Chlorine is good, but ORP is low (-${gap}mV).`,
                 action: 'Shock pool to burn organic demand.',
                 icon: 'fa-bolt'
             };
         } else if (gap > 20) {
             smartAlert = {
                 level: 'good',
                 title: 'Boost Needed',
                 message: 'Water is slightly under-sanitized.',
                 action: 'Increase Chlorine Output slightly.',
                 icon: 'fa-arrow-trend-up'
             };
         } else if (gap < -50) {
             smartAlert = {
                 level: 'good',
                 title: 'Surplus Power',
                 message: 'Sanitization is very strong.',
                 action: 'Reduce Chlorine Output.',
                 icon: 'fa-arrow-trend-down'
             };
         } else {
             smartAlert = {
                 level: 'good',
                 title: 'Perfect Balance',
                 message: 'Chemistry and ORP are perfectly aligned.',
                 action: 'Maintain current settings.',
                 icon: 'fa-circle-check'
             };
         }
    }

    const orpDiff = orpTarget - readings.orp_mv;

    // --- 3. SALT MONITOR ---
    if (readings.salt_ppm > 4000) {
        score -= 10;
        recs.push({
            id: 'salt-high',
            chemical: 'Dilute Water',
            amount: 0,
            unit: 'Drain',
            reason: 'Salt too high (>4000ppm). Risk of cell corrosion.',
            priority: 'maintenance',
            icon: 'fa-water',
            colorClass: 'bg-orange-50 border-orange-300 text-orange-900'
        });
    }

    // --- 4. SAFETY CHECKS (LIQUID CHLORINE UPDATE) ---
    if (readings.manual_free_cl < minChlorine) {
      score -= 20; 
      if (readings.manual_free_cl < healthDeptMin) score -= 40; 

      const deficit = minChlorine - readings.manual_free_cl;
      
      // FORMULA: 12.5% Liquid Chlorine
      // Approx 10.7 oz raises 10,000 gallons by 1 ppm.
      // We convert oz to gallons (oz / 128).
      const ozNeeded = deficit * 10.7 * (volume / 10000);
      const gallonsNeeded = Math.max(0.1, ozNeeded / 128); 
      
      const reasonText = readings.manual_free_cl < healthDeptMin 
        ? `CRITICAL (to increase by +${deficit.toFixed(1)} ppm)` 
        : `Boost to Standard (to increase by +${deficit.toFixed(1)} ppm)`;

      recs.push({
        id: 'cl-low',
        chemical: 'Liquid Chlorine (12.5%)',
        amount: parseFloat(gallonsNeeded.toFixed(2)),
        unit: 'gallons',
        reason: reasonText,
        priority: 'critical',
        icon: 'fa-bottle-droplet', 
        colorClass: 'bg-red-100 border-red-500 text-red-900 animate-pulse'
      });
    }

    // CYA INDOOR WARNING (Recommendations Section)
    if (env === 'indoor' && readings.cya_ppm > 20) {
        score -= 30;
        recs.push({
            id: 'cya-indoor',
            chemical: 'Drain & Fill',
            amount: 0,
            unit: 'Dilute',
            reason: 'Indoor Pool: CYA must be removed to restore ORP.',
            priority: 'critical',
            icon: 'fa-triangle-exclamation',
            colorClass: 'bg-red-100 border-red-500 text-red-900'
        });
    }

    if (readings.cya_ppm >= 100) {
        score = 0;
        recs.push({
            id: 'cya-critical',
            chemical: 'CLOSE POOL: Drain & Fill',
            amount: 0, 
            unit: 'Immediately',
            reason: 'MANDATORY CLOSURE: CYA ≥ 100ppm.',
            priority: 'critical',
            icon: 'fa-ban',
            colorClass: 'bg-red-600 text-white animate-pulse border-4 border-red-900'
        });
    }

    return { 
      score: Math.max(0, score), 
      recommendations: recs, 
      lsi: roundedLSI, 
      lsiStatus,
      orpTarget,
      orpDiff,
      smartAlert
    };
  }
}