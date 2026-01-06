import { View, ScrollView, Pressable, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { xpToNextLevel } from "~/lib/xp";
import { Flame, Dumbbell, Footprints, Plus, ChevronRight, Calendar, TrendingUp, Sparkles } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { WeeklyChart } from "~/components/ui/weekly-chart";
import { EmptyState } from "~/components/ui/empty-state";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const ACCENT = "#10B981";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

// Compact circular progress for weekly goal
function WeeklyProgress({ current, total }: { current: number; total: number }) {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total > 0 ? current / total : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={BORDER}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={PRIMARY}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: FOREGROUND, fontFamily: 'Poppins_700Bold' }}>
          {current}
        </Text>
      </View>
    </View>
  );
}

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

      {/* Weekly Goal Card - thinner accent border */}
      <View style={styles.weeklyCard}>
        <View style={styles.weeklyHeader}>
          <View>
            <Text style={styles.weeklyTitle}>Weekly goal</Text>
            <Text style={styles.weeklySubtitle}>{workoutsThisWeek} of {weeklyGoal} workouts</Text>
          </View>
          <WeeklyProgress current={workoutsThisWeek} total={weeklyGoal} />
        </View>
        {workoutsThisWeek === 0 && (
          <Text style={styles.motivationText}>Start your streak today</Text>
        )}
      </View>

      {/* Week Calendar */}
      <View style={styles.weekCalendar}>
        {weekDays.map((day, index) => {
          const hasWorkout = workoutDates.has(day.dateObj.toDateString());
          return (
            <View key={index} style={[styles.dayPill, day.isToday && styles.dayPillToday]}>
              <Text style={[styles.dayName, day.isToday && styles.dayNameToday]}>{day.day}</Text>
              {hasWorkout ? (
                <View style={styles.completedDot}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ) : (
                <Text style={[styles.dayDate, day.isToday && styles.dayDateToday]}>{day.date}</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Start Workout Button - solid orange, no gradient */}
      <Pressable style={styles.startButton} onPress={() => router.push("/log")}>
        <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.startButtonText}>Start new workout</Text>
      </Pressable>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent workouts</Text>
          {recentWorkouts.length > 0 && (
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={16} color={PRIMARY} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {recentWorkouts.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={36} color={PRIMARY} strokeWidth={1.5} />}
            title="Your fitness journey starts here"
            subtitle="Every expert was once a beginner. Log your first workout and start building your streak!"
            actionLabel="Start workout"
            onAction={() => router.push("/log")}
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.workoutList}>
            {recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={[
                  styles.workoutIcon,
                  { backgroundColor: workout.type === 'run' ? '#E6F7F2' : '#FEF3E7' }
                ]}>
                  {workout.type === 'run' ? (
                    <Footprints size={20} color={ACCENT} strokeWidth={2} />
                  ) : (
                    <Dumbbell size={20} color={PRIMARY} strokeWidth={2} />
                  )}
                </View>
                <Text style={styles.workoutName}>
                  {workout.type === 'run' ? 'Run' : 'Lift'}
                </Text>
                <Text style={styles.workoutDate}>
                  {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.workoutDetail}>
                  {workout.type === 'run' && workout.run_log
                    ? `${workout.run_log.distance_km.toFixed(1)} km`
                    : workout.lift_log
                    ? `${workout.lift_log.exercises.length} exercises`
                    : ''}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Weekly Progress Chart */}
      {workouts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly progress</Text>
            <TrendingUp size={16} color={PRIMARY} strokeWidth={2} />
          </View>
          <View style={styles.chartCard}>
            <WeeklyChart workouts={workouts} />
          </View>
        </View>
      )}

      {/* Streak Card */}
      {(user?.current_streak || 0) > 0 && (
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Flame size={20} color={PRIMARY} strokeWidth={2} />
          </View>
          <View style={styles.streakContent}>
            <Text style={styles.streakTitle}>{user?.current_streak} day streak</Text>
            <Text style={styles.streakSubtitle}>Keep it going!</Text>
          </View>
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
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  dateText: {
    fontSize: 12,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  weeklyCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  weeklySubtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  motivationText: {
    fontSize: 13,
    color: PRIMARY,
    marginTop: 12,
    fontFamily: 'Poppins_500Medium',
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  dayPill: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    minWidth: 40,
  },
  dayPillToday: {
    backgroundColor: PRIMARY,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '500',
    color: MUTED,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  dayNameToday: {
    color: '#FFFFFF',
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  dayDateToday: {
    color: '#FFFFFF',
  },
  completedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: PRIMARY,
    fontFamily: 'Poppins_500Medium',
  },
  workoutList: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  workoutCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  workoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    marginBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  workoutDate: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
  },
  workoutDetail: {
    fontSize: 12,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E7',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFE4CC',
    gap: 12,
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakContent: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  streakSubtitle: {
    fontSize: 13,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  chartCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
});
