export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number; // in seconds
  youtubeUrl: string;
  substitutions: { id: string; name: string }[];
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface WorkoutNode {
  day: number;
  workoutId: string;
}

export interface SetLog {
  set: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseHistory {
  exerciseId: string;
  name: string;
  date: string;
  sets: SetLog[];
  volume: number;
  targetRir: string;
}

export interface AppState {
  startDate: string;
  currentDay: number;
  history: ExerciseHistory[];
  exerciseSubstitutions: Record<string, string>; // Maps original exercise ID to substitution ID
  currentSession: ExerciseHistory[] | null;
}

export interface PeriodizationWeek {
  week: number;
  rir: string;
}

export interface PeriodizationSettings {
  weeks: PeriodizationWeek[];
  deloadSetReduction: number; // e.g., 0.5 for 50%
}

export interface AppConfig {
  workouts: Record<string, Workout>;
  periodization: PeriodizationSettings;
}


export enum View {
  Home,
  Workout,
  Progress,
  Settings,
}