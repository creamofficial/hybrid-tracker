import { Badge, User, WorkoutWithDetails } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_run',
    name: 'First Steps',
    description: 'Complete your first run',
    icon: '🏃',
    criteria_type: 'first',
    criteria_value: 1,
  },
  {
    id: 'first_lift',
    name: 'Iron Rookie',
    description: 'Complete your first lift session',
    icon: '🏋️',
    criteria_type: 'first',
    criteria_value: 1,
  },
  {
    id: '5k_runner',
    name: '5K Runner',
    description: 'Complete a 5K run',
    icon: '🎽',
    criteria_type: 'run_distance',
    criteria_value: 5,
  },
  {
    id: '10k_runner',
    name: '10K Runner',
    description: 'Complete a 10K run',
    icon: '🏅',
    criteria_type: 'run_distance',
    criteria_value: 10,
  },
  {
    id: 'half_marathon',
    name: 'Half Marathon',
    description: 'Complete a half marathon (21.1km)',
    icon: '🏆',
    criteria_type: 'run_distance',
    criteria_value: 21.1,
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    criteria_type: 'streak',
    criteria_value: 7,
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Maintain a 30-day workout streak',
    icon: '💪',
    criteria_type: 'streak',
    criteria_value: 30,
  },
  {
    id: '100kg_squat',
    name: '100kg Squat Club',
    description: 'Squat 100kg or more',
    icon: '🦵',
    criteria_type: 'lift_weight',
    criteria_value: 100,
  },
  {
    id: 'workout_10',
    name: 'Getting Started',
    description: 'Complete 10 workouts',
    icon: '⭐',
    criteria_type: 'workout_count',
    criteria_value: 10,
  },
  {
    id: 'workout_50',
    name: 'Dedicated',
    description: 'Complete 50 workouts',
    icon: '🌟',
    criteria_type: 'workout_count',
    criteria_value: 50,
  },
  {
    id: 'workout_100',
    name: 'Century Club',
    description: 'Complete 100 workouts',
    icon: '💯',
    criteria_type: 'workout_count',
    criteria_value: 100,
  },
];

export function checkNewBadges(
  user: User,
  workouts: WorkoutWithDetails[],
  earnedBadgeIds: string[]
): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of BADGES) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    let earned = false;

    switch (badge.criteria_type) {
      case 'first':
        if (badge.id === 'first_run') {
          earned = workouts.some((w) => w.type === 'run');
        } else if (badge.id === 'first_lift') {
          earned = workouts.some((w) => w.type === 'lift');
        }
        break;

      case 'run_distance':
        earned = workouts.some(
          (w) => w.type === 'run' && w.run_log && w.run_log.distance_km >= badge.criteria_value
        );
        break;

      case 'streak':
        earned = user.current_streak >= badge.criteria_value || user.longest_streak >= badge.criteria_value;
        break;

      case 'workout_count':
        earned = workouts.length >= badge.criteria_value;
        break;

      case 'lift_weight':
        earned = workouts.some(
          (w) =>
            w.type === 'lift' &&
            w.lift_log &&
            w.lift_log.exercises.some((e) =>
              e.sets.some((s) => s.weight_kg >= badge.criteria_value)
            )
        );
        break;
    }

    if (earned) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}
