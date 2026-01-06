import { View, Text, Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { cn } from "~/lib/utils";

// Kaizen Brand Colors
const KAIZEN_ORANGE = "#FF6B35";
const CREAM_LIGHT = "#FFFCF7";
const DEEP_BLACK = "#1A1A1A";
const CHARCOAL = "#4A4A4A";
const TEAL = "#10B981";

interface DayPillProps {
  day: string;
  date: number;
  isToday?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
  className?: string;
}

export function DayPill({
  day,
  date,
  isToday = false,
  isCompleted = false,
  onPress,
  className,
}: DayPillProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          minWidth: 44,
          backgroundColor: isToday ? KAIZEN_ORANGE : "transparent",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 4,
            color: isToday ? "#FFFFFF" : CHARCOAL,
            fontFamily: "Poppins_500Medium",
          }}
        >
          {day}
        </Text>
        {isCompleted ? (
          <View
            style={{
              width: 26,
              height: 26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 13,
              backgroundColor: TEAL,
            }}
          >
            <Check size={14} color="#fff" strokeWidth={3} />
          </View>
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: isToday ? "#FFFFFF" : DEEP_BLACK,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {date}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
