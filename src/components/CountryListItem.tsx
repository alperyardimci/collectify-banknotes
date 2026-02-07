import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { getCountry } from "@/constants/countries";
import { Badge } from "./Badge";
import { COLORS } from "@/constants/theme";

interface CountryListItemProps {
  countryCode: string;
  onPress: () => void;
}

export const CountryListItem = memo(function CountryListItem({
  countryCode,
  onPress,
}: CountryListItemProps) {
  const { t } = useTranslation();
  const country = getCountry(countryCode);
  const count = useBanknoteStore((s) => s.countryStats[countryCode] || 0);

  if (!country) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-surface rounded-md p-sm flex-row items-center active:bg-surface-light"
      accessibilityLabel={`${t(country.nameKey)}, ${count} ${t("continent.banknoteCount", { count })}`}
      accessibilityRole="button"
    >
      <Text className="text-[24px] mr-sm">{country.flag}</Text>
      <View className="flex-1">
        <Text className="text-h3 text-text-primary">{t(country.nameKey)}</Text>
        <Text className="text-caption text-text-secondary">{country.currency}</Text>
      </View>
      {count > 0 && <Badge value={count} variant="accent" />}
      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textMuted}
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );
});
