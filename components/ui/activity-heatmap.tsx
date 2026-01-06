import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "~/lib/theme";

interface ActivityHeatmapProps {
  workouts: Array<{ date: string }>;
  days?: number;
  onDayPress?: (date: Date) => void;
}

export function ActivityHeatmap({ workouts, days = 35, onDayPress }: ActivityHeatmapProps) {
  // Create a map of workout counts per day
  const workoutCounts = new Map<string, number>();
  workouts.forEach((w) => {
    const dateStr = new Date(w.date).toDateString();
    workoutCounts.set(dateStr, (workoutCounts.get(dateStr) || 0) + 1);
  });

  // Generate last N days
  const today = new Date();
  const daysList: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    daysList.push(date);
  }

  // Get color based on workout count
  const getColor = (count: number) => {
    if (count === 0) return colors.border;
    if (count === 1) return 'rgba(255, 138, 0, 0.4)';
    return colors.primary.solid;
  };

  // Group by weeks for grid layout
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  daysList.forEach((date, index) => {
    currentWeek.push(date);
    if (currentWeek.length === 7 || index === daysList.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((date, dayIndex) => {
              const count = workoutCounts.get(date.toDateString()) || 0;
              const isToday = date.toDateString() === today.toDateString();
              return (
                <Pressable
                  key={dayIndex}
                  style={[
                    styles.day,
                    { backgroundColor: getColor(count) },
                    isToday && styles.dayToday,
                  ]}
                  onPress={() => onDayPress?.(date)}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={[styles.legendBox, { backgroundColor: colors.border }]} />
        <View style={[styles.legendBox, { backgroundColor: 'rgba(255, 138, 0, 0.4)' }]} />
        <View style={[styles.legendBox, { backgroundColor: colors.primary.solid }]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    gap: 4,
  },
  week: {
    flexDirection: 'column',
    gap: 4,
  },
  day: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: colors.text.primary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  legendText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
