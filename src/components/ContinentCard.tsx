import { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { getContinentById } from "@/constants/continents";
import { ProgressBar } from "./ProgressBar";
import { COLORS } from "@/constants/theme";

interface ContinentCardProps {
  continentId: string;
  emoji: string;
  nameKey: string;
  onPress: () => void;
}

export function ContinentCard({
  continentId,
  emoji,
  nameKey,
  onPress,
}: ContinentCardProps) {
  const { t } = useTranslation();
  const countryStats = useBanknoteStore((s) => s.countryStats);

  const { collected, total, percentage } = useMemo(() => {
    const continent = getContinentById(continentId);
    if (!continent) return { collected: 0, total: 0, percentage: 0 };
    const tot = continent.countryCodes.length;
    let col = 0;
    for (const code of continent.countryCodes) {
      if (countryStats[code] && countryStats[code] > 0) col++;
    }
    return { collected: col, total: tot, percentage: tot > 0 ? col / tot : 0 };
  }, [continentId, countryStats]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-surface rounded-lg p-md active:bg-surface-light"
      accessibilityLabel={`${t(nameKey)}, ${collected}/${total} ${t("home.countriesLabel")}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center mb-sm">
        <Text className="text-[28px] mr-sm">{emoji}</Text>
        <Text className="flex-1 text-h2 font-light text-text-primary">
          {t(nameKey)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
      <ProgressBar progress={percentage} />
      <Text className="text-caption text-text-secondary mt-xs">
        {t("home.countriesProgress", { collected, total })}
      </Text>
    </Pressable>
  );
}
