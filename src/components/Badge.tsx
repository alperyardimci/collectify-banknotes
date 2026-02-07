import { View, Text } from "react-native";

interface BadgeProps {
  value: string | number;
  variant?: "default" | "accent";
}

export function Badge({ value, variant = "default" }: BadgeProps) {
  const isAccent = variant === "accent";
  return (
    <View
      className={`min-h-[24px] px-xs rounded-sm items-center justify-center ${
        isAccent ? "bg-accent-glow" : "bg-surface-light"
      }`}
    >
      <Text
        className={`text-caption ${
          isAccent ? "text-accent" : "text-text-secondary"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
