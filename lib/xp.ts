import { WorkoutType, RunLog, LiftLog } from '../types';

const BASE_XP = 50;
const XP_PER_KM = 10;
const XP_PER_EXERCISE = 10;
const PROGRAM_BONUS = 25;
const STREAK_MULTIPLIER = 1.5;
const STREAK_THRESHOLD = 7;

export function calculateRunXP(distance_km: number): number {
  return BASE_XP + Math.round(distance_km * XP_PER_KM);
}

export function calculateLiftXP(exerciseCount: number): number {
  return BASE_XP + exerciseCount * XP_PER_EXERCISE;
}

export function calculateWorkoutXP(
  type: WorkoutType,
  runLog?: RunLog,
  liftLog?: LiftLog,
  isProgram: boolean = false,
  currentStreak: number = 0
): number {
  let xp = 0;

  if (type === 'run' && runLog) {
    xp = calculateRunXP(runLog.distance_km);
  } else if (type === 'lift' && liftLog) {
    xp = calculateLiftXP(liftLog.exercises.length);
  }

  if (isProgram) {
    xp += PROGRAM_BONUS;
  }

  if (currentStreak >= STREAK_THRESHOLD) {
    xp = Math.round(xp * STREAK_MULTIPLIER);
  }

  return xp;
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100));
}

export function xpForLevel(level: number): number {
  return level * level * 100;
}

export function xpToNextLevel(currentXP: number): { current: number; required: number; progress: number } {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  return {
    current: xpInCurrentLevel,
    required: xpNeededForNextLevel,
    progress: xpInCurrentLevel / xpNeededForNextLevel,
  };
}
