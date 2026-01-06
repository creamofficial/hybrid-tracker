import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ReactNode } from 'react';
import { colors } from '~/lib/theme';

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  gradientColors?: [string, string];
  backgroundColor?: string;
  children?: ReactNode;
}

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  gradientColors = [colors.primary.start, colors.primary.end],
  backgroundColor = colors.border,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference - clampedProgress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
