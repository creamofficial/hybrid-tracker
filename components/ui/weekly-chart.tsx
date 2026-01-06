import { View, Text, StyleSheet } from "react-native";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const BORDER = "#E8E8E8";

interface WeeklyChartProps {
  workouts: Array<{ date: string }>;
}

export function WeeklyChart({ workouts }: WeeklyChartProps) {
  // Get last 4 weeks of data
  const today = new Date();
  const weeks: { label: string; count: number }[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7 + today.getDay()));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const count = workouts.filter((w) => {
      const date = new Date(w.date);
      return date >= weekStart && date <= weekEnd;
    }).length;

    const label = i === 0 ? 'This week' : i === 1 ? 'Last week' : `${i}w ago`;
    weeks.push({ label, count });
  }

  const maxCount = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {weeks.map((week, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(week.count / maxCount) * 100}%`,
                    backgroundColor: index === 3 ? PRIMARY : '#FFB088',
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{week.count}</Text>
            <Text style={styles.weekLabel}>{week.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: 24,
    height: 50,
    backgroundColor: BORDER,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: FOREGROUND,
    marginTop: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  weekLabel: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
});
