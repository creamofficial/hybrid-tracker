import { View, Text, Pressable } from "react-native";
import { cn } from "~/lib/utils";

interface MonthCardProps {
  month: string;
  workoutCount: number;
  progress: number;
  isCurrent?: boolean;
  onPress?: () => void;
  className?: string;
}

export function MonthCard({
  month,
  workoutCount,
  progress,
  isCurrent = false,
  onPress,
  className,
}: MonthCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={cn(
          "bg-card rounded-3xl p-4 w-[140px] mr-3 shadow-card border border-border",
          isCurrent && "border-2 border-primary",
          className
        )}
      >
        <Text className="text-lg font-semibold text-foreground mb-1">
          {month}
        </Text>
        <Text className="text-sm text-muted-foreground mb-3">
          {workoutCount} workouts
        </Text>
        <View className="h-2 bg-secondary rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </View>
      </View>
    </Pressable>
  );
}
