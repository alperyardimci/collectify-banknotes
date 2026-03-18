import { View, Text } from "react-native";
import { GoldButton } from "./GoldButton";
import { EmojiImage } from "./EmojiImage";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  ctaTitle?: string;
  onCtaPress?: () => void;
}

export function EmptyState({
  emoji,
  title,
  description,
  ctaTitle,
  onCtaPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-xl py-2xl">
      <View className="mb-md">
        <EmojiImage emoji={emoji} size={48} />
      </View>
      <Text className="text-h2 text-text-primary text-center mb-sm">
        {title}
      </Text>
      <Text className="text-body text-text-secondary text-center mb-lg">
        {description}
      </Text>
      {ctaTitle && onCtaPress && (
        <View className="w-full max-w-[280px]">
          <GoldButton title={ctaTitle} onPress={onCtaPress} />
        </View>
      )}
    </View>
  );
}
