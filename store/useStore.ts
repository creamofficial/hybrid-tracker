import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Workout, RunLog, LiftLog, WorkoutWithDetails, UserBadge, Program } from '../types';
import { calculateWorkoutXP, calculateLevel } from '../lib/xp';
import { checkNewBadges, BADGES } from '../lib/badges';

// Use crypto.randomUUID for web compatibility
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface AppState {
  user: User | null;
  workouts: WorkoutWithDetails[];
  userBadges: UserBadge[];
  activeProgram: Program | null;
  programProgress: { week: number; day: number } | null;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  addRunWorkout: (distance_km: number, duration_minutes: number, notes?: string) => WorkoutWithDetails;
  addLiftWorkout: (exercises: LiftLog['exercises'], duration_minutes: number, notes?: string) => WorkoutWithDetails;
  setActiveProgram: (program: Program | null) => void;
  advanceProgramProgress: () => void;
  checkAndAwardBadges: () => UserBadge[];
  updateStreak: () => void;
  clearData: () => void;
}

const initialUser: User = {
  id: generateId(),
  email: '',
  display_name: 'Athlete',
  created_at: new Date().toISOString(),
  xp: 0,
  level: 0,
  current_streak: 0,
  longest_streak: 0,
  last_workout_date: null,
};

function isConsecutiveDay(date1: string | null, date2: string): boolean {
  if (!date1) return true;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

function isSameDay(date1: string | null, date2: string): boolean {
  if (!date1) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: { ...initialUser },
      workouts: [],
      userBadges: [],
      activeProgram: null,
      programProgress: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      addRunWorkout: (distance_km, duration_minutes, notes) => {
        const state = get();
        const today = new Date().toISOString();
        const pace_per_km = duration_minutes / distance_km;

        const runLog: RunLog = {
          id: generateId(),
          workout_id: '',
          distance_km,
          pace_per_km,
        };

        const xp_earned = calculateWorkoutXP(
          'run',
          runLog,
          undefined,
          !!state.activeProgram,
          state.user?.current_streak || 0
        );

        const workout: WorkoutWithDetails = {
          id: generateId(),
          user_id: state.user?.id || '',
          type: 'run',
          date: today,
          duration_minutes,
          notes,
          xp_earned,
          created_at: today,
          run_log: { ...runLog, workout_id: '' },
        };

        workout.run_log!.workout_id = workout.id;

        const newXP = (state.user?.xp || 0) + xp_earned;
        const newLevel = calculateLevel(newXP);

        set((s) => ({
          workouts: [...s.workouts, workout],
          user: s.user
            ? {
                ...s.user,
                xp: newXP,
                level: newLevel,
              }
            : null,
        }));

        get().updateStreak();
        get().checkAndAwardBadges();

        return workout;
      },

      addLiftWorkout: (exercises, duration_minutes, notes) => {
        const state = get();
        const today = new Date().toISOString();

        const liftLog: LiftLog = {
          id: generateId(),
          workout_id: '',
          exercises,
        };

        const xp_earned = calculateWorkoutXP(
          'lift',
          undefined,
          liftLog,
          !!state.activeProgram,
          state.user?.current_streak || 0
        );

        const workout: WorkoutWithDetails = {
          id: generateId(),
          user_id: state.user?.id || '',
          type: 'lift',
          date: today,
          duration_minutes,
          notes,
          xp_earned,
          created_at: today,
          lift_log: { ...liftLog, workout_id: '' },
        };

        workout.lift_log!.workout_id = workout.id;

        const newXP = (state.user?.xp || 0) + xp_earned;
        const newLevel = calculateLevel(newXP);

        set((s) => ({
          workouts: [...s.workouts, workout],
          user: s.user
            ? {
                ...s.user,
                xp: newXP,
                level: newLevel,
              }
            : null,
        }));

        get().updateStreak();
        get().checkAndAwardBadges();

        return workout;
      },

      setActiveProgram: (program) =>
        set({
          activeProgram: program,
          programProgress: program ? { week: 1, day: 1 } : null,
        }),

      advanceProgramProgress: () => {
        const state = get();
        if (!state.activeProgram || !state.programProgress) return;

        const { week, day } = state.programProgress;
        const currentWeek = state.activeProgram.weeks.find((w) => w.week_number === week);

        if (!currentWeek) return;

        if (day < currentWeek.days.length) {
          set({ programProgress: { week, day: day + 1 } });
        } else if (week < state.activeProgram.weeks.length) {
          set({ programProgress: { week: week + 1, day: 1 } });
        } else {
          set({ activeProgram: null, programProgress: null });
        }
      },

      updateStreak: () => {
        const state = get();
        if (!state.user) return;

        const today = new Date().toISOString();
        const lastDate = state.user.last_workout_date;

        if (isSameDay(lastDate, today)) {
          return;
        }

        let newStreak = state.user.current_streak;

        if (isConsecutiveDay(lastDate, today)) {
          newStreak += 1;
        } else if (!lastDate) {
          newStreak = 1;
        } else {
          newStreak = 1;
        }

        const newLongest = Math.max(newStreak, state.user.longest_streak);

        set({
          user: {
            ...state.user,
            current_streak: newStreak,
            longest_streak: newLongest,
            last_workout_date: today,
          },
        });
      },

      checkAndAwardBadges: () => {
        const state = get();
        if (!state.user) return [];

        const earnedIds = state.userBadges.map((ub) => ub.badge_id);
        const newBadges = checkNewBadges(state.user, state.workouts, earnedIds);

        if (newBadges.length === 0) return [];

        const newUserBadges: UserBadge[] = newBadges.map((badge) => ({
          id: generateId(),
          user_id: state.user!.id,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        }));

        set((s) => ({
          userBadges: [...s.userBadges, ...newUserBadges],
        }));

        return newUserBadges;
      },

      clearData: () =>
        set({
          user: { ...initialUser, id: generateId() },
          workouts: [],
          userBadges: [],
          activeProgram: null,
          programProgress: null,
        }),
    }),
    {
      name: 'hybrid-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
