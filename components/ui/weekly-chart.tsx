import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, borderRadius } from "~/lib/theme";

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
        {weeks.map((week, index) => {
          const isCurrentWeek = index === 3;
          const heightPercent = (week.count / maxCount) * 100;

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                {isCurrentWeek ? (
                  <LinearGradient
                    colors={[colors.primary.start, colors.primary.end]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[
                      styles.bar,
                      { height: `${Math.max(heightPercent, 8)}%` },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.bar,
                      styles.barInactive,
                      { height: `${Math.max(heightPercent, 8)}%` },
                    ]}
                  />
                )}
              </View>
              <Text style={[styles.barLabel, isCurrentWeek && styles.barLabelActive]}>
                {week.count}
              </Text>
              <Text style={[styles.weekLabel, isCurrentWeek && styles.weekLabelActive]}>
                {week.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: 32,
    height: 60,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  barInactive: {
    backgroundColor: 'rgba(255, 138, 0, 0.3)',
  },
  barLabel: {
    ...typography.cardTitle,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  barLabelActive: {
    color: colors.primary.solid,
  },
  weekLabel: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  weekLabelActive: {
    color: colors.text.secondary,
  },
});
