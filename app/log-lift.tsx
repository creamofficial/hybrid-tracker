import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { Exercise, ExerciseSet } from '../types';

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
  const { addLiftWorkout } = useStore();

  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: '', sets: [{ reps: '', weight: '' }] },
  ]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

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

    Alert.alert(
      'Lift Logged!',
      `+${workout.xp_earned} XP earned!\n${validExercises.length} exercises completed`,
      [{ text: 'Nice!', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.form}>
          {exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseCard}>
              <Text style={styles.exerciseNumber}>Exercise {exerciseIndex + 1}</Text>

              <TextInput
                style={styles.input}
                value={exercise.name}
                onChangeText={(v) => updateExercise(exerciseIndex, 'name', v)}
                placeholder="Exercise name"
                placeholderTextColor="#666"
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
                <Text style={styles.setHeaderText}>Set</Text>
                <Text style={styles.setHeaderText}>Reps</Text>
                <Text style={styles.setHeaderText}>Weight (kg)</Text>
                <Text style={styles.setHeaderText}></Text>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <TextInput
                    style={styles.setInput}
                    value={set.reps}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'reps', v)}
                    placeholder="8"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={styles.setInput}
                    value={set.weight}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'weight', v)}
                    placeholder="60"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                  />
                  <Pressable onPress={() => removeSet(exerciseIndex, setIndex)}>
                    <Text style={styles.removeSet}>✕</Text>
                  </Pressable>
                </View>
              ))}

              <Pressable style={styles.addSetButton} onPress={() => addSet(exerciseIndex)}>
                <Text style={styles.addSetText}>+ Add Set</Text>
              </Pressable>
            </View>
          ))}

          <Pressable style={styles.addExerciseButton} onPress={addExercise}>
            <Text style={styles.addExerciseText}>+ Add Exercise</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="45"
              placeholderTextColor="#666"
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
              placeholderTextColor="#666"
              multiline
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Log Lift</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
  },
  scroll: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseNumber: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  quickExercises: {
    marginTop: 8,
    marginBottom: 16,
  },
  quickExercise: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  quickExerciseActive: {
    backgroundColor: '#e94560',
  },
  quickExerciseText: {
    color: '#8b8b8b',
    fontSize: 12,
  },
  quickExerciseTextActive: {
    color: '#fff',
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  setHeaderText: {
    flex: 1,
    color: '#8b8b8b',
    fontSize: 12,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  setNumber: {
    width: 30,
    color: '#fff',
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    textAlign: 'center',
  },
  removeSet: {
    color: '#e94560',
    fontSize: 18,
    width: 30,
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 8,
  },
  addSetText: {
    color: '#e94560',
    textAlign: 'center',
  },
  addExerciseButton: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addExerciseText: {
    color: '#e94560',
    textAlign: 'center',
    fontWeight: '600',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#e94560',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: '#8b8b8b',
    fontSize: 16,
  },
});
