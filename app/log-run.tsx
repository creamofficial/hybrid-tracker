import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Footprints, Clock, Zap } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { AchievementModal } from '~/components/ui/achievement-modal';
import { BADGES } from '~/lib/badges';
import { Badge } from '~/types';

// Kaizen Design System
const PRIMARY = "#FF6B35";
const ACCENT = "#10B981";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

const QUICK_DISTANCES = [
  { label: '1k', value: '1' },
  { label: '3k', value: '3' },
  { label: '5k', value: '5' },
  { label: '10k', value: '10' },
  { label: 'Half', value: '21.1' },
  { label: 'Full', value: '42.2' },
];

export default function LogRunScreen() {
  const router = useRouter();
  const { addRunWorkout, workouts, userBadges } = useStore();

  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

  const lastRunWorkout = workouts.filter((w) => w.type === 'run').slice(-1)[0];
  const previousBadgeCount = userBadges.length;

  const handleSubmit = () => {
    const distanceNum = parseFloat(distance);
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const totalMinutes = hoursNum * 60 + minutesNum;

    if (!distanceNum || distanceNum <= 0) {
      Alert.alert('Invalid Distance', 'Please enter a valid distance.');
      return;
    }

    if (totalMinutes <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration.');
      return;
    }

    const workout = addRunWorkout(distanceNum, totalMinutes, notes || undefined);

    // Check if a new badge was earned
    const { userBadges: updatedBadges } = useStore.getState();
    if (updatedBadges.length > previousBadgeCount) {
      const newBadge = updatedBadges[updatedBadges.length - 1];
      const badge = BADGES.find((b) => b.id === newBadge.badge_id);
      if (badge) {
        setEarnedBadge(badge);
        setShowAchievement(true);
        return;
      }
    }

    Alert.alert(
      'Run Logged!',
      `+${workout.xp_earned} XP earned!\n${distanceNum} km in ${totalMinutes} min`,
      [{ text: 'Nice!', onPress: () => router.back() }]
    );
  };

  const handleAchievementClose = () => {
    setShowAchievement(false);
    router.back();
  };

  const pace = () => {
    const distanceNum = parseFloat(distance);
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const totalMinutes = hoursNum * 60 + minutesNum;

    if (distanceNum > 0 && totalMinutes > 0) {
      const paceMin = totalMinutes / distanceNum;
      const paceMinutes = Math.floor(paceMin);
      const paceSeconds = Math.round((paceMin - paceMinutes) * 60);
      return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
    }
    return null;
  };

  const calculatedPace = pace();
  const isDistanceSelected = (value: string) => distance === value;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Log Run</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color={MUTED} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Quick Distance Selection */}
          <View style={styles.quickDistanceSection}>
            <View style={styles.sectionHeader}>
              <Footprints size={18} color={ACCENT} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Quick select distance</Text>
            </View>
            <View style={styles.quickDistanceGrid}>
              {QUICK_DISTANCES.map((d) => (
                <Pressable
                  key={d.value}
                  style={[
                    styles.quickDistanceButton,
                    isDistanceSelected(d.value) && styles.quickDistanceButtonActive,
                  ]}
                  onPress={() => setDistance(d.value)}
                >
                  <Text
                    style={[
                      styles.quickDistanceText,
                      isDistanceSelected(d.value) && styles.quickDistanceTextActive,
                    ]}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Distance Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Distance (km) *</Text>
            <TextInput
              style={styles.distanceInput}
              value={distance}
              onChangeText={setDistance}
              placeholder="0.0"
              placeholderTextColor={MUTED}
              keyboardType="decimal-pad"
            />
            {lastRunWorkout?.run_log && (
              <Text style={styles.lastTimeHint}>
                Last run: {lastRunWorkout.run_log.distance_km.toFixed(1)} km
              </Text>
            )}
          </View>

          {/* Duration Input */}
          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Clock size={16} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.label}>Duration *</Text>
            </View>
            <View style={styles.durationRow}>
              <View style={styles.durationInputWrapper}>
                <TextInput
                  style={styles.durationInput}
                  value={hours}
                  onChangeText={setHours}
                  placeholder="0"
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationLabel}>hr</Text>
              </View>
              <Text style={styles.durationSeparator}>:</Text>
              <View style={styles.durationInputWrapper}>
                <TextInput
                  style={styles.durationInput}
                  value={minutes}
                  onChangeText={setMinutes}
                  placeholder="30"
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationLabel}>min</Text>
              </View>
            </View>
          </View>

          {/* Pace Display */}
          <View style={styles.paceCard}>
            <View style={styles.paceHeader}>
              <Zap size={16} color={PRIMARY} strokeWidth={2} />
              <Text style={styles.paceLabel}>Average Pace</Text>
            </View>
            {calculatedPace ? (
              <View style={styles.paceValueContainer}>
                <Text style={styles.paceValue}>{calculatedPace}</Text>
                <Text style={styles.paceUnit}>/km</Text>
              </View>
            ) : (
              <View style={styles.paceEmptyState}>
                <Text style={styles.paceEmptyText}>Enter distance and duration</Text>
              </View>
            )}
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it feel? Weather, route..."
              placeholderTextColor={MUTED}
              multiline
            />
          </View>

          {/* Submit Button */}
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Footprints size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.submitText}>Log Run</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AchievementModal
        visible={showAchievement}
        badge={earnedBadge}
        onClose={handleAchievementClose}
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: CREAM,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: FOREGROUND,
    fontFamily: 'Poppins_500Medium',
  },
  quickDistanceSection: {
    marginBottom: 20,
    backgroundColor: '#E6F7F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
  },
  quickDistanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickDistanceButton: {
    backgroundColor: CARD,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    minWidth: 56,
    alignItems: 'center',
  },
  quickDistanceButtonActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  quickDistanceText: {
    color: ACCENT,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  quickDistanceTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: FOREGROUND,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 14,
    color: FOREGROUND,
    fontSize: 16,
    borderWidth: 1,
    borderColor: BORDER,
    fontFamily: 'Poppins_400Regular',
  },
  distanceInput: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 16,
    color: FOREGROUND,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: BORDER,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  lastTimeHint: {
    color: MUTED,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationInputWrapper: {
    flex: 1,
  },
  durationInput: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    color: FOREGROUND,
    fontSize: 20,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: BORDER,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  durationLabel: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    fontFamily: 'Poppins_500Medium',
  },
  durationSeparator: {
    color: MUTED,
    fontSize: 24,
    fontWeight: '600',
  },
  paceCard: {
    backgroundColor: '#FEF3E7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE4CC',
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
    alignItems: 'center',
  },
  paceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  paceLabel: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  paceValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  paceValue: {
    color: PRIMARY,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  paceUnit: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  paceEmptyState: {
    paddingVertical: 4,
  },
  paceEmptyText: {
    color: '#92400E',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: ACCENT,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
