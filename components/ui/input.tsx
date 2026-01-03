import { TextInput, View, Text } from "react-native";
import { cn } from "~/lib/utils";

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  className?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad" | "number-pad";
  multiline?: boolean;
  label?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  className,
  keyboardType = "default",
  multiline = false,
  label,
}: InputProps) {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8b8b8b"
        keyboardType={keyboardType}
        multiline={multiline}
        className={cn(
          "rounded-xl bg-input px-4 py-3 text-base text-foreground",
          multiline && "min-h-[80px] py-3",
          className
        )}
      />
    </View>
  );
}
