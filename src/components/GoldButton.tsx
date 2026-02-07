import { Text, Pressable, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GoldButton({ title, onPress, disabled = false, loading = false }: GoldButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`h-12 rounded-lg items-center justify-center bg-accent active:bg-accent-dark ${
        disabled || loading ? "opacity-50" : ""
      }`}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color="#14161E" />
      ) : (
        <Text className="text-h3 font-medium text-background">{title}</Text>
      )}
    </Pressable>
  );
}
