import { Program } from '../../types';

export const STRONGLIFTS_5X5: Program = {
  id: 'stronglifts-5x5',
  name: 'StrongLifts 5x5',
  type: 'strength',
  description: 'A beginner strength program with linear progression. Alternate between Workout A and B, 3 days per week. Add 2.5kg each workout.',
  weeks: [
    {
      week_number: 1,
      days: [
        {
          day_number: 1,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5, notes: 'Start with 20kg bar, add 2.5kg each session' },
            { name: 'Bench Press', sets: 5, reps: 5, notes: 'Start with 20kg bar, add 2.5kg each session' },
            { name: 'Barbell Row', sets: 5, reps: 5, notes: 'Start with 30kg, add 2.5kg each session' },
          ],
        },
        {
          day_number: 2,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5, notes: 'Continue from last session weight' },
            { name: 'Overhead Press', sets: 5, reps: 5, notes: 'Start with 20kg bar, add 2.5kg each session' },
            { name: 'Deadlift', sets: 1, reps: 5, notes: 'Start with 40kg, add 5kg each session' },
          ],
        },
        {
          day_number: 3,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Bench Press', sets: 5, reps: 5 },
            { name: 'Barbell Row', sets: 5, reps: 5 },
          ],
        },
      ],
    },
    {
      week_number: 2,
      days: [
        {
          day_number: 1,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Overhead Press', sets: 5, reps: 5 },
            { name: 'Deadlift', sets: 1, reps: 5 },
          ],
        },
        {
          day_number: 2,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Bench Press', sets: 5, reps: 5 },
            { name: 'Barbell Row', sets: 5, reps: 5 },
          ],
        },
        {
          day_number: 3,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Overhead Press', sets: 5, reps: 5 },
            { name: 'Deadlift', sets: 1, reps: 5 },
          ],
        },
      ],
    },
    {
      week_number: 3,
      days: [
        {
          day_number: 1,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Bench Press', sets: 5, reps: 5 },
            { name: 'Barbell Row', sets: 5, reps: 5 },
          ],
        },
        {
          day_number: 2,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Overhead Press', sets: 5, reps: 5 },
            { name: 'Deadlift', sets: 1, reps: 5 },
          ],
        },
        {
          day_number: 3,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Bench Press', sets: 5, reps: 5 },
            { name: 'Barbell Row', sets: 5, reps: 5 },
          ],
        },
      ],
    },
    {
      week_number: 4,
      days: [
        {
          day_number: 1,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Overhead Press', sets: 5, reps: 5 },
            { name: 'Deadlift', sets: 1, reps: 5 },
          ],
        },
        {
          day_number: 2,
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Bench Press', sets: 5, reps: 5 },
            { name: 'Barbell Row', sets: 5, reps: 5 },
          ],
        },
        {
          day_number: 3,
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5 },
            { name: 'Overhead Press', sets: 5, reps: 5 },
            { name: 'Deadlift', sets: 1, reps: 5 },
          ],
        },
      ],
    },
  ],
};
