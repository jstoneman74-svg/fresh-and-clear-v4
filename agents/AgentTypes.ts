export type PoolType = 'pool' | 'spa' | 'feature';
export type Environment = 'indoor' | 'outdoor';

export interface ChemicalReading {
  manual_ph: number;
  manual_free_cl: number;
  alkalinity_ppm: number;
  calcium_hardness_ppm: number;
  cya_ppm: number;
  water_temp_f: number;
  orp_mv: number;
  salt_ppm: number;
}

export interface WorkLog {
  gfci_checked: boolean; // NEW: Safety Check
  skimmers_emptied: boolean;
  pump_basket_emptied: boolean;
  filter_backwashed: boolean;
  filter_cleaned: boolean;
  vacuumed: boolean;
  brushed: boolean;
  notes: string;
}

export interface SmartAlert {
  level: 'critical' | 'warning' | 'good';
  title: string;
  message: string;
  action: string;
  icon: string;
}

export interface TreatmentRecommendation {
  id: string;
  chemical: string;
  amount: number;
  unit: string;
  reason: string;
  priority: 'critical' | 'maintenance' | 'cosmetic';
  icon: string;
  colorClass: string;
}