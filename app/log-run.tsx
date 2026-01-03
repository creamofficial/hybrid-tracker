import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';

export default function LogRunScreen() {
  const router = useRouter();
  const { addRunWorkout } = useStore();

  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');

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

    Alert.alert(
      'Run Logged!',
      `+${workout.xp_earned} XP earned!\n${distanceNum} km in ${totalMinutes} min`,
      [{ text: 'Nice!', onPress: () => router.back() }]
    );
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
      return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /km`;
    }
    return '--:-- /km';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            placeholder="5.0"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.durationRow}>
            <View style={styles.durationInput}>
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />
              <Text style={styles.durationLabel}>hr</Text>
            </View>
            <View style={styles.durationInput}>
              <TextInput
                style={styles.input}
                value={minutes}
                onChangeText={setMinutes}
                placeholder="30"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />
              <Text style={styles.durationLabel}>min</Text>
            </View>
          </View>
        </View>

        <View style={styles.paceDisplay}>
          <Text style={styles.paceLabel}>Pace</Text>
          <Text style={styles.paceValue}>{pace()}</Text>
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

        <View style={styles.quickButtons}>
          <Text style={styles.quickLabel}>Quick distance:</Text>
          <View style={styles.quickRow}>
            {['5', '10', '21.1', '42.2'].map((d) => (
              <Pressable key={d} style={styles.quickButton} onPress={() => setDistance(d)}>
                <Text style={styles.quickButtonText}>{d}k</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Log Run</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
  },
  form: {
    padding: 20,
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
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  durationInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationLabel: {
    color: '#8b8b8b',
    marginLeft: 8,
    fontSize: 16,
  },
  paceDisplay: {
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  paceLabel: {
    color: '#8b8b8b',
    fontSize: 14,
  },
  paceValue: {
    color: '#e94560',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  quickButtons: {
    marginBottom: 24,
  },
  quickLabel: {
    color: '#8b8b8b',
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickButtonText: {
    color: '#fff',
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
