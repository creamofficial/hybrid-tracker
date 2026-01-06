import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from '~/lib/theme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface StatCardProps {
  icon: ReactNode;
  iconBgColor?: string;
  value: string | number;
  label: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function StatCard({
  icon,
  iconBgColor = colors.accent.orange.bg,
  value,
  label,
  trend,
  size = 'md',
  style,
}: StatCardProps) {
  const iconSize = size === 'sm' ? iconContainer.sm : size === 'md' ? iconContainer.md : iconContainer.lg;

  return (
    <View style={[styles.container, shadows.card, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            width: iconSize.size,
            height: iconSize.size,
            borderRadius: iconSize.radius,
            backgroundColor: iconBgColor,
          },
        ]}
      >
        {icon}
      </View>
      <View style={styles.content}>
        <View style={styles.valueRow}>
          <Text
            style={[
              size === 'sm' ? styles.valueSm : size === 'lg' ? styles.valueLg : styles.valueMd,
            ]}
          >
            {value}
          </Text>
          {trend && (
            <View
              style={[
                styles.trendBadge,
                { backgroundColor: trend.direction === 'up' ? colors.accent.green.bg : colors.accent.orange.bg },
              ]}
            >
              {trend.direction === 'up' ? (
                <TrendingUp size={12} color={colors.success} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={12} color={colors.primary.solid} strokeWidth={2.5} />
              )}
              <Text
                style={[
                  styles.trendText,
                  { color: trend.direction === 'up' ? colors.success : colors.primary.solid },
                ]}
              >
                {trend.value}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

// Horizontal variant for stats in a row
export function StatCardHorizontal({
  icon,
  iconBgColor = colors.accent.orange.bg,
  value,
  label,
  style,
}: Omit<StatCardProps, 'trend' | 'size'>) {
  return (
    <View style={[styles.horizontalContainer, style]}>
      <View
        style={[
          styles.iconContainerSm,
          { backgroundColor: iconBgColor },
        ]}
      >
        {icon}
      </View>
      <Text style={styles.horizontalValue}>{value}</Text>
      <Text style={styles.horizontalLabel}>{label}</Text>
    </View>
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSm: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  valueSm: {
    ...typography.cardTitle,
    fontSize: 20,
    color: colors.text.primary,
  },
  valueMd: {
    ...typography.statMedium,
    color: colors.text.primary,
  },
  valueLg: {
    ...typography.stat,
    color: colors.text.primary,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  // Horizontal variant styles
  horizontalContainer: {
    alignItems: 'center',
    flex: 1,
  },
  horizontalValue: {
    ...typography.statMedium,
    fontSize: 22,
    color: colors.text.primary,
  },
  horizontalLabel: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
