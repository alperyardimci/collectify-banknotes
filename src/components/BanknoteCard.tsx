import { memo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import type { BanknoteRow } from "@/db/queries";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;

interface BanknoteCardProps {
  banknote: BanknoteRow;
  onPress: () => void;
}

export const BanknoteCard = memo(function BanknoteCard({
  banknote,
  onPress,
}: BanknoteCardProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const yearDisplay = banknote.is_current
    ? `${banknote.year_start} - ${t("banknote.present")}`
    : banknote.year_end
      ? `${banknote.year_start} - ${banknote.year_end}`
      : `${banknote.year_start}`;

  return (
    <Pressable
      onPress={handlePress}
      style={{ width: CARD_WIDTH }}
      className="bg-surface rounded-lg overflow-hidden active:opacity-90"
      accessibilityLabel={`${banknote.denomination} ${banknote.currency}, ${yearDisplay}`}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: banknote.front_photo }}
        style={{ width: CARD_WIDTH, height: CARD_WIDTH * 0.65 }}
        contentFit="cover"
      />
      <View className="p-sm">
        <Text className="text-[18px] text-text-primary" numberOfLines={1}>
          {banknote.denomination} {banknote.currency}
        </Text>
        <Text className="text-caption text-text-secondary">{yearDisplay}</Text>
      </View>
    </Pressable>
  );
});
