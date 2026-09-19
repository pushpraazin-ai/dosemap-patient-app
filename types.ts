export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  doctor: string;
  condition: string;
  uhid?: string;
  nextAppointment?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
  type: 'injection' | 'tablet' | 'supplement';
  status: 'taken' | 'pending' | 'late' | 'upcoming';
  stockLevelPercent: number;
  stockRemaining: string;
  frequency: string;
  foodTiming?: 'before' | 'after' | 'with' | 'anytime';
  alarmEnabled?: boolean;
  alarmType?: 'voice' | 'tone'; // Default 'voice'
  alarmTone?: 'default' | 'loud' | 'vibration';
  snoozeMinutes?: 5 | 10 | 15;
  daysRemaining?: number; // e.g. 4 days left
  lowStockThresholdDays?: number; // Configurable threshold (default 5)
  totalQuantity?: number; // e.g. 30 tablets
}

export interface VoiceSettings {
  alarmMode: 'voice' | 'tone';
  language: 'hi-IN' | 'en-US' | 'mr-IN' | 'en' | 'mr';
  volume: number; // 0.1 to 1.0
  speed: 'slow' | 'normal';
  voiceGenderPreference?: 'female' | 'male';
}

export interface DoseTimelineItem {
  id: string;
  time: string;
  medicine: string;
  dosage: string;
  status: 'taken' | 'late' | 'upcoming';
  type: 'injection' | 'tablet';
}

export type ScreenType = 'login' | 'splash' | 'onboarding' | 'dashboard' | 'medicines' | 'calendar' | 'profile' | 'order';
