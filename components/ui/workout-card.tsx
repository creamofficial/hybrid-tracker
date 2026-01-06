import { View, Text, Pressable, StyleSheet } from "react-native";
import { Dumbbell, Footprints, ChevronRight } from "lucide-react-native";
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from "~/lib/theme";

interface WorkoutCardProps {
  type: 'run' | 'lift';
  title: string;
  date: string;
  detail: string;
  onPress?: () => void;
}

export function WorkoutCard({
  type,
  title,
  date,
  detail,
  onPress,
}: WorkoutCardProps) {
  const isRun = type === 'run';
  const Icon = isRun ? Footprints : Dumbbell;
  const iconBgColor = isRun ? colors.accent.green.bg : colors.accent.orange.bg;
  const iconColor = isRun ? colors.accent.green.icon : colors.accent.orange.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      {onPress && (
        <ChevronRight size={20} color={colors.border} strokeWidth={2} />
      )}
    </Pressable>
  );
}

// Compact horizontal card for carousel
export function WorkoutCardCompact({
  type,
  title,
  date,
  detail,
  onPress,
}: WorkoutCardProps) {
  const isRun = type === 'run';
  const Icon = isRun ? Footprints : Dumbbell;
  const iconBgColor = isRun ? colors.accent.green.bg : colors.accent.orange.bg;
  const iconColor = isRun ? colors.accent.green.icon : colors.accent.orange.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compactContainer,
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.compactIcon, { backgroundColor: iconBgColor }]}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </View>
      <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.compactDate}>{date}</Text>
      <Text style={styles.compactDetail} numberOfLines={1}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: iconContainer.lg.size,
    height: iconContainer.lg.size,
    borderRadius: iconContainer.lg.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  date: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  detail: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  // Compact card styles
  compactContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: 150,
    marginRight: spacing.md,
  },
  compactIcon: {
    width: iconContainer.md.size,
    height: iconContainer.md.size,
    borderRadius: iconContainer.md.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  compactTitle: {
    ...typography.cardTitle,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 2,
  },
  compactDate: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  compactDetail: {
    ...typography.small,
    color: colors.text.tertiary,
  },
});
