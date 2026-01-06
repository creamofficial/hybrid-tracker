import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Dumbbell, Plus, Minus, Clock } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { Exercise, Badge } from '../types';
import { AchievementModal } from '~/components/ui/achievement-modal';
import { BADGES } from '~/lib/badges';

// Kaizen Design System
const PRIMARY = "#FF6B35";
const ACCENT = "#10B981";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

const COMMON_EXERCISES = [
  'Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Lunges', 'Romanian Deadlift', 'Lat Pulldown',
];

interface ExerciseInput {
  name: string;
  sets: { reps: string; weight: string }[];
}

export default function LogLiftScreen() {
  const router = useRouter();
  const { addLiftWorkout, userBadges } = useStore();

  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: '', sets: [{ reps: '', weight: '' }] },
  ]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

  const previousBadgeCount = userBadges.length;

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ reps: '', weight: '' }] }]);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    if (updated[exerciseIndex].sets.length > 1) {
      updated[exerciseIndex].sets.splice(setIndex, 1);
      setExercises(updated);
    }
  };

  const updateExercise = (index: number, field: 'name', value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const selectExercise = (exerciseIndex: number, name: string) => {
    const updated = [...exercises];
    updated[exerciseIndex].name = name;
    setExercises(updated);
  };

  const handleSubmit = () => {
    const durationNum = parseInt(duration);
    if (!durationNum || durationNum <= 0) {
      Alert.alert('Invalid Duration', 'Please enter workout duration.');
      return;
    }

    const validExercises: Exercise[] = exercises
      .filter((e) => e.name.trim() && e.sets.some((s) => s.reps && s.weight))
      .map((e) => ({
        name: e.name.trim(),
        sets: e.sets
          .filter((s) => s.reps && s.weight)
          .map((s) => ({
            reps: parseInt(s.reps),
            weight_kg: parseFloat(s.weight),
          })),
      }));

    if (validExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise with sets.');
      return;
    }

    const workout = addLiftWorkout(validExercises, durationNum, notes || undefined);

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
      'Lift Logged!',
      `+${workout.xp_earned} XP earned!\n${validExercises.length} exercises completed`,
      [{ text: 'Nice!', onPress: () => router.back() }]
    );
  };

  const handleAchievementClose = () => {
    setShowAchievement(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Log Lift</Text>
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
          {exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseIcon}>
                  <Dumbbell size={18} color={PRIMARY} strokeWidth={2} />
                </View>
                <Text style={styles.exerciseNumber}>Exercise {exerciseIndex + 1}</Text>
              </View>

              <TextInput
                style={styles.input}
                value={exercise.name}
                onChangeText={(v) => updateExercise(exerciseIndex, 'name', v)}
                placeholder="Exercise name"
                placeholderTextColor={MUTED}
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickExercises}>
                {COMMON_EXERCISES.map((name) => (
                  <Pressable
                    key={name}
                    style={[styles.quickExercise, exercise.name === name && styles.quickExerciseActive]}
                    onPress={() => selectExercise(exerciseIndex, name)}
                  >
                    <Text style={[styles.quickExerciseText, exercise.name === name && styles.quickExerciseTextActive]}>
                      {name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.setsHeader}>
                <Text style={[styles.setHeaderText, { flex: 0.5 }]}>Set</Text>
                <Text style={styles.setHeaderText}>Reps</Text>
                <Text style={styles.setHeaderText}>Weight (kg)</Text>
                <Text style={[styles.setHeaderText, { flex: 0.3 }]}></Text>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <TextInput
                    style={styles.setInput}
                    value={set.reps}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'reps', v)}
                    placeholder="8"
                    placeholderTextColor={MUTED}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={styles.setInput}
                    value={set.weight}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'weight', v)}
                    placeholder="60"
                    placeholderTextColor={MUTED}
                    keyboardType="decimal-pad"
                  />
                  <Pressable
                    style={styles.removeSetButton}
                    onPress={() => removeSet(exerciseIndex, setIndex)}
                  >
                    <Minus size={16} color={exercise.sets.length > 1 ? PRIMARY : BORDER} strokeWidth={2} />
                  </Pressable>
                </View>
              ))}

              <Pressable style={styles.addSetButton} onPress={() => addSet(exerciseIndex)}>
                <Plus size={16} color={PRIMARY} strokeWidth={2} />
                <Text style={styles.addSetText}>Add set</Text>
              </Pressable>
            </View>
          ))}

          <Pressable style={styles.addExerciseButton} onPress={addExercise}>
            <Plus size={18} color={PRIMARY} strokeWidth={2} />
            <Text style={styles.addExerciseText}>Add exercise</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Clock size={16} color={MUTED} strokeWidth={2} />
              <Text style={styles.label}>Duration (minutes) *</Text>
            </View>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="45"
              placeholderTextColor={MUTED}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it feel?"
              placeholderTextColor={MUTED}
              multiline
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Dumbbell size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.submitText}>Log Lift</Text>
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
  exerciseCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  exerciseIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumber: {
    color: FOREGROUND,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    color: FOREGROUND,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  input: {
    backgroundColor: CREAM,
    borderRadius: 12,
    padding: 14,
    color: FOREGROUND,
    fontSize: 16,
    borderWidth: 1,
    borderColor: BORDER,
    fontFamily: 'Poppins_400Regular',
  },
  quickExercises: {
    marginTop: 8,
    marginBottom: 16,
    marginLeft: -4,
  },
  quickExercise: {
    backgroundColor: CREAM,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  quickExerciseActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  quickExerciseText: {
    color: MUTED,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  quickExerciseTextActive: {
    color: '#FFFFFF',
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    flex: 1,
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  setNumber: {
    width: 24,
    color: FOREGROUND,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  setInput: {
    flex: 1,
    backgroundColor: CREAM,
    borderRadius: 10,
    padding: 12,
    color: FOREGROUND,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  removeSetButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: CREAM,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 10,
    gap: 6,
  },
  addSetText: {
    color: PRIMARY,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseText: {
    color: PRIMARY,
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
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
