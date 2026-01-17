export interface WeightRecord {
  id: string;
  date: string;        // ISO 8601 date string
  weight: number;      // kg (internal storage), 20-300
  note?: string;
  created_at: string;  // timestamp
}

export type WeightUnit = 'kg' | 'jin';

export interface UserProfile {
  height: number;      // cm
  gender?: 'male' | 'female';
  weightUnit?: WeightUnit;  // default: 'jin'
}

export interface Goal {
  target_weight: number;
  target_date?: string; // ISO 8601 date string
  created_at: string;
}

export interface AppData {
  records: WeightRecord[];
  profile?: UserProfile;
  goal?: Goal;
  version: number;
}

export type ExportFormat = 'json' | 'csv';

export interface ImportStrategy {
  onConflict: 'overwrite' | 'keep' | 'skip';
}

export interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}
