import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { CONTINENTS } from "@/constants/continents";
import { ContinentCard } from "@/components/ContinentCard";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { changeLanguage } from "@/i18n";
import { COLORS } from "@/constants/theme";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = i18n.language === "en" ? "tr" : "en";
    changeLanguage(next);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center px-xl">
        <View className="w-11" />
        <Text className="flex-1 text-center text-h1 font-light text-accent tracking-widest">
          {t("app.title")}
        </Text>
        <Pressable
          onPress={toggleLanguage}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel={t("common.language")}
          accessibilityRole="button"
        >
          <Ionicons name="globe-outline" size={22} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-lg"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-body text-text-secondary text-center mb-md">
          {t("home.motivational")}
        </Text>

        {banknotes.length > 0 && (
          <Text className="text-caption text-accent text-center mb-lg">
            {t("home.totalBanknotes", { count: banknotes.length })}
          </Text>
        )}

        <View className="gap-md">
          {CONTINENTS.map((continent) => (
            <ContinentCard
              key={continent.id}
              continentId={continent.id}
              emoji={continent.emoji}
              nameKey={continent.nameKey}
              onPress={() => router.push(`/continent/${continent.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
