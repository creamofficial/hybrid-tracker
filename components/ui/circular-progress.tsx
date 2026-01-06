import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { cn } from "~/lib/utils";

// Kaizen Brand Colors
const KAIZEN_ORANGE = "#FF6B35";
const CREAM = "#F5F1E8";
const DEEP_BLACK = "#1A1A1A";
const CHARCOAL = "#4A4A4A";

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  labelSize?: "sm" | "lg";
}

export function CircularProgress({
  current,
  total,
  size = 56,
  strokeWidth = 4,
  className,
  showLabel = true,
  labelSize = "sm",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total > 0 ? current / total : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View className={cn("items-center justify-center", className)}>
      <Svg width={size} height={size}>
        {/* Background circle - Enso inspired incomplete circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={CREAM}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle - Brushstroke style */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={KAIZEN_ORANGE}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showLabel && (
        <View className="absolute items-center justify-center">
          <Text
            style={{
              fontSize: labelSize === "lg" ? 32 : 14,
              fontWeight: "700",
              color: DEEP_BLACK,
              fontFamily: "Poppins_700Bold",
            }}
          >
            {current}
          </Text>
          <Text
            style={{
              fontSize: labelSize === "lg" ? 13 : 10,
              color: CHARCOAL,
              marginTop: -2,
              fontFamily: "Poppins_400Regular",
            }}
          >
            of {total}
          </Text>
        </View>
      )}
    </View>
  );
}
