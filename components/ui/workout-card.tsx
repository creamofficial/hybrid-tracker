import { View, Text, Pressable } from "react-native";
import { Dumbbell, Footprints, Target, Zap } from "lucide-react-native";
import { cn } from "~/lib/utils";

// Kaizen Brand Colors
const KAIZEN_ORANGE = "#FF6B35";
const LIGHT_ORANGE = "#FFB088";
const CREAM = "#F5F1E8";
const CREAM_LIGHT = "#FFFCF7";
const DEEP_BLACK = "#1A1A1A";
const CHARCOAL = "#4A4A4A";
const SOFT_GRAY = "#E8E8E8";
const TEAL = "#10B981";

interface WorkoutCardProps {
  name: string;
  date: string;
  exercises: string[];
  type?: "pull" | "push" | "shoulders" | "legs" | "default";
  onPress?: () => void;
  className?: string;
}

const iconMap = {
  pull: Dumbbell,
  push: Dumbbell,
  shoulders: Zap,
  legs: Footprints,
  default: Dumbbell,
};

const colorMap = {
  pull: KAIZEN_ORANGE,
  push: KAIZEN_ORANGE,
  shoulders: KAIZEN_ORANGE,
  legs: TEAL,
  default: KAIZEN_ORANGE,
};

export function WorkoutCard({
  name,
  date,
  exercises,
  type = "default",
  onPress,
  className,
}: WorkoutCardProps) {
  const Icon = iconMap[type] || iconMap.default;
  const iconColor = colorMap[type] || colorMap.default;
  const isRun = type === "legs";

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: CREAM_LIGHT,
          borderRadius: 20,
          padding: 16,
          width: 165,
          marginRight: 12,
          borderWidth: 1,
          borderColor: SOFT_GRAY,
          borderLeftWidth: 4,
          borderLeftColor: iconColor,
          shadowColor: DEEP_BLACK,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: isRun ? "#E6F7F2" : "#FEF3E7",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Icon size={20} color={iconColor} />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: DEEP_BLACK,
            marginBottom: 4,
            fontFamily: "Poppins_600SemiBold",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: CHARCOAL,
            marginBottom: 12,
            fontFamily: "Poppins_400Regular",
          }}
        >
          {date}
        </Text>
        <View style={{ gap: 4 }}>
          {exercises.slice(0, 3).map((exercise, index) => (
            <Text
              key={index}
              style={{
                fontSize: 12,
                color: CHARCOAL,
                fontFamily: "Poppins_400Regular",
              }}
              numberOfLines={1}
            >
              {exercise}
            </Text>
          ))}
          {exercises.length > 3 && (
            <Text
              style={{
                fontSize: 12,
                color: "#7A7A7A",
                fontFamily: "Poppins_400Regular",
              }}
            >
              +{exercises.length - 3} more
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
