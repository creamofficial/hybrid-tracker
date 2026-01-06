import { View, Pressable, ScrollView, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { Footprints, Dumbbell, ChevronRight, Bike, Waves, Flame, Lock, Calendar, Clock } from "lucide-react-native";
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from "~/lib/theme";
import { ProgressRing } from "~/components/ui/progress-ring";

export default function LogScreen() {
  const router = useRouter();
  const { activeProgram, programProgress, workouts } = useStore();

  // Count today's workouts
  const today = new Date().toDateString();
  const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === today).length;

  // Weekly progress
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= startOfWeek).length;
  const weeklyGoal = 4;
  const weeklyProgress = weeklyGoal > 0 ? workoutsThisWeek / weeklyGoal : 0;

  // Get recent workouts for quick actions
  const recentRun = workouts.filter(w => w.type === 'run').slice(-1)[0];
  const recentLift = workouts.filter(w => w.type === 'lift').slice(-1)[0];

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Log workout</Text>
          {todayWorkouts > 0 && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{todayWorkouts} today</Text>
            </View>
          )}
        </View>
        <ProgressRing progress={weeklyProgress} size={48} strokeWidth={5}>
          <Text style={styles.progressText}>{workoutsThisWeek}/{weeklyGoal}</Text>
        </ProgressRing>
      </View>

      {/* Quick Actions - Recent Workouts */}
      {(recentRun || recentLift) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
            {recentRun?.run_log && (
              <Pressable
                style={({ pressed }) => [styles.quickActionCard, shadows.card, pressed && styles.pressed]}
                onPress={() => router.push("/log-run")}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.accent.green.bg }]}>
                  <Footprints size={18} color={colors.accent.green.icon} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionTitle}>{recentRun.run_log.distance_km}km Run</Text>
                <View style={styles.quickActionMeta}>
                  <Clock size={12} color={colors.text.tertiary} strokeWidth={2} />
                  <Text style={styles.quickActionSubtitle}>
                    {recentRun.duration_minutes} min · {formatRelativeDate(recentRun.date)}
                  </Text>
                </View>
              </Pressable>
            )}
            {recentLift?.lift_log && (
              <Pressable
                style={({ pressed }) => [styles.quickActionCard, shadows.card, pressed && styles.pressed]}
                onPress={() => router.push("/log-lift")}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.accent.orange.bg }]}>
                  <Dumbbell size={18} color={colors.accent.orange.icon} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionTitle}>
                  {recentLift.lift_log.exercises[0]?.name || 'Lift'}
                </Text>
                <View style={styles.quickActionMeta}>
                  <Clock size={12} color={colors.text.tertiary} strokeWidth={2} />
                  <Text style={styles.quickActionSubtitle}>
                    {recentLift.lift_log.exercises.length} exercises · {formatRelativeDate(recentLift.date)}
                  </Text>
                </View>
              </Pressable>
            )}
          </ScrollView>
        </View>
      )}

      {/* Workout Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout types</Text>
        <View style={styles.workoutTypesGrid}>
          <Pressable
            style={({ pressed }) => [styles.workoutTypeCard, shadows.card, pressed && styles.pressed]}
            onPress={() => router.push("/log-run")}
          >
            <View style={[styles.workoutTypeIcon, { backgroundColor: colors.accent.green.bg }]}>
              <Footprints size={24} color={colors.accent.green.icon} strokeWidth={2} />
            </View>
            <View style={styles.workoutTypeContent}>
              <Text style={styles.workoutTypeName}>Run</Text>
              <Text style={styles.workoutTypeDesc}>Distance, time, pace</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} strokeWidth={2} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.workoutTypeCard, shadows.card, pressed && styles.pressed]}
            onPress={() => router.push("/log-lift")}
          >
            <View style={[styles.workoutTypeIcon, { backgroundColor: colors.accent.orange.bg }]}>
              <Dumbbell size={24} color={colors.accent.orange.icon} strokeWidth={2} />
            </View>
            <View style={styles.workoutTypeContent}>
              <Text style={styles.workoutTypeName}>Lift</Text>
              <Text style={styles.workoutTypeDesc}>Exercises, sets, reps</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* More Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More activities</Text>
        <View style={styles.moreActivitiesGrid}>
          <View style={[styles.activityCard, shadows.card, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: colors.accent.purple.bg }]}>
              <Bike size={20} color={colors.accent.purple.icon} strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Cycle</Text>
            <View style={styles.comingSoonBadge}>
              <Lock size={10} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </View>

          <View style={[styles.activityCard, shadows.card, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: colors.accent.blue.bg }]}>
              <Waves size={20} color={colors.accent.blue.icon} strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Swim</Text>
            <View style={styles.comingSoonBadge}>
              <Lock size={10} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </View>

          <View style={[styles.activityCard, shadows.card, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: colors.accent.yellow.bg }]}>
              <Flame size={20} color={colors.accent.yellow.icon} strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>HIIT</Text>
            <View style={styles.comingSoonBadge}>
              <Lock size={10} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </View>

          <View style={[styles.activityCard, shadows.card, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: colors.accent.pink.bg }]}>
              <Calendar size={20} color={colors.accent.pink.icon} strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Custom</Text>
            <View style={styles.comingSoonBadge}>
              <Lock size={10} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Streak Reminder Card */}
      <View style={[styles.streakCard, shadows.card]}>
        <LinearGradient
          colors={['rgba(255, 138, 0, 0.08)', 'rgba(255, 179, 71, 0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakGradient}
        >
          <View style={styles.streakCardIcon}>
            <Flame size={20} color={colors.primary.solid} strokeWidth={2} />
          </View>
          <View style={styles.streakCardContent}>
            <Text style={styles.streakCardTitle}>Build your streak</Text>
            <Text style={styles.streakCardSubtitle}>Log a workout every day for bonus XP</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Active Program */}
      {activeProgram && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active program</Text>
          <Pressable style={[styles.programCard, shadows.elevated]}>
            <LinearGradient
              colors={[colors.primary.start, colors.primary.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.programBadge}
            >
              <Text style={styles.programBadgeText}>ACTIVE</Text>
            </LinearGradient>
            <Text style={styles.programName}>{activeProgram.name}</Text>
            <Text style={styles.programProgress}>
              Week {programProgress?.week} · Day {programProgress?.day}
            </Text>
          </Pressable>
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
    gap: spacing.md,
  },
  headerTitle: {
    ...typography.sectionHeader,
    fontSize: 24,
    color: colors.text.primary,
  },
  todayBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  todayBadgeText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  progressText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.primary.solid,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  workoutTypesGrid: {
    gap: spacing.md,
  },
  workoutTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  workoutTypeIcon: {
    width: iconContainer.lg.size,
    height: iconContainer.lg.size,
    borderRadius: iconContainer.lg.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTypeContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  workoutTypeName: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  workoutTypeDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  moreActivitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  activityCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  activityCardDisabled: {
    opacity: 0.6,
  },
  activityIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  activityName: {
    ...typography.cardTitle,
    fontSize: 15,
    color: colors.text.primary,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  comingSoonText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
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
  streakCardIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  streakCardContent: {
    flex: 1,
  },
  streakCardTitle: {
    ...typography.cardTitle,
    fontSize: 15,
    color: colors.text.primary,
  },
  streakCardSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  programCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  programBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  programBadgeText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text.inverse,
    letterSpacing: 0.5,
  },
  programName: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  programProgress: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  quickActionsScroll: {
    marginLeft: -spacing.lg,
    paddingLeft: spacing.lg,
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    minWidth: 160,
  },
  quickActionIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  quickActionTitle: {
    ...typography.cardTitle,
    fontSize: 15,
    color: colors.text.primary,
  },
  quickActionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  quickActionSubtitle: {
    ...typography.small,
    color: colors.text.tertiary,
  },
});
