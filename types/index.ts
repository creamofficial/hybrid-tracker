export type WorkoutType = 'run' | 'lift';

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string | null;
}

export interface Workout {
  id: string;
  user_id: string;
  type: WorkoutType;
  program_id?: string;
  date: string;
  duration_minutes: number;
  notes?: string;
  xp_earned: number;
  created_at: string;
}

export interface RunLog {
  id: string;
  workout_id: string;
  distance_km: number;
  pace_per_km: number;
  elevation_m?: number;
  heart_rate_avg?: number;
}

export interface ExerciseSet {
  reps: number;
  weight_kg: number;
  rpe?: number;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

export interface LiftLog {
  id: string;
  workout_id: string;
  exercises: Exercise[];
}

export interface ProgramDay {
  day_number: number;
  name: string;
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  name: string;
  sets: number;
  reps: number | string;
  percentage?: number;
  notes?: string;
}

export interface ProgramWeek {
  week_number: number;
  days: ProgramDay[];
}

export interface Program {
  id: string;
  name: string;
  type: 'strength' | 'hybrid';
  description: string;
  weeks: ProgramWeek[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: 'run_distance' | 'lift_weight' | 'streak' | 'workout_count' | 'first';
  criteria_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface WorkoutWithDetails extends Workout {
  run_log?: RunLog;
  lift_log?: LiftLog;
}
