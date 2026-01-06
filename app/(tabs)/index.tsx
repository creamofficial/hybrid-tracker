import { View, ScrollView, Pressable, Image, StyleSheet, Text as RNText } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Dumbbell, Footprints, Plus, ChevronRight, TrendingUp, Sparkles } from "lucide-react-native";
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from "~/lib/theme";
import { ProgressRing } from "~/components/ui/progress-ring";
import { GradientButton } from "~/components/ui/gradient-button";
import { WorkoutCardCompact } from "~/components/ui/workout-card";
import { WeeklyChart } from "~/components/ui/weekly-chart";
import { EmptyState } from "~/components/ui/empty-state";

// Get current week days
function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const days = [];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      day: dayNames[i],
      date: date.getDate(),
      isToday: i === dayOfWeek,
      dateObj: date,
    });
  }
  return days;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, workouts } = useStore();

  const recentWorkouts = workouts.slice(-5).reverse();
  const weekDays = getWeekDays();

  // Count workouts this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= startOfWeek).length;
  const weeklyGoal = 4;
  const weeklyProgress = weeklyGoal > 0 ? workoutsThisWeek / weeklyGoal : 0;

  // Check which days have workouts
  const workoutDates = new Set(workouts.map(w => new Date(w.date).toDateString()));

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../appstore.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Kaizen</Text>
        </View>
        <Text style={styles.dateText}>{formatDate()}</Text>
      </View>

      {/* Weekly Goal Hero Card */}
      <View style={[styles.weeklyCard, shadows.elevated]}>
        <LinearGradient
          colors={['rgba(255, 138, 0, 0.06)', 'rgba(255, 179, 71, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weeklyGradient}
        >
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={styles.weeklyLabel}>Weekly goal</Text>
              <View style={styles.weeklyStats}>
                <Text style={styles.weeklyCount}>{workoutsThisWeek}</Text>
                <Text style={styles.weeklyDivider}>/</Text>
                <Text style={styles.weeklyTotal}>{weeklyGoal}</Text>
                <Text style={styles.weeklyUnit}>workouts</Text>
              </View>
              {workoutsThisWeek === 0 && (
                <Text style={styles.motivationText}>Start your streak today</Text>
              )}
              {workoutsThisWeek >= weeklyGoal && (
                <Text style={styles.successText}>Goal achieved! 🎉</Text>
              )}
            </View>
            <ProgressRing progress={weeklyProgress} size={72} strokeWidth={7}>
              <Text style={styles.progressPercent}>
                {Math.round(weeklyProgress * 100)}%
              </Text>
            </ProgressRing>
          </View>
        </LinearGradient>
      </View>

      {/* Week Calendar */}
      <View style={styles.weekCalendar}>
        {weekDays.map((day, index) => {
          const hasWorkout = workoutDates.has(day.dateObj.toDateString());
          return (
            <View key={index} style={styles.dayContainer}>
              <Text style={[styles.dayName, day.isToday && styles.dayNameToday]}>{day.day}</Text>
              {day.isToday ? (
                <LinearGradient
                  colors={[colors.primary.start, colors.primary.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dayPillToday}
                >
                  <Text style={styles.dayDateToday}>{day.date}</Text>
                </LinearGradient>
              ) : hasWorkout ? (
                <View style={styles.completedDot}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ) : (
                <View style={styles.dayPill}>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Start Workout Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title="Start new workout"
          onPress={() => router.push("/log")}
          icon={<Plus size={20} color={colors.text.inverse} strokeWidth={2.5} />}
          size="lg"
        />
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent workouts</Text>
          {recentWorkouts.length > 0 && (
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={16} color={colors.primary.solid} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {recentWorkouts.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={36} color={colors.primary.solid} strokeWidth={1.5} />}
            title="Your fitness journey starts here"
            subtitle="Every expert was once a beginner. Log your first workout and start building your streak!"
            actionLabel="Start workout"
            onAction={() => router.push("/log")}
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.workoutList}>
            {recentWorkouts.map((workout) => (
              <WorkoutCardCompact
                key={workout.id}
                type={workout.type}
                title={workout.type === 'run' ? 'Run' : 'Lift'}
                date={new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                detail={
                  workout.type === 'run' && workout.run_log
                    ? `${workout.run_log.distance_km.toFixed(1)} km`
                    : workout.lift_log
                    ? `${workout.lift_log.exercises.length} exercises`
                    : ''
                }
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Weekly Progress Chart */}
      {workouts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly progress</Text>
            <TrendingUp size={18} color={colors.primary.solid} strokeWidth={2} />
          </View>
          <View style={[styles.chartCard, shadows.card]}>
            <WeeklyChart workouts={workouts} />
          </View>
        </View>
      )}

      {/* Streak Card */}
      {(user?.current_streak || 0) > 0 && (
        <View style={[styles.streakCard, shadows.card]}>
          <LinearGradient
            colors={['rgba(255, 138, 0, 0.08)', 'rgba(255, 179, 71, 0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakGradient}
          >
            <View style={styles.streakIcon}>
              <Flame size={22} color={colors.primary.solid} strokeWidth={2} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakTitle}>{user?.current_streak} day streak</Text>
              <Text style={styles.streakSubtitle}>Keep the momentum going!</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  brandName: {
    ...typography.sectionHeader,
    fontSize: 22,
    color: colors.text.primary,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // Weekly Goal Card
  weeklyCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  weeklyGradient: {
    padding: spacing.xl,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  weeklyStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weeklyCount: {
    ...typography.hero,
    color: colors.text.primary,
  },
  weeklyDivider: {
    ...typography.stat,
    color: colors.text.tertiary,
  },
  weeklyTotal: {
    ...typography.stat,
    color: colors.text.tertiary,
  },
  weeklyUnit: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  progressPercent: {
    ...typography.cardTitle,
    fontSize: 14,
    color: colors.primary.solid,
  },
  motivationText: {
    ...typography.caption,
    color: colors.primary.solid,
    marginTop: spacing.sm,
  },
  successText: {
    ...typography.caption,
    color: colors.success,
    marginTop: spacing.sm,
  },
  // Week Calendar
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  dayContainer: {
    alignItems: 'center',
    width: 44,
  },
  dayName: {
    ...typography.small,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  dayNameToday: {
    color: colors.primary.solid,
    fontWeight: '600',
  },
  dayPill: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillToday: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDate: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text.primary,
  },
  dayDateToday: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  completedDot: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },
  // Button
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  // Sections
  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionHeader,
    color: colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...typography.caption,
    color: colors.primary.solid,
    fontWeight: '500',
  },
  workoutList: {
    marginLeft: -spacing.lg,
    paddingLeft: spacing.lg,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  // Streak Card
  streakCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  streakIcon: {
    width: iconContainer.lg.size,
    height: iconContainer.lg.size,
    borderRadius: iconContainer.lg.radius,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  streakContent: {
    flex: 1,
  },
  streakTitle: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  streakSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
