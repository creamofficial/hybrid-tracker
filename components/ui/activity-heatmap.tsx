import { View, Text, Pressable, StyleSheet } from "react-native";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const BORDER = "#E8E8E8";

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
    if (count === 0) return BORDER;
    if (count === 1) return '#FFB088';
    return PRIMARY;
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
        <View style={[styles.legendBox, { backgroundColor: BORDER }]} />
        <View style={[styles.legendBox, { backgroundColor: '#FFB088' }]} />
        <View style={[styles.legendBox, { backgroundColor: PRIMARY }]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    flexDirection: 'column',
    gap: 3,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: FOREGROUND,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
