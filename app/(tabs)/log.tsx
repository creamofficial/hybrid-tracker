import { View, Pressable, ScrollView, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { Footprints, Dumbbell, ChevronRight, Bike, Waves, Flame, Lock, Calendar } from "lucide-react-native";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const ACCENT = "#10B981";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

export default function LogScreen() {
  const router = useRouter();
  const { activeProgram, programProgress, workouts } = useStore();

  // Count today's workouts
  const today = new Date().toDateString();
  const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === today).length;

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
          <Image
            source={require('../../appstore.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Log workout</Text>
        </View>
        {todayWorkouts > 0 && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>{todayWorkouts} today</Text>
          </View>
        )}
      </View>

      {/* Quick Actions - Recent Workouts */}
      {(recentRun || recentLift) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
            {recentRun?.run_log && (
              <Pressable style={styles.quickActionCard} onPress={() => router.push("/log-run")}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#E6F7F2' }]}>
                  <Footprints size={18} color={ACCENT} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionTitle}>{recentRun.run_log.distance_km}km Run</Text>
                <Text style={styles.quickActionSubtitle}>
                  {recentRun.duration_minutes} mins · {formatRelativeDate(recentRun.date)}
                </Text>
              </Pressable>
            )}
            {recentLift?.lift_log && (
              <Pressable style={styles.quickActionCard} onPress={() => router.push("/log-lift")}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3E7' }]}>
                  <Dumbbell size={18} color={PRIMARY} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionTitle}>
                  {recentLift.lift_log.exercises[0]?.name || 'Lift'}
                </Text>
                <Text style={styles.quickActionSubtitle}>
                  {recentLift.lift_log.exercises.length} exercises · {formatRelativeDate(recentLift.date)}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      )}

      {/* Workout Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout types</Text>
        <View style={styles.workoutTypesGrid}>
          <Pressable style={styles.workoutTypeCard} onPress={() => router.push("/log-run")}>
            <View style={[styles.workoutTypeIcon, { backgroundColor: '#E6F7F2' }]}>
              <Footprints size={24} color={ACCENT} strokeWidth={2} />
            </View>
            <View style={styles.workoutTypeContent}>
              <Text style={styles.workoutTypeName}>Run</Text>
              <Text style={styles.workoutTypeDesc}>Distance, time, pace</Text>
            </View>
            <ChevronRight size={20} color={BORDER} strokeWidth={2} />
          </Pressable>

          <Pressable style={styles.workoutTypeCard} onPress={() => router.push("/log-lift")}>
            <View style={[styles.workoutTypeIcon, { backgroundColor: '#FEF3E7' }]}>
              <Dumbbell size={24} color={PRIMARY} strokeWidth={2} />
            </View>
            <View style={styles.workoutTypeContent}>
              <Text style={styles.workoutTypeName}>Lift</Text>
              <Text style={styles.workoutTypeDesc}>Exercises, sets, reps</Text>
            </View>
            <ChevronRight size={20} color={BORDER} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* More Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More activities</Text>
        <View style={styles.moreActivitiesGrid}>
          <View style={[styles.activityCard, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: '#F3E8FF' }]}>
              <Bike size={20} color="#8B5CF6" strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Cycle</Text>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>

          <View style={[styles.activityCard, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: '#E0F2FE' }]}>
              <Waves size={20} color="#0EA5E9" strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Swim</Text>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>

          <View style={[styles.activityCard, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: '#FEF9C3' }]}>
              <Flame size={20} color="#EAB308" strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>HIIT</Text>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>

          <View style={[styles.activityCard, styles.activityCardDisabled]}>
            <View style={[styles.activityIcon, { backgroundColor: '#FCE7F3' }]}>
              <Lock size={20} color="#EC4899" strokeWidth={2} />
            </View>
            <Text style={styles.activityName}>Custom</Text>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        </View>
      </View>

      {/* Streak Reminder Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakCardIcon}>
          <Calendar size={20} color={PRIMARY} strokeWidth={2} />
        </View>
        <View style={styles.streakCardContent}>
          <Text style={styles.streakCardTitle}>Build your streak</Text>
          <Text style={styles.streakCardSubtitle}>Log a workout every day for bonus XP</Text>
        </View>
      </View>

      {/* Active Program */}
      {activeProgram && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active program</Text>
          <Pressable style={styles.programCard}>
            <View style={styles.programBadge}>
              <Text style={styles.programBadgeText}>ACTIVE</Text>
            </View>
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
    backgroundColor: CREAM,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  todayBadge: {
    backgroundColor: ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
    marginBottom: 12,
    fontFamily: 'Poppins_500Medium',
  },
  workoutTypesGrid: {
    gap: 10,
  },
  workoutTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  workoutTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTypeContent: {
    flex: 1,
    marginLeft: 14,
  },
  workoutTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  workoutTypeDesc: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  moreActivitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityCard: {
    width: '48%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  activityCardDisabled: {
    opacity: 0.5,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  comingSoonText: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E7',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: PRIMARY,
    gap: 12,
  },
  streakCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCardContent: {
    flex: 1,
  },
  streakCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  streakCardSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 1,
    fontFamily: 'Poppins_400Regular',
  },
  programCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  programBadge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  programBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_700Bold',
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  programProgress: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  quickActionsScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  quickActionCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: BORDER,
    minWidth: 140,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
});
