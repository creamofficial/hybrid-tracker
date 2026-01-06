import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { colors, shadows, typography, borderRadius, spacing } from '~/lib/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = true,
  style,
}: GradientButtonProps) {
  const buttonHeight = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const paddingHorizontal = size === 'sm' ? spacing.lg : spacing.xl;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonBase,
          { height: buttonHeight, opacity: pressed ? 0.9 : disabled ? 0.5 : 1 },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <LinearGradient
          colors={['#FF8A00', '#FFB347']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            shadows.button,
            { paddingHorizontal, borderRadius: borderRadius.md },
          ]}
        >
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.primaryText, size === 'sm' && styles.smallText]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonBase,
          styles.secondaryButton,
          shadows.card,
          {
            height: buttonHeight,
            paddingHorizontal,
            opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {icon && iconPosition === 'left' && icon}
        <Text style={[styles.secondaryText, size === 'sm' && styles.smallText]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && icon}
      </Pressable>
    );
  }

  // Outline variant
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        styles.outlineButton,
        {
          height: buttonHeight,
          paddingHorizontal,
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {icon && iconPosition === 'left' && icon}
      <Text style={[styles.outlineText, size === 'sm' && styles.smallText]}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryText: {
    ...typography.button,
    color: colors.text.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary.solid,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  outlineText: {
    ...typography.button,
    color: colors.primary.solid,
  },
  smallText: {
    fontSize: 14,
  },
});
