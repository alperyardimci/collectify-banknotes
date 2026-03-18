import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { EmojiImage } from "./EmojiImage";

interface CelebrationOverlayProps {
  visible: boolean;
  emoji: string;
  title: string;
  subtitle?: string;
  onDismiss: () => void;
}

export function CelebrationOverlay({
  visible,
  emoji,
  title,
  subtitle,
  onDismiss,
}: CelebrationOverlayProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 0;
      scale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 120 }));
    }
  }, [visible]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 z-50 items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    >
      <ConfettiOverlay visible />
      <Pressable
        onPress={onDismiss}
        className="items-center justify-center flex-1 w-full"
      >
        <Animated.View style={emojiStyle}>
          <EmojiImage emoji={emoji} size={72} />
        </Animated.View>
        <Text className="text-display text-accent font-light mt-lg text-center px-xl">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-body text-text-secondary mt-sm text-center px-xl">
            {subtitle}
          </Text>
        )}
        <Text className="text-caption text-text-muted mt-2xl">
          Tap to continue
        </Text>
      </Pressable>
    </Animated.View>
  );
}
