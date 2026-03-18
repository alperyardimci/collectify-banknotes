import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { CONTINENTS } from "@/constants/continents";
import { getCustomCountries } from "@/constants/countries";
import { ContinentCard } from "@/components/ContinentCard";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);


  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center px-xl">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/statistics");
          }}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel={t("statistics.title")}
          accessibilityRole="button"
        >
          <Ionicons name="bar-chart-outline" size={22} color={COLORS.textSecondary} />
        </Pressable>
        <View className="flex-1 flex-row items-center justify-center">
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 24, height: 24, borderRadius: 6 }}
            contentFit="contain"
          />
          <Text className="text-[16px] font-bold text-accent tracking-wider ml-sm">
            Collectify Banknotes
          </Text>
        </View>
        <View className="flex-row">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/search");
            }}
            className="w-11 h-11 items-center justify-center"
            accessibilityLabel={t("search.title")}
            accessibilityRole="button"
          >
            <Ionicons name="search-outline" size={22} color={COLORS.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/account");
            }}
            className="w-11 h-11 items-center justify-center"
            accessibilityLabel={t("account.title")}
            accessibilityRole="button"
          >
            <Ionicons name="person-circle-outline" size={22} color={COLORS.textSecondary} />
          </Pressable>
        </View>
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
          {CONTINENTS.filter(
            (c) => c.id !== "other" || getCustomCountries().length > 0
          ).map((continent) => (
            <ContinentCard
              key={continent.id}
              continentId={continent.id}
              emoji={continent.emoji}
              icon={continent.icon}
              nameKey={continent.nameKey}
              onPress={() => router.push(`/continent/${continent.id}`)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB buttons */}
      <View
        className="absolute bottom-3 right-6 flex-row items-center gap-sm"
        style={{ marginBottom: insets.bottom + 8 }}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/quick-add");
          }}
          className="w-12 h-12 rounded-full bg-surface items-center justify-center"
          style={{
            borderWidth: 1.5,
            borderColor: COLORS.accent,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}
          accessibilityLabel={t("quickAdd.title")}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color={COLORS.accent} />
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/identify");
          }}
          className="w-12 h-12 rounded-full bg-accent items-center justify-center"
          style={{
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 6,
          }}
          accessibilityLabel={t("identify.title")}
          accessibilityRole="button"
        >
          <Ionicons name="scan-outline" size={22} color={COLORS.background} />
        </Pressable>
      </View>
    </View>
  );
}
