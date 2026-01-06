import { View, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { colors, shadows, typography, borderRadius, spacing } from "~/lib/theme";
import { GradientButton } from "./gradient-button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact';
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <View style={[styles.container, shadows.card, variant === 'compact' && styles.containerCompact]}>
      <View style={[styles.iconContainer, variant === 'compact' && styles.iconContainerCompact]}>
        {icon}
      </View>
      <Text style={[styles.title, variant === 'compact' && styles.titleCompact]}>{title}</Text>
      <Text style={[styles.subtitle, variant === 'compact' && styles.subtitleCompact]}>{subtitle}</Text>
      {actionLabel && onAction && (
        <View style={styles.buttonContainer}>
          <GradientButton
            title={actionLabel}
            onPress={onAction}
            size="sm"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  containerCompact: {
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accent.orange.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconContainerCompact: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.sectionHeader,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  titleCompact: {
    ...typography.cardTitle,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  subtitleCompact: {
    ...typography.caption,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
});
