import { View } from "react-native";
import { cn } from "~/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View className={cn("h-3 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <View
        className={cn("h-full rounded-full bg-primary", indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </View>
  );
}
