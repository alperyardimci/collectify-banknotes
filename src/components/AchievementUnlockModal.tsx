import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { EmojiImage } from "./EmojiImage";
import type { AchievementDef } from "@/constants/achievements";

interface AchievementUnlockModalProps {
  visible: boolean;
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

export function AchievementUnlockModal({
  visible,
  achievement,
  onDismiss,
}: AchievementUnlockModalProps) {
  const { t } = useTranslation();
  const emojiScale = useSharedValue(0);
  const cardScale = useSharedValue(0);

  useEffect(() => {
    if (visible && achievement) {
      emojiScale.value = 0;
      cardScale.value = 0;
      emojiScale.value = withDelay(
        300,
        withSequence(
          withSpring(1.3, { damping: 6, stiffness: 150 }),
          withSpring(1, { damping: 10 })
        )
      );
      cardScale.value = withDelay(
        500,
        withSpring(1, { damping: 12, stiffness: 100 })
      );
    }
  }, [visible, achievement]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  if (!visible || !achievement) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 z-50 items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
    >
      <ConfettiOverlay visible />
      <Pressable
        onPress={onDismiss}
        className="items-center justify-center flex-1 w-full"
      >
        <Text className="text-caption text-accent tracking-widest mb-md uppercase">
          {t("achievements.unlocked")}
        </Text>

        <Animated.View style={emojiStyle}>
          <EmojiImage emoji={achievement.emoji} size={80} />
        </Animated.View>

        <Animated.View
          style={cardStyle}
          className="bg-surface rounded-xl p-lg mx-xl mt-lg items-center"
        >
          <View
            className="absolute inset-0 rounded-xl"
            style={{
              borderWidth: 1,
              borderColor: "rgba(212, 168, 67, 0.3)",
            }}
          />
          <Text className="text-h1 text-text-primary font-light text-center">
            {t(achievement.titleKey)}
          </Text>
          <Text className="text-body text-text-secondary text-center mt-sm">
            {t(achievement.descriptionKey)}
          </Text>
        </Animated.View>

        <Text className="text-caption text-text-muted mt-2xl">
          {t("achievements.tapToContinue")}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
