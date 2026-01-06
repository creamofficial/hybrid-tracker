import { View, Text, Modal, Pressable, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Badge } from "~/types";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";

interface AchievementModalProps {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
}

export function AchievementModal({ visible, badge, onClose }: AchievementModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!badge) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.confettiContainer}>
            <Text style={styles.confetti}>🎉</Text>
            <Text style={[styles.confetti, styles.confettiLeft]}>✨</Text>
            <Text style={[styles.confetti, styles.confettiRight]}>✨</Text>
          </View>

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
          </View>

          <Text style={styles.title}>Achievement Unlocked!</Text>
          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.description}>{badge.description}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  confetti: {
    fontSize: 32,
  },
  confettiLeft: {
    position: 'absolute',
    left: 30,
    top: 10,
    transform: [{ rotate: '-15deg' }],
  },
  confettiRight: {
    position: 'absolute',
    right: 30,
    top: 10,
    transform: [{ rotate: '15deg' }],
  },
  badgeContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  badgeIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  badgeName: {
    fontSize: 24,
    fontWeight: '700',
    color: FOREGROUND,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  description: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});
