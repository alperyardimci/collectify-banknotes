import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

interface FABProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({ onPress }: FABProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      entering={FadeIn.duration(200)}
      onPress={handlePress}
      className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-accent items-center justify-center active:bg-accent-dark shadow-lg shadow-black/30"
      style={{ elevation: 8 }}
      accessibilityLabel={t("country.addFirst")}
      accessibilityRole="button"
    >
      <Ionicons name="add" size={28} color="#14161E" />
    </AnimatedPressable>
  );
}
