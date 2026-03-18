import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { EmojiImage } from "@/components/EmojiImage";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { useBanknoteStore } from "@/store/useBanknoteStore";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const unlockedAchievements = useBanknoteStore((s) => s.unlockedAchievements);

  const unlockedCount = unlockedAchievements.size;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("achievements.title")} showBack />

      <Text className="text-caption text-accent text-center mb-md">
        {t("achievements.progress", {
          unlocked: unlockedCount,
          total: ACHIEVEMENTS.length,
        })}
      </Text>

      <FlatList
        data={ACHIEVEMENTS}
        numColumns={3}
        contentContainerClassName="px-md pb-lg"
        columnWrapperClassName="gap-sm mb-sm"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isUnlocked = unlockedAchievements.has(item.id);
          return (
            <View
              className={`flex-1 items-center p-md rounded-lg ${
                isUnlocked ? "bg-surface" : "bg-surface/40"
              }`}
              style={
                isUnlocked
                  ? { borderWidth: 1, borderColor: "rgba(212, 168, 67, 0.3)" }
                  : undefined
              }
            >
              <View style={{ opacity: isUnlocked ? 1 : 0.3 }}>
                <EmojiImage emoji={item.emoji} size={32} />
              </View>
              <Text
                className={`text-caption text-center mt-xs ${
                  isUnlocked ? "text-text-primary" : "text-text-muted"
                }`}
                numberOfLines={2}
              >
                {t(item.titleKey)}
              </Text>
              {isUnlocked && (
                <View className="bg-accent/20 rounded-full px-sm py-xs mt-xs">
                  <Text className="text-[10px] text-accent">
                    {t("achievements.unlocked")}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
