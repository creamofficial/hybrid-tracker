import { View, Text, Pressable, StyleSheet } from "react-native";
import { ReactNode } from "react";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const BORDER = "#E8E8E8";

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
    <View style={[styles.container, variant === 'compact' && styles.containerCompact]}>
      <View style={[styles.iconContainer, variant === 'compact' && styles.iconContainerCompact]}>
        {icon}
      </View>
      <Text style={[styles.title, variant === 'compact' && styles.titleCompact]}>{title}</Text>
      <Text style={[styles.subtitle, variant === 'compact' && styles.subtitleCompact]}>{subtitle}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  containerCompact: {
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconContainerCompact: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FOREGROUND,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  titleCompact: {
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
    maxWidth: 260,
  },
  subtitleCompact: {
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});
