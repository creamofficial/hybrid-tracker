import { View, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { xpToNextLevel } from "~/lib/xp";
import { BADGES } from "~/lib/badges";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Target, Footprints, Clock, Flame, ChevronRight, Lock, Zap, TrendingUp, Award } from "lucide-react-native";
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from "~/lib/theme";
import { ProgressRing } from "~/components/ui/progress-ring";
import { ActivityHeatmap } from "~/components/ui/activity-heatmap";

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBarContainer}>
      <LinearGradient
        colors={[colors.primary.start, colors.primary.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const { user, workouts, userBadges, clearData } = useStore();

  const { current, required, progress } = xpToNextLevel(user?.xp || 0);
  const runCount = workouts.filter((w) => w.type === "run").length;
  const liftCount = workouts.filter((w) => w.type === "lift").length;
  const totalDistance = workouts
    .filter((w) => w.type === "run" && w.run_log)
    .reduce((acc, w) => acc + (w.run_log?.distance_km || 0), 0);
  const earnedBadgeIds = userBadges.map((ub) => ub.badge_id);
  const earnedCount = userBadges.length;
  const lockedCount = BADGES.length - earnedCount;

  // Calculate Personal Records
  const runWorkouts = workouts.filter((w) => w.type === "run" && w.run_log);
  const liftWorkouts = workouts.filter((w) => w.type === "lift" && w.lift_log);

  const longestRun = runWorkouts.length > 0
    ? Math.max(...runWorkouts.map((w) => w.run_log!.distance_km))
    : 0;

  const fastestPace = runWorkouts.length > 0
    ? Math.min(...runWorkouts.map((w) => w.run_log!.pace_per_km))
    : 0;

  const heaviestLift = liftWorkouts.reduce((max, w) => {
    const exerciseMax = w.lift_log!.exercises.reduce((eMax, ex) => {
      const setMax = ex.sets.reduce((sMax, set) => Math.max(sMax, set.weight_kg), 0);
      return Math.max(eMax, setMax);
    }, 0);
    return Math.max(max, exerciseMax);
  }, 0);

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const weekCounts = new Map<number, number>();
  workouts.forEach((w) => {
    const weekStart = getWeekStart(new Date(w.date));
    weekCounts.set(weekStart, (weekCounts.get(weekStart) || 0) + 1);
  });
  const bestWeek = weekCounts.size > 0 ? Math.max(...weekCounts.values()) : 0;

  const formatPace = (pacePerKm: number) => {
    if (pacePerKm === 0) return "--:--";
    const mins = Math.floor(pacePerKm);
    const secs = Math.round((pacePerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClearData = () => {
    Alert.alert(
      "Reset All Data?",
      "This will delete all your workouts, badges, and progress.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: clearData },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header / Avatar */}
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary.start, colors.primary.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {(user?.display_name || "A")[0].toUpperCase()}
          </Text>
        </LinearGradient>
        <Text style={styles.displayName}>{user?.display_name || "Athlete"}</Text>
        <Text style={styles.memberSince}>
          Training since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </Text>
      </View>

      {/* Level Card */}
      <View style={[styles.levelCard, shadows.elevated]}>
        <View style={styles.levelHeader}>
          <View style={styles.levelIcon}>
            <Trophy size={22} color={colors.accent.amber.icon} strokeWidth={2} />
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Current Level</Text>
            <Text style={styles.levelValue}>{user?.level || 0}</Text>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpLabel}>Total XP</Text>
            <Text style={styles.xpValue}>{user?.xp || 0}</Text>
          </View>
        </View>
        <ProgressBar progress={progress} />
        <Text style={styles.xpToNext}>
          {required - current} XP to level {(user?.level || 0) + 1}
        </Text>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={[styles.statsCard, shadows.card]}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent.orange.bg }]}>
              <Target size={18} color={colors.accent.orange.icon} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent.green.bg }]}>
              <Footprints size={18} color={colors.accent.green.icon} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{totalDistance.toFixed(1)}</Text>
            <Text style={styles.statLabel}>km run</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent.purple.bg }]}>
              <Flame size={18} color={colors.accent.purple.icon} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{user?.longest_streak || 0}</Text>
            <Text style={styles.statLabel}>Best streak</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.quickStatsGrid}>
        <View style={[styles.quickStatCard, shadows.card]}>
          <Text style={styles.quickStatValue}>{user?.current_streak || 0}</Text>
          <Text style={styles.quickStatLabel}>Current streak</Text>
        </View>
        <View style={[styles.quickStatCard, shadows.card]}>
          <Text style={styles.quickStatValue}>{runCount}</Text>
          <Text style={styles.quickStatLabel}>Runs</Text>
        </View>
        <View style={[styles.quickStatCard, shadows.card]}>
          <Text style={styles.quickStatValue}>{liftCount}</Text>
          <Text style={styles.quickStatLabel}>Lifts</Text>
        </View>
        <View style={[styles.quickStatCard, shadows.card]}>
          <Text style={styles.quickStatValue}>
            {workouts.length > 0
              ? Math.round(workouts.reduce((acc, w) => acc + w.duration_minutes, 0) / workouts.length)
              : 0}
          </Text>
          <Text style={styles.quickStatLabel}>Avg mins</Text>
        </View>
      </View>

      {/* Activity Heatmap */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={[styles.heatmapCard, shadows.card]}>
          <ActivityHeatmap workouts={workouts} days={35} />
        </View>
      </View>

      {/* Personal Records */}
      {workouts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal records</Text>
            <Award size={16} color={colors.primary.solid} strokeWidth={2} />
          </View>
          <View style={styles.recordsGrid}>
            {longestRun > 0 && (
              <View style={[styles.recordCard, shadows.card]}>
                <View style={[styles.recordIcon, { backgroundColor: colors.accent.green.bg }]}>
                  <Footprints size={16} color={colors.accent.green.icon} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{longestRun.toFixed(1)} km</Text>
                <Text style={styles.recordLabel}>Longest run</Text>
              </View>
            )}
            {fastestPace > 0 && (
              <View style={[styles.recordCard, shadows.card]}>
                <View style={[styles.recordIcon, { backgroundColor: colors.accent.green.bg }]}>
                  <Zap size={16} color={colors.accent.green.icon} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{formatPace(fastestPace)}</Text>
                <Text style={styles.recordLabel}>Fastest pace</Text>
              </View>
            )}
            {heaviestLift > 0 && (
              <View style={[styles.recordCard, shadows.card]}>
                <View style={[styles.recordIcon, { backgroundColor: colors.accent.orange.bg }]}>
                  <TrendingUp size={16} color={colors.accent.orange.icon} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{heaviestLift} kg</Text>
                <Text style={styles.recordLabel}>Heaviest lift</Text>
              </View>
            )}
            {bestWeek > 0 && (
              <View style={[styles.recordCard, shadows.card]}>
                <View style={[styles.recordIcon, { backgroundColor: colors.accent.purple.bg }]}>
                  <Target size={16} color={colors.accent.purple.icon} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{bestWeek}</Text>
                <Text style={styles.recordLabel}>Best week</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Badges */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <Text style={styles.badgeCount}>
            <Text style={{ color: colors.primary.solid }}>{earnedCount}</Text> / {BADGES.length}
          </Text>
        </View>
        <View style={styles.badgesGrid}>
          {BADGES.slice(0, 6).map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, shadows.card, !earned && styles.badgeCardLocked]}
              >
                <Text style={styles.badgeIcon}>
                  {earned ? badge.icon : "🔒"}
                </Text>
                <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
                  {badge.name}
                </Text>
              </View>
            );
          })}
        </View>
        {BADGES.length > 6 && (
          <Pressable style={styles.viewAllBadges}>
            <Text style={styles.viewAllBadgesText}>View all badges</Text>
            <ChevronRight size={16} color={colors.primary.solid} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Reset Button */}
      <Pressable style={[styles.resetButton, shadows.card]} onPress={handleClearData}>
        <Text style={styles.resetButtonText}>Reset all data</Text>
      </Pressable>

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
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.elevated,
  },
  avatarText: {
    ...typography.hero,
    fontSize: 32,
    color: colors.text.inverse,
  },
  displayName: {
    ...typography.sectionHeader,
    fontSize: 24,
    color: colors.text.primary,
  },
  memberSince: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  levelCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  levelIcon: {
    width: iconContainer.lg.size,
    height: iconContainer.lg.size,
    borderRadius: iconContainer.lg.radius,
    backgroundColor: colors.accent.amber.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  levelLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  levelValue: {
    ...typography.stat,
    color: colors.text.primary,
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  xpValue: {
    ...typography.sectionHeader,
    color: colors.primary.solid,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: borderRadius.full,
  },
  xpToNext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.statMedium,
    fontSize: 24,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 56,
    backgroundColor: colors.border,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  quickStatCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  quickStatValue: {
    ...typography.statMedium,
    color: colors.text.primary,
  },
  quickStatLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  heatmapCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  recordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  recordCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  recordIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  recordValue: {
    ...typography.cardTitle,
    fontSize: 18,
    color: colors.text.primary,
  },
  recordLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
  badgeCount: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  badgeName: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.text.tertiary,
  },
  viewAllBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  viewAllBadgesText: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.primary.solid,
  },
  resetButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  resetButtonText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
