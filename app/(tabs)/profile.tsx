import { View, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { xpToNextLevel } from "~/lib/xp";
import { BADGES } from "~/lib/badges";
import { Trophy, Target, Footprints, Clock, Flame, ChevronRight, Lock, Zap, TrendingUp, Award } from "lucide-react-native";
import { ActivityHeatmap } from "~/components/ui/activity-heatmap";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const ACCENT = "#10B981";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
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

  // Longest run
  const longestRun = runWorkouts.length > 0
    ? Math.max(...runWorkouts.map((w) => w.run_log!.distance_km))
    : 0;

  // Fastest pace (min per km) - lower is better
  const fastestPace = runWorkouts.length > 0
    ? Math.min(...runWorkouts.map((w) => w.run_log!.pace_per_km))
    : 0;

  // Heaviest lift
  const heaviestLift = liftWorkouts.reduce((max, w) => {
    const exerciseMax = w.lift_log!.exercises.reduce((eMax, ex) => {
      const setMax = ex.sets.reduce((sMax, set) => Math.max(sMax, set.weight_kg), 0);
      return Math.max(eMax, setMax);
    }, 0);
    return Math.max(max, exerciseMax);
  }, 0);

  // Most workouts in a week
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

  // Format pace as mm:ss
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.display_name || "A")[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.displayName}>{user?.display_name || "Athlete"}</Text>
        <Text style={styles.memberSince}>
          Training since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </Text>
      </View>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelIcon}>
            <Trophy size={20} color={PRIMARY} strokeWidth={2} />
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
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3E7' }]}>
              <Target size={18} color={PRIMARY} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#E6F7F2' }]}>
              <Footprints size={18} color={ACCENT} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{totalDistance.toFixed(1)}</Text>
            <Text style={styles.statLabel}>km run</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}>
              <Clock size={18} color="#8B5CF6" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{user?.longest_streak || 0}</Text>
            <Text style={styles.statLabel}>Best streak</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid - simplified to 4 items */}
      <View style={styles.quickStatsGrid}>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{user?.current_streak || 0}</Text>
          <Text style={styles.quickStatLabel}>Current streak</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{runCount}</Text>
          <Text style={styles.quickStatLabel}>Runs</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{liftCount}</Text>
          <Text style={styles.quickStatLabel}>Lifts</Text>
        </View>
        <View style={styles.quickStatCard}>
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
        <View style={styles.heatmapCard}>
          <ActivityHeatmap workouts={workouts} days={35} />
        </View>
      </View>

      {/* Personal Records */}
      {workouts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal records</Text>
            <Award size={16} color={PRIMARY} strokeWidth={2} />
          </View>
          <View style={styles.recordsGrid}>
            {longestRun > 0 && (
              <View style={styles.recordCard}>
                <View style={[styles.recordIcon, { backgroundColor: '#E6F7F2' }]}>
                  <Footprints size={16} color={ACCENT} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{longestRun.toFixed(1)} km</Text>
                <Text style={styles.recordLabel}>Longest run</Text>
              </View>
            )}
            {fastestPace > 0 && (
              <View style={styles.recordCard}>
                <View style={[styles.recordIcon, { backgroundColor: '#E6F7F2' }]}>
                  <Zap size={16} color={ACCENT} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{formatPace(fastestPace)}</Text>
                <Text style={styles.recordLabel}>Fastest pace</Text>
              </View>
            )}
            {heaviestLift > 0 && (
              <View style={styles.recordCard}>
                <View style={[styles.recordIcon, { backgroundColor: '#FEF3E7' }]}>
                  <TrendingUp size={16} color={PRIMARY} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{heaviestLift} kg</Text>
                <Text style={styles.recordLabel}>Heaviest lift</Text>
              </View>
            )}
            {bestWeek > 0 && (
              <View style={styles.recordCard}>
                <View style={[styles.recordIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Target size={16} color="#8B5CF6" strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{bestWeek}</Text>
                <Text style={styles.recordLabel}>Best week</Text>
              </View>
            )}
            {(user?.longest_streak || 0) > 0 && (
              <View style={styles.recordCard}>
                <View style={[styles.recordIcon, { backgroundColor: '#FEF3E7' }]}>
                  <Flame size={16} color={PRIMARY} strokeWidth={2} />
                </View>
                <Text style={styles.recordValue}>{user?.longest_streak}</Text>
                <Text style={styles.recordLabel}>Best streak</Text>
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
            <Text style={{ color: PRIMARY }}>{earnedCount} earned</Text> · {lockedCount} locked
          </Text>
        </View>
        <View style={styles.badgesGrid}>
          {BADGES.slice(0, 6).map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, !earned && styles.badgeCardLocked]}
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
            <ChevronRight size={16} color={PRIMARY} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Reset Button */}
      <Pressable style={styles.resetButton} onPress={handleClearData}>
        <Text style={styles.resetButtonText}>Reset all data</Text>
      </Pressable>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  memberSince: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  levelCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  levelLabel: {
    fontSize: 12,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  levelValue: {
    fontSize: 24,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    fontSize: 12,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  xpValue: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: PRIMARY,
    borderRadius: 4,
  },
  xpToNext: {
    fontSize: 12,
    color: MUTED,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: FOREGROUND,
    fontFamily: 'Poppins_500Medium',
  },
  statsCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: BORDER,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  quickStatCard: {
    width: '48%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  quickStatLabel: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  badgeCount: {
    fontSize: 13,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '31%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: FOREGROUND,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  badgeNameLocked: {
    color: MUTED,
  },
  viewAllBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 4,
  },
  viewAllBadgesText: {
    fontSize: 14,
    color: PRIMARY,
    fontFamily: 'Poppins_500Medium',
  },
  resetButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    color: MUTED,
    fontFamily: 'Poppins_500Medium',
  },
  heatmapCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  recordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recordCard: {
    width: '31%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  recordIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  recordLabel: {
    fontSize: 10,
    color: MUTED,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});
